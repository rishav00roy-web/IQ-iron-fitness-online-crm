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

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-37067");
  const [invoiceDate, setInvoiceDate] = useState("27 JUL 2026");
  const [dueDate, setDueDate] = useState("10 AUG 2026");

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

  const memberName = member?.name || "rishav";
  const memberPhone = member?.phone || "6001914771";
  
  const totalAmount = member?.total_fee || 10000;
  
  // GST Calculations (18% GST split into 9% CGST and 9% SGST)
  const taxableAmount = totalAmount / 1.18;
  const cgst = taxableAmount * 0.09;
  const sgst = taxableAmount * 0.09;
  const subtotal = taxableAmount;

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
      {/* Page Border (Solid Blue - No inner silver pin-strip) */}
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
            .print-border-adjust {
              border-[10px] border-[#0b337c] !important;
              height: 100% !important;
            }
          }
        `}</style>

        {/* HEADER SECTION */}
        <div className="w-full bg-[#0b337c] text-white p-5 rounded-sm relative overflow-hidden flex items-center justify-between shrink-0 z-10 shadow-md">
          {/* Header background accents */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-[#1e3a8a] z-0" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>
          
          <div className="relative z-10 flex items-center gap-4">
            {/* Standalone Logo */}
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
              <div className="flex gap-0.5 mt-1 text-yellow-400 text-[10px]">
                <span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>

          {/* Right side Metadata */}
          <div className="relative z-10 flex flex-col items-end gap-2">
            <div className="bg-[#1e40af] text-white px-3 py-0.5 font-bold text-[10px] rounded-sm tracking-wider font-display uppercase border border-blue-400/20">
              TAX INVOICE
            </div>
            <div className="text-right text-[10px] space-y-0.5 font-mono text-blue-100 leading-tight">
              <div>Invoice No : <span className="font-bold text-white">{invoiceNumber}</span></div>
              <div>Date : <span className="text-white">{invoiceDate}</span></div>
              <div>Due Date : <span className="text-white">{dueDate}</span></div>
            </div>
          </div>
        </div>

        {/* Metal Divider bar */}
        <div className="w-full h-[4px] bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 my-4 shadow-sm shrink-0 z-10"></div>

        {/* ADDRESS ROW (FROM & BILL TO - Styled as Card Panels) */}
        <div className="grid grid-cols-2 gap-6 my-2 text-[12px] font-body shrink-0 z-10">
          {/* FROM CARD */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-md space-y-1.5 shadow-sm" style={{ padding: '20px' }}>
            <p className="text-[9px] font-bold text-[#0b337c] tracking-wider uppercase font-display border-b border-slate-200/80 pb-0.5">From</p>
            <h3 className="font-bold text-slate-900 font-display text-sm">IQ IRON FITNESS</h3>
            <p className="text-slate-600 leading-relaxed">
              123, Power House Road,<br />
              Kothrud, Pune - 411038, Maharashtra, India
            </p>
            <div className="flex flex-col gap-0.5 text-slate-500 pt-1 font-mono text-[10px]">
              <span>Ph: +91 98765 43210</span>
              <span>Email: info@iqironfitness.com</span>
              <span>Web: www.iqironfitness.com</span>
              <span className="font-semibold text-slate-700 mt-0.5">GSTIN: 27ABCDE1234F1Z5</span>
            </div>
          </div>

          {/* BILL TO CARD */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-md space-y-1.5 shadow-sm" style={{ padding: '20px' }}>
            <p className="text-[9px] font-bold text-[#0b337c] tracking-wider uppercase font-display border-b border-slate-200/80 pb-0.5">Bill To</p>
            <h3 className="font-bold text-slate-900 font-display text-sm capitalize">{memberName}</h3>
            <p className="text-slate-600 leading-relaxed">
              45, Green Park Avenue,<br />
              Kolkata - 700019, West Bengal, India
            </p>
            <div className="flex flex-col gap-0.5 text-slate-500 pt-1 font-mono text-[10px]">
              <span>Ph: +91 {memberPhone}</span>
              <span>Email: rishavroy@email.com</span>
            </div>
          </div>
        </div>

        {/* FEE BREAKDOWN TABLE (Increased spacing, larger fonts, and sub-details) */}
        <div className="my-4 shrink-0 z-10">
          <table className="w-full border-collapse border border-slate-200 text-[13px] table-fixed">
            <thead>
              <tr className="bg-[#0b337c] text-white text-left font-display">
                <th className="py-2.5 px-2 border border-slate-300 w-[6%] text-center">#</th>
                <th className="py-2.5 px-3 border border-slate-300 w-[44%]">DESCRIPTION</th>
                <th className="py-2.5 px-2 border border-slate-300 w-[15%] text-center">HSN / SAC</th>
                <th className="py-2.5 px-2 border border-slate-300 w-[10%] text-center">QTY</th>
                <th className="py-2.5 px-3 border border-slate-300 w-[12%] text-right">UNIT PRICE (₹)</th>
                <th className="py-2.5 px-3 border border-slate-300 w-[13%] text-right">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              <tr className="bg-white">
                <td className="py-5 px-2 border border-slate-200 text-center font-mono align-top">1</td>
                <td className="py-5 px-3 border border-slate-200 align-top">
                  <span className="font-bold text-slate-950 block text-[14px]">Premium Gym Membership</span>
                  <span className="text-slate-500 text-[11px] capitalize block mt-0.5 mb-2">
                    Plan type: {member?.membership_type || "Monthly"}
                  </span>
                  {/* Detailed features of membership */}
                  <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-0.5 font-normal">
                    <li>Full access to strength, cardio & free-weight zones</li>
                    <li>Complimentary lockers & shower facilities</li>
                    <li>1x Fitness consultation & assessment</li>
                  </ul>
                </td>
                <td className="py-5 px-2 border border-slate-200 text-center font-mono align-top">999799</td>
                <td className="py-5 px-2 border border-slate-200 text-center font-mono align-top">1</td>
                <td className="py-5 px-3 border border-slate-200 text-right font-mono align-top">
                  {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-5 px-3 border border-slate-200 text-right font-mono align-top">
                  {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LOWER SECTION (PAYMENT METHODS & TOTALS - Elevated vertical spacing) */}
        <div className="grid grid-cols-2 gap-6 my-4 shrink-0 z-10">
          {/* PAYMENT METHODS BLOCK */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="font-display font-bold text-[11px] uppercase tracking-wider text-[#0b337c] mb-2.5 pb-1 border-b border-slate-200">
                Payment Methods
              </h4>
              <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <div className="flex gap-1.5">
                  <span className="font-bold text-[#0b337c]">UPI :</span>
                  <span>iqironfitness@upi</span>
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-[#0b337c]">Bank Transfer :</p>
                  <p>A/c No: 1234 5678 9012</p>
                  <p>IFSC: HDFC0001234</p>
                  <p>HDFC Bank, Kothrud, Pune</p>
                </div>
              </div>
            </div>

            {/* Styled QR Code Box */}
            <div className="flex items-center gap-3 mt-3 bg-white p-2 border border-slate-200 rounded-md w-fit shadow-inner">
              <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-800 shrink-0">
                <rect width="100" height="100" fill="white" />
                <path d="M0,0 h30 v10 h-20 v20 h-10 z M70,0 h30 v30 h-10 v-20 h-20 z M0,70 h10 v20 h20 v10 h-30 z M90,90 h-20 v10 h30 v-30 h-10 z" fill="currentColor" />
                <rect x="15" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="70" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="15" y="70" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M40,20 h10 v10 h-10 z M45,40 h10 v15 h-10 z M30,45 h10 v10 h-10 z M60,40 h15 v10 h-15 z M55,65 h15 v10 h-15 z M75,75 h10 v10 h-10 z M40,80 h10 v10 h-10 z M65,80 h10 v10 h-10 z" fill="currentColor" />
              </svg>
              <div className="text-[9px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-700 block uppercase tracking-wide">Scan To Pay</span>
                <span>UPI ID: iqironfitness@upi</span>
              </div>
            </div>
          </div>

          {/* TOTALS SUMMARY BLOCK */}
          <div className="space-y-2 text-[12px] font-body">
            <div className="flex justify-between py-0.5 border-b border-slate-100 text-slate-600">
              <span>SUBTOTAL</span>
              <span className="font-mono">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100 text-slate-600">
              <span>DISCOUNT</span>
              <span className="font-mono">- ₹ 0.00</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100 text-slate-600">
              <span>TAXABLE AMOUNT</span>
              <span className="font-mono">₹ {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100 text-slate-600">
              <span>CGST (9%)</span>
              <span className="font-mono">₹ {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-200 text-slate-600">
              <span>SGST (9%)</span>
              <span className="font-mono">₹ {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            {/* Total Amount Ribbon */}
            <div className="bg-[#0b337c] text-white py-2.5 px-4 rounded-sm flex justify-between items-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-full bg-white/10 skew-x-12 transform origin-top-right"></div>
              <span className="font-display font-bold text-[12px] tracking-widest uppercase">Total Amount</span>
              <span className="font-mono text-lg font-black">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Amount in words */}
            <div className="text-[10px] text-slate-500 italic mt-1 leading-snug">
              <span className="font-bold text-slate-700 block not-italic uppercase tracking-wide text-[8px]">Amount in Words:</span>
              <span>{numberToWords(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* TERMS & SIGNATORY */}
        <div className="grid grid-cols-3 gap-6 items-end my-3 pt-3 border-t border-slate-200/50 shrink-0 font-body z-10">
          {/* Terms and conditions */}
          <div className="col-span-2 space-y-1.5">
            <h5 className="font-display font-bold text-[#0b337c] tracking-wider uppercase text-[9px]">
              Terms & Conditions
            </h5>
            <ul className="list-disc list-inside text-[9px] text-slate-500 space-y-0.5 leading-relaxed">
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
              className="h-8 opacity-70 mb-0.5 grayscale object-contain"
            />
            <div className="w-full border-t border-slate-300 pt-1.5">
              <p className="text-[8px] font-bold text-[#0b337c] tracking-widest uppercase font-display leading-none">
                Authorised Signatory
              </p>
              <p className="text-[7px] text-slate-400 mt-0.5">IQ Iron Fitness</p>
            </div>
          </div>
        </div>

        {/* BOTTOM METALLIC STATUS BAR & FOOTER */}
        <div className="bg-[#0b337c] border-t border-slate-300 py-3 relative overflow-hidden flex flex-col items-center justify-center shrink-0 w-full mt-3 z-10">
          <div className="absolute top-0 left-0 w-24 h-full bg-white/5 rotate-45 transform -translate-x-12"></div>
          <div className="absolute bottom-0 right-0 w-32 h-full bg-white/5 -rotate-45 transform translate-x-16"></div>

          {/* Contact Bar */}
          <div className="flex items-center gap-4 text-[9px] text-blue-200/80 mb-1 font-body justify-center w-full">
            <span>123, Power House Road, Kothrud, Pune - 411038</span>
            <span className="w-0.5 h-0.5 rounded-full bg-blue-300/30"></span>
            <span>+91 98765 43210</span>
            <span className="w-0.5 h-0.5 rounded-full bg-blue-300/30"></span>
            <span>info@iqironfitness.com</span>
          </div>

          {/* Thank You message */}
          <div className="flex items-center gap-2">
            <span className="text-blue-300 text-xs">★</span>
            <p className="text-white font-display text-[9px] tracking-[0.25em] font-bold uppercase" style={{ textRendering: "geometricPrecision" }}>
              Thank you for choosing IQ IRON FITNESS
            </p>
            <span className="text-blue-300 text-xs">★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
