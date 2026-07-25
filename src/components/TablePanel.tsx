"use client";

import React, { useMemo } from "react";
import { useCRM } from "@/context/CRMContext";

export default function TablePanel() {
  const { 
    members, loading, 
    activeTab, setActiveTab, 
    searchQuery, setSearchQuery,
    setIsEditOpen, setSelectedMember,
    setIsBroadcastOpen, setIsDeleteOpen
  } = useCRM();

  // Wait for two animation frames (lets React commit + browser paint the
  // new member into InvoiceTemplate) instead of guessing with a fixed delay.
  const waitForNextPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

  // Wait for every <img> inside the target element to finish loading (or
  // fail) so the signature image can't get cut off by a race condition.
  const waitForImages = (element: HTMLElement) => {
    const imgs = Array.from(element.querySelectorAll('img'));
    return Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        });
      })
    );
  };

  const handleGenerateBill = (member: any) => {
    setSelectedMember(member);

    (async () => {
      const wrapper = document.getElementById('invoice-wrapper');
      const element = document.getElementById('invoice-template');
      if (!wrapper || !element) return;

      // Temporarily bring into view but keep invisible
      // position absolute and a large width prevents mobile viewports from squishing the element
      const originalCssText = wrapper.style.cssText;
      wrapper.style.cssText = 'position: absolute; top: -9999px; left: -9999px; min-width: 1000px; display: block; overflow: visible;';

      try {
        // html2canvas-pro is a drop-in replacement for html2canvas that
        // understands modern CSS color functions (oklch/oklab/color-mix),
        // which Tailwind v4 uses by default. Plain html2canvas throws on
        // those and silently aborts most of the render.
        const html2canvas = (await import('html2canvas-pro')).default;
        const { jsPDF } = await import('jspdf');

        await waitForNextPaint();
        await waitForImages(element);

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          scrollY: 0
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Perfect 1-page fit
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width / 2, canvas.height / 2]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`Receipt_${member.name.replace(/\s+/g, '_')}.pdf`);

        const phone = member.phone ? member.phone.replace(/[^0-9]/g, '') : '';
        const msg = `Hi ${member.name}, please find attached the receipt for your gym membership fee. Thank you!`;
        if (phone) {
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
          window.open(url, "_blank");
        } else {
          alert('Bill downloaded. No phone number to send WhatsApp message.');
        }
      } catch (err) {
        console.error("PDF generation failed:", err);
        alert('Bill generation failed — check the console for details.');
      } finally {
        // Always restore, even if generation failed
        wrapper.style.cssText = originalCssText;
      }
    })();
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // 1. Search Query
      const q = searchQuery.toLowerCase();
      if (q && !m.name.toLowerCase().includes(q) && !(m.phone || '').includes(q) && !(m.trainer_name || '').toLowerCase().includes(q)) {
        return false;
      }
      
      // 2. Tabs
      const today = new Date().toISOString().slice(0, 10);
      switch(activeTab) {
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
        case 'pt':
          if (!m.has_personal_trainer) return false;
          break;
        case 'birthdays':
          if (!m.dob) return false;
          const dobDate = new Date(m.dob);
          const now = new Date();
          if (dobDate.getMonth() !== now.getMonth() || dobDate.getDate() !== now.getDate()) return false;
          break;
      }
      return true;
    });
  }, [members, activeTab, searchQuery]);

  return (
    <>
      <main className="panel">
        <div className="grid-toolbar">
          <div className="search-wrap">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
            <input 
              className="search-input" 
              id="search-input" 
              placeholder="Search name, phone, trainer…" 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="tabs" role="tablist">
            {['all', 'active', 'expiring', 'expired', 'dues', 'pt', 'birthdays'].map(tab => (
              <button 
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'pt' ? 'PT Members' : tab === 'birthdays' ? '🎂 Birthdays' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table" id="member-table">
            <thead>
              <tr>
                <th className="sortable" data-sort="name">Name <span className="sort-icon" id="sort-name">↕</span></th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Trainer</th>
                <th className="sortable" data-sort="smart">Status <span className="sort-icon" id="sort-smart">⚡</span></th>
                <th className="sortable" data-sort="expiry">Expiry <span className="sort-icon" id="sort-expiry">↕</span></th>
                <th className="sortable" data-sort="dues">Balance <span className="sort-icon" id="sort-dues">↕</span></th>
                <th>Last Sent</th>
                <th style={{}}>Broadcast</th>
                <th style={{}}>Actions</th>
              </tr>
            </thead>
            <tbody id="table-body">
              {loading ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '20px' }}>Loading data...</td></tr>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member: any) => {
                  const today = new Date().toISOString().slice(0, 10);
                  const isExpired = member.expiry_date < today;
                  
                  const balance = member.pending_amount;
                  const total = member.total_fee || 0;
                  const paid = total - balance;
                  const payPct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 100;
                  
                  const dobDate = member.dob ? new Date(member.dob) : null;
                  const now = new Date();
                  const isBday = dobDate && dobDate.getMonth() === now.getMonth() && dobDate.getDate() === now.getDate();
                  
                  let waBtnClass = 'renewal';
                  let waBtnText = 'Renewal';
                  if (isBday) {
                    waBtnClass = 'birthday';
                    waBtnText = 'Wish';
                  } else if (balance > 0) {
                    waBtnClass = 'dues';
                    waBtnText = 'Dues';
                  }

                  let badgeClass = isExpired ? 'badge-expired' : 'badge-active';
                  let badgeText = isExpired ? 'Expired' : 'Active';
                  if (isBday) {
                    badgeClass = 'badge-birthday';
                    badgeText = 'Birthday';
                  }

                  return (
                    <tr key={member.id}>
                      <td><strong>{member.name}</strong>{isBday && <span className="bday-icon">🎂</span>}{member.renewal_streak > 0 && <span className="streak-badge" title={`${member.renewal_streak} renewal streak`}>🔥{member.renewal_streak}</span>}</td>
                      <td>{member.phone || '-'}</td>
                      <td><span className={`plan-badge plan-${member.membership_type.toLowerCase()}`}>{member.membership_type}</span></td>
                      <td>{member.has_personal_trainer && member.trainer_name ? <span className="trainer-badge">{member.trainer_name}</span> : <span className="no-trainer">—</span>}</td>
                      <td><span className={`badge ${badgeClass}`}>{badgeText}</span></td>
                      <td>{member.expiry_date}</td>
                      <td>
                        {balance > 0 ? (
                          <button className="balance-btn danger" onClick={() => {
                            setSelectedMember(member);
                            setIsEditOpen(true);
                          }}>
                            ₹{Math.round(balance).toLocaleString('en-IN')}
                            <span className="pay-pct">{payPct}% paid</span>
                          </button>
                        ) : (
                          <span className="balance-clear">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '12px', height: '12px'}}><polyline points="20 6 9 17 4 12"/></svg>
                            Paid
                          </span>
                        )}
                      </td>
                      <td>{member.last_contacted ? new Date(member.last_contacted).toLocaleDateString() : '-'}</td>
                      <td style={{textAlign: 'center'}}>
                        <button className={`wa-btn ${waBtnClass}`} onClick={() => {
                          setSelectedMember(member);
                          setIsBroadcastOpen(true);
                        }}>
                          <svg viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                          {waBtnText}
                        </button>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <div className="row-actions">
                          <button className="icon-btn" onClick={() => handleGenerateBill(member)} title="Download Bill & Send WA">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          </button>
                          <button className="icon-btn" onClick={() => {
                            setSelectedMember(member);
                            setIsEditOpen(true);
                          }} title="Edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button className="icon-btn delete" onClick={() => {
                            setSelectedMember(member);
                            setIsDeleteOpen(true);
                          }} title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state" id="empty-state">
                      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" x2="16" y1="12" y2="12"></line></svg>
                      <h4 id="empty-title">No Members Found</h4>
                      <p id="empty-text">Add your first member or import an existing list.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
