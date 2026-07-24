import re

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\components\Dialogs.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add use client and import useCRM
content = content.replace('import React from "react";', '"use client";\nimport React, { useState } from "react";\nimport { useCRM } from "@/context/CRMContext";\nimport { supabase } from "@/lib/supabase";')

content = content.replace('export default function Dialogs() {', '''export default function Dialogs() {
  const { 
    isAddOpen, setIsAddOpen, 
    isBroadcastOpen, setIsBroadcastOpen,
    isEditOpen, setIsEditOpen,
    isTrainersOpen, setIsTrainersOpen,
    isSettingsOpen, setIsSettingsOpen,
    isDeleteOpen, setIsDeleteOpen,
    isPaymentsOpen, setIsPaymentsOpen,
    selectedMember, setSelectedMember,
    fetchMembers
  } = useCRM();

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newMember = {
      name: (form.elements.namedItem("add-name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("add-phone") as HTMLInputElement).value,
      dob: (form.elements.namedItem("add-dob") as HTMLInputElement).value,
      membership_type: (form.elements.namedItem("add-membership-type") as HTMLSelectElement).value,
      start_date: (form.elements.namedItem("add-start") as HTMLInputElement).value,
      expiry_date: (form.elements.namedItem("add-expiry") as HTMLInputElement).value,
      has_personal_trainer: (form.elements.namedItem("add-pt-checkbox") as HTMLInputElement).checked,
      trainer_name: (form.elements.namedItem("add-trainer") as HTMLSelectElement).value,
      total_fee: parseFloat((form.elements.namedItem("add-fee") as HTMLInputElement).value) || 0,
      pending_amount: parseFloat((form.elements.namedItem("add-balance") as HTMLInputElement).value) || 0,
    };
    await supabase.from('members').insert(newMember);
    setIsAddOpen(false);
    fetchMembers();
  };
''')

# Hook up open state on dialogs
content = content.replace('<dialog id="dialog-add">', '<dialog id="dialog-add" open={isAddOpen}>')
content = content.replace('<dialog id="dialog-edit">', '<dialog id="dialog-edit" open={isEditOpen}>')
content = content.replace('<dialog id="dialog-payments">', '<dialog id="dialog-payments" open={isPaymentsOpen}>')
content = content.replace('<dialog id="dialog-broadcast">', '<dialog id="dialog-broadcast" open={isBroadcastOpen}>')
content = content.replace('<dialog id="dialog-delete">', '<dialog id="dialog-delete" open={isDeleteOpen}>')
content = content.replace('<dialog id="dialog-trainers">', '<dialog id="dialog-trainers" open={isTrainersOpen}>')
content = content.replace('<dialog id="dialog-settings">', '<dialog id="dialog-settings" open={isSettingsOpen}>')

# Add name="" to inputs so form elements can be accessed by namedItem
content = re.sub(r'id="add-name"', 'id="add-name" name="add-name"', content)
content = re.sub(r'id="add-phone"', 'id="add-phone" name="add-phone"', content)
content = re.sub(r'id="add-dob"', 'id="add-dob" name="add-dob"', content)
content = re.sub(r'id="add-membership-type"', 'id="add-membership-type" name="add-membership-type"', content)
content = re.sub(r'id="add-start"', 'id="add-start" name="add-start"', content)
content = re.sub(r'id="add-expiry"', 'id="add-expiry" name="add-expiry"', content)
content = re.sub(r'id="add-pt-checkbox"', 'id="add-pt-checkbox" name="add-pt-checkbox"', content)
content = re.sub(r'id="add-trainer"', 'id="add-trainer" name="add-trainer"', content)
content = re.sub(r'id="add-fee"', 'id="add-fee" name="add-fee"', content)
content = re.sub(r'id="add-balance"', 'id="add-balance" name="add-balance"', content)

# Hook up onSubmit
content = content.replace('<form id="form-add" noValidate>', '<form id="form-add" noValidate onSubmit={handleAddSubmit}>')

# Hook up close buttons
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-add">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsAddOpen(false)}>')
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-edit">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsEditOpen(false)}>')
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-payments">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsPaymentsOpen(false)}>')
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-broadcast">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsBroadcastOpen(false)}>')
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-delete">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsDeleteOpen(false)}>')
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-trainers">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsTrainersOpen(false)}>')
content = content.replace('<button className="icon-btn close-dialog" data-dialog="dialog-settings">', '<button type="button" className="icon-btn close-dialog" onClick={() => setIsSettingsOpen(false)}>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
