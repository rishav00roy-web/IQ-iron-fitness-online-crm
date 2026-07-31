"use client";
import React, { useMemo } from "react";
import { useCRM } from "@/context/CRMContext";

export default function Metrics() {
  const { members, setActiveTab, settings } = useCRM();

  const currency = settings?.system?.currency || "₹";

  const getCurrencyDetails = (symbol: string) => {
    switch (symbol) {
      case "$": return { code: "USD", locale: "en-US" };
      case "€": return { code: "EUR", locale: "en-IE" };
      case "£": return { code: "GBP", locale: "en-GB" };
      case "₹":
      default:
        return { code: "INR", locale: "en-IN" };
    }
  };

  const formatMetricCurrency = (amount: number, symbol: string) => {
    const { code, locale } = getCurrencyDetails(symbol);
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount) || 0);
  };

  const stats = useMemo(() => {
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let pendingDues = 0;
    let pendingCount = 0;
    let birthdays = 0;

    const today = new Date().toISOString().slice(0, 10);
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const nextWeek = in7Days.toISOString().slice(0, 10);
    const now = new Date();

    members.forEach(m => {
      // Expiry status
      if (!m.expiry_date) {
        active++;
      } else if (m.expiry_date >= today && m.expiry_date <= nextWeek) {
        expiring++;
        active++;
      } else if (m.expiry_date >= today) {
        active++;
      } else {
        expired++;
      }

      // Dues
      if (m.pending_amount > 0) {
        pendingDues += m.pending_amount;
        pendingCount++;
      }

      // Birthdays
      if (m.dob) {
        const dobDate = new Date(m.dob);
        if (dobDate.getMonth() === now.getMonth() && dobDate.getDate() === now.getDate()) {
          birthdays++;
        }
      }
    });

    return {
      total: members.length,
      active,
      expiring,
      expired,
      pendingDues,
      pendingCount,
      birthdays
    };
  }, [members]);


  return (
    <>
      <section className="metrics-grid">
        <div className="metric-card --total">
          <div className="metric-top">
            <span className="metric-label">Total Members</span>
            <div className="metric-icon --total">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div className="metric-value" id="m-total">{stats.total}</div>
          <div className="metric-sub" id="m-total-sub">Registered</div>
        </div>
        <div className="metric-card --active js-metric-tab" data-tab="active" style={{ cursor: 'pointer' }} title="View Active members" onClick={() => setActiveTab('active')}>
          <div className="metric-top">
            <span className="metric-label">Active</span>
            <div className="metric-icon --active">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div className="metric-value" id="m-active">{stats.active}</div>
          <div className="metric-sub">Current memberships</div>
        </div>
        <div className="metric-card --expiring js-metric-tab" data-tab="expiring" style={{ cursor: 'pointer' }} title="View Expiring members" onClick={() => setActiveTab('expiring')}>
          <div className="metric-top">
            <span className="metric-label">Expiring Soon</span>
            <div className="metric-icon --expiring">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div className="metric-value" id="m-expiring">{stats.expiring}</div>
          <div className="metric-sub" id="m-expiring-sub">Next 7 days</div>
        </div>
        <div className="metric-card --expired js-metric-tab" data-tab="expired" style={{ cursor: 'pointer' }} title="View Expired members" onClick={() => setActiveTab('expired')}>
          <div className="metric-top">
            <span className="metric-label">Expired</span>
            <div className="metric-icon --expired">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>
            </div>
          </div>
          <div className="metric-value" id="m-expired">{stats.expired}</div>
          <div className="metric-sub">Lapsed memberships</div>
        </div>
        <div className="metric-card --dues js-metric-tab" data-tab="dues" style={{ cursor: 'pointer' }} title="View members with Dues" onClick={() => setActiveTab('dues')}>
          <div className="metric-top">
            <span className="metric-label">Pending Dues</span>
            <div className="metric-icon --dues">
              <span>{currency}</span>
            </div>
          </div>
          <div className="metric-value" id="m-dues-val">{formatMetricCurrency(stats.pendingDues, currency)}</div>
          <div className="metric-sub" id="m-dues-sub">{stats.pendingCount} members pending</div>
        </div>
        <div className="metric-card --birthday js-metric-tab" data-tab="birthdays" style={{ cursor: 'pointer' }} title="View Birthday members" onClick={() => setActiveTab('birthdays')}>
          <div className="metric-top">
            <span className="metric-label">Birthdays</span>
            <div className="metric-icon --birthday">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><path d="M4 16h16"></path><path d="M10 9V5a2 2 0 0 1 4 0v4"></path><circle cx="12" cy="3" r="1"></circle></svg>
            </div>
          </div>
          <div className="metric-value" id="m-bday">{stats.birthdays}</div>
          <div className="metric-sub" id="m-bday-sub">Today</div>
        </div>
      </section>
    </>
  );
}
