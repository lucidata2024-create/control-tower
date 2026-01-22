// assets/js/control-tower.js
// Retail Operations Command Center – Control Tower (Enterprise Ready)

/* ======================================================
   INIT
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (!window.LuciData?.retail?.stores) {
    console.error("Control Tower: stores-data.js nu este disponibil.");
    return;
  }

  const stores = LuciData.retail.stores;

  const totalEl = document.getElementById("ctTotalStores");
  if (totalEl) totalEl.textContent = stores.length;

  renderStores(stores);
  renderStoreKpis(stores);
  renderTopRiskStores(stores);
  renderRegionalMap(stores);
  renderLiveAlerts();
});

/* ======================================================
   STORE CARDS
====================================================== */
function renderStores(stores) {
  const container = document.getElementById("controlTowerStores");
  if (!container) return;

  container.innerHTML = "";

  stores.forEach(store => {
    const { score, status } = calculateStoreStatus(store.id);

    const div = document.createElement("div");
    div.className = `store-card ${status}`;

    div.innerHTML = `
      <h4>${store.name}</h4>
      <p>${store.city}, ${store.county}</p>
      <p><strong>Status:</strong> ${status.toUpperCase()}</p>
      <p><strong>Risk:</strong> ${score}/100</p>
      <button class="btn-small" data-store-id="${store.id}">Vezi detalii</button>
    `;

    container.appendChild(div);
  });
}

/* ======================================================
   KPI STORES
====================================================== */
function renderStoreKpis(stores) {
  const results = stores.map(s => calculateStoreStatus(s.id));

  const warningEl = document.getElementById("ctWarningStores");
  const criticalEl = document.getElementById("ctCriticalStores");

  if (warningEl)
    warningEl.textContent = results.filter(r => r.status === "warning").length;

  if (criticalEl)
    criticalEl.textContent = results.filter(r => r.status === "critical").length;
}

