import React, { useState, useEffect } from "react";
import { Dumbbell, Mail, MapPin, Phone } from "lucide-react";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-00000");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString());

  useEffect(() => {
    if (member) {
      setInvoiceNumber(`INV-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`);
      const today = new Date();
      setInvoiceDate(today.toISOString());
    }
  }, [member]);

  const currency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      n || 0
    );

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  // Data mapping from real Member DB type
  const fullName = member?.name ?? "—";
  const phone = member?.phone ?? "—";
  const memberCode = member?.id ? member.id.slice(0, 8).toUpperCase() : "—";
  const planName = member?.membership_type ?? "—";
  const planStart = member?.start_date;
  const planEnd = member?.expiry_date;
  
  const totalFee = member?.total_fee ?? 0;
  const pendingAmount = member?.pending_amount ?? 0;
  const paidAmount = totalFee - pendingAmount;
  
  const discount = 0;
  
  const lineItems = [
    {
      label: `Membership Fee (${planName})`,
      qty: "1",
      rate: totalFee,
      amount: totalFee
    }
  ];

  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const total = Math.max(subtotal - discount, 0);
  
  const status = pendingAmount > 0 ? "due" : "paid";

  const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
    paid: { label: "PAID", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
    due: { label: "DUE", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
    overdue: { label: "OVERDUE", bg: "bg-red-50", text: "text-red-700", border: "border-red-400" },
  };

  const statusStyle = STATUS_STYLES[status];

  return (
    <div className="w-full max-w-[794px] min-h-[1123px] mx-auto bg-white text-slate-900 flex flex-col" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      {/* Google Fonts — inline per existing pattern (flagged: move to next/font later) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; }
        .font-body { font-family: 'Work Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* ───────────────────────── HEADER ───────────────────────── */}
      <div className="relative bg-gradient-to-r from-[#031d4f] via-[#0b337c] to-[#031d4f] px-10 pt-8 pb-14 overflow-hidden">
        {/* chrome edge accents echoing the shield logo */}
        <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/10 rotate-45 -translate-x-12 translate-y-12" />
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-slate-200 via-white to-slate-400 flex items-center justify-center shadow-lg border border-white/40">
              <img 
                 src="/logo.png" 
                 alt="Logo" 
                 className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white tracking-wide leading-none">
                IQ IRON FITNESS
              </h1>
              <p className="font-body text-[10px] text-blue-200 tracking-[0.2em] uppercase mt-1">
                Where Intelligence Meets Iron
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-display text-white text-lg tracking-[0.3em] uppercase mb-1">
              Invoice
            </p>
            <p className="font-mono text-blue-200 text-xs">
              {invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      {/* diagonal chrome divider cut, matching the shield's silver edge */}
      <svg
        className="w-full -mt-6 relative z-20"
        viewBox="0 0 794 24"
        preserveAspectRatio="none"
        style={{ height: 24 }}
      >
        <polygon points="0,24 794,0 794,24" fill="#ffffff" />
      </svg>

      {/* ───────────────────────── BODY ───────────────────────── */}
      <div className="flex-1 px-10 py-8 font-body">
        {/* status + dates row */}
        <div className="flex items-center justify-between mb-8">
          <span
            className={`inline-block px-4 py-1 rounded-full border text-xs font-bold tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {statusStyle.label}
          </span>
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <p>
              <span className="text-slate-400">Issued:</span>{" "}
              <span className="text-slate-700 font-medium">{formatDate(invoiceDate)}</span>
            </p>
          </div>
        </div>

        {/* bill-to / plan info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="font-display text-[11px] tracking-[0.15em] text-[#0b337c] uppercase mb-2 border-b border-slate-200 pb-1">
              Billed To
            </p>
            <p className="font-semibold text-slate-900">{fullName}</p>
            <p className="text-sm text-slate-500">Member ID: {memberCode}</p>
            <p className="text-sm text-slate-500">{phone}</p>
          </div>
          <div>
            <p className="font-display text-[11px] tracking-[0.15em] text-[#0b337c] uppercase mb-2 border-b border-slate-200 pb-1">
              Membership Plan
            </p>
            <p className="font-semibold text-slate-900 capitalize">{planName}</p>
            <p className="text-sm text-slate-500">
              {formatDate(planStart)} – {formatDate(planEnd)}
            </p>
          </div>
        </div>

        {/* line items table */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="bg-[#0b337c]">
              <th className="text-left font-display text-[11px] tracking-wider text-white uppercase py-2 px-3 rounded-l">
                Description
              </th>
              <th className="text-center font-display text-[11px] tracking-wider text-white uppercase py-2 px-3">
                Qty
              </th>
              <th className="text-right font-display text-[11px] tracking-wider text-white uppercase py-2 px-3">
                Rate
              </th>
              <th className="text-right font-display text-[11px] tracking-wider text-white uppercase py-2 px-3 rounded-r">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-6 text-sm">
                  No line items
                </td>
              </tr>
            )}
            {lineItems.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2.5 px-3 text-slate-700">{item.label}</td>
                <td className="py-2.5 px-3 text-center text-slate-500">{item.qty}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                  {currency(item.rate)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                  {currency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* totals */}
        <div className="flex justify-end mb-10">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-slate-500">
               <span>Total Fee</span>
               <span className="font-mono">{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
               <span>Amount Paid</span>
               <span className="font-mono">{currency(paidAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-[#0b337c] mt-2">
              <span className="font-display text-sm uppercase tracking-wide text-[#0b337c]">
                Balance Due
              </span>
              <span className="font-mono text-lg font-semibold text-slate-900">
                {currency(pendingAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* terms */}
        <div className="mt-auto pt-16">
          <p className="font-display text-[11px] tracking-[0.15em] text-[#0b337c] uppercase mb-2 border-b border-slate-200 pb-1">
            Terms &amp; Conditions
          </p>
          <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
            <li>Membership is non-transferable and non-refundable.</li>
            <li>Please carry this invoice for verification.</li>
            <li>For any queries, contact our front desk.</li>
          </ul>
        </div>
      </div>

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <div className="bg-gradient-to-r from-[#031d4f] via-[#0b337c] to-[#031d4f] py-4 border-t-[4px] border-slate-300 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/10 rotate-45 transform -translate-x-12 translate-y-12" />
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 -rotate-45 transform translate-x-16 -translate-y-16" />
        <div className="relative z-10 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold text-blue-200 tracking-[0.2em] uppercase mb-1">
            Thank you for being a part of
          </p>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <span className="text-white text-xs">★</span>
              <span className="text-white text-xs">★</span>
            </div>
            <h2 className="text-lg font-black text-white tracking-widest">
              IQ IRON FITNESS FAMILY!
            </h2>
            <div className="flex gap-1">
              <span className="text-white text-xs">★</span>
              <span className="text-white text-xs">★</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-blue-200 justify-center">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> iqironfitness.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
