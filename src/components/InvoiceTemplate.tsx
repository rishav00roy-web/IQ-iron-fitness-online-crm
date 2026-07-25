import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Mail,
  CalendarDays,
  User,
  Award,
  List,
  CheckCircle,
  Dumbbell,
  Shield,
  CreditCard,
  Receipt,
  Star,
} from "lucide-react";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

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

  let statusBg = "bg-amber-50 text-amber-700 border-amber-200";
  let statusIcon = <CreditCard size={14} />;
  if (paymentStatus === "PAID IN FULL") {
    statusBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    statusIcon = <CheckCircle size={14} />;
  }
  if (paymentStatus === "UNPAID") {
    statusBg = "bg-rose-50 text-rose-700 border-rose-200";
    statusIcon = <Receipt size={14} />;
  }

  return (
    <div
      id="invoice-template"
      className="w-[794px] min-h-[1123px] bg-white relative font-sans text-slate-800 overflow-hidden"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" } as React.CSSProperties}
    >
      {/* Premium gold accent line at top */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #fbbf24, #eab308, #fbbf24)" }} />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          opacity: 0.015,
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" style={{ opacity: 0.02 }}>
        <Dumbbell size={400} strokeWidth={0.5} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* HEADER */}
        <div className="relative overflow-hidden" style={{ background: "#020617", padding: "40px 40px 32px" }}>
          {/* Subtle gradient orbs */}
          <div className="absolute top-0 right-0 rounded-full" style={{ width: 400, height: 400, background: "rgba(251,191,36,0.1)", filter: "blur(120px)", transform: "translateY(-50%) translateX(25%)" }} />
          <div className="absolute bottom-0 left-0 rounded-full" style={{ width: 300, height: 300, background: "rgba(59,130,246,0.1)", filter: "blur(100px)", transform: "translateY(50%) translateX(-25%)" }} />

          <div className="relative z-10 flex justify-between items-start">
            {/* Logo & Brand */}
            <div className="flex gap-5 items-center">
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                <img
                  src="/logo.png"
                  alt="IQ Iron Fitness"
                  className="w-20 h-20 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <h1
                  className="text-3xl font-black tracking-tight text-white"
                  style={{ fontFamily: "Impact, sans-serif" }}
                >
                  {BUSINESS.name}
                </h1>
                <p style={{ color: "#fbbf24", fontWeight: 600, letterSpacing: "0.2em", fontSize: 10, marginTop: 4, textTransform: "uppercase" }}>
                  {BUSINESS.tagline}
                </p>
                <div className="flex gap-0.5 mt-2">
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      size={10}
                      style={{ color: "#fbbf24", fill: "#fbbf24" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Document Title & Invoice Info */}
            <div className="text-right">
              <div style={{ display: "inline-block", background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.2))", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.3)", padding: "10px 24px", borderRadius: 8, marginBottom: 20, boxShadow: "0 4px 15px rgba(251,191,36,0.1)" }}>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", color: "#fbbf24", textTransform: "uppercase" }}>
                  Tax Invoice
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex justify-end gap-3 items-center">
                  <span style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                    Invoice No
                  </span>
                  <span style={{ color: "white", fontFamily: "monospace", fontWeight: 600, fontSize: 13, background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }}>
                    {invoiceNumber}
                  </span>
                </p>
                <p className="flex justify-end gap-3 items-center">
                  <span style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                    Date
                  </span>
                  <span className="text-white font-semibold">
                    {invoiceDate}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="px-10 py-8 flex-1 flex flex-col space-y-6">
          {/* Billed To & Status Bar */}
          <div className="grid grid-cols-3 gap-4">
            {/* Member Info */}
            <div className="col-span-2 rounded-xl relative overflow-hidden" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: 20 }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: "linear-gradient(180deg, #fbbf24, #f59e0b)" }} />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "#020617", color: "#fbbf24", boxShadow: "0 4px 12px rgba(2,6,23,0.3)" }}>
                  <User size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>
                    Billed To
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {member.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-600">
                    <Phone size={12} className="text-slate-400" />
                    <span>{member.phone || "No phone provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: 20 }}>
              <div
                className="absolute top-0 right-0 w-1 h-full"
                style={{
                  background: "linear-gradient(180deg, #34d399, #059669)",
                  opacity:
                    paymentStatus === "PAID IN FULL"
                      ? 1
                      : paymentStatus === "UNPAID"
                        ? 0
                        : 0.5,
                }}
              />
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
                Payment Status
              </p>
              <div
                className={`px-4 py-2 rounded-full border text-xs font-bold tracking-wider flex items-center gap-2 ${statusBg}`}
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                {statusIcon}
                {paymentStatus}
              </div>
            </div>
          </div>

          {/* Membership Info Banner */}
          <div className="flex items-center gap-6 text-white rounded-xl" style={{ background: "linear-gradient(135deg, #020617, #1e293b)", padding: "16px 24px", boxShadow: "0 10px 25px rgba(2,6,23,0.3)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Award size={20} style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  Membership
                </p>
                <p className="text-base font-bold">
                  {member.membership_type || "Monthly"} Plan
                </p>
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                <CalendarDays size={20} style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  Valid Period
                </p>
                <p className="text-sm font-semibold">
                  {member.start_date || "N/A"}{" "}
                  <span style={{ color: "#64748b", margin: "0 4px" }}>→</span>{" "}
                  {member.expiry_date || "N/A"}
                </p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                Invoice Total
              </p>
              <p className="text-2xl font-black" style={{ color: "#fbbf24" }}>
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-800 uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: "0.15em" }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#020617", color: "#fbbf24" }}>
                <List size={14} />
              </div>
              Payment Breakdown
            </h3>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: "#020617", color: "white", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
                    <th style={{ padding: "14px 24px" }}>Description</th>
                    <th style={{ padding: "14px 24px", textAlign: "center" }}>Period</th>
                    <th style={{ padding: "14px 24px", textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr style={{ borderBottom: "1px solid #f1f5f9", background: "white" }}>
                    <td style={{ padding: "20px 24px" }}>
                      <p className="font-bold text-slate-800 text-base">
                        {member.membership_type || "Monthly"} Membership Fee
                      </p>
                      <p style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                        Base charge for gym facility access &amp; equipment
                      </p>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                      <span className="font-semibold">
                        {member.start_date || "N/A"}
                      </span>
                      <div style={{ color: "#cbd5e1", fontSize: 11, margin: "2px 0" }}>to</div>
                      <span className="font-semibold">
                        {member.expiry_date || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "right", fontWeight: 700, color: "#0f172a", fontSize: 18 }}>
                      ₹{total.toLocaleString("en-IN")}
                    </td>
                  </tr>

                  {member.has_personal_trainer && (
                    <tr style={{ borderBottom: "1px solid #f1f5f9", background: "rgba(248,250,252,0.8)" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <p className="font-bold text-slate-800">
                          Personal Training
                        </p>
                        <p style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                          Trainer: {member.trainer_name || "Assigned"}
                        </p>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
                        —
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right", fontWeight: 600, color: "#059669", fontSize: 13 }}>
                        Included
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mt-6 flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between items-center text-sm px-2" style={{ color: "#475569" }}>
                  <span style={{ color: "#64748b" }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: "#0f172a" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm px-2" style={{ color: "#475569" }}>
                  <span style={{ color: "#64748b" }}>Discount</span>
                  <span className="font-semibold" style={{ color: "#0f172a" }}>₹0</span>
                </div>
                <div className="flex justify-between items-center text-sm px-2">
                  <span style={{ color: "#64748b" }}>Amount Paid</span>
                  <span className="font-semibold" style={{ color: "#059669" }}>
                    ₹{paid.toLocaleString("en-IN")}
                  </span>
                </div>

                <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #cbd5e1, transparent)", margin: "8px 0" }} />

                <div className="flex justify-between items-center text-white rounded-xl" style={{ padding: "16px 20px", background: "linear-gradient(135deg, #020617, #1e293b)", boxShadow: "0 10px 25px rgba(2,6,23,0.25)", border: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, display: "block" }}>
                      Balance Due
                    </span>
                    <span style={{ fontSize: 10, color: "#64748b" }}>
                      Please clear at earliest
                    </span>
                  </div>
                  <span className="text-2xl font-black" style={{ color: "#fbbf24", letterSpacing: "-1px" }}>
                    ₹{balance.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-6" style={{ borderTop: "1px solid #e2e8f0" }}>
            <div className="flex justify-between items-end">
              <div className="w-1/2 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield size={12} style={{ color: "#f59e0b" }} />
                    <h4 style={{ fontSize: 10, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      Terms &amp; Conditions
                    </h4>
                  </div>
                  <ul style={{ fontSize: 10, color: "#64748b", lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
                    <li>This invoice is valid for the stated membership period only.</li>
                    <li>Membership fees are non-transferable and non-refundable.</li>
                    <li>Please present this document at the front desk if requested.</li>
                    <li>Late payments may attract a penalty of 5% per month.</li>
                  </ul>
                  <div className="inline-flex items-center gap-1.5 mt-3" style={{ padding: "8px 16px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, color: "#047857", fontSize: 11, fontWeight: 600, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <CheckCircle size={14} />
                    Thank you for choosing IQ IRON FITNESS.
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex flex-col items-end gap-2.5" style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>
                <div className="flex items-center gap-2.5">
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>{BUSINESS.phone}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                    <Phone size={12} />
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>{BUSINESS.email}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                    <Mail size={12} />
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span style={{ textAlign: "right", color: "#0f172a", fontWeight: 600 }}>
                    {BUSINESS.addressLine1},<br />{BUSINESS.addressLine2}
                  </span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                    <MapPin size={12} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, height: 2, width: "100%", background: "linear-gradient(90deg, transparent, #fbbf24, transparent)", opacity: 0.4 }} />
            <p style={{ textAlign: "center", fontSize: 9, color: "#94a3b8", marginTop: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              IQ Iron Fitness • Where Intelligence Meets Iron • Official Tax Invoice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
