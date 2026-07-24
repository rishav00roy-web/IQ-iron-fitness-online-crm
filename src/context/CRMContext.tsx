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
  trainer_name?: string;
  total_fee: number;
  pending_amount: number;
  last_contacted?: string;
  notes?: string;
  renewal_streak: number;
  created_at: string;
};

type CRMContextType = {
  members: Member[];
  loading: boolean;
  fetchMembers: () => Promise<void>;
  
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

  const fetchMembers = async () => {
    setLoading(true);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn("Supabase not configured locally.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
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
      members, loading, fetchMembers,
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
