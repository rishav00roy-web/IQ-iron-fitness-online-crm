import React, { useState, useEffect } from "react";
import {
  Phone,
  Globe,
  Mail,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  User,
  ShieldCheck
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

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-48291");
  const [invoiceDate, setInvoiceDate] = useState("25 MAY 2025");
  const [dueDate, setDueDate] = useState("08 JUN 2025");

  useEffect(() => {
    if (member) {
      setInvoiceNumber(`INV-${Math.floor(10000 + Math.random() * 90000)}`);
      const today = new Date();
      setInvoiceDate(today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
      
      const due = new Date();
      due.setDate(today.getDate() + 14); // Due in 14 days
      setDueDate(due.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
    }
  }, [member]);

  const memberName = member?.name || "Rishav Roy";
  const memberPhone = member?.phone || "6001914771";
  
  const totalAmount = member?.total_fee || 14160;
  
  // GST Calculations (18% GST split into 9% CGST and 9% SGST)
  const taxableAmount = totalAmount / 1.18;
  const cgst = taxableAmount * 0.09;
  const sgst = taxableAmount * 0.09;
  const subtotal = taxableAmount;

  return (
    <div
      id="invoice-template"
      className="font-sans bg-white mx-auto relative select-none text-slate-800 p-6"
      style={{
        width: "794px",
        height: "1123px",
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* Page Border & Silver Pin-strip */}
      <div className="w-full h-full border-[10px] border-[#0a224a] rounded-sm relative flex flex-col justify-between overflow-hidden bg-white">
        <div className="absolute inset-1 border-[2px] border-slate-300 rounded-[2px] pointer-events-none z-50"></div>

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
            .print-border-adjust {
              border-[10px] border-[#0a224a] !important;
              height: 100% !important;
            }
          }
        `}</style>

        {/* Header container */}
        <div className="relative flex-1 flex flex-col justify-between p-6 font-body">
          {/* HEADER SECTION */}
          <div className="w-full bg-[#0a224a] text-white p-6 rounded-sm relative overflow-hidden flex items-center justify-between">
            {/* Header background accents */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-[#123675] z-0" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-4 bg-slate-300/40 z-0 transform skew-x-12"></div>

            <div className="relative z-10 flex items-center gap-6">
              {/* Standalone Logo */}
              <img
                src="/logo.png"
                alt="IQ Iron Fitness Logo"
                className="w-20 h-auto object-contain"
                style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))", WebkitPrintColorAdjust: "exact" as any }}
              />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-wide font-display text-white">
                  IQ IRON FITNESS
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-[1px] w-4 bg-blue-300"></span>
                  <p className="text-blue-200 text-[9px] tracking-[0.2em] font-semibold uppercase">
                    Where Intelligence Meets Iron
                  </p>
                  <span className="h-[1px] w-4 bg-blue-300"></span>
                </div>
                <div className="flex gap-1 mt-1 text-yellow-400 text-xs">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
              </div>
            </div>

            {/* Right side Metadata */}
            <div className="relative z-10 flex flex-col items-end gap-3">
              <div className="bg-[#1e3a8a] text-white px-4 py-1 font-bold text-xs rounded-sm tracking-wider font-display uppercase border border-blue-400/30">
                TAX INVOICE
              </div>
              <div className="text-right text-xs space-y-1 font-mono text-blue-100">
                <div className="flex justify-end gap-2">
                  <span className="text-blue-300">Invoice No :</span>
                  <span className="font-bold text-white">{invoiceNumber}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <span className="text-blue-300">Date :</span>
                  <span className="text-white">{invoiceDate}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <span className="text-blue-300">Due Date :</span>
                  <span className="text-white">{dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metal Divider bar */}
          <div className="w-full h-[6px] bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 my-4 shadow-sm"></div>

          {/* ADDRESS ROW (FROM & BILL TO) */}
          <div className="grid grid-cols-2 gap-8 my-2 text-xs">
            {/* FROM BLOCK */}
            <div className="border-l-2 border-slate-300 pl-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-display">From</p>
              <h3 className="font-bold text-sm text-slate-900 font-display">IQ IRON FITNESS</h3>
              <p className="text-slate-600 leading-relaxed">
                123, Power House Road,<br />
                Kothrud, Pune - 411038, Maharashtra, India
              </p>
              <div className="flex flex-col gap-0.5 text-slate-500 pt-1">
                <span className="flex items-center gap-1"><Phone size={10} /> +91 98765 43210</span>
                <span className="flex items-center gap-1"><Mail size={10} /> info@iqironfitness.com</span>
                <span className="flex items-center gap-1"><Globe size={10} /> www.iqironfitness.com</span>
                <span className="mt-1 font-semibold text-slate-700">GSTIN: 27ABCDE1234F1Z5</span>
              </div>
            </div>

            {/* BILL TO BLOCK */}
            <div className="border-l-2 border-slate-300 pl-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-display">Bill To</p>
              <h3 className="font-bold text-sm text-slate-900 font-display">{memberName}</h3>
              <p className="text-slate-600 leading-relaxed">
                45, Green Park Avenue,<br />
                Kolkata - 700019, West Bengal, India
              </p>
              <div className="flex flex-col gap-0.5 text-slate-500 pt-1">
                <span className="flex items-center gap-1"><Phone size={10} /> +91 {memberPhone}</span>
                <span className="flex items-center gap-1"><Mail size={10} /> rishavroy@email.com</span>
              </div>
            </div>
          </div>

          {/* FEE BREAKDOWN TABLE */}
          <div className="my-4">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-[#0a224a] text-white text-left font-display">
                  <th className="py-2 px-3 border border-slate-300 w-12 text-center">#</th>
                  <th className="py-2 px-3 border border-slate-300">DESCRIPTION</th>
                  <th className="py-2 px-3 border border-slate-300 w-24 text-center">HSN / SAC</th>
                  <th className="py-2 px-3 border border-slate-300 w-16 text-center">QTY</th>
                  <th className="py-2 px-3 border border-slate-300 w-28 text-right">UNIT PRICE (₹)</th>
                  <th className="py-2 px-3 border border-slate-300 w-28 text-right">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 font-medium">
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-3 border border-slate-200 text-center font-mono">1</td>
                  <td className="py-3 px-3 border border-slate-200">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center text-[#0a224a] shrink-0 mt-0.5">
                        ★
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Premium Gym Membership</span>
                        <span className="text-slate-500 text-[10px] capitalize">{member?.membership_type || "Monthly"} membership plan</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 border border-slate-200 text-center font-mono">999799</td>
                  <td className="py-3 px-3 border border-slate-200 text-center font-mono">1</td>
                  <td className="py-3 px-3 border border-slate-200 text-right font-mono">
                    {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 border border-slate-200 text-right font-mono">
                    {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* LOWER SECTION (PAYMENT METHODS & TOTALS) */}
          <div className="grid grid-cols-2 gap-8 my-2">
            {/* PAYMENT METHODS BLOCK */}
            <div className="border border-slate-200 rounded-sm p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0a224a] mb-3 pb-1 border-b border-slate-200">
                  Payment Methods
                </h4>
                <div className="space-y-3 text-[11px] text-slate-600">
                  <div className="flex gap-2">
                    <span className="font-bold text-[#0a224a]">UPI :</span>
                    <span>iqironfitness@upi</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#0a224a]">Bank Transfer :</p>
                    <p>A/c No: 1234 5678 9012</p>
                    <p>IFSC: HDFC0001234</p>
                    <p>HDFC Bank, Kothrud, Pune</p>
                  </div>
                </div>
              </div>

              {/* Styled QR Code Box */}
              <div className="flex items-center gap-4 mt-4 bg-white p-2 border border-slate-200 rounded-sm w-fit">
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-800">
                  <rect width="100" height="100" fill="white" />
                  <path d="M0,0 h30 v10 h-20 v20 h-10 z M70,0 h30 v30 h-10 v-20 h-20 z M0,70 h10 v20 h20 v10 h-30 z M90,90 h-20 v10 h30 v-30 h-10 z" fill="currentColor" />
                  <rect x="15" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="70" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="15" y="70" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M40,20 h10 v10 h-10 z M45,40 h10 v15 h-10 z M30,45 h10 v10 h-10 z M60,40 h15 v10 h-15 z M55,65 h15 v10 h-15 z M75,75 h10 v10 h-10 z M40,80 h10 v10 h-10 z M65,80 h10 v10 h-10 z" fill="currentColor" />
                </svg>
                <div className="text-[10px] text-slate-500">
                  <span className="font-bold text-slate-700 block uppercase tracking-wide">Scan To Pay</span>
                  <span>UPI ID: iqironfitness@upi</span>
                </div>
              </div>
            </div>

            {/* TOTALS SUMMARY BLOCK */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>SUBTOTAL</span>
                <span className="font-mono">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>DISCOUNT</span>
                <span className="font-mono">- ₹ 0.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>TAXABLE AMOUNT</span>
                <span className="font-mono">₹ {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>CGST (9%)</span>
                <span className="font-mono">₹ {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                <span>SGST (9%)</span>
                <span className="font-mono">₹ {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              {/* Total Amount Ribbon */}
              <div className="bg-[#0a224a] text-white py-2.5 px-4 rounded-sm flex justify-between items-center shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-full bg-white/10 skew-x-12 transform origin-top-right"></div>
                <span className="font-display font-bold text-sm tracking-widest uppercase">Total Amount</span>
                <span className="font-mono text-lg font-black">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              {/* Amount in words */}
              <div className="text-[10px] text-slate-500 italic mt-2 leading-snug">
                <span className="font-bold text-slate-700 block not-italic uppercase tracking-wide">Amount in Words:</span>
                <span>{numberToWords(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* TERMS & SIGNATORY */}
          <div className="grid grid-cols-3 gap-6 items-end my-4 text-xs pt-4 border-t border-slate-200/50">
            {/* Terms and conditions */}
            <div className="col-span-2 space-y-2">
              <h5 className="font-display font-bold text-[#0a224a] tracking-wider uppercase text-[10px]">
                Terms & Conditions
              </h5>
              <ul className="list-disc list-inside text-[10px] text-slate-500 space-y-1 leading-relaxed">
                <li>This invoice is computer generated and does not require signature.</li>
                <li>Payment to be made before the due date to avoid late fees.</li>
                <li>Membership once purchased is non-refundable and non-transferable.</li>
                <li>Please carry a valid ID card during all gym visits.</li>
              </ul>
            </div>

            {/* Authorised Signatory */}
            <div className="flex flex-col items-center justify-end text-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg"
                alt="Signature"
                className="h-10 opacity-70 mb-1 grayscale object-contain"
                style={{ WebkitPrintColorAdjust: "exact" as any }}
              />
              <div className="w-full border-t border-slate-300 pt-1.5">
                <p className="text-[9px] font-bold text-[#0a224a] tracking-widest uppercase font-display">
                  Authorised Signatory
                </p>
                <p className="text-[8px] text-slate-400">IQ Iron Fitness</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METALLIC STATUS BAR & FOOTER */}
        <div className="bg-[#0a224a] border-t-2 border-slate-300 py-3 relative overflow-hidden flex flex-col items-center justify-center z-10">
          <div className="absolute top-0 left-0 w-24 h-full bg-white/5 rotate-45 transform -translate-x-12"></div>
          <div className="absolute bottom-0 right-0 w-32 h-full bg-white/5 -rotate-45 transform translate-x-16"></div>

          {/* Contact Bar */}
          <div className="flex items-center gap-6 text-[9px] text-blue-200/80 mb-1.5 font-body justify-center w-full">
            <span className="flex items-center gap-1"><MapPin size={10} /> 123, Power House Road, Kothrud, Pune - 411038</span>
            <span className="w-1 h-1 rounded-full bg-blue-300/30"></span>
            <span className="flex items-center gap-1"><Phone size={10} /> +91 98765 43210</span>
            <span className="w-1 h-1 rounded-full bg-blue-300/30"></span>
            <span className="flex items-center gap-1"><Mail size={10} /> info@iqironfitness.com</span>
          </div>

          {/* Thank You message */}
          <div className="flex items-center gap-3">
            <span className="text-blue-300 text-xs">★</span>
            <p className="text-white font-display text-[10px] tracking-[0.25em] font-bold uppercase" style={{ textRendering: "geometricPrecision" }}>
              Thank you for choosing IQ IRON FITNESS
            </p>
            <span className="text-blue-300 text-xs">★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
