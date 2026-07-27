import React, { useState, useEffect } from "react";
import {
  Phone,
  Globe,
  Mail,
  MapPin
} from "lucide-react";

// Indian numbering style currency formatting
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n || 0
  );

// Number to Words Converter (Indian Currency Style)
function numberToWords(num: number): string {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return '';
  };

  const words = convert(Math.floor(num));
  return words ? words + ' Rupees Only' : '';
}

export default function EmployeeSalaryTemplate({ trainerName, basicPay, ptClients }: { trainerName: string, basicPay: number, ptClients: any[] }) {
  const [payslipNumber, setPayslipNumber] = useState("PS-37067");
  const [payslipDate, setPayslipDate] = useState("27 JUL 2026");
  const [period, setPeriod] = useState("JULY 2026");

  useEffect(() => {
    setPayslipNumber(`PS-${Math.floor(10000 + Math.random() * 90000)}`);
    const today = new Date();
    setPayslipDate(today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
    setPeriod(today.toLocaleDateString("en-GB", { month: "long", year: "numeric" }).toUpperCase());
  }, []);

  const totalClientFees = ptClients.reduce((sum, c) => sum + (c.total_fee || 0), 0);
  const commission = totalClientFees * 0.2;
  const netSalary = basicPay + commission;

  return (
    <div
      id="invoice-template"
      className="font-sans bg-white mx-auto relative select-none text-slate-800 p-5"
      style={{
        width: "794px",
        height: "1123px",
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* Page Border (Solid Blue) */}
      <div className="w-full h-full border-[10px] border-[#0b337c] rounded-sm relative flex flex-col justify-between overflow-hidden bg-white" style={{ padding: '24px' }}>
        
        {/* Subtle Watermark background logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 select-none">
          <img src="/logo.png" alt="watermark logo" className="w-[360px] h-auto object-contain" />
        </div>

        {/* Embedded fonts and prints setup */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
          .font-display { font-family: 'Oswald', sans-serif; }
          .font-body { font-family: 'Work Sans', sans-serif; }
          .font-mono { font-family: 'IBM Plex Mono', monospace; }
          @media print {
            @page {
              size: A4;
              margin: 0 !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            #invoice-template {
              border: none !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
            }
          }
        `}</style>

        {/* HEADER SECTION */}
        <div className="w-full bg-[#0b337c] text-white p-5 rounded-sm relative overflow-hidden flex items-center justify-between shrink-0 z-10 shadow-md">
          {/* Header background accents */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-[#1e3a8a] z-0" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <img
              src="/logo.png"
              alt="IQ Iron Fitness Logo"
              className="w-16 h-16 object-contain"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }}
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-wide font-display text-white leading-none">
                IQ IRON FITNESS
              </h1>
              <p className="text-blue-200 text-[8px] tracking-[0.2em] font-semibold uppercase mt-1">
                Where Intelligence Meets Iron
              </p>
            </div>
          </div>

          {/* Right side Metadata */}
          <div className="relative z-10 flex flex-col items-end gap-2">
            <div className="bg-[#1e40af] text-white px-3 py-0.5 font-bold text-[10px] rounded-sm tracking-wider font-display uppercase border border-blue-400/20">
              SALARY SLIP
            </div>
            <div className="text-right text-[10px] space-y-0.5 font-mono text-blue-100 leading-tight">
              <div>Payslip No : <span className="font-bold text-white">{payslipNumber}</span></div>
              <div>Date : <span className="text-white">{payslipDate}</span></div>
              <div>Period : <span className="text-white">{period}</span></div>
            </div>
          </div>
        </div>

        {/* Metal Divider bar */}
        <div className="w-full h-[4px] bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 my-4 shadow-sm shrink-0 z-10"></div>

        {/* EMPLOYEE DETAILS ROW */}
        <div className="grid grid-cols-2 gap-6 my-2 text-[12px] font-body shrink-0 z-10">
          {/* EMPLOYER CARD */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-md space-y-1.5 shadow-sm" style={{ padding: '20px' }}>
            <p className="text-[9px] font-bold text-[#0b337c] tracking-wider uppercase font-display border-b border-slate-200/80 pb-0.5">Employer Details</p>
            <h3 className="font-bold text-slate-900 font-display text-sm">IQ IRON FITNESS</h3>
            <p className="text-slate-600 leading-relaxed">
              123, Power House Road,<br />
              Kothrud, Pune - 411038, Maharashtra, India
            </p>
            <div className="flex flex-col gap-0.5 text-slate-500 pt-1 font-mono text-[10px]">
              <span>Ph: +91 98765 43210</span>
              <span>Email: hr@iqironfitness.com</span>
            </div>
          </div>

          {/* EMPLOYEE CARD */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-md space-y-1.5 shadow-sm" style={{ padding: '20px' }}>
            <p className="text-[9px] font-bold text-[#0b337c] tracking-wider uppercase font-display border-b border-slate-200/80 pb-0.5">Employee Details</p>
            <h3 className="font-bold text-slate-900 font-display text-sm capitalize">{trainerName}</h3>
            <p className="text-slate-600 leading-relaxed font-mono mt-1 text-[11px]">
              Role: Personal Trainer
            </p>
            <p className="text-slate-600 leading-relaxed font-mono text-[11px]">
              Department: Fitness & Training
            </p>
            <p className="text-slate-600 leading-relaxed font-mono text-[11px]">
              Payment Mode: Bank Transfer
            </p>
          </div>
        </div>

        {/* EARNINGS BREAKDOWN */}
        <div className="my-4 shrink-0 z-10">
          <table className="w-full border-collapse border border-slate-200 text-[13px] table-fixed">
            <thead>
              <tr className="bg-[#0b337c] text-white text-left font-display">
                <th className="py-2.5 px-3 border border-slate-300 w-[60%]" style={{ padding: '10px 12px' }}>EARNINGS DESCRIPTION</th>
                <th className="py-2.5 px-3 border border-slate-300 w-[40%] text-right" style={{ padding: '10px 12px' }}>AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              <tr className="bg-white">
                <td className="py-4 px-3 border border-slate-200 align-top" style={{ padding: '16px 12px' }}>
                  <span className="font-bold text-slate-950 block text-[14px]">Basic Pay</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Fixed monthly remuneration</span>
                </td>
                <td className="py-4 px-3 border border-slate-200 text-right font-mono align-top" style={{ padding: '16px 12px' }}>
                  {basicPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="py-4 px-3 border border-slate-200 align-top" style={{ padding: '16px 12px' }}>
                  <span className="font-bold text-slate-950 block text-[14px]">Personal Training Commission</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">20% of total PT client fees (Total PT Revenue: ₹{totalClientFees.toLocaleString('en-IN')})</span>
                </td>
                <td className="py-4 px-3 border border-slate-200 text-right font-mono align-top" style={{ padding: '16px 12px' }}>
                  {commission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* CLIENT LIST (Optional Detail) */}
        {ptClients.length > 0 && (
          <div className="my-2 shrink-0 z-10">
            <h4 className="font-display font-bold text-[10px] uppercase tracking-wider text-[#0b337c] mb-1">
              PT Clients Overview ({ptClients.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {ptClients.map((c, i) => (
                <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                  {c.name} (₹{c.total_fee})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* LOWER SECTION (TOTALS & SIGNATURE) */}
        <div className="grid grid-cols-2 gap-6 mt-auto mb-4 shrink-0 z-10 pt-4">
          
          <div className="space-y-1">
             <div className="text-[10px] text-slate-500 italic mt-1 leading-snug p-3 bg-slate-50 border border-slate-100 rounded">
              <span className="font-bold text-slate-700 block not-italic uppercase tracking-wide text-[8px] mb-1">Net Pay in Words:</span>
              <span>{numberToWords(netSalary)}</span>
            </div>
          </div>

          {/* TOTALS SUMMARY BLOCK */}
          <div className="space-y-2 text-[12px] font-body flex flex-col justify-end">
            <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
              <span className="font-bold">TOTAL DEDUCTIONS</span>
              <span className="font-mono">₹ 0.00</span>
            </div>
            
            {/* Net Salary Ribbon */}
            <div className="bg-[#0b337c] text-white py-2.5 px-4 rounded-sm flex justify-between items-center shadow-md relative overflow-hidden mt-2" style={{ padding: '10px 16px' }}>
              <div className="absolute top-0 right-0 w-24 h-full bg-white/10 skew-x-12 transform origin-top-right"></div>
              <span className="font-display font-bold text-[12px] tracking-widest uppercase">Net Salary</span>
              <span className="font-mono text-lg font-black">
                {formatCurrency(netSalary)}
              </span>
            </div>
          </div>
        </div>

        {/* TERMS & SIGNATORY */}
        <div className="grid grid-cols-3 gap-6 items-end my-3 pt-3 border-t border-slate-200/50 shrink-0 font-body z-10">
          {/* Terms and conditions */}
          <div className="col-span-2 space-y-1.5">
            <h5 className="font-display font-bold text-[#0b337c] tracking-wider uppercase text-[9px]">
              Notes
            </h5>
            <ul className="list-disc list-inside text-[9px] text-slate-500 space-y-0.5 leading-relaxed">
              <li>This is a computer generated payslip.</li>
              <li>Salary is credited directly to the registered bank account.</li>
              <li>All amounts are in Indian Rupees (INR).</li>
            </ul>
          </div>

          {/* Authorised Signatory */}
          <div className="flex flex-col items-center justify-end text-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg"
              alt="Signature"
              className="h-8 opacity-70 mb-0.5 grayscale object-contain"
            />
            <div className="w-full border-t border-slate-300 pt-1.5">
              <p className="text-[8px] font-bold text-[#0b337c] tracking-widest uppercase font-display leading-none">
                Authorised Signatory
              </p>
              <p className="text-[7px] text-slate-400 mt-0.5">HR Department, IQ Iron Fitness</p>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="bg-[#0b337c] border-t border-slate-300 py-3 relative overflow-hidden flex flex-col items-center justify-center shrink-0 w-full mt-3 z-10">
          <div className="absolute top-0 left-0 w-24 h-full bg-white/5 rotate-45 transform -translate-x-12"></div>
          <div className="absolute bottom-0 right-0 w-32 h-full bg-white/5 -rotate-45 transform translate-x-16"></div>

          <div className="flex items-center gap-2">
            <span className="text-blue-300 text-xs">★</span>
            <p className="text-white font-display text-[9px] tracking-[0.25em] font-bold uppercase" style={{ textRendering: "geometricPrecision" }}>
              Private & Confidential
            </p>
            <span className="text-blue-300 text-xs">★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
