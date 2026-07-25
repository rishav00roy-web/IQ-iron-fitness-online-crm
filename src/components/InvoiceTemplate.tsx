import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Globe,
  FileText,
  CalendarDays,
  User,
  Award,
  List,
  CheckCircle,
  Dumbbell,
  Mail,
} from "lucide-react";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  // TODO(antigravity): fill in real business contact details.
  const BUSINESS = {
    name: "IQ IRON FITNESS",
    tagline: "WHERE INTELLIGENCE MEETS IRON",
    phone: "+91 98765 43210",
    addressLine1: "123 Iron Avenue, Fitness Square",
    addressLine2: "Mumbai, MH 400001",
    email: "contact@iqironfitness.com",
    website: "www.iqironfitness.com",
  };

  useEffect(() => {
    setInvoiceNumber(
      `INV-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`,
    );
    setInvoiceDate(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    );
  }, [member]);

  if (!member) return null;

  const total = member.total_fee || 0;
  const balance = member.pending_amount || 0;
  const paid = total - balance;

  let paymentStatus = "PARTIALLY PAID";
  if (balance === 0) paymentStatus = "PAID IN FULL";
  if (paid === 0) paymentStatus = "UNPAID";

  let statusBg = "bg-orange-100 text-orange-700 border-orange-200";
  if (paymentStatus === "PAID IN FULL") statusBg = "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (paymentStatus === "UNPAID") statusBg = "bg-rose-100 text-rose-700 border-rose-200";

  return (
    <div
      id="invoice-template"
      className="font-sans text-slate-800 bg-white shadow-2xl print:shadow-none mx-auto relative overflow-hidden"
      style={{
        width: "794px",      /* Exact A4 width at 96DPI */
        minHeight: "1123px", /* Exact A4 height at 96DPI */
        padding: "0",
      }}
    >
      {/* Background Watermark */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none select-none z-0">
        <Dumbbell size={500} strokeWidth={1} />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* --- PREMIUM HEADER --- */}
        <div className="bg-slate-900 text-white px-10 pt-12 pb-10 relative overflow-hidden">
          {/* Subtle glow / gradient mesh effect */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            {/* Logo & Brand */}
            <div className="flex gap-6 items-center">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl">
                <img
                  src="/logo.png"
                  alt="IQ Iron Fitness"
                  className="w-24 h-24 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-1" style={{ fontFamily: "Impact, sans-serif" }}>
                  {BUSINESS.name}
                </h1>
                <p className="text-blue-300 font-medium tracking-[0.15em] text-xs">
                  {BUSINESS.tagline}
                </p>
              </div>
            </div>

            {/* Document Title & Invoice Info */}
            <div className="text-right">
              <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-6 shadow-lg">
                <span className="text-lg font-bold tracking-widest text-white">TAX INVOICE</span>
              </div>
              <div className="space-y-1 text-sm text-slate-300">
                <p className="flex justify-end gap-3 items-center">
                  <span className="text-slate-400">Invoice No:</span>
                  <span className="text-white font-semibold">{invoiceNumber}</span>
                </p>
                <p className="flex justify-end gap-3 items-center">
                  <span className="text-slate-400">Date Issued:</span>
                  <span className="text-white font-semibold">{invoiceDate}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BODY CONTENT --- */}
        <div className="px-10 py-10 flex-1 flex flex-col space-y-8">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Billed To</p>
                <p className="text-lg font-bold text-slate-800">{member.name}</p>
                <p className="text-sm text-slate-500 mt-0.5">{member.phone || "No phone provided"}</p>
              </div>
            </div>

            <div className="w-px h-12 bg-slate-200 mx-4"></div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Membership</p>
                <p className="text-base font-bold text-slate-800">{member.membership_type || "Monthly"} Plan</p>
                <p className="text-sm text-slate-500 mt-0.5">Valid until {member.expiry_date}</p>
              </div>
            </div>

            <div className="w-px h-12 bg-slate-200 mx-4"></div>

            <div className="text-right flex flex-col items-end justify-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</p>
              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider shadow-sm ${statusBg}`}>
                {paymentStatus}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <List size={18} className="text-slate-400" /> Payment Breakdown
            </h3>
            
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6 text-center">Period</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-100 last:border-0">
                    <td className="py-5 px-6">
                      <p className="font-bold text-slate-800">{member.membership_type || "Monthly"} Membership Fee</p>
                      <p className="text-slate-500 text-xs mt-1">Base charge for facility access</p>
                    </td>
                    <td className="py-5 px-6 text-center text-slate-600">
                      {member.start_date || "N/A"} <br/><span className="text-slate-400 text-xs">to</span><br/> {member.expiry_date || "N/A"}
                    </td>
                    <td className="py-5 px-6 text-right font-semibold text-slate-800">
                      ₹{total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  
                  {member.has_personal_trainer && (
                    <tr className="border-b border-slate-100 last:border-0 bg-slate-50/50">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-800">Personal Training ({member.trainer_name})</p>
                        <p className="text-slate-500 text-xs mt-1">Add-on service</p>
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600">-</td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-800">Included</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mt-6 flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between items-center text-sm text-slate-600 px-4">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-600 px-4">
                  <span>Discount</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-600 px-4">
                  <span>Amount Paid</span>
                  <span className="font-semibold text-emerald-600">- ₹{paid.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="h-px bg-slate-200 my-2"></div>
                
                <div className="flex justify-between items-center px-4 py-3 bg-slate-800 text-white rounded-xl shadow-md">
                  <span className="font-bold tracking-wide">Balance Due</span>
                  <span className="text-xl font-black tracking-tight">₹{balance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <div className="mt-auto pt-8 border-t border-slate-200">
            <div className="flex justify-between items-end">
              <div className="w-1/2 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Terms & Conditions</h4>
                  <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                    <li>This invoice is valid for the stated membership period only.</li>
                    <li>Membership fees are non-transferable and non-refundable.</li>
                    <li>Please present this document at the front desk if requested.</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium text-xs bg-emerald-50 w-max px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                  <CheckCircle size={14} /> Thank you for choosing IQ IRON FITNESS.
                </div>
              </div>
              
              <div className="w-1/2 flex flex-col items-end gap-2 text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span>{BUSINESS.phone}</span>
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center"><Phone size={10} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{BUSINESS.email}</span>
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center"><Mail size={10} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-right">{BUSINESS.addressLine1}, {BUSINESS.addressLine2}</span>
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><MapPin size={10} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
