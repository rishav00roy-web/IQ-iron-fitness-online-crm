"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  phone: string;
  dob?: string;
  membership_type: string;
  start_date: string;
  expiry_date: string;
  has_personal_trainer: boolean;
  trainer_id?: string;
  trainer_name?: string; // Virtual property, populated by join
  pt_fee?: number;
  total_fee: number;
  pending_amount: number;
  last_contacted?: string;
  notes?: string;
  renewal_streak: number;
  created_at: string;
};

export type Trainer = {
  id: string;
  name: string;
};

type CRMContextType = {
  members: Member[];
  trainers: Trainer[];
  loading: boolean;
  fetchMembers: () => Promise<void>;
  fetchTrainers: () => Promise<void>;
  addTrainer: (name: string) => Promise<boolean>;
  deleteTrainer: (id: string) => Promise<boolean>;
  
  // UI State
  isAddOpen: boolean;
  setIsAddOpen: (v: boolean) => void;
  isBroadcastOpen: boolean;
  setIsBroadcastOpen: (v: boolean) => void;
  isBroadcastAllOpen: boolean;
  setIsBroadcastAllOpen: (v: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  isTrainersOpen: boolean;
  setIsTrainersOpen: (v: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (v: boolean) => void;
  isPaymentsOpen: boolean;
  setIsPaymentsOpen: (v: boolean) => void;
  selectedMember: Member | null;
  setSelectedMember: (m: Member | null) => void;
  
  // Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
};

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isBroadcastAllOpen, setIsBroadcastAllOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTrainersOpen, setIsTrainersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchTrainers = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setTrainers([
        { id: "t1", name: "Rahul" },
        { id: "t2", name: "Vikram" }
      ]);
      return;
    }
    const { data, error } = await supabase.from('trainers').select('*').order('name');
    if (!error && data) {
      setTrainers(data);
    }
  };

  const addTrainer = async (name: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setTrainers(prev => [...prev, { id: Date.now().toString(), name }]);
      return true;
    }
    const { error } = await supabase.from('trainers').insert([{ name }]);
    if (!error) {
      fetchTrainers();
      return true;
    }
    console.error("Error adding trainer:", error);
    alert("Failed to add trainer. Please check database permissions.");
    return false;
  };

  const deleteTrainer = async (id: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setTrainers(prev => prev.filter(t => t.id !== id));
      return true;
    }
    const { error } = await supabase.from('trainers').delete().eq('id', id);
    if (!error) {
      fetchTrainers();
      return true;
    }
    console.error("Error deleting trainer:", error);
    alert("Failed to delete trainer. Please check database permissions or associated members.");
    return false;
  };

  const fetchMembers = async () => {
    setLoading(true);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn("Supabase not configured locally. Using mock data.");
      setMembers([
        {
          id: "1", name: "Raj Sharma", phone: "9876543210", dob: "1990-05-15",
          membership_type: "Monthly", start_date: "2026-06-25", expiry_date: "2026-07-25",
          has_personal_trainer: true, trainer_id: "t1", trainer_name: "Rahul", pt_fee: 300, total_fee: 1500, pending_amount: 500,
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
          has_personal_trainer: true, trainer_id: "t2", trainer_name: "Vikram", pt_fee: 2400, total_fee: 12000, pending_amount: 0,
          renewal_streak: 1, created_at: "2025-07-20T11:15:00Z"
        },
        {
          id: "4", name: "Neha Singh", phone: "9876501234", dob: "1992-03-30",
          membership_type: "Monthly", start_date: "2026-06-01", expiry_date: "2026-07-01",
          has_personal_trainer: false, total_fee: 1500, pending_amount: 1500,
          renewal_streak: 0, created_at: "2026-06-01T14:45:00Z"
        }
      ]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('members').select('*, trainers(name)').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching members:', error);
    } else {
      const flattenedData = (data || []).map((m: any) => ({
        ...m,
        trainer_name: m.trainers?.name || undefined
      }));
      setMembers(flattenedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrainers();
    fetchMembers();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const channel = supabase
      .channel('public:members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, (payload: any) => {
        console.log('Realtime update:', payload);
        fetchMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <CRMContext.Provider value={{
      members, trainers, loading, fetchMembers, fetchTrainers, addTrainer, deleteTrainer,
      isAddOpen, setIsAddOpen,
      isBroadcastOpen, setIsBroadcastOpen,
      isBroadcastAllOpen, setIsBroadcastAllOpen,
      isEditOpen, setIsEditOpen,
      isTrainersOpen, setIsTrainersOpen,
      isSettingsOpen, setIsSettingsOpen,
      isDeleteOpen, setIsDeleteOpen,
      isPaymentsOpen, setIsPaymentsOpen,
      selectedMember, setSelectedMember,
      searchQuery, setSearchQuery,
      activeTab, setActiveTab
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error("useCRM must be used within CRMProvider");
  return context;
}
