/* ==========================================================================
   GIIAS 2026 — Activity Dashboard JavaScript (Crypto Theme)
   ========================================================================== */

'use strict';

/* =========================================================
   BRANDS CONFIG
   ========================================================= */
const BRANDS = [
  { id: 'all', name: 'Semua Brand', abbr: 'ALL', ic: 'ic--all' },
  { id: 'microsite', name: 'Microsite', abbr: 'MIC', ic: 'ic--microsite' },
  { id: 'mlf', name: 'MLF', abbr: 'MLF', ic: 'ic--mlf' },
  { id: 'hyundai', name: 'Hyundai', abbr: 'HYU', ic: 'ic--hyundai', image: '/img/cars/hyundai.png' },
  { id: 'mazda', name: 'Mazda', abbr: 'MZD', ic: 'ic--mazda' },
  { id: 'polytron', name: 'Polytron', abbr: 'PLY', ic: 'ic--polytron' },
  { id: 'jetour', name: 'Jetour', abbr: 'JET', ic: 'ic--jetour' },
  { id: 'vinfast', name: 'Vinfast', abbr: 'VIN', ic: 'ic--vinfast' },
  { id: 'byd', name: 'BYD', abbr: 'BYD', ic: 'ic--byd', image: '/img/cars/byd.png' },
  { id: 'fuso', name: 'Fuso', abbr: 'FUS', ic: 'ic--fuso' },
];

/* =========================================================
   MOCK DATA 
   ========================================================= */
const ACTIVITIES = [
  /* ─── MICROSITE ─── */
  {
    id: 'MIC-001',
    brand: 'microsite',
    title: 'Microsite — Interactive Quiz',
    status: 'active',
    category: 'game',
    entries: [
      { id: 1, name: 'Andi S.', score: 980, phone: 'rp2s4-4pcja-d3ss4', date: '2026-07-24 10:00:00' },
      { id: 2, name: 'Budi W.', score: 850, phone: 'xq9m1-2zbwl-k9pp2', date: '2026-07-24 10:15:00' },
      { id: 3, name: 'Cici K.', score: 920, phone: 'a1b2c-3d4e5-f6g7h', date: '2026-07-24 10:30:00' }
    ]
  },

  /* ─── MLF ─── */
  {
    id: 'MLF-001',
    brand: 'mlf',
    title: 'MLF — Special Funding Promo',
    status: 'upcoming',
    category: 'event',
    entries: []
  },

  /* ─── HYUNDAI ─── */
  {
    id: 'HYU-001',
    brand: 'hyundai',
    title: 'Hyundai — IONIQ 6 Test Drive',
    status: 'active',
    category: 'testdrive',
    entries: [
      { id: 1, name: 'Ahmad Fauzi', score: 85, phone: 'h4x0r-993lz-11qqx', date: '2026-07-24 10:00:00' },
      { id: 2, name: 'Bella Safitri', score: 92, phone: 'j1k2l-3m4n5-o6p7q', date: '2026-07-24 10:30:00' },
      { id: 3, name: 'Cahyo Prabowo', score: 78, phone: 'r8s9t-0u1v2-w3x4y', date: '2026-07-24 11:00:00' },
      { id: 4, name: 'Diah Pertiwi', score: 88, phone: 'z5a6b-7c8d9-e0f1g', date: '2026-07-24 11:30:00' },
      { id: 5, name: 'Erik Hidayat', score: 95, phone: 'h2i3j-4k5l6-m7n8o', date: '2026-07-24 12:00:00' },
    ]
  },

  /* ─── MAZDA ─── */
  {
    id: 'MZD-001',
    brand: 'mazda',
    title: 'Mazda — CX-60 Test Drive Experience',
    status: 'active',
    category: 'testdrive',
    entries: [
      { id: 1, name: 'Rudy Hartono', score: 91, phone: 'p9q0r-1s2t3-u4v5w', date: '2026-07-24 09:00:00' }
    ]
  },

  /* ─── POLYTRON ─── */
  {
    id: 'PLY-001',
    brand: 'polytron',
    title: 'Polytron — Type Race',
    status: 'active',
    category: 'game',
    entries: [
      { id: 11, name: 'Alll', score: 99, phone: 'x6y7z-8a9b0-c1d2e', date: '2026-07-19 19:02:11' },
      { id: 3, name: 'I wanna sleep', score: 82, phone: 'f3g4h-5i6j7-k8l9m', date: '2026-07-17 19:57:45' },
      { id: 7, name: ';-;', score: 75, phone: 'n0o1p-2q3r4-s5t6u', date: '2026-07-18 18:02:11' },
      { id: 10, name: 'LIKE THE WAY', score: 88, phone: 'v7w8x-9y0z1-a2b3c', date: '2026-07-19 18:19:06' },
      { id: 2, name: 'Oyen', score: 85, phone: 'd4e5f-6g7h8-i9j0k', date: '2026-07-17 19:52:28' },
    ]
  },

  /* ─── JETOUR ─── */
  {
    id: 'JET-001',
    brand: 'jetour',
    title: 'Jetour — Dashing Launch',
    status: 'done',
    category: 'launch',
    entries: [
      { id: 1, name: 'Media Oto 1', score: 100, phone: 'l1m2n-3o4p5-q6r7s', date: '2026-07-23 10:00:00' }
    ]
  },

  /* ─── VINFAST ─── */
  {
    id: 'VIN-001',
    brand: 'vinfast',
    title: 'Vinfast — VF 5 Test Drive',
    status: 'active',
    category: 'testdrive',
    entries: [
      { id: 1, name: 'Tono', score: 89, phone: 't8u9v-0w1x2-y3z4a', date: '2026-07-24 10:00:00' }
    ]
  },

  /* ─── BYD ─── */
  {
    id: 'BYD-001',
    brand: 'byd',
    title: 'BYD — Atto 1 Pre-Order',
    status: 'done',
    category: 'launch',
    entries: [
      { id: 1, name: 'Steven Limanto', score: 95, phone: 'b5c6d-7e8f9-g0h1i', date: '2026-07-24 10:05:00' },
      { id: 2, name: 'Jessica Tan', score: 93, phone: 'j2k3l-4m5n6-o7p8q', date: '2026-07-24 10:08:00' },
      { id: 3, name: 'Richard Halim', score: 88, phone: 'r9s0t-1u2v3-w4x5y', date: '2026-07-24 10:12:00' },
    ]
  },

  /* ─── FUSO ─── */
  {
    id: 'FUS-001',
    brand: 'fuso',
    title: 'Fuso — eCanter Demo',
    status: 'active',
    category: 'event',
    entries: [
      { id: 1, name: 'PT Logistik Maju', score: 90, phone: 'z6a7b-8c9d0-e1f2g', date: '2026-07-24 09:00:00' }
    ]
  }
];

