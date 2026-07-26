import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Globe,
  FileText,
  CalendarDays,
  User,
  Medal,
  FileSpreadsheet,
  CheckCircle2,
  Dumbbell
} from "lucide-react";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-85027");
  const [invoiceDate, setInvoiceDate] = useState("25 July 2026");

  useEffect(() => {
    if (member) {
      setInvoiceNumber(`INV-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`);
      const today = new Date();
      setInvoiceDate(today.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }));
    }
  }, [member]);

  const memberName = member?.name || "rishav";
  const memberPhone = member?.phone || "6001914771";
  
  const totalAmount = member?.total_fee || 8000;
  const discount = 0;
  const paidAmount = totalAmount; 
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div
      id="invoice-template"
      className="font-sans bg-white mx-auto relative overflow-hidden rounded-[16px] shadow-2xl print:shadow-none print:rounded-none"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "0",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER */}
      <div className="relative w-full h-48 bg-[#0a224a] overflow-hidden">
         {/* Diagonal shape overlay */}
         <div className="absolute top-0 right-0 w-3/4 h-full bg-[#123675] opacity-60 z-0" style={{ clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1c4d9e] opacity-50 z-0" style={{ clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

         <div className="relative z-10 flex w-full h-full px-10 py-6">
            {/* Left Logo */}
            <div className="w-[140px] flex items-center justify-center">
                <div className="relative w-full h-[120px] flex items-center justify-center border-4 border-slate-300 shadow-xl rounded-b-full bg-gradient-to-b from-[#134e9e] to-[#0a2353]" style={{ clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)" }}>
                  <div className="absolute inset-1 border border-slate-400 rounded-b-full" style={{ clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)" }}></div>
                  <div className="z-10 flex flex-col items-center justify-center text-white font-black text-2xl tracking-tighter" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>
                    <span className="-mb-1">IQ</span>
                    <Dumbbell size={24} className="text-white" />
                  </div>
                  <div className="absolute bottom-6 w-full text-center text-white text-[8px] font-bold bg-[#0a224a] py-0.5 border-y border-white">
                    IQ IRON FITNESS
                  </div>
                  <div className="absolute bottom-3 text-white text-[6px]">★ ★ ★</div>
                </div>
            </div>

            {/* Center Text */}
            <div className="flex-1 flex flex-col items-center justify-center -ml-10 mt-2">
                <h1 className="text-[42px] font-black text-white tracking-widest leading-none mb-2" style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.3)" }}>
                  IQ IRON FITNESS
                </h1>
                <p className="text-white text-xs tracking-[0.2em] mb-3">WHERE INTELLIGENCE MEETS IRON</p>
                <div className="bg-[#1c4d9e] text-white px-6 py-1.5 font-bold text-sm rounded-sm uppercase tracking-wider shadow-md">
                   PAYMENT INVOICE
                </div>
            </div>

            {/* Right Icons */}
            <div className="w-[40px] flex flex-col gap-4 justify-center items-end">
                <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center"><Phone size={14} className="text-white" /></div>
                <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center"><MapPin size={14} className="text-white" /></div>
                <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center"><Globe size={14} className="text-white" /></div>
            </div>
         </div>
      </div>

      {/* SUB-HEADER */}
      <div className="px-10 py-5 flex justify-between items-center bg-white border-b border-slate-100">
         <div className="flex gap-16">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 rounded-full bg-[#0a224a] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <FileText size={20} />
               </div>
               <div>
                  <p className="text-[11px] font-bold text-[#0a224a] tracking-wider uppercase mb-0.5">INVOICE NO.</p>
                  <p className="text-[19px] font-black text-slate-800 leading-none">{invoiceNumber}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 rounded-full bg-[#0a224a] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <CalendarDays size={20} />
               </div>
               <div>
                  <p className="text-[11px] font-bold text-[#0a224a] tracking-wider uppercase mb-0.5">INVOICE DATE</p>
                  <p className="text-[19px] font-black text-slate-800 leading-none">{invoiceDate}</p>
               </div>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase mb-1">PAYMENT STATUS</p>
            <div className="bg-emerald-600 text-white font-bold px-8 py-1.5 rounded-full text-sm inline-block tracking-widest shadow-sm">
               PAID
            </div>
         </div>
      </div>

      {/* DETAILS CARDS */}
      <div className="px-10 flex gap-6 mt-6">
         {/* Member Details */}
         <div className="flex-1 rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="bg-[#0a224a] text-white px-5 py-2.5 flex items-center gap-2.5">
               <User size={16} />
               <span className="font-bold text-sm tracking-wider">MEMBER DETAILS</span>
            </div>
            <div className="p-5 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 bg-slate-50">
                     <User size={14} className="text-slate-500" />
                  </div>
                  <div className="flex flex-1 text-[15px] font-semibold text-slate-600">
                     <span className="w-32">Member Name</span>
                     <span className="w-6 text-center">:</span>
                     <span className="text-slate-900 font-bold">{memberName}</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 bg-slate-50">
                     <Phone size={14} className="text-slate-500" />
                  </div>
                  <div className="flex flex-1 text-[15px] font-semibold text-slate-600">
                     <span className="w-32">Phone Number</span>
                     <span className="w-6 text-center">:</span>
                     <span className="text-slate-900 font-bold">{memberPhone}</span>
                  </div>
               </div>
            </div>
         </div>
         
         {/* Membership Details */}
         <div className="flex-1 rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="bg-[#0a224a] text-white px-5 py-2.5 flex items-center gap-2.5">
               <Medal size={16} />
               <span className="font-bold text-sm tracking-wider">MEMBERSHIP DETAILS</span>
            </div>
            <div className="p-5 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 bg-slate-50">
                     <Medal size={14} className="text-slate-500" />
                  </div>
                  <div className="flex flex-1 text-[15px] font-semibold text-slate-600">
                     <span className="w-32">Membership Type</span>
                     <span className="w-6 text-center">:</span>
                     <span className="text-slate-900 font-bold">monthly</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 bg-slate-50">
                     <CalendarDays size={14} className="text-slate-500" />
                  </div>
                  <div className="flex flex-1 text-[15px] font-semibold text-slate-600">
                     <span className="w-32">Start Date</span>
                     <span className="w-6 text-center">:</span>
                     <span className="text-slate-900 font-bold">3/7/2026</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 bg-slate-50">
                     <CalendarDays size={14} className="text-slate-500" />
                  </div>
                  <div className="flex flex-1 text-[15px] font-semibold text-slate-600">
                     <span className="w-32">Expiry Date</span>
                     <span className="w-6 text-center">:</span>
                     <span className="text-slate-900 font-bold">3/8/2026</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="px-10 flex gap-6 mt-8">
         {/* LEFT COLUMN */}
         <div className="w-[55%] flex flex-col">
            {/* FEE BREAKDOWN */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white flex flex-col">
               <div className="bg-[#0a224a] text-white px-5 py-2.5 flex items-center gap-2.5">
                  <FileSpreadsheet size={16} />
                  <span className="font-bold text-sm tracking-wider uppercase">FEE BREAKDOWN</span>
               </div>
               
               <table className="w-full">
                  <thead>
                     <tr className="border-b-2 border-slate-100">
                        <th className="text-left py-3 px-5 text-[11px] font-extrabold text-[#0a224a] uppercase tracking-wider">DESCRIPTION</th>
                        <th className="text-right py-3 px-5 text-[11px] font-extrabold text-[#0a224a] uppercase tracking-wider">AMOUNT (₹)</th>
                     </tr>
                  </thead>
                  <tbody className="text-[15px] font-semibold">
                     <tr className="border-b border-slate-100">
                        <td className="py-3.5 px-5 text-slate-700">Membership Fee (monthly)</td>
                        <td className="py-3.5 px-5 text-right text-slate-700">{totalAmount.toLocaleString('en-IN')}</td>
                     </tr>
                     <tr className="border-b border-slate-100">
                        <td className="py-3.5 px-5 text-slate-700">Discount</td>
                        <td className="py-3.5 px-5 text-right text-slate-700">{discount.toFixed(2)}</td>
                     </tr>
                     <tr className="border-b border-slate-100">
                        <td className="py-3.5 px-5 text-emerald-600 font-bold">Paid Amount</td>
                        <td className="py-3.5 px-5 text-right text-emerald-600 font-bold">{paidAmount.toLocaleString('en-IN')}</td>
                     </tr>
                     <tr>
                        <td className="py-3.5 px-5 text-orange-500 font-bold">Pending Amount</td>
                        <td className="py-3.5 px-5 text-right text-orange-500 font-bold">{pendingAmount.toLocaleString('en-IN')}</td>
                     </tr>
                  </tbody>
               </table>
               
               {/* TOTAL BAR */}
               <div className="mt-4 relative bg-[#0a224a] text-white flex justify-between items-center h-14">
                  {/* Clean slanted cutout on the left */}
                  <div className="absolute -left-6 top-0 h-full w-14 bg-white" style={{ transform: "skewX(-30deg)" }}></div>
                  <div className="pl-12 font-black tracking-widest text-sm relative z-10 uppercase">TOTAL AMOUNT</div>
                  <div className="pr-6 font-black text-2xl relative z-10">₹ {totalAmount.toLocaleString('en-IN')}</div>
               </div>
            </div>

            {/* NOTES */}
            <div className="mt-8 relative pl-2">
               <div className="flex items-center gap-2.5 mb-3">
                  <FileText size={18} className="text-[#0a224a]" />
                  <span className="font-bold text-sm tracking-wider text-[#0a224a] uppercase">NOTES</span>
               </div>
               <p className="text-[13px] text-slate-700 font-medium">Thank you for choosing IQ IRON FITNESS.</p>
               <p className="text-[13px] text-slate-700 font-medium mt-1.5">Keep pushing, keep growing!</p>
               
               <Dumbbell size={80} className="absolute right-4 top-0 text-slate-100 -rotate-45" />
            </div>
         </div>

         {/* RIGHT COLUMN */}
         <div className="w-[45%] flex flex-col gap-6">
            {/* TOTALS SUMMARY CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0a224a]"></div>
               
               <p className="text-[11px] font-bold text-[#0a224a] tracking-widest uppercase mb-1.5 mt-2">TOTAL AMOUNT</p>
               <p className="text-4xl font-black text-[#0a224a] tracking-tight mb-5">₹ {totalAmount.toLocaleString('en-IN')}</p>
               
               <div className="w-full h-px bg-slate-200 mb-5"></div>
               
               <div className="bg-emerald-50/50 w-[120%] py-3 -mx-6 flex flex-col items-center">
                 <p className="text-[11px] font-bold text-emerald-600 tracking-widest uppercase mb-1">AMOUNT PAID</p>
                 <p className="text-4xl font-black text-emerald-600 tracking-tight">₹ {paidAmount.toLocaleString('en-IN')}</p>
               </div>

               <div className="w-full h-px bg-slate-200 my-5"></div>
               
               <p className="text-[11px] font-bold text-orange-500 tracking-widest uppercase mb-1.5">PENDING AMOUNT</p>
               <p className="text-4xl font-black text-orange-500 tracking-tight mb-2">₹ {pendingAmount.toLocaleString('en-IN')}</p>
            </div>

            {/* TERMS */}
            <div className="pl-2 mt-2">
               <div className="flex items-center gap-2.5 mb-3">
                  <CheckCircle2 size={18} className="text-[#0a224a]" />
                  <span className="font-bold text-sm tracking-wider text-[#0a224a] uppercase">TERMS & CONDITIONS</span>
               </div>
               <ul className="text-[11px] text-slate-600 font-medium space-y-1.5 leading-relaxed">
                  <li>This invoice is valid for the membership period.</li>
                  <li>Membership is non-transferable & non-refundable.</li>
                  <li>Please carry this invoice for verification.</li>
               </ul>
            </div>
         </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 w-full bg-[#0a224a] text-center py-5">
         <p className="text-white text-[10px] tracking-[0.3em] font-bold mb-2 opacity-90 uppercase">THANK YOU FOR BEING A PART OF</p>
         <p className="text-white text-base font-black tracking-widest">
            ★ ★ &nbsp; IQ IRON FITNESS FAMILY! &nbsp; ★ ★
         </p>
      </div>

    </div>
  );
}
