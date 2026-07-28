"use client";
import React, { useState, useEffect } from "react";
import { useCRM } from "@/context/CRMContext";
import { supabase } from "@/lib/supabase";

const Modal = ({ isOpen, onClose, id, children }: { isOpen: boolean, onClose: () => void, id: string, children: React.ReactNode }) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.classList.add('closing');
      setTimeout(() => {
        dialog.classList.remove('closing');
        dialog.close();
      }, 180);
    }
  }, [isOpen]);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog id={id} ref={dialogRef} onCancel={handleCancel}>
      {children}
    </dialog>
  );
};

export default function Dialogs() {
  const { 
    members,
    trainers, addTrainer, deleteTrainer,
    isAddOpen, setIsAddOpen, 
    isBroadcastOpen, setIsBroadcastOpen,
    isBroadcastAllOpen, setIsBroadcastAllOpen,
    isEditOpen, setIsEditOpen,
    isTrainersOpen, setIsTrainersOpen,
    isSettingsOpen, setIsSettingsOpen,
    isDeleteOpen, setIsDeleteOpen,
    isPaymentsOpen, setIsPaymentsOpen,
    selectedMember,
    fetchMembers
  } = useCRM();

  const [addForm, setAddForm] = useState({
    name: "", phone: "", dob: "", membership_type: "monthly",
    start_date: "", expiry_date: "", has_personal_trainer: "no",
    trainer_id: "", pt_fee: 0, total_fee: 0, paid_now: 0, balance_due: 0, notes: ""
  });

  const [newTrainerName, setNewTrainerName] = useState("");

  const handleAddChange = (field: string, value: any) => {
    setAddForm(prev => {
      const next = { ...prev, [field]: value };
      
      if ((field === 'start_date' || field === 'membership_type') && next.start_date) {
        const start = new Date(next.start_date);
        let months = 1;
        if (next.membership_type === 'quarterly') months = 3;
        if (next.membership_type === 'half_yearly') months = 6;
        if (next.membership_type === 'yearly') months = 12;
        start.setMonth(start.getMonth() + months);
        next.expiry_date = start.toISOString().split('T')[0];
      }
      
      if (field === 'total_fee' || field === 'paid_now') {
        const total = parseFloat(next.total_fee as any) || 0;
        const paid = parseFloat(next.paid_now as any) || 0;
        next.balance_due = Math.max(0, total - paid);
      }
      
      return next;
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      alert("Please enter a member name");
      return;
    }
    const newMember = {
      name: addForm.name,
      phone: addForm.phone,
      dob: addForm.dob || null,
      membership_type: addForm.membership_type,
      start_date: addForm.start_date || null,
      expiry_date: addForm.expiry_date || null,
      has_personal_trainer: addForm.has_personal_trainer === 'yes',
      trainer_id: addForm.has_personal_trainer === 'yes' ? (addForm.trainer_id || null) : null,
      pt_fee: addForm.has_personal_trainer === 'yes' ? (parseFloat(addForm.pt_fee as any) || 0) : 0,
      total_fee: parseFloat(addForm.total_fee as any) || 0,
      pending_amount: parseFloat(addForm.balance_due as any) || 0,
      renewal_streak: 0,
      created_at: new Date().toISOString(),
      notes: addForm.notes
    };
    
    const { error } = await supabase.from('members').insert(newMember);
    if (error) {
      console.error("Error inserting member:", error);
      alert("Failed to save member: " + error.message);
      return;
    }
    
    setIsAddOpen(false);
    fetchMembers();
    setAddForm({
      name: "", phone: "", dob: "", membership_type: "monthly",
      start_date: "", expiry_date: "", has_personal_trainer: "no",
      trainer_id: "", pt_fee: 0, total_fee: 0, paid_now: 0, balance_due: 0, notes: ""
    });
  };

  const [editForm, setEditForm] = useState<any>({});
  
  useEffect(() => {
    if (selectedMember) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditForm({
        ...selectedMember,
        add_payment: 0
      });
    } else {
      setEditForm({});
    }
  }, [selectedMember]);

  const handleEditChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    const addPayment = parseFloat(editForm.add_payment) || 0;
    const newPending = Math.max(0, parseFloat(editForm.pending_amount) - addPayment);
    
    const updates = {
      name: editForm.name,
      phone: editForm.phone,
      dob: editForm.dob || null,
      membership_type: editForm.membership_type,
      start_date: editForm.start_date || null,
      expiry_date: editForm.expiry_date || null,
      has_personal_trainer: editForm.has_personal_trainer,
      trainer_id: editForm.has_personal_trainer ? (editForm.trainer_id || null) : null,
      pt_fee: editForm.has_personal_trainer ? (parseFloat(editForm.pt_fee) || 0) : 0,
      total_fee: parseFloat(editForm.total_fee) || 0,
      pending_amount: newPending,
      renewal_streak: parseInt(editForm.renewal_streak) || 0,
      notes: editForm.notes
    };
    
    const { error } = await supabase.from('members').update(updates).eq('id', selectedMember.id);
    if (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member: " + error.message);
      return;
    }
    
    setIsEditOpen(false);
    fetchMembers();
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    const { error } = await supabase.from('members').delete().eq('id', selectedMember.id);
    if (error) {
      alert("Failed to delete: " + error.message);
      return;
    }
    setIsDeleteOpen(false);
    fetchMembers();
  };
  
  const [broadcastAllFilter, setBroadcastAllFilter] = useState('all');
  const [broadcastAllMessage, setBroadcastAllMessage] = useState('');

  const handleBroadcastAll = () => {
    if (!broadcastAllMessage) {
      alert("Please enter a message.");
      return;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(broadcastAllMessage)}`;
    window.open(url, "_blank");
    setIsBroadcastAllOpen(false);
  };
  
  const broadcastAllCount = React.useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return members.filter(m => {
      switch(broadcastAllFilter) {
        case 'active':
          if (m.expiry_date < today) return false;
          break;
        case 'expiring':
          const in7Days = new Date();
          in7Days.setDate(in7Days.getDate() + 7);
          const nextWeek = in7Days.toISOString().slice(0, 10);
          if (m.expiry_date < today || m.expiry_date > nextWeek) return false;
          break;
        case 'expired':
          if (m.expiry_date >= today) return false;
          break;
        case 'dues':
          if (m.pending_amount <= 0) return false;
          break;
      }
      return true;
    }).length;
  }, [members, broadcastAllFilter]);
  
  const defaultTemplates = {
    expiry: "Hi {{name}}, your gym membership is expiring on {{expiry_date}}. Please renew.",
    dues: "Hi {{name}}, you have pending dues of ₹{{due_amount}}. Please clear them.",
    birthday: "Happy Birthday {{name}}!",
    welcome: "Welcome to the gym, {{name}}!",
  };

  const [settings, setSettings] = useState({
    templates: { ...defaultTemplates },
    system: { currency: "₹", countryCode: "+91", expiryDays: 7 }
  });

  const [selectedTpl, setSelectedTpl] = useState<keyof typeof defaultTemplates>('expiry');

  useEffect(() => {
    const saved = localStorage.getItem('gymSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(prev => ({
          templates: { ...prev.templates, ...(parsed.templates || {}) },
          system: { ...prev.system, ...(parsed.system || {}) }
        }));
      } catch {
        // ignore JSON parse error
      }
    }
  }, []);

  const handleSettingsChange = (field: string, value: any, category: 'templates' | 'system' = 'templates') => {
    setSettings(prev => {
      const next = {
        ...prev,
        [category]: { ...prev[category], [field]: value }
      };
      localStorage.setItem('gymSettings', JSON.stringify(next));
      return next;
    });
  };

  const renderPreview = (text: string) => {
    if (!text) return <span className="preview-empty">Start typing to preview…</span>;
    return (
      <span>
        {text
          .replace(/{{name}}/g, 'Raj Sharma')
          .replace(/{{expiry_date}}/g, '25-08-2026')
          .replace(/{{start_date}}/g, '25-07-2026')
          .replace(/{{due_amount}}/g, '1500')
          .replace(/{{membership_type}}/g, 'Monthly')
          .replace(/{{trainer_name}}/g, 'Rahul')
          .replace(/{{trainer_line}}/g, 'Your trainer Rahul is waiting.')}
      </span>
    );
  };
  
  const [bMessageType, setBMessageType] = useState<keyof typeof defaultTemplates>('expiry');
  const [bMessageText, setBMessageText] = useState('');

  const defaultBMessageText = React.useMemo(() => {
    if (!selectedMember) return '';
    const text = settings.templates[bMessageType] || `Hi {{name}}!`;
    return text
      .replace(/{{name}}/g, selectedMember.name || '')
      .replace(/{{expiry_date}}/g, selectedMember.expiry_date || '')
      .replace(/{{start_date}}/g, selectedMember.start_date || '')
      .replace(/{{due_amount}}/g, (selectedMember.pending_amount || 0).toString())
      .replace(/{{membership_type}}/g, selectedMember.membership_type || '')
      .replace(/{{trainer_name}}/g, selectedMember.trainer_name || '')
      .replace(/{{trainer_line}}/g, selectedMember.has_personal_trainer ? `Your trainer ${selectedMember.trainer_name} is waiting.` : '');
  }, [selectedMember, bMessageType, settings.templates]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isBroadcastOpen) setBMessageText('');
  }, [isBroadcastOpen]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMessage = bMessageText || defaultBMessageText;
    if (!finalMessage) return;
    
    const phone = selectedMember?.phone || '';
    if (!phone) {
      alert("This member does not have a phone number.");
      return;
    }
    
    const encoded = encodeURIComponent(finalMessage);
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    let cc = settings.system.countryCode.replace('+', '');
    if (cleanPhone.startsWith(cc) && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.substring(cc.length);
    }
    const url = `https://wa.me/${cc}${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank');
    setIsBroadcastOpen(false);
  };

  const namePlaceholder = '{{name}}';
  const trainerPlaceholder = '{{trainer_name}}';
  return (
    <>
      <Modal id="dialog-add" isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
<div className="dialog-header">
<h3>Add New Member</h3>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsAddOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<form id="form-add" noValidate onSubmit={handleAddSubmit}>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Full Name <span className="req">*</span></label>
<input autoComplete="off" className="form-input" id="add-name" name="add-name" placeholder="Raj Sharma" required type="text" value={addForm.name} onChange={(e) => handleAddChange('name', e.target.value)}/>
</div>
<div className="form-group">
<label className="form-label">WhatsApp Number <span className="req">*</span></label>
<input autoComplete="off" className="form-input" id="add-phone" name="add-phone" placeholder="9876543210" required type="tel" value={addForm.phone} onChange={(e) => handleAddChange('phone', e.target.value)}/>
</div>
</div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Date of Birth <span className="req">*</span></label>
<input className="form-input" id="add-dob" name="add-dob" required type="date" value={addForm.dob} onChange={(e) => handleAddChange('dob', e.target.value)}/>
</div>
<div className="form-group">
<label className="form-label">Membership Type <span className="req">*</span></label>
<select className="form-select" id="add-membership-type" name="add-membership-type" required value={addForm.membership_type} onChange={(e) => handleAddChange('membership_type', e.target.value)}>
<option value="monthly">Monthly</option>
<option value="quarterly">Quarterly (3 mo)</option>
<option value="half_yearly">Half Yearly (6 mo)</option>
<option value="yearly">Yearly (12 mo)</option>
</select>
</div>
</div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Start Date <span className="req">*</span></label>
<input className="form-input" id="add-start-date" name="add-start" required type="date" value={addForm.start_date} onChange={(e) => handleAddChange('start_date', e.target.value)}/>
</div>
<div className="form-group">
<label className="form-label">Expiry Date</label>
<input className="form-input" id="add-expiry" name="add-expiry" readOnly style={{}} type="date" value={addForm.expiry_date}/>
<span className="form-hint">Auto-calculated from type + start</span>
</div>
</div>
<div className="form-divider"><span>Personal Trainer</span></div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Personal Trainer</label>
<select className="form-select" id="add-has-pt" name="add-has-pt" value={addForm.has_personal_trainer} onChange={(e) => handleAddChange('has_personal_trainer', e.target.value)}>
<option value="no">No PT</option>
<option value="yes">Has PT</option>
</select>
</div>
{addForm.has_personal_trainer === 'yes' && (
  <div className="form-group" id="add-trainer-group" style={{}}>
  <label className="form-label">Trainer Name</label>
  <select className="form-select" id="add-trainer-name" name="add-trainer-name" value={addForm.trainer_id} onChange={(e) => handleAddChange('trainer_id', e.target.value)}>
  <option value="">— Select Trainer —</option>
  {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
  </select>
  </div>
)}
</div>
{addForm.has_personal_trainer === 'yes' && (
  <div className="form-row-2">
    <div className="form-group">
      <label className="form-label">PT Fee <span className="req">*</span></label>
      <div className="input-prefix-wrap">
        <span className="input-prefix currency-prefix">₹</span>
        <input className="form-input prefixed" id="add-pt-fee" min="0" placeholder="0" type="number" value={addForm.pt_fee || ''} onChange={(e) => handleAddChange('pt_fee', e.target.value)}/>
      </div>
    </div>
    <div></div>
  </div>
)}
<div className="form-divider"><span>Payment</span></div>
<div className="form-row-3">
<div className="form-group">
<label className="form-label">Total Fee <span className="req">*</span></label>
<div className="input-prefix-wrap">
<span className="input-prefix currency-prefix">₹</span>
<input className="form-input prefixed" id="add-total-fee" min="0" name="add-fee" placeholder="0" type="number" value={addForm.total_fee || ''} onChange={(e) => handleAddChange('total_fee', e.target.value)}/>
</div>
</div>
<div className="form-group">
<label className="form-label">Paid Now</label>
<div className="input-prefix-wrap">
<span className="input-prefix currency-prefix">₹</span>
<input className="form-input prefixed" id="add-paid-now" min="0" placeholder="0" type="number" value={addForm.paid_now || ''} onChange={(e) => handleAddChange('paid_now', e.target.value)}/>
</div>
</div>
<div className="form-group">
<label className="form-label">Balance Due</label>
<div className="input-prefix-wrap">
<span className="input-prefix currency-prefix">₹</span>
<input className="form-input prefixed" id="add-balance" name="add-balance" min="0" readOnly style={{}} type="number" value={addForm.balance_due}/>
</div>
<span className="form-hint">Auto = Total − Paid</span>
</div>
</div>
<div className="form-divider"><span>Notes</span></div>
<div className="form-group">
<label className="form-label">Internal Notes</label>
<textarea className="form-textarea" id="add-notes" placeholder="Goals, health notes, preferences…" rows={2} value={addForm.notes} onChange={(e) => handleAddChange('notes', e.target.value)}></textarea>
</div>
</form>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsAddOpen(false)}>Cancel</button>
<button type="submit" form="form-add" className="btn btn-primary" id="btn-add-submit">Save Member</button>
</div>
</Modal>
<Modal id="dialog-edit" isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
<div className="dialog-header">
<h3>Edit Member</h3>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsEditOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<form id="form-edit" noValidate onSubmit={handleEditSubmit}>
<input id="edit-id"  type="hidden" value={editForm.id || ""} onChange={(e) => handleEditChange("id", e.target.value)}/>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Full Name <span className="req">*</span></label>
<input id="edit-name"  required type="text" value={editForm.name || ""} onChange={(e) => handleEditChange("name", e.target.value)}/>
</div>
<div className="form-group">
<label className="form-label">WhatsApp Number <span className="req">*</span></label>
<input id="edit-phone"  required type="tel" value={editForm.phone || ""} onChange={(e) => handleEditChange("phone", e.target.value)}/>
</div>
</div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Date of Birth</label>
<input id="edit-dob"  type="date" value={editForm.dob || ""} onChange={(e) => handleEditChange("dob", e.target.value)}/>
</div>
<div className="form-group">
<label className="form-label">Membership Type</label>
<select id="edit-membership-type"  value={editForm.membership_type || ""} onChange={(e) => handleEditChange("membership_type", e.target.value)}>
<option value="monthly">Monthly</option>
<option value="quarterly">Quarterly (3 mo)</option>
<option value="half_yearly">Half Yearly (6 mo)</option>
<option value="yearly">Yearly (12 mo)</option>
</select>
</div>
</div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Start Date</label>
<input id="edit-start-date"  type="date" value={editForm.start_date || ""} onChange={(e) => handleEditChange("start_date", e.target.value)}/>
</div>
<div className="form-group">
<label className="form-label">Expiry Date</label>
<input id="edit-expiry"  type="date" value={editForm.expiry_date || ""} onChange={(e) => handleEditChange("expiry_date", e.target.value)}/>
</div>
</div>
<div className="form-divider"><span>Personal Trainer</span></div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Personal Trainer</label>
<select id="edit-has-pt"  value={editForm.has_personal_trainer ? "yes" : "no"} onChange={(e) => handleEditChange("has_personal_trainer", e.target.value === "yes")}>
<option value="no">No PT</option>
<option value="yes">Has PT</option>
</select>
</div>
{editForm.has_personal_trainer && (
  <div className="form-group" id="edit-trainer-group" style={{}}>
  <label className="form-label">Trainer Name</label>
  <select id="edit-trainer-name"  value={editForm.trainer_id || ""} onChange={(e) => handleEditChange("trainer_id", e.target.value)}>
  <option value="">— Select Trainer —</option>
  {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
  </select>
  </div>
)}
</div>
{editForm.has_personal_trainer && (
  <div className="form-row-2">
    <div className="form-group">
      <label className="form-label">PT Fee <span className="req">*</span></label>
      <div className="input-prefix-wrap">
        <span className="input-prefix currency-prefix">₹</span>
        <input id="edit-pt-fee" min="0" placeholder="0" type="number" value={editForm.pt_fee || ''} onChange={(e) => handleEditChange('pt_fee', e.target.value)}/>
      </div>
    </div>
    <div></div>
  </div>
)}

<div className="form-row-3">
<div className="form-group">
<label className="form-label">Total Fee</label>
<div className="input-prefix-wrap">
<span className="input-prefix currency-prefix">₹</span>
<input id="edit-total-fee"  min="0" type="number"  value={editForm.total_fee || ""} onChange={(e) => handleEditChange("total_fee", e.target.value)}/>
</div>
</div>
<div className="form-group">
<label className="form-label">Add Payment</label>
<div className="input-prefix-wrap">
<span className="input-prefix currency-prefix">₹</span>
<input id="edit-add-payment"  min="0" placeholder="0" type="number"  value={editForm.add_payment || ""} onChange={(e) => handleEditChange("add_payment", e.target.value)}/>
</div>
</div>
<div className="form-group">
<label className="form-label">Balance Due</label>
<div className="input-prefix-wrap">
<span className="input-prefix currency-prefix">₹</span>
<input id="edit-balance" style={{}} type="number" value={Math.max(0, (editForm.pending_amount || 0) - (editForm.add_payment || 0))} readOnly/>
</div>
</div>
</div>
<div className="form-divider"><span>Streak &amp; Notes</span></div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Renewal Streak 🔥</label>
<input id="edit-streak"  min="0" placeholder="0" type="number"  value={editForm.renewal_streak || ""} onChange={(e) => handleEditChange("renewal_streak", e.target.value)}/>
<span className="form-hint">Times this member has renewed</span>
</div>
<div className="form-group">
<label className="form-label">Internal Notes</label>
<textarea id="edit-notes"  placeholder="Goals, health notes, preferences…" rows={2} value={editForm.notes || ""} onChange={(e) => handleEditChange("notes", e.target.value)}></textarea>
</div>
</div>
</form>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsEditOpen(false)}>Cancel</button>
<button type="submit" form="form-edit" className="btn btn-primary" id="btn-edit-submit">Update Member</button>
</div>
</Modal>
<Modal id="dialog-payments" isOpen={isPaymentsOpen} onClose={() => setIsPaymentsOpen(false)}>
<div className="dialog-header">
<div>
<h3 id="pay-dialog-name">Payment History</h3>
<p className="dialog-sub" id="pay-dialog-sub"></p>
</div>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsPaymentsOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<div className="pay-summary-bar" id="pay-summary-bar">
  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '1rem', borderRadius: '8px' }}>
    <div><strong>Total Fee:</strong> ₹{selectedMember?.total_fee || 0}</div>
    <div><strong>Paid:</strong> ₹{(selectedMember?.total_fee || 0) - (selectedMember?.pending_amount || 0)}</div>
    <div style={{ color: (selectedMember?.pending_amount || 0) > 0 ? 'var(--danger)' : 'var(--success)' }}><strong>Pending:</strong> ₹{selectedMember?.pending_amount || 0}</div>
  </div>
