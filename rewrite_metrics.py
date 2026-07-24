import re

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\components\Metrics.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import React from "react";', '"use client";\nimport React, { useMemo } from "react";\nimport { useCRM } from "@/context/CRMContext";')

content = content.replace('export default function Metrics() {', '''export default function Metrics() {
  const { members } = useCRM();

  const stats = useMemo(() => {
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let pendingDues = 0;
    let pendingCount = 0;
    let birthdays = 0;

    const today = new Date().toISOString().slice(0, 10);
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const nextWeek = in7Days.toISOString().slice(0, 10);
    const now = new Date();

    members.forEach(m => {
      // Expiry status
      if (m.expiry_date >= today && m.expiry_date <= nextWeek) {
        expiring++;
        active++;
      } else if (m.expiry_date >= today) {
        active++;
      } else {
        expired++;
      }

      // Dues
      if (m.pending_amount > 0) {
        pendingDues += m.pending_amount;
        pendingCount++;
      }

      // Birthdays
      if (m.dob) {
        const dobDate = new Date(m.dob);
        if (dobDate.getMonth() === now.getMonth() && dobDate.getDate() === now.getDate()) {
          birthdays++;
        }
      }
    });

    return {
      total: members.length,
      active,
      expiring,
      expired,
      pendingDues,
      pendingCount,
      birthdays
    };
  }, [members]);

''')

# Now replace the hardcoded metric values with `{stats.total}`, etc.
content = re.sub(r'<div className="metric-val" id="total-members">\s*0\s*</div>', '<div className="metric-val" id="total-members">{stats.total}</div>', content)
content = re.sub(r'<div className="metric-val" id="active-members">\s*0\s*</div>', '<div className="metric-val" id="active-members">{stats.active}</div>', content)
content = re.sub(r'<div className="metric-val" id="expiring-members">\s*0\s*</div>', '<div className="metric-val" id="expiring-members">{stats.expiring}</div>', content)
content = re.sub(r'<div className="metric-val" id="expired-members">\s*0\s*</div>', '<div className="metric-val" id="expired-members">{stats.expired}</div>', content)
content = re.sub(r'<div className="metric-val" id="pending-dues">₹0</div>', '<div className="metric-val" id="pending-dues">₹{Math.round(stats.pendingDues).toLocaleString("en-IN")}</div>', content)
content = re.sub(r'<div className="metric-sub" id="pending-count">\s*0 members pending\s*</div>', '<div className="metric-sub" id="pending-count">{stats.pendingCount} members pending</div>', content)
content = re.sub(r'<div className="metric-val" id="bday-count">\s*0\s*</div>', '<div className="metric-val" id="bday-count">{stats.birthdays}</div>', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
