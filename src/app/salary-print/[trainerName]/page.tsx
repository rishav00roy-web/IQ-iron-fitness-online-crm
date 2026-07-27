"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import EmployeeSalaryTemplate from "@/components/EmployeeSalaryTemplate";

export default function PrintSalaryPage() {
  const { trainerName } = useParams();
  const searchParams = useSearchParams();
  const decodedTrainerName = decodeURIComponent(trainerName as string);
  const basicPay = Number(searchParams.get("basicPay")) || 0;
  
  const [ptClients, setPtClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Fallback to mock data if no Supabase
        const mockMembers = [
          {
            id: "1", name: "Raj Sharma", has_personal_trainer: true, trainer_name: "Rahul", total_fee: 1500
          },
          {
            id: "3", name: "Amit Kumar", has_personal_trainer: true, trainer_name: "Vikram", total_fee: 12000
          },
          {
            id: "5", name: "Vikram Malhotra", has_personal_trainer: true, trainer_name: "Rahul", total_fee: 7000
          }
        ];
        const clients = mockMembers.filter(
          (m) => m.has_personal_trainer && m.trainer_name === decodedTrainerName
        );
        setPtClients(clients);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("has_personal_trainer", true)
          .eq("trainer_name", decodedTrainerName);

        if (error) throw error;
        setPtClients(data || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    }

    if (decodedTrainerName) {
      fetchClients();
    }
  }, [decodedTrainerName]);

  useEffect(() => {
    if (!loading) {
      // Small delay to ensure images/fonts are painted before printing
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading salary slip for printing...</div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen print:bg-white flex flex-col items-center p-4 print:p-0 overflow-x-auto print:block">
      {/* Mobile scaling wrapper (only scales on screen, prints at 100%) */}
      <div className="origin-top transform scale-[0.5] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 print:scale-100 transition-transform print:transform-none">
        <div className="w-[794px] max-w-full min-h-[1123px] bg-white shadow-2xl print:shadow-none print:w-full print:min-h-0">
          <EmployeeSalaryTemplate 
            trainerName={decodedTrainerName} 
            basicPay={basicPay} 
            ptClients={ptClients} 
          />
        </div>
      </div>
    </div>
  );
}
