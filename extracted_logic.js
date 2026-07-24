
/* IQ Iron Fitness CRM — app.js v3
   Final: custom broadcast dialog, dynamic currency, premium polish
*/

// ─── State ─────────────────────────────────────────────────────────────────
const state = {
  members: [],
  trainers: [],
  templates: { expiry: '', dues: '', birthday: '', welcome: '' },
  settings: { currency: '₹', countryCode: '+91', expiryDays: 7 },
  tab: 'all',
  query: '',
  sortBy: 'smart',
  sortDir: 'asc',
  isSearching: false,
};

const MEMBERSHIP_MONTHS = { monthly: 1, quarterly: 3, half_yearly: 6, yearly: 12 };
const MEMBERSHIP_LABELS = { monthly: 'Monthly', quarterly: 'Quarterly', half_yearly: 'Half Yearly', yearly: 'Yearly' };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const esc = (s = '') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');

function dateOffset(days) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}
function todayISO() { return new Date().toISOString().slice(0,10); }
function isoOffset(hours) {
  const d = new Date(); d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function formatISODateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function calcExpiry(startDateStr, membershipType) {
  if (!startDateStr || !membershipType) return '';
  const months = MEMBERSHIP_MONTHS[membershipType] || 1;
  const parts = String(startDateStr).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return '';
  const [year, month, day] = parts;
  const lastTargetDay = new Date(year, month - 1 + months + 1, 0).getDate();
  const d = new Date(year, month - 1 + months, Math.min(day, lastTargetDay));
  return formatISODateLocal(d);
}

// ─── Default Data ───────────────────────────────────────────────────────────
const DEFAULT_TRAINERS = ['Arjun Singh', 'Priya Nair', 'Rahul Verma'];

const DEFAULT_MEMBERS = [
  {
    id: 'm1', name: 'Aarav Sharma', phone: '9876543210',
    dob: '1995-05-28', membershipType: 'monthly',
    startDate: dateOffset(-20), expiryDate: dateOffset(10),
    hasPersonalTrainer: false, trainerName: '',
    totalFee: 1500, payments: [{ amount: 1500, date: dateOffset(-20), note: 'Full payment' }],
    pendingAmount: 0, lastContacted: null
  },
  {
    id: 'm2', name: 'Sarah Jenkins', phone: '+91 91234 56789',
    dob: '1998-01-15', membershipType: 'quarterly',
    startDate: dateOffset(-80), expiryDate: dateOffset(10),
    hasPersonalTrainer: true, trainerName: 'Arjun Singh',
    totalFee: 4500, payments: [{ amount: 2000, date: dateOffset(-80), note: 'First instalment' }],
    pendingAmount: 2500, lastContacted: isoOffset(-2)
  },
  {
    id: 'm3', name: 'Rajesh Patel', phone: '9988776655',
    dob: '1994-08-22', membershipType: 'monthly',
    startDate: dateOffset(-35), expiryDate: dateOffset(-5),
    hasPersonalTrainer: false, trainerName: '',
    totalFee: 1500, payments: [
      { amount: 1000, date: dateOffset(-35), note: 'First instalment' },
    ],
    pendingAmount: 500, lastContacted: isoOffset(-48)
  },
  {
    id: 'm4', name: 'Emma Watson', phone: '9871234560',
    dob: '1996-12-10', membershipType: 'yearly',
    startDate: dateOffset(-30), expiryDate: dateOffset(335),
    hasPersonalTrainer: true, trainerName: 'Priya Nair',
    totalFee: 12000, payments: [{ amount: 12000, date: dateOffset(-30), note: 'Full payment' }],
    pendingAmount: 0, lastContacted: null
  },
  {
    id: 'm5', name: 'Vikram Malhotra', phone: '9876501234',
    dob: '1991-03-05', membershipType: 'half_yearly',
    startDate: dateOffset(-200), expiryDate: dateOffset(-20),
    hasPersonalTrainer: false, trainerName: '',
    totalFee: 6000, payments: [{ amount: 6000, date: dateOffset(-200), note: 'Full payment' }],
    pendingAmount: 0, lastContacted: null
  },
];

const DEFAULT_TEMPLATES = {
  expiry: `Dear {{name}},

Your {{membership_type}} membership at IQ Iron Fitness expires on {{expiry_date}}.

Please renew at your earliest convenience to continue training without interruption.

— IQ Iron Fitness Team`,
  dues: `Dear {{name}},

You have an outstanding balance of {{due_amount}}.

Please clear this to keep your membership active. Thank you for being part of IQ Iron Fitness.`,
  birthday: `Dear {{name}},

Happy Birthday from the entire IQ Iron Fitness team!

Wishing you a year of strength, health, and success. See you on the floor!`,
  welcome: `Hi {{name}}!

Welcome to IQ Iron Fitness — we're thrilled to have you on board!

Your {{membership_type}} membership started on {{start_date}} and runs until {{expiry_date}}.{{trainer_line}}

If you ever need help, have questions, or just want to know the class schedule, feel free to reach out anytime.

See you on the floor — let's crush it!

— IQ Iron Fitness Team`,
};

// ─── LocalStorage ───────────────────────────────────────────────────────────
function load() {
  try {
    const m = localStorage.getItem('iqiron_members');
    const tr = localStorage.getItem('iqiron_trainers');
    const t = localStorage.getItem('iqiron_templates');
    const s = localStorage.getItem('iqiron_settings');
    state.members   = m  ? JSON.parse(m)  : [...DEFAULT_MEMBERS];
    state.trainers  = tr ? JSON.parse(tr) : [...DEFAULT_TRAINERS];
    state.templates = t  ? JSON.parse(t)  : { ...DEFAULT_TEMPLATES };
    // Backfill welcome template for existing installs
    if (!state.templates.welcome) state.templates.welcome = DEFAULT_TEMPLATES.welcome;
    state.settings  = s  ? JSON.parse(s)  : { currency: '₹', countryCode: '+91', expiryDays: 7 };
    state.settings.currency = '₹';
    save('settings');
    state.members.forEach(m => {
      if (!m.name) m.name = 'Unnamed';
      if (!m.phone) m.phone = '';
      if (!m.membershipType) m.membershipType = 'monthly';
      if (m.hasPersonalTrainer === undefined) m.hasPersonalTrainer = false;
      if (!m.trainerName) m.trainerName = '';
      if (!Array.isArray(m.payments)) {
        m.payments = m.pendingAmount !== undefined
          ? [{ amount: (m.totalFee || 0) - (m.pendingAmount || 0), date: m.startDate || todayISO(), note: 'Migrated' }]
          : [];
      }
      if (!m.totalFee) m.totalFee = 0;
      if (!m.startDate) m.startDate = m.expiryDate ? dateOffset(-30) : todayISO();
      if (m.renewalStreak === undefined) m.renewalStreak = 0;
      if (m.notes === undefined) m.notes = '';
      m.pendingAmount = calcBalance(m);
    });
    if (!m) save('members');
    if (!tr) save('trainers');
    if (!t) save('templates');
    if (!s) save('settings');
    updateCurrencySymbols();
  } catch(e) {
    state.members = [...DEFAULT_MEMBERS];
    state.trainers = [...DEFAULT_TRAINERS];
    state.templates = { ...DEFAULT_TEMPLATES };
    toast('Storage error — changes may not persist.', 'danger');
  }
}

function save(key) {
  try {
    if (!key || key === 'members')   localStorage.setItem('iqiron_members',   JSON.stringify(state.members));
    if (!key || key === 'trainers')  localStorage.setItem('iqiron_trainers',  JSON.stringify(state.trainers));
    if (!key || key === 'templates') localStorage.setItem('iqiron_templates', JSON.stringify(state.templates));
    if (!key || key === 'settings')  localStorage.setItem('iqiron_settings',  JSON.stringify(state.settings));
  } catch(e) { toast('Auto-save failed.', 'danger'); }
}

// ─── Payment helpers ────────────────────────────────────────────────────────
function calcBalance(member) {
  const paid = (member.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  return Math.max(0, (parseFloat(member.totalFee) || 0) - paid);
}

function totalPaid(member) {
  return (member.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
}

function toMoney(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const n = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

function readImportValue(row, keys, fallback = '') {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
  }
  return fallback;
}

function normalizeBool(value) {
  if (value === true) return true;
  const v = String(value || '').trim().toLowerCase();
  return ['yes', 'y', 'true', '1'].includes(v);
}

function normalizeMembershipType(value) {
  const v = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (MEMBERSHIP_MONTHS[v]) return v;
  if (v.includes('quarter')) return 'quarterly';
  if (v.includes('half')) return 'half_yearly';
  if (v.includes('year')) return 'yearly';
  return 'monthly';
}

function normalizePayments(value) {
  if (Array.isArray(value)) {
    return value.map(p => ({
      amount: toMoney(p.amount),
      date: p.date || todayISO(),
      note: p.note || 'Imported payment'
    })).filter(p => p.amount > 0);
  }
  if (typeof value === 'string' && value.trim()) {
    try { return normalizePayments(JSON.parse(value)); }
    catch(e) { return []; }
  }
  return [];
}

function normalizeImportedMember(row) {
  const name = String(readImportValue(row, ['name', 'fullname'], 'Unnamed')).trim() || 'Unnamed';
  const phone = sanitizePhone(readImportValue(row, ['phone', 'whatsapp', 'whatsappnumber'], ''));
  const totalFee = toMoney(readImportValue(row, ['totalFee', 'totalfee', 'fee'], 0));
  const pendingRaw = readImportValue(row, ['pendingAmount', 'pendingamount', 'balance', 'balancedue', 'pendingdues'], null);
  const pendingAmount = pendingRaw === null ? null : toMoney(pendingRaw, 0);
  const amountPaid = toMoney(readImportValue(row, ['amountPaid', 'amountpaid', 'paid', 'paidamount'], ''), NaN);
  let payments = normalizePayments(readImportValue(row, ['payments'], []));

  if (!payments.length) {
    let paid = Number.isFinite(amountPaid) ? amountPaid : 0;
    if (!paid && pendingAmount !== null) paid = Math.max(0, totalFee - pendingAmount);
    if (paid > 0) payments = [{ amount: paid, date: readImportValue(row, ['startDate', 'startdate'], todayISO()), note: 'Imported payment' }];
  }

  const adjustedTotal = totalFee > 0 ? totalFee : (pendingAmount !== null ? pendingAmount + totalPaid({ payments }) : 0);
  const cleaned = {
    id: readImportValue(row, ['id'], '') || 'm' + Date.now() + Math.random().toString(36).slice(2,7),
    name,
    phone,
    dob: readImportValue(row, ['dob', 'dateofbirth'], '1998-01-01'),
    membershipType: normalizeMembershipType(readImportValue(row, ['membershipType', 'membershiptype', 'plan'], 'monthly')),
    startDate: readImportValue(row, ['startDate', 'startdate'], dateOffset(-30)),
    expiryDate: readImportValue(row, ['expiryDate', 'expirydate', 'expiry'], dateOffset(0)),
    hasPersonalTrainer: normalizeBool(readImportValue(row, ['hasPersonalTrainer', 'haspt', 'personaltrainer'], false)),
    trainerName: String(readImportValue(row, ['trainerName', 'trainername', 'trainer'], '')).trim(),
    totalFee: adjustedTotal,
    payments,
    pendingAmount: 0,
    lastContacted: readImportValue(row, ['lastContacted', 'lastcontacted'], null),
    renewalStreak: parseInt(readImportValue(row, ['renewalStreak', 'renewalstreak', 'streak'], 0)) || 0,
    notes: String(readImportValue(row, ['notes', 'internalnotes'], '') || ''),
  };
  cleaned.pendingAmount = calcBalance(cleaned);
  return cleaned;
}

// ─── Status Logic ─────────────────────────────────────────────────────────────
function getStatus(expiryStr) {
  if (!expiryStr) return 'expired';
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(expiryStr); exp.setHours(0,0,0,0);
  if (isNaN(exp)) return 'expired';
  const diff = Math.ceil((exp - today) / 86400000);
  if (diff < 0) return 'expired';
  if (diff <= (parseInt(state.settings.expiryDays) || 7)) return 'expiring';
  return 'active';
}

function isBdayToday(dob) {
  if (!dob) return false;
  const d = new Date(dob);
  if (isNaN(d)) return false;
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
}

function isBdaySoon(dob) {
  if (!dob) return false;
  const d = new Date(dob);
  if (isNaN(d)) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  let bday = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  if (bday < today) bday.setFullYear(today.getFullYear() + 1);
  const diff = Math.ceil((bday - today) / 86400000);
  return diff >= 0 && diff <= 7;
}

function fmtDate(str) {
  if (!str) return 'N/A';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtRelative(iso) {
  if (!iso) return '<span class="never-text">Never</span>';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff/86400000)}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function fmtCurrency(val) {
  return `${state.settings.currency}${Math.round(parseFloat(val)||0).toLocaleString('en-IN')}`;
}

function updateCurrencySymbols() {
  document.querySelectorAll('.currency-prefix').forEach(el => {
    el.textContent = state.settings.currency;
  });
}

// ─── Filtering & Sorting ────────────────────────────────────────────────────
function getFiltered() {
  const q = state.query.trim().toLowerCase();
  return state.members.filter(m => {
    const status = getStatus(m.expiryDate);
    if (state.tab === 'active'    && status !== 'active')   return false;
    if (state.tab === 'expiring'  && status !== 'expiring') return false;
    if (state.tab === 'expired'   && status !== 'expired')  return false;
    if (state.tab === 'dues'      && (m.pendingAmount || 0) <= 0) return false;
    if (state.tab === 'pt'        && !m.hasPersonalTrainer) return false;
    if (state.tab === 'birthdays' && !isBdaySoon(m.dob))   return false;
    if (!q) return true;
    const name = String(m.name || '').toLowerCase();
    const phone = String(m.phone || '');
    const digits = phone.replace(/\D/g,'');
    return (
      name.includes(q) ||
      digits.includes(q.replace(/\D/g,'')) ||
      phone.toLowerCase().includes(q) ||
      (m.trainerName || '').toLowerCase().includes(q)
    );
  });
}

function getSmartPriority(m) {
  const status = getStatus(m.expiryDate);
  if (status === 'expiring') return 0;
  if (status === 'expired')  return 1;
  if (isBdaySoon(m.dob))     return 2;
  if ((m.pendingAmount || 0) > 0) return 3;
  return 4;
}

function getSorted(list) {
  if (state.sortBy === 'smart') {
    return [...list].sort((a, b) => {
      const pa = getSmartPriority(a), pb = getSmartPriority(b);
      if (pa !== pb) return pa - pb;
      if (pa === 0 || pa === 1) return (a.expiryDate || '') < (b.expiryDate || '') ? -1 : 1;
      return String(a.name || '').toLowerCase() < String(b.name || '').toLowerCase() ? -1 : 1;
    });
  }
  return [...list].sort((a, b) => {
    let fa, fb;
    if (state.sortBy === 'name')   { fa = String(a.name || '').toLowerCase(); fb = String(b.name || '').toLowerCase(); }
    if (state.sortBy === 'expiry') { fa = a.expiryDate || ''; fb = b.expiryDate || ''; }
    if (state.sortBy === 'dues')   { fa = parseFloat(a.pendingAmount||0); fb = parseFloat(b.pendingAmount||0); }
    if (fa < fb) return state.sortDir === 'asc' ? -1 : 1;
    if (fa > fb) return state.sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

// ─── Phone ──────────────────────────────────────────────────────────────────
function cleanPhone(phone) {
  let c = String(phone || '').replace(/[^\d+]/g, '');
  if (c.startsWith('+')) c = c.slice(1);
  if (c.length === 10 && state.settings.countryCode)
    c = state.settings.countryCode.replace(/\D/g,'') + c;
  return c;
}

function sanitizePhone(p) {
  return (p || '').trim().replace(/[^0-9\s\-+()/]/g,'');
}

// ─── Template Compiler ────────────────────────────────────────────────────────
function compileTemplate(text, member) {
  if (!text) return '';
  const trainerLine = (member.hasPersonalTrainer && member.trainerName)
    ? `\nYour personal trainer is ${member.trainerName} — reach out to them to schedule your first session.`
    : '';
  return text
    .replace(/{{name}}/g, member.name || '')
    .replace(/{{expiry_date}}/g, fmtDate(member.expiryDate))
    .replace(/{{start_date}}/g, fmtDate(member.startDate))
    .replace(/{{due_amount}}/g, fmtCurrency(member.pendingAmount || 0))
    .replace(/{{membership_type}}/g, MEMBERSHIP_LABELS[member.membershipType] || 'Monthly')
    .replace(/{{trainer_name}}/g, member.trainerName || 'your trainer')
    .replace(/{{trainer_line}}/g, trainerLine);
}

// ─── Trainer Select Population ────────────────────────────────────────────────
function populateTrainerSelects() {
  ['add-trainer-name', 'edit-trainer-name'].forEach(selId => {
    const sel = $(selId);
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">— Select Trainer —</option>';
    state.trainers.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  });
}

// ─── Rendering ──────────────────────────────────────────────────────────────
function renderMetrics() {
  let active = 0, expiring = 0, expired = 0, duesCount = 0, duesSum = 0, bdayToday = 0, bdaySoon = 0;
  state.members.forEach(m => {
    const s = getStatus(m.expiryDate);
    if (s === 'active')   active++;
    if (s === 'expiring') expiring++;
    if (s === 'expired')  expired++;
    const d = parseFloat(m.pendingAmount || 0);
    if (d > 0) { duesCount++; duesSum += d; }
    if (isBdayToday(m.dob)) bdayToday++;
    else if (isBdaySoon(m.dob)) bdaySoon++;
  });

  $('m-total').textContent     = state.members.length;
  $('m-active').textContent    = active;
  $('m-expiring').textContent  = expiring;
  $('m-expired').textContent   = expired;
  $('m-expiring-sub').textContent = `Next ${state.settings.expiryDays} days`;
  $('m-dues-val').textContent  = fmtCurrency(duesSum);
  $('m-dues-sub').textContent  = `${duesCount} member${duesCount!==1?'s':''} pending`;
  $('m-bday').textContent      = bdayToday;
  $('m-bday-sub').textContent  = bdayToday > 0 ? `Celebrating today 🎉` : `${bdaySoon} upcoming this week`;

  const footerStats = $('footer-stats');
  if (footerStats) {
    const ptCount = state.members.filter(m => m.hasPersonalTrainer).length;
    footerStats.textContent = `${state.members.length} members · ${ptCount} with PT · ${state.trainers.length} trainers`;
  }
}

function renderTabs() {
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === state.tab)
  );
}

function renderSortArrows() {
  ['name','expiry','dues'].forEach(col => {
    const el = $(`sort-${col}`);
    const th = document.querySelector(`th[data-sort="${col}"]`);
    if (!el || !th) return;
    if (state.sortBy === col) {
      el.textContent = state.sortDir === 'asc' ? '▲' : '▼';
      th.classList.add('sorted');
    } else {
      el.textContent = '↕';
      th.classList.remove('sorted');
    }
  });
  const smartEl = $('sort-smart');
  const smartTh = document.querySelector('th[data-sort="smart"]');
  if (smartEl && smartTh) {
    smartTh.classList.toggle('sorted', state.sortBy === 'smart');
    smartEl.textContent = state.sortBy === 'smart' ? '⚡' : '↕';
  }
}

function renderTable() {
  const tbody = $('table-body');
  const empty = $('empty-state');
  const cur = state.settings.currency;
  const rows = getSorted(getFiltered());

  if (rows.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    $('empty-title').textContent = state.members.length === 0 ? 'No Members Yet' : 'No Matching Results';
    $('empty-text').textContent  = state.members.length === 0 ? 'Add your first member or import a CSV list.' : 'Try a different search or tab filter.';
    return;
  }

  empty.style.display = 'none';

  const html = rows.map(m => {
    const status   = getStatus(m.expiryDate);
    const balance  = parseFloat(m.pendingAmount || 0);
    const bday     = isBdayToday(m.dob);
    const bdayIcon = bday ? '<span class="bday-icon">🎂</span>' : '';
    const paid     = totalPaid(m);
    const total    = parseFloat(m.totalFee || 0);
    const payPct   = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 100;

    let badgeClass = 'badge-active', badgeText = 'Active';
    if (bday)              { badgeClass = 'badge-birthday'; badgeText = 'Birthday'; }
    else if (status === 'expiring') { badgeClass = 'badge-expiring'; badgeText = 'Expiring'; }
    else if (status === 'expired')  { badgeClass = 'badge-expired';  badgeText = 'Expired'; }

    let waBtnClass = 'renewal', waBtnText = 'Renewal';
    if (bday)      { waBtnClass = 'birthday'; waBtnText = 'Wish'; }
    else if (balance > 0) { waBtnClass = 'dues'; waBtnText = 'Dues'; }

    const trainerCell = m.hasPersonalTrainer && m.trainerName
      ? `<span class="trainer-badge">${esc(m.trainerName)}</span>`
      : `<span class="no-trainer">—</span>`;

    const balanceCell = balance > 0
      ? `<button class="balance-btn danger js-view-payments" data-id="${m.id}" title="View payments">
           ${cur}${Math.round(balance).toLocaleString('en-IN')}
           <span class="pay-pct">${payPct}% paid</span>
         </button>`
      : `<span class="balance-clear">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><polyline points="20 6 9 17 4 12"/></svg>
           Paid
         </span>`;

    const streakBadge = (m.renewalStreak > 0)
      ? `<span class="streak-badge" title="${m.renewalStreak} renewal${m.renewalStreak!==1?'s':''} streak">🔥${m.renewalStreak}</span>`
      : '';

    return `<tr>
      <td>
        <span class="member-name js-view-drawer" data-id="${m.id}" style="cursor:pointer;">${esc(m.name)}${bdayIcon}${streakBadge}</span>
      </td>
      <td><span class="member-phone">${esc(m.phone)}</span></td>
      <td><span class="plan-badge plan-${m.membershipType||'monthly'}">${MEMBERSHIP_LABELS[m.membershipType]||'Monthly'}</span></td>
      <td>${trainerCell}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td><input type="date" class="cell-date js-expiry-change" data-id="${m.id}" value="${m.expiryDate || ''}"></td>
      <td>${balanceCell}</td>
      <td><span class="contacted-text" id="ct-${m.id}">${fmtRelative(m.lastContacted)}</span></td>
      <td style="text-align:center;">
        <button class="wa-btn ${waBtnClass} js-dispatch" data-id="${m.id}" data-type="${bday ? 'birthday' : balance > 0 ? 'dues' : 'expiry'}">
          <svg viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
          ${waBtnText}
        </button>
      </td>
      <td style="text-align:center;">
        <div class="row-actions">
          <button class="icon-btn js-edit-member" data-id="${m.id}" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="icon-btn delete js-delete-member" data-id="${m.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  tbody.innerHTML = html;

  // Animate only a small number of rows; Chrome can stutter when many rows animate together.
  if (!state.isSearching) {
    tbody.querySelectorAll('tr').forEach((tr, i) => {
      if (i > 14) return;
      tr.style.animationDelay = `${i * 15}ms`;
      tr.classList.add('row-animate');
    });
  }
}

function renderSettings() {
  $('s-currency').value     = state.settings.currency;
  $('s-country-code').value = state.settings.countryCode;
  $('s-expiry-days').value  = state.settings.expiryDays;
  updateCurrencySymbols();
}

function renderPreview() {
  const type = $('tpl-select').value;
  const text = state.templates[type] || '';
  $('tpl-editor').value = text;
  const preview = $('tpl-preview');
  const compiled = compileTemplate(text, {
    name: 'Rahul Kumar', expiryDate: dateOffset(5), startDate: todayISO(),
    pendingAmount: 3000, membershipType: 'monthly', trainerName: 'Arjun Singh',
    hasPersonalTrainer: true,
  });
  if (compiled.trim()) {
    preview.textContent = compiled;
  } else {
    preview.innerHTML = '<span class="preview-empty">Start typing to preview…</span>';
  }
}

function renderTrainerList() {
  const list = $('trainer-list');
  if (!list) return;
  if (!state.trainers.length) {
    list.innerHTML = '<p style="color:var(--text-3);font-size:0.82rem;text-align:center;padding:1rem 0;">No trainers added yet.</p>';
    return;
  }
  list.innerHTML = state.trainers.map((t, i) =>
    `<div class="trainer-item">
      <span>${esc(t)}</span>
      <button class="icon-btn delete js-remove-trainer" data-idx="${i}" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>`
  ).join('');
}

function renderAll() {
  renderMetrics();
  renderTabs();
  renderSortArrows();
  renderTable();
}

// ─── Payment Ledger (edit dialog) ────────────────────────────────────────────
function renderEditPaymentLedger(member) {
  const el = $('edit-payment-ledger');
  if (!el) return;
  const cur = state.settings.currency;
  if (!member.payments || !member.payments.length) {
    el.innerHTML = '<p style="color:var(--text-3);font-size:0.78rem;margin-bottom:0.75rem;">No payments recorded.</p>';
  } else {
    el.innerHTML = `
      <div class="ledger-table">
        <div class="ledger-header">
          <span>Date</span><span>Amount</span><span>Note</span>
        </div>
        ${member.payments.map((p, i) => `
          <div class="ledger-row">
            <span>${fmtDate(p.date)}</span>
            <span class="ledger-amount">${cur}${Math.round(p.amount).toLocaleString('en-IN')}</span>
            <span class="ledger-note">${esc(p.note || '—')}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  const balance = calcBalance(member);
  $('edit-balance').value = Math.round(balance);
}

// ─── Payment History Dialog ──────────────────────────────────────────────────
function openPaymentsDialog(member) {
  $('pay-dialog-name').textContent = member.name;
  $('pay-dialog-sub').textContent = `${MEMBERSHIP_LABELS[member.membershipType]||'Monthly'} · ${member.hasPersonalTrainer ? 'PT: '+member.trainerName : 'No PT'}`;
  const cur = state.settings.currency;
  const paid = totalPaid(member);
  const balance = calcBalance(member);
  const total = parseFloat(member.totalFee || 0);
  const pct = total > 0 ? Math.min(100, Math.round((paid/total)*100)) : 100;

  $('pay-summary-bar').innerHTML = `
    <div class="pay-summary-items">
      <div class="pay-summary-item">
        <span class="pay-summary-label">Total Fee</span>
        <span class="pay-summary-val">${fmtCurrency(total)}</span>
      </div>
      <div class="pay-summary-item">
        <span class="pay-summary-label">Total Paid</span>
        <span class="pay-summary-val green">${fmtCurrency(paid)}</span>
      </div>
      <div class="pay-summary-item">
        <span class="pay-summary-label">Balance Due</span>
        <span class="pay-summary-val ${balance > 0 ? 'red' : 'green'}">${fmtCurrency(balance)}</span>
      </div>
    </div>
    <div class="pay-progress-wrap">
      <div class="pay-progress-bar">
        <div class="pay-progress-fill" style="width:${pct}%"></div>
      </div>
      <span class="pay-progress-label">${pct}% collected</span>
    </div>
  `;

  const list = $('pay-history-list');
  if (!member.payments || !member.payments.length) {
    list.innerHTML = '<p style="color:var(--text-3);font-size:0.82rem;text-align:center;padding:2rem 0;">No payment records.</p>';
  } else {
    list.innerHTML = member.payments.map(p => `
      <div class="pay-history-item">
        <div class="pay-history-left">
          <span class="pay-history-amount">${fmtCurrency(p.amount)}</span>
          <span class="pay-history-note">${esc(p.note || 'Payment')}</span>
        </div>
        <span class="pay-history-date">${fmtDate(p.date)}</span>
      </div>
    `).join('');
  }

  openDialog('dialog-payments');
}

// ─── Broadcast Dialog ───────────────────────────────────────────────────────
function openBroadcastDialog(member, type) {
  // Contextual dialog title
  const titleEl = $('broadcast-dialog-title');
  if (type === 'welcome') {
    titleEl.innerHTML = 'Welcome Message — <span id="broadcast-member-name">' + esc(member.name) + '</span>';
  } else {
    titleEl.innerHTML = 'Message — <span id="broadcast-member-name">' + esc(member.name) + '</span>';
  }
  const sub = `${MEMBERSHIP_LABELS[member.membershipType] || 'Monthly'} · ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  $('broadcast-member-sub').textContent = sub;

  // Ensure welcome template is never blank — fall back to default if missing
  const tplText = state.templates[type] || DEFAULT_TEMPLATES[type] || '';
  const compiled = compileTemplate(tplText, member);
  $('broadcast-message').value = compiled;
  $('btn-send-broadcast').dataset.memberId = member.id;
  $('btn-send-broadcast').dataset.type = type;
  openDialog('dialog-broadcast');
}

// ─── Dialog Helpers ─────────────────────────────────────────────────────────
function openDialog(id) {
  const d = $(id);
  if (!d) return;
  d.classList.remove('closing');
  d.showModal();
}
function closeDialog(id) {
  const d = $(id);
  if (!d) return;
  d.classList.add('closing');
  d.addEventListener('animationend', () => {
    d.classList.remove('closing');
    d.close();
  }, { once: true });
}

// ─── WhatsApp ───────────────────────────────────────────────────────────────
function dispatch(member, type, customText) {
  const text = customText || compileTemplate(state.templates[type] || '', member);
  const phone = cleanPhone(member.phone);
  if (!phone || phone.length < 7) { toast(`Invalid phone for ${member.name}.`, 'danger'); return; }
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  member.lastContacted = new Date().toISOString();
  save('members');
  const el = $(`ct-${member.id}`);
  if (el) el.innerHTML = fmtRelative(member.lastContacted);
  toast(`WhatsApp opened for ${member.name}`, 'success');
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const icons = { success: '✓', info: 'i', warning: '⚠', danger: '✕' };
  const container = $('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'✓'}</span><span class="toast-msg">${esc(msg)}</span>`;
  container.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 320); }, 3800);
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportCSV() {
  if (!state.members.length) { toast('No members to export.', 'warning'); return; }
  const csvCell = (v = '') => `"${String(v ?? '').replace(/"/g,'""')}"`;
  let csv = 'Name,Phone,DOB,Membership Type,Start Date,Expiry Date,Has PT,Trainer,Total Fee,Amount Paid,Balance,Last Contacted,Renewal Streak,Notes\r\n';
  state.members.forEach(m => {
    const paid = totalPaid(m);
    csv += [
      csvCell(m.name), csvCell(m.phone), csvCell(m.dob || ''), csvCell(m.membershipType || 'monthly'),
      csvCell(m.startDate || ''), csvCell(m.expiryDate || ''), csvCell(m.hasPersonalTrainer ? 'Yes' : 'No'),
      csvCell(m.trainerName || ''), m.totalFee || 0, paid, m.pendingAmount || 0,
      csvCell(m.lastContacted || ''), m.renewalStreak || 0, csvCell(m.notes || '')
    ].join(',') + '\r\n';
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = `IQIron_Members_${todayISO()}.csv`;
  a.click();
  toast('CSV exported.', 'success');
  resetNudge();
}

// ─── Import ───────────────────────────────────────────────────────────────────
function handleImport(e) {
  const file = e.target.files[0]; if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      let imported = [];
      if (ext === 'json') {
        const p = JSON.parse(ev.target.result);
        if (!Array.isArray(p)) throw new Error('Must be array');
        imported = p;
      } else {
        imported = parseCSV(ev.target.result);
      }
      if (!imported.length) { toast('No records found.', 'danger'); return; }
      let added = 0, updated = 0;
      imported.forEach(row => {
        const cleaned = normalizeImportedMember(row);
        const phone = cleaned.phone.replace(/\D/g,'');
        const idx = phone ? state.members.findIndex(m => String(m.phone || '').replace(/\D/g,'') === phone) : -1;
        if (idx !== -1) { state.members[idx] = cleaned; updated++; }
        else { state.members.push(cleaned); added++; }
      });
      save('members'); renderAll(); trackChange();
      toast(`Imported: ${added} added, ${updated} updated`, 'success');
    } catch(err) { toast('Import failed — check file format.', 'danger'); }
    e.target.value = '';
  };
  reader.readAsText(file);
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const parseLine = (line) => {
    const cells = []; let inQ = false, cur = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { cells.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  };
  const normalizeHeader = h => h.replace(/['"]/g,'').trim().toLowerCase().replace(/\s+/g,'');
  const headers = parseLine(lines[0] || '').map(normalizeHeader);
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim(); if (!line) continue;
    const cells = parseLine(line);
    if (cells.length < 2) continue;
    const row = {};
    headers.forEach((h, idx) => { if (h) row[h] = cells[idx] || ''; });
    if (!row.name) row.name = cells[0] || 'Unnamed';
    if (!row.phone) row.phone = cells[1] || '';
    result.push(row);
  }
  return result;
}

// ─── Event Setup ──────────────────────────────────────────────────────────────

// ─── Broadcast All ────────────────────────────────────────────────────────────
function getBroadcastAllTargets(filter) {
  return state.members.filter(m => {
    if (filter === 'all')      return true;
    const status = getStatus(m.expiryDate);
    if (filter === 'active')   return status === 'active';
    if (filter === 'expiring') return status === 'expiring';
    if (filter === 'expired')  return status === 'expired';
    if (filter === 'dues')     return (m.pendingAmount || 0) > 0;
    return true;
  });
}

function updateBroadcastAllCount(filter) {
  const count = getBroadcastAllTargets(filter).length;
  const el = $('broadcast-all-count');
  if (el) el.textContent = count + ' member' + (count !== 1 ? 's' : '') + ' match this reference filter. WhatsApp recipient is chosen manually.';
}

function debounce(fn, ms) {
  let t;
  return function(...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); };
}

function setupEvents() {

  // Search — debounced + isSearching flag suppresses row animation while typing
  const _renderTable = debounce(renderTable, 120);
  $('search-input').addEventListener('input', e => {
    state.query = e.target.value;
    state.isSearching = true;
    _renderTable();
  });

  // Tabs — clear isSearching so tab switches still get the animation
  document.querySelector('.tabs').addEventListener('click', e => {
    const tab = e.target.closest('.tab'); if (!tab) return;
    state.isSearching = false;
    state.tab = tab.dataset.tab; renderTabs(); renderTable();
  });

  // Sort headers
  document.querySelector('.data-table thead').addEventListener('click', e => {
    const th = e.target.closest('th.sortable'); if (!th) return;
    const field = th.dataset.sort;
    if (field === 'smart') { state.sortBy = 'smart'; }
    else if (state.sortBy === field) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    else { state.sortBy = field; state.sortDir = 'asc'; }
    renderSortArrows(); renderTable();
  });

  // Table delegation
  const tbody = $('table-body');

  tbody.addEventListener('click', e => {
    const dispBtn  = e.target.closest('.js-dispatch');
    const editBtn  = e.target.closest('.js-edit-member');
    const delBtn   = e.target.closest('.js-delete-member');
    const payBtn   = e.target.closest('.js-view-payments');

    if (dispBtn) {
      const m = state.members.find(x => x.id === dispBtn.dataset.id);
      if (m) openBroadcastDialog(m, dispBtn.dataset.type);
    }
    if (editBtn) {
      const m = state.members.find(x => x.id === editBtn.dataset.id);
      if (m) openEditDialog(m);
    }
    if (delBtn) {
      const m = state.members.find(x => x.id === delBtn.dataset.id);
      if (m) openDeleteDialog(m);
    }
    if (payBtn) {
      const m = state.members.find(x => x.id === payBtn.dataset.id);
      if (m) openPaymentsDialog(m);
    }
  });

  tbody.addEventListener('change', e => {
    const el = e.target;
    if (el.classList.contains('js-expiry-change')) {
      const m = state.members.find(x => x.id === el.dataset.id);
      if (!m) return;
      m.expiryDate = el.value; save('members'); renderMetrics();
      const row = el.closest('tr');
      const badge = row.querySelector('.badge');
      if (badge && !isBdayToday(m.dob)) {
        const s = getStatus(el.value);
        badge.className = `badge ${s === 'expiring' ? 'badge-expiring' : s === 'expired' ? 'badge-expired' : 'badge-active'}`;
        badge.textContent = s === 'expiring' ? 'Expiring' : s === 'expired' ? 'Expired' : 'Active';
      }
      toast(`Expiry updated for ${m.name}`, 'info');
    }
  });

  // Close dialogs
  document.addEventListener('click', e => {
    const btn = e.target.closest('.close-dialog');
    if (btn) closeDialog(btn.dataset.dialog);
  });
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  });

  // ── ADD MEMBER ──
  $('btn-add-member').addEventListener('click', () => {
    $('form-add').reset();
    const today = todayISO();
    $('add-start-date').value = today;
    $('add-expiry').value = calcExpiry(today, 'monthly');
    $('add-dob').value = '1998-06-15';
    populateTrainerSelects();
    $('add-trainer-group').style.display = 'none';
    openDialog('dialog-add');
  });

  // Auto-calc expiry in Add dialog
  function updateAddExpiry() {
    const start = $('add-start-date').value;
    const type  = $('add-membership-type').value;
    if (start && type) $('add-expiry').value = calcExpiry(start, type);
  }
  $('add-start-date').addEventListener('change', updateAddExpiry);
  $('add-membership-type').addEventListener('change', updateAddExpiry);

  // Auto-calc balance in Add dialog
  function updateAddBalance() {
    const total = parseFloat($('add-total-fee').value) || 0;
    const paid  = parseFloat($('add-paid-now').value) || 0;
    $('add-balance').value = Math.max(0, total - paid);
  }
  $('add-total-fee').addEventListener('input', updateAddBalance);
  $('add-paid-now').addEventListener('input', updateAddBalance);

  // PT toggle in Add
  $('add-has-pt').addEventListener('change', e => {
    $('add-trainer-group').style.display = e.target.value === 'yes' ? 'flex' : 'none';
  });

  // Add submit
  $('btn-add-submit').addEventListener('click', () => {
    const name   = $('add-name').value.trim();
    const phone  = $('add-phone').value.trim();
    const dob    = $('add-dob').value;
    const type   = $('add-membership-type').value;
    const start  = $('add-start-date').value;
    const expiry = $('add-expiry').value;
    const hasPT  = $('add-has-pt').value === 'yes';
    const trainer = hasPT ? $('add-trainer-name').value : '';
    const total  = parseFloat($('add-total-fee').value) || 0;
    const paidNow = parseFloat($('add-paid-now').value) || 0;
    const notes  = $('add-notes').value.trim();

    if (!name || !phone || !dob || !start) {
      toast('Please fill all required fields.', 'danger'); return;
    }
    if (paidNow > total) {
      toast('Paid amount cannot exceed total fee.', 'danger'); return;
    }

    const payments = [];
    if (paidNow > 0) payments.push({ amount: paidNow, date: todayISO(), note: 'Initial payment' });

    const newMember = {
      id: 'm' + Date.now(),
      name, phone: sanitizePhone(phone), dob,
      membershipType: type, startDate: start, expiryDate: expiry,
      hasPersonalTrainer: hasPT, trainerName: trainer,
      totalFee: total, payments,
      pendingAmount: Math.max(0, total - paidNow),
      lastContacted: null,
      renewalStreak: 0,
      notes,
    };
    state.members.push(newMember);
    save('members'); renderAll(); trackChange();
    closeDialog('dialog-add');
    toast(`Added: ${name} — sending welcome message…`, 'success');
    setTimeout(() => openBroadcastDialog(newMember, 'welcome'), 250);
  });

  // ── EDIT MEMBER ──
  $('edit-has-pt').addEventListener('change', e => {
    $('edit-trainer-group').style.display = e.target.value === 'yes' ? 'flex' : 'none';
  });

  $('edit-total-fee').addEventListener('input', () => {
    const id = $('edit-id').value;
    const m  = state.members.find(x => x.id === id);
    if (!m) return;
    const total = parseFloat($('edit-total-fee').value) || 0;
    const paid  = totalPaid({ payments: m.payments, totalFee: total });
    $('edit-balance').value = Math.max(0, total - paid);
  });

  $('btn-edit-submit').addEventListener('click', () => {
    const id      = $('edit-id').value;
    const name    = $('edit-name').value.trim();
    const phone   = $('edit-phone').value.trim();
    const dob     = $('edit-dob').value;
    const type    = $('edit-membership-type').value;
    const start   = $('edit-start-date').value;
    const expiry  = $('edit-expiry').value;
    const hasPT   = $('edit-has-pt').value === 'yes';
    const trainer = hasPT ? $('edit-trainer-name').value : '';
    const total   = parseFloat($('edit-total-fee').value) || 0;
    const addPay  = parseFloat($('edit-add-payment').value) || 0;
    const streak  = parseInt($('edit-streak').value) || 0;
    const notes   = $('edit-notes').value.trim();

    if (!name || !phone) { toast('Name and phone are required.', 'danger'); return; }

    const idx = state.members.findIndex(m => m.id === id);
    if (idx === -1) { toast('Member not found.', 'danger'); return; }

    const m = state.members[idx];
    const alreadyPaid = totalPaid(m);
    if (alreadyPaid + addPay > total) {
      toast('Payment cannot exceed total fee.', 'danger'); return;
    }
    if (addPay > 0) {
      m.payments.push({ amount: addPay, date: todayISO(), note: 'Additional payment' });
    }

    Object.assign(m, {
      name, phone: sanitizePhone(phone), dob,
      membershipType: type, startDate: start, expiryDate: expiry,
      hasPersonalTrainer: hasPT, trainerName: trainer,
      totalFee: total,
      renewalStreak: streak, notes,
    });
    m.pendingAmount = calcBalance(m);

    save('members'); renderAll(); trackChange();
    closeDialog('dialog-edit');
    toast(`Updated: ${name}`, 'success');
  });

  // Delete confirm
  $('btn-delete-confirm').addEventListener('click', () => {
    const id = $('btn-delete-confirm').dataset.targetId;
    const m  = state.members.find(x => x.id === id);
    state.members = state.members.filter(x => x.id !== id);
    save('members'); renderAll(); trackChange();
    closeDialog('dialog-delete');
    toast(`Deleted: ${m ? m.name : 'Member'}`, 'warning');
  });

  // ── BROADCAST SEND ──
  $('btn-send-broadcast').addEventListener('click', () => {
    const id = $('btn-send-broadcast').dataset.memberId;
    const type = $('btn-send-broadcast').dataset.type;
    const m = state.members.find(x => x.id === id);
    if (!m) return;
    const text = $('broadcast-message').value.trim();
    if (!text) { toast('Message cannot be empty.', 'warning'); return; }
    dispatch(m, type, text);
    closeDialog('dialog-broadcast');
  });

  // ── BROADCAST ALL ──
  $('btn-broadcast-all').addEventListener('click', () => {
    const filter = $('broadcast-all-filter') ? $('broadcast-all-filter').value : 'all';
    updateBroadcastAllCount(filter);
    openDialog('dialog-broadcast-all');
  });

  $('broadcast-all-filter').addEventListener('change', e => {
    updateBroadcastAllCount(e.target.value);
  });

  $('btn-send-broadcast-all').addEventListener('click', () => {
    const msg = $('broadcast-all-message').value.trim();
    if (!msg) { toast('Please enter a message.', 'warning'); return; }

    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    closeDialog('dialog-broadcast-all');
    toast('WhatsApp opened. Choose the group or contact there.', 'success');
  });


  // ── TRAINERS ──
  $('btn-manage-trainers').addEventListener('click', () => {
    renderTrainerList(); openDialog('dialog-trainers');
  });

  $('btn-add-trainer').addEventListener('click', () => {
    const val = $('new-trainer-name').value.trim();
    if (!val) { toast('Enter a trainer name.', 'warning'); return; }
    if (state.trainers.includes(val)) { toast('Trainer already exists.', 'warning'); return; }
    state.trainers.push(val); save('trainers');
    $('new-trainer-name').value = '';
    renderTrainerList(); populateTrainerSelects();
    toast(`Trainer added: ${val}`, 'success');
  });

  $('trainer-list').addEventListener('click', e => {
    const btn = e.target.closest('.js-remove-trainer'); if (!btn) return;
    const idx = parseInt(btn.dataset.idx);
    const name = state.trainers[idx];
    state.trainers.splice(idx, 1); save('trainers');
    state.members.forEach(m => {
      if (m.trainerName === name) { m.trainerName = ''; m.hasPersonalTrainer = false; }
    });
    save('members'); renderAll(); renderTrainerList(); populateTrainerSelects();
    toast(`Removed trainer: ${name}`, 'warning');
  });

  // ── SETTINGS ──
  $('btn-settings').addEventListener('click', () => {
    renderSettings(); renderPreview(); openDialog('dialog-settings');
  });

  $('tpl-select').addEventListener('change', renderPreview);
  $('tpl-editor').addEventListener('input', e => {
    state.templates[$('tpl-select').value] = e.target.value;
    save('templates'); renderPreview();
  });

  document.querySelectorAll('.pills').forEach(pills => {
    pills.addEventListener('click', e => {
      const pill = e.target.closest('.pill'); if (!pill) return;
      const editor = $('tpl-editor');
      const insert = pill.dataset.var;
      const s = editor.selectionStart, end = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + insert + editor.value.slice(end);
      editor.focus();
      editor.setSelectionRange(s + insert.length, s + insert.length);
      state.templates[$('tpl-select').value] = editor.value;
      save('templates'); renderPreview();
    });
  });

  $('s-country-code').addEventListener('input', e => {
    let v = e.target.value.trim();
    if (v && !v.startsWith('+')) v = '+' + v;
    state.settings.countryCode = v; save('settings');
  });
  $('s-expiry-days').addEventListener('input', e => {
    const v = parseInt(e.target.value);
    state.settings.expiryDays = v > 0 ? v : 7; save('settings'); renderMetrics(); renderTable();
  });

  // Export / Import
  $('btn-export-csv').addEventListener('click', exportCSV);
  $('btn-import-trigger').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', handleImport);
}

// ─── Open Edit Dialog ───────────────────────────────────────────────────────
function openEditDialog(m) {
  populateTrainerSelects();
  $('edit-id').value              = m.id;
  $('edit-name').value            = m.name;
  $('edit-phone').value           = m.phone;
  $('edit-dob').value             = m.dob || '1998-01-01';
  $('edit-membership-type').value = m.membershipType || 'monthly';
  $('edit-start-date').value      = m.startDate || '';
  $('edit-expiry').value          = m.expiryDate || '';
  $('edit-has-pt').value          = m.hasPersonalTrainer ? 'yes' : 'no';
  $('edit-trainer-group').style.display = m.hasPersonalTrainer ? 'flex' : 'none';
  $('edit-trainer-name').value    = m.trainerName || '';
  $('edit-total-fee').value       = m.totalFee || 0;
  $('edit-add-payment').value     = 0;
  $('edit-balance').value         = Math.round(calcBalance(m));
  $('edit-streak').value          = m.renewalStreak || 0;
  $('edit-notes').value           = m.notes || '';
  renderEditPaymentLedger(m);
  openDialog('dialog-edit');
}

function openDeleteDialog(m) {
  $('delete-name').textContent = m.name;
  $('btn-delete-confirm').dataset.targetId = m.id;
  openDialog('dialog-delete');
}

// ─── Quick-View Drawer ────────────────────────────────────────────────────────
let drawerMemberId = null;

function openDrawer(member) {
  drawerMemberId = member.id;
  const status   = getStatus(member.expiryDate);
  const balance  = calcBalance(member);
  const paid     = totalPaid(member);
  const bday     = isBdayToday(member.dob);

  $('drawer-name').textContent = member.name;
  $('drawer-meta').textContent =
    `${MEMBERSHIP_LABELS[member.membershipType] || 'Monthly'}` +
    (member.hasPersonalTrainer && member.trainerName ? ` · PT: ${member.trainerName}` : '') +
    (bday ? ' · 🎂 Birthday today!' : '');

  $('drawer-membership').innerHTML = `
    <div class="drawer-field">
      <span class="drawer-field-label">Status</span>
      <span class="drawer-field-val ${status === 'active' ? 'green' : status === 'expiring' ? 'gold' : 'red'}">${bday ? '🎂 Birthday' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Plan</span>
      <span class="drawer-field-val">${MEMBERSHIP_LABELS[member.membershipType] || 'Monthly'}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Started</span>
      <span class="drawer-field-val mono">${fmtDate(member.startDate)}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Expires</span>
      <span class="drawer-field-val mono ${status === 'expired' ? 'red' : status === 'expiring' ? 'gold' : ''}">${fmtDate(member.expiryDate)}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Phone</span>
      <span class="drawer-field-val mono">${esc(member.phone)}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Streak 🔥</span>
      <span class="drawer-field-val gold">${member.renewalStreak || 0} renewal${(member.renewalStreak || 0) !== 1 ? 's' : ''}</span>
    </div>
  `;

  $('drawer-payment').innerHTML = `
    <div class="drawer-field">
      <span class="drawer-field-label">Total Fee</span>
      <span class="drawer-field-val mono">${fmtCurrency(member.totalFee || 0)}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Paid</span>
      <span class="drawer-field-val mono green">${fmtCurrency(paid)}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Balance Due</span>
      <span class="drawer-field-val mono ${balance > 0 ? 'red' : 'green'}">${balance > 0 ? fmtCurrency(balance) : '✓ Cleared'}</span>
    </div>
    <div class="drawer-field">
      <span class="drawer-field-label">Last Contacted</span>
      <span class="drawer-field-val mono">${member.lastContacted ? fmtRelative(member.lastContacted) : 'Never'}</span>
    </div>
  `;

  const notesEl = $('drawer-notes');
  if (member.notes && member.notes.trim()) {
    notesEl.textContent = member.notes;
    notesEl.classList.remove('empty');
  } else {
    notesEl.textContent = 'No notes added.';
    notesEl.classList.add('empty');
  }

  $('drawer-overlay').classList.add('open');
  $('member-drawer').classList.add('open');
}

function closeDrawer() {
  $('drawer-overlay').classList.remove('open');
  $('member-drawer').classList.remove('open');
  drawerMemberId = null;
}

// ─── Export Nudge ─────────────────────────────────────────────────────────────
let changesSinceExport = parseInt(localStorage.getItem('iqiron_changes') || '0');

function trackChange() {
  changesSinceExport++;
  localStorage.setItem('iqiron_changes', changesSinceExport);
  if (changesSinceExport >= 5) {
    $('export-nudge-wrap').style.display = 'inline';
    $('export-nudge-quiet').style.display = 'none';
  }
}

function resetNudge() {
  changesSinceExport = 0;
  localStorage.setItem('iqiron_changes', '0');
  $('export-nudge-wrap').style.display = 'none';
  $('export-nudge-quiet').style.display = 'inline';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  load();
  setupEvents();
  renderAll();
  renderSettings();
  renderPreview();

  // Init nudge state
  if (changesSinceExport >= 5) {
    $('export-nudge-wrap').style.display = 'inline';
    $('export-nudge-quiet').style.display = 'none';
  }

  // Metric card click-through
  document.querySelectorAll('.js-metric-tab').forEach(card => {
    card.addEventListener('click', () => {
      const tab = card.dataset.tab;
      state.tab = tab;
      state.isSearching = false;
      renderAll();
      document.querySelector('.panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Drawer: name click
  document.getElementById('table-body').addEventListener('click', e => {
    const trigger = e.target.closest('.js-view-drawer');
    if (!trigger) return;
    const id = trigger.dataset.id;
    const m = state.members.find(x => x.id === id);
    if (m) openDrawer(m);
  });

  // Drawer: close
  $('drawer-close').addEventListener('click', closeDrawer);
  $('drawer-overlay').addEventListener('click', closeDrawer);

  // Drawer: edit button
  $('drawer-btn-edit').addEventListener('click', () => {
    if (!drawerMemberId) return;
    const m = state.members.find(x => x.id === drawerMemberId);
    if (!m) return;
    closeDrawer();
    setTimeout(() => openEditDialog(m), 180);
  });

  // Drawer: WhatsApp button
  $('drawer-btn-wa').addEventListener('click', () => {
    if (!drawerMemberId) return;
    const m = state.members.find(x => x.id === drawerMemberId);
    if (!m) return;
    const status = getStatus(m.expiryDate);
    const type = isBdayToday(m.dob) ? 'birthday' : m.pendingAmount > 0 ? 'dues' : 'expiry';
    closeDrawer();
    setTimeout(() => openBroadcastDialog(m, type), 180);
  });

  // Export nudge click
  $('export-nudge-btn').addEventListener('click', () => {
    exportCSV();
    resetNudge();
  });
});