</div>

</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsPaymentsOpen(false)}>Close</button>
</div>
</Modal>
<Modal id="dialog-broadcast" isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)}>
<div className="dialog-header">
<div>
<h3 id="broadcast-dialog-title">Message — <span id="broadcast-member-name"></span></h3>
<p className="dialog-sub" id="broadcast-member-sub"></p>
</div>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsBroadcastOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<form id="form-broadcast" onSubmit={handleBroadcast}>
<div className="form-group">
<label className="form-label">Template</label>
<select
  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
  value={bMessageType}
  onChange={(e) => {
    setBMessageType(e.target.value as keyof typeof defaultTemplates);
    setBMessageText('');
  }}
>
  <option value="expiry">Membership Renewal</option>
  <option value="dues">Payment Due</option>
  <option value="birthday">Birthday Greeting</option>
  <option value="welcome">New Joiner Welcome</option>
</select>
</div>
<div className="form-group">
<label className="form-label">Custom Message</label>
<textarea
  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm h-32 text-white"
  value={bMessageText || defaultBMessageText}
  onChange={(e) => setBMessageText(e.target.value)}
></textarea>
<span className="form-hint">Pre-filled from template. Edit freely before sending.</span>
</div>
</form>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsBroadcastOpen(false)}>Cancel</button>
<button type="submit" form="form-broadcast" className="btn btn-primary" id="btn-broadcast-submit">Send Message</button>
</div>
</Modal>
<Modal id="dialog-delete" isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
<div className="dialog-header">
<h3 style={{}}>Confirm Deletion</h3>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsDeleteOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<p style={{}}>
      Remove <strong id="delete-name" style={{}}>this member</strong> from the database? This cannot be undone.
    </p>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsDeleteOpen(false)}>Keep Member</button>
