import React, { useMemo } from 'react';

export default function InvoiceTemplate({ member }: { member: any }) {
  if (!member) return null;

  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const invoiceNumber = useMemo(() => `INV-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`, []);
  
  const total = member.total_fee || 0;
  const balance = member.pending_amount || 0;
  const paid = total - balance;

  return (
    <div 
      id="invoice-template" 
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '800px', // Fixed width for consistent A4 scaling
        padding: '40px',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ea580c', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', color: '#ea580c', fontSize: '32px', fontWeight: 800 }}>IQ IRON FITNESS</h1>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>Premium Fitness Center & Gym</p>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>contact@iqironfitness.com</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#111827' }}>FEE RECEIPT</h2>
          <p style={{ margin: 0, fontWeight: 'bold' }}>No: {invoiceNumber}</p>
          <p style={{ margin: 0 }}>Date: {invoiceDate}</p>
        </div>
      </div>

      {/* Member Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4b5563', textTransform: 'uppercase' }}>Billed To:</h3>
          <p style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold' }}>{member.name}</p>
          <p style={{ margin: 0 }}>Phone: {member.phone || 'N/A'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4b5563', textTransform: 'uppercase' }}>Membership Details:</h3>
          <p style={{ margin: '0 0 5px 0' }}>Plan: <strong>{member.membership_type || 'Custom Plan'}</strong></p>
          <p style={{ margin: 0 }}>Expiry: <strong>{new Date(member.expiry_date).toLocaleDateString('en-IN')}</strong></p>
        </div>
      </div>

      {/* Bill Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <td style={{ padding: '16px 12px' }}>Gym Membership Fee ({member.membership_type})</td>
            <td style={{ padding: '16px 12px', textAlign: 'right' }}>₹{total.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>Total Amount:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#16a34a' }}>
            <span>Amount Paid:</span>
            <span>₹{paid.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #ea580c', fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
            <span>Balance Due:</span>
            <span style={{ color: balance > 0 ? '#dc2626' : '#111827' }}>₹{balance.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '60px', textAlign: 'center', color: '#6b7280', fontSize: '14px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        <p style={{ margin: '0 0 5px 0' }}>Thank you for choosing IQ Iron Fitness!</p>
        <p style={{ margin: 0 }}>This is a computer generated receipt and does not require a physical signature.</p>
      </div>
    </div>
  );
}
