"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import InvoiceTemplate from "@/components/InvoiceTemplate";

function InvoicePreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Fallback to mock data if no Supabase
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
          }
        ];
        const m = mockMembers.find((m) => m.id === id) || mockMembers[0]; // fallback to first if not found in mock
        setMember(m);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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
    if (id || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      fetchMember();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading perfect invoice for printing...
      </div>
    );
  }

  if (!member) {
    return <div className="p-8 text-center text-red-500">Member not found.</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen print:bg-white flex flex-col items-center p-4 print:p-0 overflow-x-auto print:block">
      {/* Screen-only action bar */}
      <div className="w-full max-w-[794px] flex items-center justify-between mb-4 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0b337c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => router.push(`/print/${member.id}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0b337c] text-white text-sm font-semibold hover:bg-[#031d4f] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Ready
        </button>
      </div>

      {/* Mobile scaling wrapper (only scales on screen, prints at 100%) */}
      <div className="origin-top transform scale-[0.5] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 print:scale-100 transition-transform print:transform-none">
        <div className="w-[794px] max-w-full min-h-[1123px] bg-white shadow-2xl print:shadow-none print:w-full print:min-h-0">
          <InvoiceTemplate member={member} />
        </div>
      </div>
    </div>
  );
}

export default function InvoicePreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading invoice viewer...</div>}>
      <InvoicePreviewContent />
    </Suspense>
  );
}
