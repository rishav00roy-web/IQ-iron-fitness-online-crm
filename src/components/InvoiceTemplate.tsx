import React, { useState, useEffect } from "react";
import {
  Phone,
  Globe,
  FileText,
  User,
  Medal,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-85027");
  const [invoiceDate, setInvoiceDate] = useState("25 July 2026");

  useEffect(() => {
    if (member) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInvoiceNumber(`INV-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`);
      const today = new Date();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInvoiceDate(today.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }));
    }
  }, [member]);

  const memberName = member?.name || "Rishav Roy";
  const memberPhone = member?.phone || "6001914771";
  
  const totalAmount = member?.total_fee || 8000;
  const discount = 0;
  const paidAmount = totalAmount; 
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div
      id="invoice-template"
      className="font-sans bg-white mx-auto relative overflow-hidden text-slate-800"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "0",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER */}
      <div className="relative w-full bg-[#0a224a] px-8 py-8 flex items-center justify-between border-b-[8px] border-slate-900">
         {/* Diagonal shape overlay - kept minimal for brand feel without muddying UI */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[#123675] z-0" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

         {/* Logo */}
         <div className="relative z-10 flex items-center gap-6">
            <div className="w-[120px] shrink-0 bg-white p-2 rounded-xl shadow-lg border border-slate-200">
               <img 
                  src="/logo.png" 
                  alt="IQ Iron Fitness Logo" 
                  className="w-full h-auto object-contain"
                  style={{ imageRendering: "crisp-edges", WebkitPrintColorAdjust: "exact" as any }}
               />
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  IQ IRON FITNESS
                </h1>
                <p className="text-white/90 text-xs tracking-wider uppercase mt-1">Where Intelligence Meets Iron</p>
            </div>
         </div>

         {/* Header Info / Contact */}
         <div className="relative z-10 flex flex-col gap-3 justify-center items-end">
            <div className="bg-white/10 text-white px-4 py-1.5 font-bold text-xs rounded uppercase tracking-widest border border-white/20">
               PAYMENT INVOICE
            </div>
            <div className="flex gap-4 mt-2">
               <div className="flex items-center gap-2 text-white/90 text-xs">
                  <Phone size={12} />
                  <span>+91 98765 43210</span>
               </div>
               <div className="flex items-center gap-2 text-white/90 text-xs">
                  <Globe size={12} />
                  <span>iqironfitness.com</span>
               </div>
            </div>
         </div>
      </div>

      {/* INVOICE METADATA */}
      <div className="px-8 py-6 flex justify-between items-center bg-slate-50 border-b border-slate-200">
         <div className="flex gap-12">
            <div>
               <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Invoice No.</p>
               <p className="text-lg font-semibold text-slate-900 leading-none tabular-nums">{invoiceNumber}</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Invoice Date</p>
               <p className="text-lg font-semibold text-slate-900 leading-none">{invoiceDate}</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Payment Status</p>
            <div className="bg-slate-900 text-white font-semibold px-6 py-1.5 rounded text-xs inline-block tracking-widest">
               PAID
            </div>
         </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="px-8 flex gap-8 mt-8">
         {/* Member Details */}
         <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-3">
               <User size={14} className="text-slate-500" />
               <span className="font-bold text-[11px] text-slate-700 tracking-wider uppercase">Member Details</span>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex text-sm gap-3">
                  <span className="w-20 shrink-0 text-slate-500 font-medium">Name</span>
                  <span className="text-slate-900 font-semibold break-words flex-1">{memberName}</span>
               </div>
               <div className="flex text-sm gap-3">
                  <span className="w-20 shrink-0 text-slate-500 font-medium">Phone</span>
                  <span className="text-slate-900 font-semibold truncate flex-1 tabular-nums">{memberPhone}</span>
               </div>
            </div>
         </div>
         
         {/* Membership Details */}
         <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-3">
               <Medal size={14} className="text-slate-500" />
               <span className="font-bold text-[11px] text-slate-700 tracking-wider uppercase">Membership Details</span>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex text-sm gap-3">
                  <span className="w-20 shrink-0 text-slate-500 font-medium">Type</span>
                  <span className="text-slate-900 font-semibold truncate flex-1 capitalize">{member?.membership_type || "Monthly"}</span>
               </div>
               <div className="flex text-sm gap-3">
                  <span className="w-20 shrink-0 text-slate-500 font-medium">Validity</span>
                  <span className="text-slate-900 font-semibold truncate flex-1 tabular-nums">
                     {new Date(member?.start_date || "2026-07-25").toLocaleDateString("en-GB")} - {new Date(member?.expiry_date || "2026-08-25").toLocaleDateString("en-GB")}
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* FEE BREAKDOWN & TOTALS */}
      <div className="px-8 mt-8">
         <div className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-3">
               <FileSpreadsheet size={14} className="text-slate-500" />
               <span className="font-bold text-[11px] text-slate-700 tracking-wider uppercase">Fee Breakdown</span>
            </div>
            
            <table className="w-full text-sm">
               <thead>
                  <tr className="border-b border-slate-200 bg-white">
                     <th className="text-left py-4 px-6 font-semibold text-slate-500">Description</th>
                     <th className="text-right py-4 px-6 font-semibold text-slate-500">Amount</th>
                  </tr>
               </thead>
               <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100">
                     <td className="py-4 px-6">Membership Fee ({member?.membership_type || "Monthly"})</td>
                     <td className="py-4 px-6 text-right tabular-nums">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                     <td className="py-4 px-6">Discount Applied</td>
                     <td className="py-4 px-6 text-right tabular-nums">₹ {discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
               </tbody>
            </table>

            {/* TOTALS SUMMARY */}
            <div className="bg-slate-50 flex justify-end flex-1">
               <div className="w-[50%] border-l border-slate-200 bg-white flex flex-col">
                  <div className="flex justify-between items-center py-4 px-6 border-b border-slate-100">
                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
                     <span className="text-base font-semibold text-slate-900 tabular-nums">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 px-6 border-b border-slate-100">
                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount Paid</span>
                     <span className="text-base font-semibold text-slate-900 tabular-nums">₹ {paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center py-6 px-6 bg-slate-900 text-white mt-auto">
                     <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Balance Due</span>
                     <span className="text-3xl font-black tabular-nums tracking-tight">₹ {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* NOTES & TERMS */}
      <div className="px-8 mt-12 flex gap-12">
         <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
               <FileText size={14} className="text-slate-400" />
               <span className="font-bold text-[10px] tracking-wider text-slate-500 uppercase">Notes</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
               Thank you for choosing IQ IRON FITNESS. Keep pushing, keep growing! Please keep this invoice for your records.
            </p>
         </div>
         <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
               <CheckCircle2 size={14} className="text-slate-400" />
               <span className="font-bold text-[10px] tracking-wider text-slate-500 uppercase">Terms & Conditions</span>
            </div>
            <ul className="text-xs text-slate-600 leading-relaxed list-disc list-inside">
               <li>Valid only for the stated membership period.</li>
               <li>Membership is strictly non-transferable & non-refundable.</li>
               <li>Management reserves the right of admission.</li>
            </ul>
         </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t-4 border-[#0a224a] py-6 flex flex-col items-center justify-center">
         <p className="text-white text-[10px] tracking-wide font-semibold mb-1 uppercase" style={{ textRendering: "geometricPrecision" }}>
            Thank You For Being A Part Of
         </p>
         <div className="flex items-center gap-3">
            <span className="text-white text-[10px]">★</span>
            <p className="text-white text-sm font-bold tracking-wide" style={{ textRendering: "geometricPrecision" }}>
               IQ IRON FITNESS FAMILY
            </p>
            <span className="text-white text-[10px]">★</span>
         </div>
      </div>

    </div>
  );
}
