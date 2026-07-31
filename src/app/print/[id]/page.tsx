"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

export default function PrintInvoicePage() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [currency, setCurrency] = useState("₹");

  useEffect(() => {
    const saved = localStorage.getItem('gymSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.system?.currency) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCurrency(parsed.system.currency);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const element = document.getElementById("invoice-template");
      const wrapper = document.getElementById("invoice-wrapper");
      
      if (!element) return;

      // Temporarily remove scaling so html-to-image captures at full resolution
      if (wrapper) wrapper.style.transform = "scale(1)";
      
      // html-to-image bypasses custom CSS parsers and relies on the browser,
      // fixing modern CSS issues like Tailwind v4's oklch/lab colors
      
      // Safari/iOS workaround: render multiple times to ensure images and fonts are drawn
      // The first render on iOS often yields a blank image or missing assets.
      if (isIOS) {
        await toJpeg(element, { quality: 1.0, pixelRatio: 2 });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const dataUrl = await toJpeg(element, { 
        quality: 1.0, 
        pixelRatio: 2 
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
      
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    } catch (err: any) {
      console.error("Failed to generate PDF", err);
      alert(`Failed to generate PDF: ${err?.message || err}`);
    } finally {
      const wrapper = document.getElementById("invoice-wrapper");
      if (wrapper) wrapper.style.transform = "";
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    async function fetchMember() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Fallback to mock data if no Supabase (same as CRMContext)
        const mockMembers = [
          {
            id: "1", name: "Raj Sharma", phone: "9876543210", dob: "1990-05-15",
            membership_type: "Monthly", start_date: "2026-06-25", expiry_date: "2026-07-25",
            has_personal_trainer: true, trainer_name: "Rahul", total_fee: 1500, pending_amount: 500,
            renewal_streak: 2, created_at: "2026-06-25T10:00:00Z"
          },
          {
            id: "2", name: "Priya Patel", phone: "9123456789", dob: "1995-08-20",
            membership_type: "Quarterly", start_date: "2026-05-10", expiry_date: "2026-08-10",
            has_personal_trainer: false, total_fee: 4000, pending_amount: 0,
            renewal_streak: 5, created_at: "2026-05-10T09:30:00Z"
          },
          {
            id: "3", name: "Amit Kumar", phone: "9988776655", dob: "1988-12-05",
            membership_type: "Yearly", start_date: "2025-07-20", expiry_date: "2026-07-20",
            has_personal_trainer: true, trainer_name: "Vikram", total_fee: 12000, pending_amount: 0,
            renewal_streak: 1, created_at: "2025-07-20T11:15:00Z"
          },
          {
            id: "4", name: "Neha Singh", phone: "9876501234", dob: "1992-03-30",
            membership_type: "Monthly", start_date: "2026-07-01", expiry_date: "2026-08-01",
            has_personal_trainer: false, total_fee: 1200, pending_amount: 1200,
            renewal_streak: 0, created_at: "2026-07-01T08:45:00Z"
          },
          {
            id: "5", name: "Vikram Malhotra", phone: "9123454321", dob: "1985-11-12",
            membership_type: "Half-Yearly", start_date: "2026-01-15", expiry_date: "2026-07-15",
            has_personal_trainer: true, trainer_name: "Rahul", total_fee: 7000, pending_amount: 0,
            renewal_streak: 3, created_at: "2026-01-15T14:20:00Z"
          }
        ];
        const m = mockMembers.find((m) => m.id === id);
        setMember(m);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setMember(data);
      } catch (err) {
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMember();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && member) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsIOS(isIOSDevice);

      if (!isIOSDevice) {
        // Wait for fonts and images to load before popping the print dialog on Android/Desktop
        const imagePromises = Array.from(document.images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });

        Promise.all([document.fonts.ready, ...imagePromises]).then(() => {
          window.print();
        });
      }
    }
  }, [loading, member]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading perfect invoice for printing...</div>;
  }

  if (!member) {
    return <div className="p-8 text-center text-red-500">Member not found.</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen print:bg-white flex flex-col items-center p-4 print:p-0 overflow-x-auto print:block">
      {/* Floating Action Buttons for Print/Download */}
      <div className="print:hidden flex flex-wrap justify-center gap-4 mb-6 mt-2 sticky top-4 z-50">
        {isIOS && (
          pdfUrl ? (
            <button 
              onClick={async () => {
                const fileName = `Invoice_${member?.name?.replace(/\s+/g, "_") || "Member"}.pdf`;
                if (pdfBlob && navigator.share) {
                  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
                  // navigator.canShare is not supported in older iOS, so we just try to share
                  try {
                    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
                      throw new Error("Cannot share file");
                    }
                    await navigator.share({
                      files: [file],
                      title: fileName,
                    });
                    return;
                  } catch (err: any) {
                    console.log('Share failed or canceled', err);
                    if (err.name !== 'AbortError') {
                      // Fallback if share fails (but not if user just canceled)
                      const a = document.createElement("a");
                      a.href = pdfUrl;
                      a.download = fileName;
                      a.click();
                    }
                  }
                } else {
                  // Fallback
                  const a = document.createElement("a");
                  a.href = pdfUrl;
                  a.download = fileName;
                  a.click();
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full shadow-lg font-bold flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Share / Save PDF
            </button>
          ) : (
            <button 
              onClick={handleGeneratePDF} 
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full shadow-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                 <span className="animate-pulse">Preparing PDF...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Prepare PDF
                </>
              )}
            </button>
          )
        )}
      </div>

      {/* Mobile scaling wrapper (only scales on screen, prints at 100%) */}
      <div id="invoice-wrapper" className="origin-top transform scale-[0.5] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 print:scale-100 transition-transform print:transform-none">
        <div className="w-[794px] max-w-full min-h-[1123px] bg-white shadow-2xl print:shadow-none print:w-full print:min-h-0">
          <InvoiceTemplate member={member} currency={currency} />
        </div>
      </div>
    </div>
  );
}
