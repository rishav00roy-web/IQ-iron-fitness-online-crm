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
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                Employee Salary Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">Generate Payslips based on Basic Pay + 20% PT Commission</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading trainer data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && trainers.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Trainers Found</h3>
            <p className="text-slate-500 text-sm">Assign members to personal trainers to see them here.</p>
          </div>
        )}

        {/* Trainers List */}
        {!loading && trainers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainers.map((t, idx) => {
              const totalSalary = t.basicPay + t.commission;
              
              return (
                <div key={t.name} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-[#0b337c] px-5 py-3 flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">{t.name}</h2>
                    <span className="bg-blue-600/30 text-blue-100 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-500/30">
                      {t.clients.length} PT Client(s)
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-5">
                    
                    {/* Pay Config */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Pay (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400 font-medium">₹</span>
                          </div>
                          <input 
                            type="number" 
                            className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            value={t.basicPay}
                            onChange={(e) => handleBasicPayChange(idx, e.target.value)}
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-t border-slate-200">
                        <span className="text-sm font-medium text-slate-600">PT Commission (20%)</span>
                        <span className="font-bold text-green-600">₹ {t.commission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Total Salary Highlight */}
                    <div className="mt-auto bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Salary</span>
                        <span className="text-2xl font-black text-[#0b337c]">₹ {totalSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button 
                      onClick={() => handleGeneratePayslip(t.name, t.basicPay)}
                      className="w-full py-2.5 bg-[#0b337c] hover:bg-[#0a265e] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Generate Payslip
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
