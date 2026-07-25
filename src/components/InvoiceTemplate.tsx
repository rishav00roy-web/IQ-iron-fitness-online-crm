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
} from "lucide-react";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  // TODO(antigravity): fill in real business contact details.
  // Left blank intentionally — mock data is used for the member/fee
  // fields below, but these should come from real gym info.
  const BUSINESS = {
    phone: "",
    addressLine1: "",
    addressLine2: "",
    website: "",
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvoiceNumber(
      `INV-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvoiceDate(
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, [member]);

  if (!member) return null;

  const total = member.total_fee || 0;
  const balance = member.pending_amount || 0;
  const paid = total - balance;

  let paymentStatus = "PARTIALLY PAID";
  if (balance === 0) paymentStatus = "PAID";
  if (paid === 0) paymentStatus = "UNPAID";

  let statusBg = "bg-[#fb923c]";
  let statusColor = "#fb923c"; // orange
  if (paymentStatus === "PAID") statusBg = "bg-[#16a34a]";
  statusColor = "#16a34a"; // green
  if (paymentStatus === "UNPAID") statusBg = "bg-[#dc2626]";
  statusColor = "#dc2626"; // red

  return (
    <div
      id="invoice-template"
      className="font-sans text-neutral-800"
      style={{
        backgroundColor: "#ffffff",
        width: "1000px", // Fixed width so html2canvas renders correctly
        minHeight: "1414px", // Fixed height to enforce portrait layout
        padding: "0",
      }}
    >
      {/* Invoice Container */}
      <div
        style={{ backgroundColor: "#ffffff" }}
        className="w-[1000px] overflow-hidden border-[12px] border-slate-200/50 rounded-lg relative"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="text-[400px] font-black tracking-tighter text-slate-900 leading-none">
            IQ
          </div>
        </div>

        {/* --- HEADER --- */}
        <div
          style={{
            background: "linear-gradient(to right, #031d4f, #0b337c, #031d4f)",
          }}
          className="relative bg-blue-900 text-white px-8 pt-8 pb-6 border-b-[8px] border-slate-300"
        >
          {/* Decorative Corner Flaps / Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 -rotate-45 transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rotate-45 transform translate-x-24 translate-y-24"></div>

          <div className="relative z-10 flex items-center justify-between gap-6">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="IQ Iron Fitness logo"
                className="drop-shadow-lg"
                style={{ width: "128px", height: "auto", maxWidth: "100%" }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Center Title */}
            <div className="flex-1 text-center flex flex-col items-center">
              <h1
                className="text-5xl font-black tracking-wider text-white drop-shadow-md mb-2"
                style={{ fontFamily: "Impact, sans-serif" }}
              >
                IQ IRON FITNESS
              </h1>

              <div className="flex items-center justify-center w-full max-w-md gap-3 mb-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/60"></div>
                <p className="text-xs tracking-[0.2em] font-medium text-slate-200">
                  WHERE INTELLIGENCE MEETS IRON
                </p>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/60"></div>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(to right, #1d4ed8, #3b82f6, #1d4ed8)",
                }}
                className=" px-8 py-1.5 rounded-sm shadow-md border-y border-blue-400/50"
              >
                <span className="text-sm font-bold tracking-widest text-white">
                  PAYMENT INVOICE
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex-shrink-0 text-sm space-y-3 font-medium text-slate-200 text-right">
              <div className="flex items-center justify-end gap-3">
                <p>{BUSINESS.phone}</p>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                  <Phone className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <p className="text-right max-w-[150px] leading-tight">
                  {BUSINESS.addressLine1}
                  <br />
                  {BUSINESS.addressLine2}
                </p>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <p>{BUSINESS.website}</p>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                  <Globe className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BODY CONTENT --- */}
        <div
          className="p-8 relative z-10 space-y-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Top Bar: Invoice Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-[#e6eaf3] rounded-xl px-6 py-4 bg-white/80 shadow-sm">
            <div className="flex items-center gap-4 border-r-2 border-slate-100 pr-8">
              <div
                style={{ backgroundColor: "#0d2a6a" }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
              >
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <p
                  style={{ color: "#0d2a6a" }}
                  className="text-xs font-bold tracking-wider uppercase mb-1"
                >
                  Invoice No.
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {invoiceNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 pl-4">
              <div
                style={{ backgroundColor: "#0d2a6a" }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
              >
                <CalendarDays className="text-white w-6 h-6" />
              </div>
              <div>
                <p
                  style={{ color: "#0d2a6a" }}
                  className="text-xs font-bold tracking-wider uppercase mb-1"
                >
                  Invoice Date
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {invoiceDate}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                style={{ color: "#0d2a6a" }}
                className="text-xs font-bold tracking-wider uppercase mb-2"
              >
                Payment Status
              </p>
              <div
                className={`${statusBg} text-white font-bold py-1.5 px-6 rounded-full shadow-md text-sm tracking-wide`}
              >
                {paymentStatus}
              </div>
            </div>
          </div>

          {/* Grid: Member Details & Membership Details */}
          <div className="grid grid-cols-2 gap-6">
            {/* Member Details */}
            <div className="border-2 border-[#e6eaf3] rounded-xl overflow-hidden bg-white/80 shadow-sm">
              <div
                style={{ backgroundColor: "#0b337c" }}
                className="px-4 py-2 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-white" />
                <h3 className="text-white font-bold tracking-wide">
                  MEMBER DETAILS
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="w-32 text-slate-600 font-medium">
                    Member Name
                  </span>
                  <span className="text-slate-400 font-bold">:</span>
                  <span className="font-bold text-slate-800 ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    {member.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="w-32 text-slate-600 font-medium">
                    Phone Number
                  </span>
                  <span className="text-slate-400 font-bold">:</span>
                  <span className="font-bold text-slate-800 ml-2">
                    {member.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div className="border-2 border-[#e6eaf3] rounded-xl overflow-hidden bg-white/80 shadow-sm">
              <div
                style={{ backgroundColor: "#0b337c" }}
                className="px-4 py-2 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-white" />
                <h3 className="text-white font-bold tracking-wide">
                  MEMBERSHIP DETAILS
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="w-32 text-slate-600 font-medium">
                    Membership Type
                  </span>
                  <span className="text-slate-400 font-bold">:</span>
                  <span className="font-bold text-slate-800 ml-2">
                    {member.membership_type || "Monthly"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500 shrink-0">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <span className="w-32 text-slate-600 font-medium">
                    Start Date
                  </span>
                  <span className="text-slate-400 font-bold">:</span>
                  <span className="font-bold text-slate-800 ml-2">
                    {member.start_date
                      ? new Date(member.start_date).toLocaleDateString("en-IN")
                      : invoiceDate}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500 shrink-0">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <span className="w-32 text-slate-600 font-medium">
                    Expiry Date
                  </span>
                  <span className="text-slate-400 font-bold">:</span>
                  <span className="font-bold text-slate-800 ml-2">
                    {member.expiry_date
                      ? new Date(member.expiry_date).toLocaleDateString("en-IN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid: Fee Breakdown & Totals */}
          <div className="flex gap-6 items-stretch">
            {/* Fee Breakdown */}
            <div className="flex-[2] border-2 border-[#e6eaf3] rounded-xl overflow-hidden bg-white/90 shadow-sm flex flex-col">
              <div
                style={{ backgroundColor: "#0b337c" }}
                className="px-4 py-2 flex items-center gap-2"
              >
                <List className="w-4 h-4 text-white" />
                <h3 className="text-white font-bold tracking-wide uppercase">
                  Fee Breakdown
                </h3>
              </div>

              <div className="flex-1 flex flex-col">
                <div
                  style={{ backgroundColor: "#12429a", color: "white" }}
                  className=" grid grid-cols-4 px-6 py-2 text-sm font-semibold uppercase tracking-wider"
                >
                  <div className="col-span-3">Description</div>
                  <div className="text-right">Amount (₹)</div>
                </div>

                <div className="p-6 space-y-4 font-medium flex-1">
                  <div className="grid grid-cols-4 text-slate-700">
                    <div className="col-span-3">
                      Membership Fee ({member.membership_type || "Monthly"})
                    </div>
                    <div className="text-right">
                      {total.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-slate-100"></div>

                  <div className="grid grid-cols-4 text-slate-500">
                    <div className="col-span-3">Discount</div>
                    <div className="text-right">0.00</div>
                  </div>
                  <div className="w-full h-[1px] bg-slate-100"></div>

                  <div className="grid grid-cols-4 text-[#16a34a] font-bold">
                    <div className="col-span-3">Paid Amount</div>
                    <div className="text-right">
                      {paid.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-slate-100"></div>

                  <div className="grid grid-cols-4 text-[#ea580c] font-bold">
                    <div className="col-span-3">Pending Amount</div>
                    <div className="text-right">
                      {balance.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 grid grid-cols-4 px-6 py-4 border-t border-slate-200 mt-auto items-center overflow-hidden">
                  <div
                    style={{ color: "#0d2a6a" }}
                    className="col-span-3 font-bold tracking-wide text-lg"
                  >
                    TOTAL AMOUNT
                  </div>
                  <div className="relative z-10 text-right h-full flex items-center justify-end">
                    {/* The blue polygon background for the total amount text */}
                    <div
                      className="absolute top-[-16px] bottom-[-16px] left-[-40px] right-[-24px] bg-[#0d2a6a] z-[-1]"
                      style={{
                        clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                      }}
                    ></div>
                    <span className="text-white font-bold text-xl relative z-10 mr-2">
                      ₹ {total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="flex-1 border-2 border-[#e6eaf3] rounded-xl bg-white/90 shadow-sm overflow-hidden flex flex-col divide-y divide-[#e6eaf3]">
              <div className="p-5 text-center flex flex-col items-center justify-center flex-1">
                <p
                  style={{ color: "#0d2a6a" }}
                  className="text-xs font-bold tracking-wider uppercase mb-1"
                >
                  Total Amount
                </p>
                <p style={{ color: "#0d2a6a" }} className="text-2xl font-black">
                  ₹ {total.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="p-5 text-center flex flex-col items-center justify-center flex-1 bg-green-50/50">
                <p
                  style={{ color: "#16a34a" }}
                  className="text-xs font-bold tracking-wider uppercase mb-1"
                >
                  Amount Paid
                </p>
                <p style={{ color: "#16a34a" }} className="text-3xl font-black">
                  ₹ {paid.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="p-5 text-center flex flex-col items-center justify-center flex-1 bg-orange-50/50">
                <p
                  style={{ color: "#ea580c" }}
                  className="text-xs font-bold tracking-wider uppercase mb-1"
                >
                  Pending Amount
                </p>
                <p style={{ color: "#ea580c" }} className="text-3xl font-black">
                  ₹ {balance.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Grid: Bottom info */}
          <div className="flex gap-6 pt-4">
            {/* Notes */}
            <div className="flex-1 border border-[#e6eaf3] rounded-lg bg-white overflow-hidden shadow-sm relative">
              <div className="bg-slate-50 px-4 py-2 border-b border-[#e6eaf3] flex items-center gap-2">
                <FileText style={{ color: "#0d2a6a" }} className="w-4 h-4" />
                <h4
                  style={{ color: "#0d2a6a" }}
                  className="font-bold text-sm uppercase tracking-wider"
                >
                  Notes
                </h4>
              </div>
              <div className="p-4 text-xs text-slate-600 font-medium leading-relaxed">
                <p>Thank you for choosing IQ IRON FITNESS.</p>
                <p className="mt-1">Keep pushing, keep growing!</p>
              </div>
              <div className="absolute bottom-2 right-4 opacity-10">
                <Dumbbell className="w-12 h-12" />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex-1 border border-[#e6eaf3] rounded-lg bg-white overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 px-4 py-2 border-b border-[#e6eaf3] flex items-center gap-2">
                <CheckCircle style={{ color: "#0d2a6a" }} className="w-4 h-4" />
                <h4
                  style={{ color: "#0d2a6a" }}
                  className="font-bold text-sm uppercase tracking-wider"
                >
                  Terms & Conditions
                </h4>
              </div>
              <div className="p-4 text-[10px] text-slate-600 font-medium leading-relaxed">
                <ul className="list-disc list-outside ml-3 space-y-1.5 marker:text-slate-400">
                  <li>This invoice is valid for the membership period.</li>
                  <li>Membership is non-transferable & non-refundable.</li>
                  <li>Please carry this invoice for verification.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div
          style={{
            background: "linear-gradient(to right, #031d4f, #0b337c, #031d4f)",
          }}
          className="py-4 bg-blue-900 border-t-[4px] border-slate-300 relative overflow-hidden"
        >
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/10 rotate-45 transform -translate-x-12 translate-y-12"></div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 -rotate-45 transform translate-x-16 -translate-y-16"></div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
