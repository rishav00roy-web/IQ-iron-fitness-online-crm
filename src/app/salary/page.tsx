"use client";

import React, { useState, useEffect } from "react";
import { CRMProvider, useCRM } from "@/context/CRMContext";
import { useRouter } from "next/navigation";
import { Dumbbell, DollarSign, FileText, ArrowLeft, Users } from "lucide-react";

function SalaryContent() {
  const { members, loading } = useCRM();
  const router = useRouter();

  // Extract trainers and their clients
  const [trainers, setTrainers] = useState<{
    name: string;
    clients: any[];
    commission: number;
    basicPay: number;
  }[]>([]);

  useEffect(() => {
    if (!loading && members.length > 0) {
      const trainerMap: Record<string, any[]> = {};

      members.forEach((m) => {
        if (m.has_personal_trainer && m.trainer_name && m.trainer_name.trim() !== "") {
          const tName = m.trainer_name.trim();
          if (!trainerMap[tName]) {
            trainerMap[tName] = [];
          }
          trainerMap[tName].push(m);
        }
      });

      const trainerList = Object.keys(trainerMap).map((tName) => {
        const clients = trainerMap[tName];
        const totalClientFees = clients.reduce((sum, c) => sum + (c.total_fee || 0), 0);
        return {
          name: tName,
          clients,
          commission: totalClientFees * 0.2, // 20% commission
          basicPay: 10000, // Default basic pay
        };
      });

      setTrainers(trainerList);
    }
  }, [members, loading]);

  const handleBasicPayChange = (index: number, val: string) => {
    const updated = [...trainers];
    updated[index].basicPay = Number(val) || 0;
    setTrainers(updated);
  };

  const handleGeneratePayslip = (trainerName: string, basicPay: number) => {
    router.push(`/salary-print/${encodeURIComponent(trainerName)}?basicPay=${basicPay}`);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <button 
            className="btn btn-icon" 
            onClick={() => router.push('/')}
            aria-label="Go Back"
            style={{ marginRight: '1rem' }}
          >
            <ArrowLeft />
          </button>
          <div className="brand-mark">
            <Dumbbell style={{ color: 'var(--gold)', width: '32px', height: '32px' }} />
          </div>
          <div className="brand-text">
            <h1>Employee Salary</h1>
            <span className="brand-sub">Generate Payslips based on Basic Pay + 20% PT Commission</span>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="panel empty-state">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
          <p>Loading trainer data...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && trainers.length === 0 && (
        <div className="panel empty-state">
          <Users />
          <h4>No Trainers Found</h4>
          <p>Assign members to personal trainers to see them here.</p>
        </div>
      )}

      {/* Trainers List */}
      {!loading && trainers.length > 0 && (
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {trainers.map((t, idx) => {
            const totalSalary = t.basicPay + t.commission;
            
            return (
              <div key={t.name} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.6rem', color: 'var(--gold)', margin: 0 }}>{t.name}</h2>
                  <span className="streak-badge" style={{ margin: 0 }}>
                    {t.clients.length} PT Client(s)
                  </span>
                </div>
                
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Pay Config */}
                  <div style={{ background: 'var(--bg-3)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', fontFamily: '"DM Mono", monospace' }}>Basic Pay (₹)</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={t.basicPay}
                        onChange={(e) => handleBasicPayChange(idx, e.target.value)}
                        min="0"
                      />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-1)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>PT Commission (20%)</span>
                      <span style={{ color: 'var(--green)', fontFamily: '"DM Mono", monospace', fontWeight: 600 }}>₹ {t.commission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Total Salary Highlight */}
                  <div className="metric-card --total" style={{ padding: '1rem', margin: 'auto 0 0 0' }}>
                    <div className="metric-top">
                      <span className="metric-label">Total Salary</span>
                      <div className="metric-icon --total">
                        <DollarSign />
                      </div>
                    </div>
                    <div className="metric-value" style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>₹ {totalSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  </div>

                </div>

                {/* Actions */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-1)', background: 'var(--bg-2)' }}>
                  <button 
                    onClick={() => handleGeneratePayslip(t.name, t.basicPay)}
                    className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <FileText style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                    Generate Payslip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SalaryPage() {
  return (
    <CRMProvider>
      <SalaryContent />
    </CRMProvider>
  );
}
