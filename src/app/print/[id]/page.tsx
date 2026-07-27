"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import InvoiceTemplate from "@/components/InvoiceTemplate";

export default function PrintInvoicePage() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      // Small delay to ensure images/fonts are painted before printing
      setTimeout(() => {
        window.print();
      }, 500);
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
      {/* Mobile scaling wrapper (only scales on screen, prints at 100%) */}
      <div className="origin-top transform scale-[0.5] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 print:scale-100 transition-transform print:transform-none">
        <div className="w-[794px] max-w-full min-h-[1123px] bg-white shadow-2xl print:shadow-none print:w-full print:min-h-0">
          <InvoiceTemplate member={member} />
        </div>
      </div>
    </div>
  );
}
