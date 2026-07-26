import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Globe,
  FileText,
  CalendarDays,
  User,
  Clock,
  Mail,
  Building2,
  Landmark,
  CreditCard,
  QrCode,
  Dumbbell
} from "lucide-react";
import QRCode from "react-qr-code";

export default function InvoiceTemplate({ member }: { member: any }) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const BUSINESS = {
    name: "IQ IRON FITNESS",
    tagline: "WHERE INTELLIGENCE MEETS IRON",
    phone: "+91 98765 43210",
    addressLine1: "123, Power House Road,",
    addressLine2: "Kothrud, Pune - 411038, Maharashtra, India",
    email: "info@iqironfitness.com",
    website: "www.iqironfitness.com",
    gstin: "27ABCDE1234F1Z5"
  };

  useEffect(() => {
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`);
    
    const today = new Date();
    setInvoiceDate(today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 14);
    setDueDate(nextWeek.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase());
  }, [member]);

  if (!member) return null;

  // Use dynamic member details if available, else placeholders matching the mock
  const memberName = member.name || "Mr. Rishav Roy";
  const memberPhone = member.phone || "+91 91234 56789";
  const memberEmail = member.email || "rishavroy@email.com";
  // The address might not be in member object, using mock
  const memberAddress1 = "45, Green Park Avenue,";
  const memberAddress2 = "Kolkata - 700019, West Bengal, India";

  const total = member.total_fee || 10000;
  const discount = 0; // Or whatever dynamic discount
  
  // Calculate reverse breakdown for realistic mock
  const isInterState = !memberAddress2.toLowerCase().includes("maharashtra");
  const taxableAmount = total / 1.18;
  const taxAmount = total - taxableAmount;
  
  const cgst = isInterState ? 0 : taxAmount / 2;
  const sgst = isInterState ? 0 : taxAmount / 2;
  const igst = isInterState ? taxAmount : 0;
  const subtotal = taxableAmount;

  const numberToWords = (num: number) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'Overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
    return str.trim();
  };
  const amountInWordsText = numberToWords(Math.round(total));

  return (
    <div
      id="invoice-template"
      className="font-sans text-slate-800 bg-white shadow-2xl print:shadow-none mx-auto relative overflow-hidden"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "0",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* --- HEADER SECTION --- */}
      <div className="relative w-full h-[250px]" style={{ backgroundColor: "#ffffff" }}>
        {/* Background shapes mimicking the uploaded design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <svg width="794" height="250" viewBox="0 0 794 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L794,0 L794,185 L540,185 L500,215 L280,240 L0,185 Z" fill="#cbd5e1" />
            <path d="M0,0 L794,0 L794,180 L542,180 L502,210 L280,235 L0,180 Z" fill="#061b40" />
            <path d="M0,178 L280,233 L500,208 L540,178 L794,178" stroke="#1b3a70" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex w-full h-full pt-8 px-10">
          {/* Left: Logo & Brand */}
          <div className="flex flex-col items-center w-1/2 mt-2">
            <div className="flex gap-4 items-center pl-10">
              <div className="relative w-[130px] h-[150px] flex items-center justify-center">
                {/* Fallback shield logo if no logo.png */}
                <div className="absolute inset-0 border-4 border-slate-300 shadow-xl rounded-b-full" style={{ background: "linear-gradient(to bottom, #134e9e, #0a2353)", clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)" }}></div>
                <div className="absolute inset-2 border-2 border-slate-400 rounded-b-full" style={{ clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)" }}></div>
                <img
                  src="/logo.png"
                  alt="IQ Iron Fitness"
                  className="w-24 h-24 object-contain z-10 filter drop-shadow-md brightness-110 contrast-125"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="z-10 absolute flex flex-col items-center justify-center text-white font-black text-2xl tracking-tighter" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>
                  <span className="-mb-1">IQ</span>
                  <Dumbbell size={24} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center -ml-4 mt-6">
                <h1 className="text-[34px] font-black tracking-widest text-white leading-none" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
                  {BUSINESS.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px w-8" style={{ backgroundColor: "#60a5fa" }}></div>
                  <p className="text-blue-300 font-semibold tracking-widest text-[9px] uppercase">
                    {BUSINESS.tagline}
                  </p>
                  <div className="h-px w-8" style={{ backgroundColor: "#60a5fa" }}></div>
                </div>
                <div className="flex gap-2 mt-2 text-white">
                  ★ ★ ★
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tax Invoice Details */}
          <div className="flex flex-col items-end w-1/2 pr-4 pt-2">
            <div className="px-10 py-2 rounded-l-full shadow-lg -mr-14 pr-16 relative flex items-center" style={{ backgroundColor: "#1253a6", borderBottom: "1px solid #60a5fa" }}>
               <div className="absolute right-0 top-0 w-8 h-full" style={{ backgroundColor: "#1253a6" }}></div>
               <span className="text-xl font-bold tracking-widest text-white relative z-10">TAX INVOICE</span>
            </div>
            
            <div className="mt-8 space-y-3 text-sm text-white">
              <div className="flex items-center gap-4">
                <FileText size={16} className="text-blue-300" />
                <span className="w-20 text-blue-200">Invoice No</span>
                <span>:</span>
                <span className="font-bold tracking-wide w-24 text-right">{invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-4">
                <CalendarDays size={16} className="text-blue-300" />
                <span className="w-20 text-blue-200">Date</span>
                <span>:</span>
                <span className="font-bold tracking-wide w-24 text-right">{invoiceDate}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} className="text-blue-300" />
                <span className="w-20 text-blue-200">Due Date</span>
                <span>:</span>
                <span className="font-bold tracking-wide w-24 text-right">{dueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FROM / BILL TO SECTION --- */}
      <div className="px-12 py-2 mt-2">
        <div className="flex justify-between">
          
          {/* FROM */}
          <div className="w-[45%] text-[11px] space-y-1">
            <h2 className="font-bold text-xs uppercase mb-1" style={{ color: "#1253a6" }}>FROM</h2>
            <h3 className="font-extrabold text-slate-900 text-sm">{BUSINESS.name}</h3>
            
            <div className="flex items-start gap-2 pt-1 text-slate-700">
              <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: "#1253a6" }} />
              <p className="leading-tight">{BUSINESS.addressLine1}<br/>{BUSINESS.addressLine2}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-1 text-slate-700">
              <Phone size={12} className="shrink-0" style={{ color: "#1253a6" }} />
              <p>{BUSINESS.phone}</p>
            </div>
            
            <div className="flex items-center gap-2 text-slate-700">
              <Mail size={12} className="shrink-0" style={{ color: "#1253a6" }} />
              <p>{BUSINESS.email}</p>
            </div>
            
            <div className="flex items-center gap-2 text-slate-700">
              <Globe size={12} className="shrink-0" style={{ color: "#1253a6" }} />
              <p>{BUSINESS.website}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-1 text-slate-700 font-bold">
              <Building2 size={12} className="shrink-0" style={{ color: "#1253a6" }} />
              <p>GSTIN: {BUSINESS.gstin}</p>
            </div>
          </div>

          <div className="w-px bg-slate-200"></div>

          {/* BILL TO */}
          <div className="w-[45%] text-[11px] space-y-1 pl-4">
            <h2 className="font-bold text-xs uppercase mb-1" style={{ color: "#1253a6" }}>BILL TO</h2>
            <h3 className="font-extrabold text-slate-900 text-sm">{memberName}</h3>
            
            <div className="flex items-start gap-2 pt-1 text-slate-700">
              <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: "#1253a6" }} />
              <p className="leading-tight">{memberAddress1}<br/>{memberAddress2}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-1 text-slate-700">
              <Phone size={12} className="shrink-0" style={{ color: "#1253a6" }} />
              <p>{memberPhone}</p>
            </div>
            
            <div className="flex items-center gap-2 text-slate-700">
              <Mail size={12} className="shrink-0" style={{ color: "#1253a6" }} />
              <p>{memberEmail}</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="px-10 mt-6 mb-8 relative z-10">
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white text-[10px] font-bold tracking-wider" style={{ backgroundColor: "#061b40" }}>
                <th className="py-2.5 px-4 text-center border-r border-slate-600 w-12">#</th>
                <th className="py-2.5 px-4 border-r border-slate-600">DESCRIPTION</th>
                <th className="py-2.5 px-4 text-center border-r border-slate-600 w-24">HSN / SAC</th>
                <th className="py-2.5 px-4 text-center border-r border-slate-600 w-16">QTY</th>
                <th className="py-2.5 px-4 text-right border-r border-slate-600 w-28">UNIT PRICE (₹)</th>
                <th className="py-2.5 px-4 text-right w-28">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {/* Main Membership Row */}
              <tr className="border-b border-dashed border-slate-300 last:border-b-0" style={{ backgroundColor: "rgba(248, 250, 252, 0.3)" }}>
                <td className="py-3.5 px-4 text-center border-r border-dashed border-slate-300 font-semibold text-slate-600">
                  1
                </td>
                <td className="py-3.5 px-4 border-r border-dashed border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-white rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#1253a6" }}>
                        <Dumbbell size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{member.membership_type || "Monthly"} Gym Membership</p>
                      <p className="text-slate-500 text-[10px]">Membership valid for selected period</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center border-r border-dashed border-slate-300 text-slate-600">
                  999799
                </td>
                <td className="py-3.5 px-4 text-center border-r border-dashed border-slate-300 text-slate-600">
                  1
                </td>
                <td className="py-3.5 px-4 text-right border-r border-dashed border-slate-300 text-slate-700">
                  {taxableAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-900 font-semibold">
                  {taxableAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </td>
              </tr>

              {/* Conditional Personal Training Row */}
              {member.has_personal_trainer && (
                <tr className="border-b border-dashed border-slate-300 last:border-b-0" style={{ backgroundColor: "rgba(248, 250, 252, 0.3)" }}>
                  <td className="py-3.5 px-4 text-center border-r border-dashed border-slate-300 font-semibold text-slate-600">
                    2
                  </td>
                  <td className="py-3.5 px-4 border-r border-dashed border-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 text-white rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#1253a6" }}>
                          <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Personal Training</p>
                        <p className="text-slate-500 text-[10px]">Trainer: {member.trainer_name || "Assigned"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center border-r border-dashed border-slate-300 text-slate-600">
                    999799
                  </td>
                  <td className="py-3.5 px-4 text-center border-r border-dashed border-slate-300 text-slate-600">
                    1
                  </td>
                  <td className="py-3.5 px-4 text-right border-r border-dashed border-slate-300 text-slate-700">
                    -
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 font-semibold">
                    Included
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAYMENT & TOTALS SECTION --- */}
      <div className="px-10 mt-6 flex justify-between gap-6">
        
        {/* PAYMENT METHODS */}
        <div className="w-[45%] relative mt-3 rounded-xl border border-slate-300 p-4 pt-6" style={{ backgroundColor: "#f8fafc" }}>
          <div className="absolute -top-3.5 left-0 text-white text-[11px] font-bold px-4 py-1 rounded-br-xl" style={{ backgroundColor: "#1253a6" }}>
            PAYMENT METHODS
          </div>
          
          <div className="flex justify-between h-full">
            <div className="space-y-4 text-[10px] text-slate-700 w-3/5 pr-2">
              <div className="flex gap-2">
                <div className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#1253a6" }}><QrCode size={14}/></div>
                <div>
                  <p className="font-bold text-slate-900">UPI</p>
                  <p>iqironfitness@upi</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#1253a6" }}><Landmark size={14}/></div>
                <div>
                  <p className="font-bold text-slate-900">Bank Transfer</p>
                  <p>IQ Iron Fitness</p>
                  <p>A/c No: 1234 5678 9012</p>
                  <p>IFSC: HDFC0001234</p>
                  <p>HDFC Bank, Kothrud, Pune</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#1253a6" }}><CreditCard size={14}/></div>
                <div>
                  <p className="font-bold text-slate-900">Card / Net Banking</p>
                  <p>We accept all major cards and net banking</p>
                </div>
              </div>
            </div>
            
            <div className="w-2/5 flex flex-col items-center justify-center border-l border-slate-200 pl-4">
              <p className="text-[10px] font-bold mb-2 uppercase tracking-wide" style={{ color: "#1253a6" }}>SCAN TO PAY</p>
              <div className="p-2 border border-slate-300 rounded-lg shadow-sm" style={{ backgroundColor: "#ffffff" }}>
                <div className="w-[90px] h-[90px] flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
                   <QRCode value="upi://pay?pa=iqironfitness@upi" size={90} />
                </div>
              </div>
              <p className="text-[9px] text-slate-500 mt-2 font-medium">UPI ID: iqironfitness@upi</p>
            </div>
          </div>
        </div>

        {/* TOTALS */}
        <div className="w-[50%] rounded-xl border border-slate-200 overflow-hidden flex flex-col" style={{ backgroundColor: "#f4f7fb" }}>
          <div className="p-4 text-[11px] font-bold text-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <span>SUBTOTAL</span>
              <span>₹ {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600">
              <span>DISCOUNT</span>
              <span>- ₹ {discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span>TAXABLE AMOUNT</span>
              <span>₹ {taxableAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            {igst > 0 ? (
              <div className="flex justify-between items-center" style={{ color: "#1253a6" }}>
                <span>IGST (18%)</span>
                <span>₹ {igst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center" style={{ color: "#1253a6" }}>
                  <span>CGST (9%)</span>
                  <span>₹ {cgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center" style={{ color: "#1253a6" }}>
                  <span>SGST (9%)</span>
                  <span>₹ {sgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-auto">
            <div className="text-white flex justify-between items-center px-4 py-3" style={{ backgroundColor: "#061b40" }}>
              <span className="font-bold text-xs tracking-wider">TOTAL AMOUNT</span>
              <div className="flex items-center">
                <span className="text-xl font-bold">₹ {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-slate-300 text-center" style={{ backgroundColor: "#eef2f6" }}>
              <p className="text-[9px] mb-0.5" style={{ color: "#1253a6" }}>Amount In Words:</p>
              <p className="text-[10px] font-bold italic" style={{ color: "#061b40" }}>{amountInWordsText}</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- TERMS & SIGNATURE SECTION --- */}
      <div className="px-10 mt-10 flex justify-between items-end relative z-10">
        <div className="w-[45%]">
          <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#1253a6" }}>TERMS & CONDITIONS</h4>
          <ul className="text-[9px] text-slate-700 space-y-1 list-disc list-inside font-medium">
            <li>This invoice is computer generated and does not require signature.</li>
            <li>Payment to be made before the due date to avoid late fees.</li>
            <li>Membership once purchased is non-refundable and non-transferable.</li>
            <li>Please carry a valid ID card during all gym visits.</li>
            <li>For any queries, contact us at {BUSINESS.phone}.</li>
          </ul>
        </div>
        
        <div className="w-[50%] flex justify-between items-end px-4">
          <div className="flex flex-col items-center">
            <div className="w-[85px] h-[85px] relative flex items-center justify-center -rotate-12 opacity-80">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-slate-500">
                 <path id="curve" fill="transparent" d="M 15,50 A 35,35 0 1,1 85,50 A 35,35 0 1,1 15,50" />
                 <text width="100" className="text-[12px] font-bold uppercase tracking-widest" fill="currentColor">
                   <textPath href="#curve" startOffset="50%" textAnchor="middle">IQ IRON FITNESS</textPath>
                 </text>
                 <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" />
               </svg>
               <div className="flex flex-col items-center justify-center text-slate-500 mt-2">
                 <span className="text-[11px] font-black leading-none">PUNE</span>
                 <span className="text-[6px] font-bold tracking-widest mt-0.5">MAHARASHTRA</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Mock signature */}
            <div className="h-10 w-32 border-b border-slate-400 relative">
               <svg className="absolute bottom-1 w-full h-8 opacity-80" viewBox="0 0 100 30">
                  <path d="M10,20 Q30,-10 40,25 T60,10 T80,25" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <path d="M30,22 Q50,0 60,20" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <line x1="20" y1="28" x2="90" y2="15" stroke="#0f172a" strokeWidth="1" />
               </svg>
            </div>
            <p className="text-[9px] font-bold text-slate-800 mt-2">Authorised Signatory</p>
            <p className="text-[9px] font-bold" style={{ color: "#1253a6" }}>{BUSINESS.name}</p>
          </div>
        </div>
      </div>

      {/* --- FOOTER BANNER --- */}
      <div className="absolute bottom-0 w-full">
        <div className="text-slate-300 text-[9px] py-3 px-10 flex justify-between items-center border-b-[3px] border-[#0a1e3f]" style={{ backgroundColor: "#12366b" }}>
          <div className="flex items-center gap-1.5">
            <MapPin size={10} className="text-white shrink-0"/>
            <span>123, Power House Road,<br/>Kothrud, Pune - 411038</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={10} className="text-white shrink-0"/>
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail size={10} className="text-white shrink-0"/>
            <span>info@iqironfitness.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe size={10} className="text-white shrink-0"/>
            <span>www.iqironfitness.com</span>
          </div>
        </div>
        <div className="text-white text-xs font-bold tracking-[0.2em] py-3 flex justify-center items-center gap-4" style={{ backgroundColor: "#061b40" }}>
          <Dumbbell size={14} className="text-blue-400" />
          THANK YOU FOR CHOOSING IQ IRON FITNESS
          <Dumbbell size={14} className="text-blue-400" />
        </div>
      </div>

    </div>
  );
}
