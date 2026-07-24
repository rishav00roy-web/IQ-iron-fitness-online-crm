import React from 'react';

export default function InvoiceTemplate({ member }: { member: any }) {
  if (!member) return null;

  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const invoiceNumber = `INV-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  
  const total = member.total_fee || 0;
  const balance = member.pending_amount || 0;
  const paid = total - balance;
  const isPaid = balance <= 0;

  return (
    <div 
      id="invoice-template" 
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '800px', // Perfect A4 scaling
        minHeight: '1130px',
        padding: '40px',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-30deg)',
        fontSize: '120px',
        fontWeight: 900,
        color: 'rgba(0, 0, 0, 0.03)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        IQ IRON FITNESS
      </div>

      {/* Outer Metallic Border Wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        border: '4px solid transparent',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #e5e7eb, #9ca3af, #d1d5db, #6b7280)',
        padding: '30px',
        borderRadius: '12px',
        minHeight: '1040px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
      }}>
        
        {/* Blue Gradient Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #1d4ed8)',
          borderRadius: '8px',
          padding: '30px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '36px', fontWeight: 900, letterSpacing: '1px' }}>IQ IRON FITNESS</h1>
            <p style={{ margin: 0, fontSize: '15px', opacity: 0.9, letterSpacing: '2px', textTransform: 'uppercase' }}>Premium Training Facility</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 600, color: '#f8fafc' }}>OFFICIAL RECORD</h2>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>No. {invoiceNumber}</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 800, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '3px' }}>
            Membership Certificate
          </h2>
          <div style={{ height: '3px', width: '80px', background: 'linear-gradient(90deg, #3b82f6, #ea580c)', margin: '0 auto' }}></div>
        </div>

        {/* Member Details & QR Placeholder */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', padding: '0 20px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Proudly Issued To:</p>
            <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 800, color: '#111827' }}>{member.name}</p>
            <p style={{ margin: 0, fontSize: '15px', color: '#4b5563' }}>Phone: {member.phone}</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#4b5563' }}>Member Since: {new Date(member.start_date || member.created_at).toLocaleDateString('en-IN')}</p>
          </div>
          
          {/* QR Code Graphic / Status Box */}
          <div style={{ 
            width: '120px', 
            height: '120px', 
            border: '2px solid #e5e7eb', 
            borderRadius: '8px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8fafc'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={isPaid ? '#16a34a' : '#ea580c'} strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              {isPaid ? <polyline points="22 4 12 14.01 9 11.01"></polyline> : <circle cx="12" cy="12" r="10"></circle>}
            </svg>
            <span style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold', color: isPaid ? '#16a34a' : '#ea580c' }}>
              {isPaid ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>
        </div>

        {/* Beautiful Table */}
        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', fontSize: '13px', borderBottom: '2px solid #cbd5e1' }}>Plan Details</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', fontSize: '13px', borderBottom: '2px solid #cbd5e1' }}>Valid Until</th>
                <th style={{ padding: '15px', textAlign: 'right', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', fontSize: '13px', borderBottom: '2px solid #cbd5e1' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #e2e8f0', fontSize: '16px', fontWeight: 600 }}>{member.membership_type} Premium Pass</td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontSize: '15px', color: '#1f2937' }}>{new Date(member.expiry_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px', fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Box */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px', marginBottom: '60px' }}>
          <div style={{ width: '320px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px dashed #cbd5e1', fontSize: '15px' }}>
              <span style={{ color: '#6b7280' }}>Total Fee:</span>
              <span style={{ fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #cbd5e1', fontSize: '15px' }}>
              <span style={{ color: '#6b7280' }}>Amount Paid:</span>
              <span style={{ fontWeight: 600, color: '#16a34a' }}>₹{paid.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', fontSize: '18px', fontWeight: 800 }}>
              <span style={{ color: '#1e3a8a' }}>Balance Due:</span>
              <span style={{ color: balance > 0 ? '#ea580c' : '#1e3a8a' }}>₹{balance.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', marginTop: 'auto', paddingTop: '80px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '150px', borderBottom: '1px solid #9ca3af', marginBottom: '10px' }}></div>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Member Signature</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '150px', borderBottom: '1px solid #9ca3af', marginBottom: '10px' }}>
              <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '24px', color: '#1e3a8a', display: 'block', transform: 'translateY(5px)' }}>IQ Iron</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Signatory</p>
          </div>
        </div>

      </div>
    </div>
  );
}

