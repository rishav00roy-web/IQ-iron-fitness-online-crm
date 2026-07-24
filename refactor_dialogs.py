import re

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\components\Dialogs.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import useEffect and controlled state
content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";')

# 2. Add controlled state for Edit Form inside Dialogs
controlled_state = '''
  const [editForm, setEditForm] = useState<any>({});
  
  useEffect(() => {
    if (selectedMember) {
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
    
    // Calculate new payment
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
      trainer_name: editForm.trainer_name,
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
  
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const msgType = (form.elements.namedItem("b-message-type") as HTMLSelectElement).value;
    
    let text = "";
    if (msgType === "expiry") {
      text = `Hi ${selectedMember?.name || ''}, your gym membership is expiring soon. Please renew.`;
    } else if (msgType === "dues") {
      text = `Hi ${selectedMember?.name || ''}, you have pending dues of ₹${selectedMember?.pending_amount}. Please clear them.`;
    } else {
      text = `Hi ${selectedMember?.name || ''}, hope you're having a great day!`;
    }
    
    const phone = selectedMember?.phone || '';
    if (!phone) {
      alert("This member does not have a phone number.");
      return;
    }
    
    const url = `https://wa.me/91${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsBroadcastOpen(false);
  };
'''

# Insert after handleAddSubmit
content = content.replace('const namePlaceholder = \'{name}\';', controlled_state + '\n  const namePlaceholder = \'{name}\';')

# 3. Fix Edit Form tags
content = content.replace('<form id="form-edit" noValidate>', '<form id="form-edit" noValidate onSubmit={handleEditSubmit}>')
content = content.replace('<button className="btn btn-primary" id="btn-edit-submit">Save Changes</button>', '<button type="submit" className="btn btn-primary" id="btn-edit-submit">Save Changes</button>')

# Replace uncontrolled edit inputs with controlled inputs
def repl_input(match):
    id_attr = match.group(1)
    rest = match.group(2)
    # Map id to state field
    field = id_attr.replace('edit-', '').replace('-', '_')
    if field == 'name': state_field = 'name'
    elif field == 'phone': state_field = 'phone'
    elif field == 'dob': state_field = 'dob'
    elif field == 'membership_type': state_field = 'membership_type'
    elif field == 'start_date': state_field = 'start_date'
    elif field == 'expiry': state_field = 'expiry_date'
    elif field == 'has_pt': state_field = 'has_personal_trainer'
    elif field == 'trainer_name': state_field = 'trainer_name'
    elif field == 'total_fee': state_field = 'total_fee'
    elif field == 'add_payment': state_field = 'add_payment'
    elif field == 'streak': state_field = 'renewal_streak'
    elif field == 'notes': state_field = 'notes'
    elif field == 'balance': state_field = 'pending_amount'
    else: state_field = field

    if '<select' in match.group(0):
        if state_field == 'has_personal_trainer':
            return f'<select id="{id_attr}" {rest} value={{editForm.has_personal_trainer ? "yes" : "no"}} onChange={{(e) => handleEditChange("has_personal_trainer", e.target.value === "yes")}}>'
        return f'<select id="{id_attr}" {rest} value={{editForm.{state_field} || ""}} onChange={{(e) => handleEditChange("{state_field}", e.target.value)}}>'
    elif '<textarea' in match.group(0):
        return f'<textarea id="{id_attr}" {rest} value={{editForm.{state_field} || ""}} onChange={{(e) => handleEditChange("{state_field}", e.target.value)}}>'
    else:
        # It's an input
        # Remove any defaultValue="0" or value="0"
        rest = re.sub(r'defaultValue="[^"]*"', '', rest)
        rest = re.sub(r'value="[^"]*"', '', rest)
        if state_field == 'pending_amount':
            return f'<input id="{id_attr}" {rest} value={{Math.max(0, (editForm.pending_amount || 0) - (editForm.add_payment || 0))}} readOnly/>'
        return f'<input id="{id_attr}" {rest} value={{editForm.{state_field} || ""}} onChange={{(e) => handleEditChange("{state_field}", e.target.value)}}/>'

# Replace edit inputs
content = re.sub(r'<input[^>]*id="(edit-[^"]*)"([^>]*)/>', repl_input, content)
content = re.sub(r'<select[^>]*id="(edit-[^"]*)"([^>]*)>', repl_input, content)
content = re.sub(r'<textarea[^>]*id="(edit-[^"]*)"([^>]*)>', repl_input, content)

# 4. Fix Delete dialog
content = content.replace('<button className="btn btn-danger" id="btn-confirm-delete">Yes, Delete</button>', '<button type="button" className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>')

# 5. Fix Broadcast dialog
content = content.replace('<form id="form-broadcast" noValidate>', '<form id="form-broadcast" noValidate onSubmit={handleBroadcast}>')
content = content.replace('<button className="btn wa-btn" id="btn-send-wa">', '<button type="submit" className="btn wa-btn" id="btn-send-wa">')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