/* =========================================================
   STATE
   ========================================================= */
const S = {
  brand: 'all',
  search: '',
  page: 1,
  limit: 8,
  sort: 'date-desc',
  dateFrom: '',
  dateTo: ''
};

/* =========================================================
   DOM refs
   ========================================================= */
let D = {};

function cacheDOM() {
  D.brandSelect = document.getElementById('brand-select');
  D.sortSelect = document.getElementById('sort-select');
  D.filterBtn = document.getElementById('filter-btn');
  D.filterPanel = document.getElementById('filter-panel');
  D.dateFrom = document.getElementById('date-from');
  D.dateTo = document.getElementById('date-to');
  D.limitInput = document.getElementById('limit-input');
  D.applyBtn = document.getElementById('apply-btn');
  D.resetBtn = document.getElementById('reset-btn');

  D.searchInput = document.getElementById('search');

  D.exportBtn = document.getElementById('export-btn');
  D.exportMenu = document.getElementById('export-menu');
  D.expCsv = document.getElementById('exp-csv');
  D.expPrint = document.getElementById('exp-print');

  D.sumTotal = document.getElementById('sum-total');
  D.sumSubTotal = document.getElementById('sum-sub-total');
  D.sumActive = document.getElementById('sum-active');
  D.sumSubActive = document.getElementById('sum-sub-active');
  D.sumUpcoming = document.getElementById('sum-upcoming');
  D.sumSubUpcoming = document.getElementById('sum-sub-upcoming');
  D.sumParticipants = document.getElementById('sum-participants');
  D.sumSubParticipants = document.getElementById('sum-sub-participants');

  D.tbody = document.getElementById('table-body');
  D.pagination = document.getElementById('pagination');
}

/* =========================================================
   EVENTS
   ========================================================= */
function bindEvents() {
  D.brandSelect.addEventListener('change', () => {
    S.brand = D.brandSelect.value;
    S.page = 1;
    render();
  });

  D.sortSelect.addEventListener('change', () => {
    S.sort = D.sortSelect.value;
    S.page = 1;
    render();
  });

  D.searchInput.addEventListener('input', () => {
    S.search = D.searchInput.value.toLowerCase();
    S.page = 1;
    render();
  });

  // Filter Toggle
  D.filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    D.filterPanel.style.display = D.filterPanel.style.display === 'none' ? 'block' : 'none';
  });
  D.filterPanel.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => D.filterPanel.style.display = 'none');

  // Apply Filter
  D.applyBtn.addEventListener('click', () => {
    S.dateFrom = D.dateFrom.value;
    S.dateTo = D.dateTo.value;
    S.limit = parseInt(D.limitInput.value, 10) || 8;
    S.page = 1;
    D.filterPanel.style.display = 'none';
    render();
  });

  // Reset Filter
  D.resetBtn.addEventListener('click', () => {
    D.dateFrom.value = '';
    D.dateTo.value = '';
    D.limitInput.value = '8';
    S.dateFrom = '';
    S.dateTo = '';
    S.limit = 8;
    S.page = 1;
    D.filterPanel.style.display = 'none';
    render();
  });

  // Export Menu
  D.exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    D.exportMenu.style.display = D.exportMenu.style.display === 'none' ? 'block' : 'none';
  });
  D.exportMenu.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => D.exportMenu.style.display = 'none');

  D.expCsv.addEventListener('click', exportCSV);
  D.expPrint.addEventListener('click', () => {
    D.exportMenu.style.display = 'none';
    window.print();
  });
}

