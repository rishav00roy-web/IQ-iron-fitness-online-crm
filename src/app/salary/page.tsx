"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CRMProvider, useCRM } from "@/context/CRMContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dumbbell, DollarSign, FileText, ArrowLeft, Users } from "lucide-react";

function SalaryContent() {
  const { members, trainers: contextTrainers, loading, setIsTrainersOpen } = useCRM();
  const router = useRouter();

  const currentPeriod = useMemo(() => new Date().toISOString().slice(0, 7), []); // YYYY-MM

  const [trainers, setTrainers] = useState<{
    id: string;
    name: string;
    clients: any[];
    commission: number;
    basicPay: number;
  }[]>([]);

  useEffect(() => {
    async function loadPayroll() {
      if (loading) return;
      
      const { data: payrollData } = await supabase
        .from('payroll')
        .select('*')
        .eq('period', currentPeriod);
      
      const payrollMap = (payrollData || []).reduce((acc: any, p: any) => {
        acc[p.trainer_id] = p.basic_pay;
        return acc;
      }, {});

      const trainerList = contextTrainers.map((t) => {
        const clients = members.filter(m => m.has_personal_trainer && m.trainer_id === t.id);
        const commission = clients.reduce((sum, c) => sum + (c.pt_fee || 0), 0);
        return {
          id: t.id,
          name: t.name,
          clients,
          commission,
          basicPay: payrollMap[t.id] ?? 10000, // Default basic pay
        };
      });

      setTrainers(trainerList);
    }
    loadPayroll();
  }, [members, contextTrainers, loading, currentPeriod]);

  const handleBasicPayChange = (index: number, val: string) => {
    const updated = [...trainers];
    updated[index].basicPay = Number(val) || 0;
    setTrainers(updated);
  };

  const handleCommissionChange = (index: number, val: string) => {
    const updated = [...trainers];
    updated[index].commission = Number(val) || 0;
    setTrainers(updated);
  };

  const handleGeneratePayslip = async (trainerId: string, trainerName: string, basicPay: number, commission: number) => {
    await supabase.from('payroll').upsert({
      trainer_id: trainerId,
      period: currentPeriod,
      basic_pay: basicPay,
      commission: commission,
      total_salary: basicPay + commission
    }, { onConflict: 'trainer_id,period' });
    router.push(`/salary-print/${trainerId}?basicPay=${basicPay}&commission=${commission}`);
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
            <span className="brand-sub">Payslips · Basic Pay + PT Commission</span>
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
          <p style={{ marginBottom: '1rem' }}>Assign members to personal trainers to see them here.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              router.push('/');
              setTimeout(() => setIsTrainersOpen(true), 100);
            }}
          >
            Manage Trainers
          </button>
        </div>
      )}

      {/* Trainers List */}
      {!loading && trainers.length > 0 && (
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}>
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
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-1)' }}>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', fontFamily: '"DM Mono", monospace' }}>PT Commission (₹)</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={t.commission}
                        onChange={(e) => handleCommissionChange(idx, e.target.value)}
                        min="0"
                      />
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
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={() => handleGeneratePayslip(t.id, t.name, t.basicPay, t.commission)}
                  >
                    <FileText size={16} />
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