/* ======================================================
   TOP RISK STORES
====================================================== */
function renderTopRiskStores(stores) {
  const tbody = document.getElementById("ctTopRiskStores");
  if (!tbody) return;

  tbody.innerHTML = "";

  stores
    .map(s => ({ ...s, ...calculateStoreStatus(s.id) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.county}</td>
        <td>${s.status.toUpperCase()}</td>
        <td>${s.score}</td>
        <td><button class="btn-small">Acțiuni</button></td>
      `;
      tbody.appendChild(tr);
    });
}

/* ======================================================
   STORE RISK ENGINE
====================================================== */
function calculateStoreStatus(storeId) {
  const inventory = (LuciData.retail.inventory || []).filter(i => i.storeId === storeId);
  const tasks = (LuciData.retail.tasks || []).filter(t => t.storeId === storeId);
  const batches = (LuciData.retail.batches || []).filter(b => b.storeId === storeId);

  let score = 0;
  const today = new Date();

  score += inventory.filter(i => i.shelfStock === 0).length * 25;
  score += inventory.filter(i => i.totalStock < i.reorderPoint).length * 20;

  score += batches.filter(b => {
    const days = (new Date(b.expiryDate) - today) / 86400000;
    return days <= 2;
  }).length * 25;

  score += tasks.filter(
    t => t.status !== "Done" && new Date(t.deadline) < today
  ).length * 20;

  score = Math.min(100, score);

  let status = "ok";
  if (score >= 70) status = "critical";
  else if (score >= 40) status = "warning";

  return { score, status };
}

/* ======================================================
   REGIONAL AGGREGATION (LIPSEA – FIX CRITIC)
====================================================== */
function groupStoresByCounty(stores) {
  return stores.reduce((acc, store) => {
    acc[store.county] = acc[store.county] || [];
    acc[store.county].push(store);
    return acc;
  }, {});
}

function calculateRegionRisk(stores) {
  const scores = stores.map(s => calculateStoreStatus(s.id).score);
  const avg = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length);

  let status = "ok";
  if (avg >= 70) status = "critical";
  else if (avg >= 40) status = "warning";

  return { score: Math.round(avg), status };
}

/* ======================================================
   REGIONAL MAP
====================================================== */
function renderRegionalMap(stores) {
  const container = document.getElementById("regionalMap");
  if (!container) return;

  container.innerHTML = "";

  const regions = groupStoresByCounty(stores);

  Object.entries(regions).forEach(([county, countyStores]) => {
    const regionRisk = calculateRegionRisk(countyStores);

    const card = document.createElement("div");
    card.className = "region-card";

    card.innerHTML = `
      <div class="region-header">
        <div class="region-name">${county}</div>
        <div class="region-risk ${regionRisk.status}">
          Risk ${regionRisk.score}/100
        </div>
      </div>
    `;

    countyStores.forEach(store => {
      const { score, status } = calculateStoreStatus(store.id);

      const row = document.createElement("div");
      row.className = `store-dot ${status}`;
      row.innerHTML = `
        <span>${store.name}</span>
        <strong>${score}</strong>
      `;
      card.appendChild(row);
    });

    container.appendChild(card);
  });
}

/* ======================================================
   LIVE ALERTS ENGINE
====================================================== */
function generateLiveAlerts() {
  const alerts = [];

  const inventory = LuciData.retail.inventory || [];
  const batches = LuciData.retail.batches || [];
  const tasks = LuciData.retail.tasks || [];

  const today = new Date();

  inventory.filter(i => i.shelfStock === 0).forEach(i =>
    alerts.push({
      level: "critical",
      title: "Out-of-stock la raft",
      message: `SKU ${i.sku} este epuizat.`,
      storeId: i.storeId,
      action: "Refill imediat"
    })
  );

  batches.filter(b => {
    const days = (new Date(b.expiryDate) - today) / 86400000;
    return days <= 2;
  }).forEach(b =>
    alerts.push({
      level: "critical",
      title: "Expirare iminentă",
      message: `SKU ${b.sku} expiră curând.`,
      storeId: b.storeId,
      action: "Acțiune urgentă"
    })
  );

  tasks.filter(t => t.status !== "Done" && new Date(t.deadline) < today)
    .forEach(t =>
      alerts.push({
        level: "warning",
        title: "Task întârziat",
        message: `${t.type} nefinalizat.`,
        storeId: t.storeId,
        action: "Escaladare"
      })
    );

  if (!alerts.length) {
    alerts.push({
      level: "ok",
      title: "Operațiuni stabile",
      message: "Nu există alerte critice în acest moment.",
      storeId: "—",
      action: "Monitorizare"
    });
  }

  return alerts;
}

/* ======================================================
   LIVE ALERTS RENDER
====================================================== */
function renderLiveAlerts() {
  const container = document.getElementById("liveAlerts");
  if (!container) return;

  const alerts = generateLiveAlerts();
  container.innerHTML = "";

  alerts.slice(0, 12).forEach(a => {
    const div = document.createElement("div");
    div.className = `alert-card ${a.level}`;

    div.innerHTML = `
      <div class="alert-title">${a.title}</div>
      <div class="alert-body">${a.message}</div>
      <div class="alert-meta">
        <span>Magazin: ${a.storeId}</span>
        <strong>${a.action}</strong>
      </div>
    `;

    container.appendChild(div);
  });
}

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-store-id]");
  if (!btn) return;

  const storeId = btn.dataset.storeId;
  const store = LuciData.retail.stores.find(s => s.id === storeId);

  if (!store || !store.profilePage) {
    console.warn("Store routing: lipsește profilePage pentru storeId:", storeId);
    return;
  }

  // IMPORTANT: ajustează calea în funcție de unde e control-tower.html
  // Dacă control-tower.html e în root, aceasta e corectă:
  window.location.href = `retail/stores/${store.profilePage}`;
});
