"use client";
import React from 'react';
import Header from '@/components/Header';
import Metrics from '@/components/Metrics';
import TablePanel from '@/components/TablePanel';
import Dialogs from '@/components/Dialogs';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { CRMProvider, useCRM } from '@/context/CRMContext';

function AppContent() {
  const { selectedMember } = useCRM();
  
  return (
    <div className="app">
      <Header />
      <Metrics />
      <TablePanel />
      <Dialogs />
      {/* Hidden invoice for PDF generation */}
      <div style={{ position: 'fixed', top: '200vh', left: 0, pointerEvents: 'none' }}>
        <InvoiceTemplate member={selectedMember} />
      </div>
      <footer className="app-footer">
        <div className="footer-left">IQ Iron Fitness CRM</div>
        <div className="footer-center">
        </div>
        <div className="footer-right">Live Sync • Supabase</div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}
