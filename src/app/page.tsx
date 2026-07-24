import React from 'react';
import Header from '@/components/Header';
import Metrics from '@/components/Metrics';
import TablePanel from '@/components/TablePanel';
import Dialogs from '@/components/Dialogs';

import { CRMProvider } from '@/context/CRMContext';

export default function Home() {
  return (
    <CRMProvider>
      <div className="app">
        <Header />
        <Metrics />
        <TablePanel />
        <Dialogs />
        <footer className="app-footer">
          <div className="footer-left">IQ Iron Fitness CRM</div>
          <div className="footer-center">
            {/* Removed extra button */}
          </div>
          <div className="footer-right">Live Sync • Supabase</div>
        </footer>
      </div>
    </CRMProvider>
  );
}