<button className="btn btn-danger" id="btn-delete-confirm" onClick={handleDelete}>Delete Permanently</button>
</div>
</Modal>
<Modal id="dialog-trainers" isOpen={isTrainersOpen} onClose={() => setIsTrainersOpen(false)}>
<div className="dialog-header">
<h3>Manage Trainers</h3>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsTrainersOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<form className="trainer-add-row" onSubmit={async (e) => {
  e.preventDefault();
  if (!newTrainerName.trim()) {
    alert("Please enter a trainer name");
    return;
  }
  const ok = await addTrainer(newTrainerName);
  if (ok) setNewTrainerName('');
}}>
<input 
  className="form-input" 
  placeholder="Trainer full name" 
  style={{}} 
  type="text"
  value={newTrainerName}
  onChange={(e) => setNewTrainerName(e.target.value)}
/>
<button type="submit" className="btn btn-primary" id="btn-add-trainer">Add</button>
</form>
<div className="trainer-list" id="trainer-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
  {trainers.map(t => (
    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
      <span>{t.name}</span>
      <button type="button" className="icon-btn delete" onClick={() => deleteTrainer(t.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"/></svg>
      </button>
    </div>
  ))}
  {trainers.length === 0 && <p style={{ color: 'var(--text-3)' }}>No trainers added yet.</p>}
</div>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsTrainersOpen(false)}>Done</button>
</div>
</Modal>
<Modal id="dialog-settings" isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
<div className="dialog-header">
<h3>Settings</h3>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsSettingsOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<div className="settings-section">
<div className="settings-section-title">Broadcast Templates</div>
<div className="form-group">
<label className="form-label">Template Type</label>
<select className="form-select" id="tpl-select" value={selectedTpl} onChange={(e) => setSelectedTpl(e.target.value as any)}>
<option value="expiry">Membership Renewal</option>
<option value="dues">Payment Due Reminder</option>
<option value="birthday">Birthday Greeting</option>
<option value="welcome">New Joiner Welcome</option>
</select>
</div>
<div className="form-group">
<label className="form-label">Message</label>
<textarea className="form-textarea" id="tpl-editor" rows={5} value={settings.templates[selectedTpl]} onChange={(e) => handleSettingsChange(selectedTpl, e.target.value, 'templates')}></textarea>
<div className="pills">
<span className="pill" data-var="{namePlaceholder}">{namePlaceholder}</span>
<span className="pill" data-var="{{expiry_date}}">{"{{expiry_date}}"}</span>
<span className="pill" data-var="{{start_date}}">{"{{start_date}}"}</span>
<span className="pill" data-var="{{due_amount}}">{"{{due_amount}}"}</span>
<span className="pill" data-var="{{membership_type}}">{"{{membership_type}}"}</span>
<span className="pill" data-var="{trainerPlaceholder}">{trainerPlaceholder}</span>
<span className="pill" data-var="{{trainer_line}}">{"{{trainer_line}}"}</span>
</div>
</div>
<div className="form-group">
<label className="form-label">Preview</label>
<div className="preview-box" id="tpl-preview">{renderPreview(settings.templates[selectedTpl])}</div>
</div>
</div>
<div className="settings-section">
<div className="settings-section-title">System</div>
<div className="form-row-2">
<div className="form-group">
<label className="form-label">Currency</label>
<select className="form-select" id="s-currency" value={settings.system.currency} onChange={(e) => handleSettingsChange('currency', e.target.value, 'system')}>
<option value="₹">INR (₹)</option>
<option value="$">USD ($)</option>
<option value="€">EUR (€)</option>
<option value="£">GBP (£)</option>
</select>
</div>
<div className="form-group">
<label className="form-label">Country Code</label>
<input className="form-input" id="s-country-code" placeholder="+91" type="text" value={settings.system.countryCode} onChange={(e) => handleSettingsChange('countryCode', e.target.value, 'system')}/>
</div>
</div>
<div className="form-group">
<label className="form-label">Expiry Alert Window (Days)</label>
<input className="form-input" id="s-expiry-days" max="60" min="1" type="number" value={settings.system.expiryDays} onChange={(e) => handleSettingsChange('expiryDays', parseInt(e.target.value) || 7, 'system')}/>
<span className="form-hint">Members expiring within this window are flagged "Expiring"</span>
</div>
</div>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-primary close-dialog" onClick={() => setIsSettingsOpen(false)}>Save & Close</button>
</div>
</Modal>
<Modal id="dialog-broadcast-all" isOpen={isBroadcastAllOpen} onClose={() => setIsBroadcastAllOpen(false)}>
<div className="dialog-header">
<div>
<h3>Broadcast All</h3>
<p className="dialog-sub" id="broadcast-all-sub">Compose one WhatsApp message and choose the group in WhatsApp</p>
</div>
<button type="button" className="icon-btn close-dialog" onClick={() => setIsBroadcastAllOpen(false)}>
<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{}} viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</button>
</div>
<div className="dialog-body">
<div className="form-group">
<label className="form-label">Reference Group</label>
<select className="form-select" id="broadcast-all-filter" value={broadcastAllFilter} onChange={(e) => setBroadcastAllFilter(e.target.value)}>
<option value="all">All Members</option>
<option value="active">Active Members</option>
<option value="expiring">Expiring Soon</option>
<option value="expired">Expired Members</option>
<option value="dues">Members with Pending Dues</option>
</select>
</div>
<div className="form-group" style={{}}>
<label className="form-label">Custom Message <span className="req">*</span></label>
<textarea className="form-textarea" id="broadcast-all-message" placeholder="Type your custom group message here..." rows={7} value={broadcastAllMessage} onChange={(e) => setBroadcastAllMessage(e.target.value)}></textarea>
<span className="form-hint">Opens one WhatsApp screen. Choose any person, gym group, or community there.</span>
</div>
<div id="broadcast-all-count" style={{ marginTop: '1rem', color: 'var(--brand)' }}>
  Addressing <strong>{broadcastAllCount}</strong> members.
</div>
</div>
<div className="dialog-actions">
<button type="button" className="btn btn-ghost close-dialog" onClick={() => setIsBroadcastAllOpen(false)}>Cancel</button>
<button className="btn btn-primary" id="btn-broadcast-all-submit" onClick={handleBroadcastAll}>Send to All Visible</button>
</div>
</Modal>
    </>
  );
}