/* =========================================================
   DATA PREP
   ========================================================= */
function getFlattenedEntries() {
  let acts = ACTIVITIES.slice();
  if (S.brand !== 'all') acts = acts.filter(a => a.brand === S.brand);

  let allEntries = [];
  acts.forEach(act => {
    act.entries.forEach(e => {
      allEntries.push({ ...e, actId: act.id, actTitle: act.title });
    });
  });

  if (S.search) {
    allEntries = allEntries.filter(e =>
      e.name.toLowerCase().includes(S.search) ||
      String(e.id).includes(S.search) ||
      e.actTitle.toLowerCase().includes(S.search)
    );
  }

  if (S.dateFrom) {
    allEntries = allEntries.filter(e => e.date.slice(0, 10) >= S.dateFrom);
  }
  if (S.dateTo) {
    allEntries = allEntries.filter(e => e.date.slice(0, 10) <= S.dateTo);
  }

  // Sort
  allEntries.sort((a, b) => {
    if (S.sort === 'date-desc') return b.date.localeCompare(a.date);
    if (S.sort === 'date-asc') return a.date.localeCompare(b.date);
    if (S.sort === 'score-desc') return b.score - a.score;
    if (S.sort === 'score-asc') return a.score - b.score;
    if (S.sort === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  return allEntries;
}

/* =========================================================
   RENDER
   ========================================================= */
function render() {
  const acts = S.brand === 'all' ? ACTIVITIES : ACTIVITIES.filter(a => a.brand === S.brand);
  const allEntries = getFlattenedEntries();

  // Update Summary blocks
  D.sumTotal.textContent = acts.length; // Total Sessions
  D.sumSubTotal.textContent = `${(acts.length * 1.5).toFixed(2)}/h`;

  let totalScore = 0;
  let topScore = 0;
  allEntries.forEach(e => {
    totalScore += e.score;
    if (e.score > topScore) topScore = e.score;
  });

  const avgScore = allEntries.length > 0 ? (totalScore / allEntries.length).toFixed(1) : 0;

  D.sumActive.textContent = avgScore; // Average Score
  D.sumSubActive.textContent = `Avg Score`;

  D.sumUpcoming.textContent = topScore; // Top Score
  D.sumSubUpcoming.textContent = `Best Play`;

  D.sumParticipants.textContent = allEntries.length; // Total Players
  D.sumSubParticipants.textContent = `${allEntries.length} Players`;

  // Update Table
  const offset = (S.page - 1) * S.limit;
  const pageEntries = allEntries.slice(offset, offset + S.limit);

  D.tbody.innerHTML = pageEntries.map(e => {
    const timeScore = e.score.toFixed(2);

    // Format date like screenshot: November 2, 2021
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + d.getFullYear();

    return `
      <tr>
        <td class="td-id">#${e.id}</td>
        <td>${e.actTitle}</td>
        <td style="color:var(--text-muted)">${e.phone}</td>
        <td class="td-score">${timeScore}s</td>
        <td>${dateStr}</td>
        <td style="text-align:right"><button class="btn-details">See Details</button></td>
      </tr>
    `;
  }).join('') || `<tr><td colspan="6" style="text-align:center;padding:60px;color:var(--text-muted)">No data found</td></tr>`;

  // Pagination
  const pages = Math.ceil(allEntries.length / S.limit);
  let pageHTML = '';
  for (let i = 1; i <= pages; i++) {
    pageHTML += `<button class="page-btn ${i === S.page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  D.pagination.innerHTML = pageHTML;
}

window.goPage = function (p) { S.page = p; render(); };

/* =========================================================
   EXPORT CSV
   ========================================================= */
function exportCSV() {
  D.exportMenu.style.display = 'none';
  const allEntries = getFlattenedEntries();

  const headers = ['Entry ID', 'Activity Title', 'Address / Phone', 'Score', 'Date'];
  const rows = allEntries.map(e => [
    e.id, `"${e.actTitle}"`, `"${e.phone}"`, e.score, e.date
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GIIAS2026_Activity_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  cacheDOM();
  bindEvents();
  render();
});
