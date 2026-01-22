// assets/js/store-profile.js
// Store Profile – Enterprise Loader (Mega Image / Franciză)

document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // VALIDARE CONTEXT
  // ===============================
  if (!window.LuciData?.retail?.stores) {
    console.error("Store Profile: stores-data.js nu este disponibil.");
    return;
  }

  if (!window.STORE_CONTEXT?.storeId) {
    console.error("Store Profile: STORE_CONTEXT.storeId lipsește.");
    return;
  }

  const storeId = window.STORE_CONTEXT.storeId;
  const store = LuciData.retail.stores.find(s => s.id === storeId);

  if (!store) {
    console.error("Store Profile: storeId invalid:", storeId);
    return;
  }

  // 4) Buton "Daily Financials"
const btnFin = document.getElementById("spGoFinancials");
if (btnFin) {
  btnFin.addEventListener("click", () => {
    // financials.html?storeId=MI-BUC-001
    window.location.href =
      `../../financials.html?storeId=${encodeURIComponent(storeId)}`;
  });
}

  // ===============================
  // DATA SOURCES
  // ===============================
  const inventory = (LuciData.retail.inventory || []).filter(i => i.storeId === storeId);
  const tasks     = (LuciData.retail.tasks || []).filter(t => t.storeId === storeId);
  const batches   = (LuciData.retail.batches || []).filter(b => b.storeId === storeId);
  const events    = (LuciData.retail.events || []).filter(e => e.storeId === storeId);
  const audit     = (LuciData.audit || []).filter(a => a.storeId === storeId);

  // ===============================
  // 1️⃣ HEADER STORE
  // ===============================
  setText("spStoreName", store.name);
  setText(
    "spStoreMeta",
    `${store.type} • ${store.city}, ${store.county} • ${store.address}`
  );
  setText(
    "spOwnershipTag",
    store.ownership === "franchise" ? "Franciză" : "Mega Image"
  );

  // ===============================
  // 2️⃣ KPI STORE
  // ===============================
  const today = new Date();

  const totalSku   = inventory.length;
  const outOfStock = inventory.filter(i => (i.shelfStock || 0) === 0).length;
  const lowStock   = inventory.filter(i => (i.totalStock || 0) < (i.reorderPoint || 0)).length;

  const expCritical = batches.filter(b => {
    const days = (new Date(b.expiryDate) - today) / 86400000;
    return days <= 2;
  }).length;

  const overdueTasks = tasks.filter(
    t => t.status !== "Done" && new Date(t.deadline) < today
  ).length;

  setText("spKpiSku", totalSku);
  setText("spKpiOos", outOfStock);
  setText("spKpiLow", lowStock);
  setText("spKpiExpiry", expCritical);
  setText("spKpiOverdue", overdueTasks);

  // ===============================
  // 3️⃣ INVENTORY SNAPSHOT
  // ===============================
  renderInventoryTable(inventory);

  // ===============================
  // 4️⃣ REFILL LIST (AI)
  // ===============================
  renderRefillList(inventory);

  // ===============================
  // 5️⃣ EXPIRY & WASTE
  // ===============================
  renderExpiryTable(batches);

  // ===============================
  // 6️⃣ POS EVENTS
  // ===============================
  renderPosEvents(events);

  // ===============================
  // 7️⃣ AUDIT TRAIL
  // ===============================
  renderAuditTrail(audit);

  // ===============================
  // 8️⃣ BUTON INVENTORY
  // ===============================
  const btnInv = document.getElementById("spGoInventory");
  if (btnInv) {
    btnInv.addEventListener("click", () => {
      window.location.href = `inventory.html?storeId=${encodeURIComponent(storeId)}`;
    });
  }
});

/* =====================================================
   HELPERS
===================================================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value ?? "—");
}

/* =====================================================
   INVENTORY
===================================================== */
function renderInventoryTable(inventory) {
  const table = document.getElementById("spInventoryTable");
  if (!table) return;

  table.innerHTML = "";

  inventory.forEach(i => {
    const status =
      i.totalStock < i.reorderPoint ? "Critic" :
      i.shelfStock === 0 ? "Raft gol" : "OK";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.sku}</td>
      <td>${i.shelfStock}</td>
      <td>${i.warehouseStock || 0}</td>
      <td>${i.totalStock}</td>
      <td><strong>${status}</strong></td>
    `;
    table.appendChild(tr);
  });

  if (!inventory.length) {
    table.innerHTML = `<tr><td colspan="5">Nu există date de inventar</td></tr>`;
  }
}

/* =====================================================
   REFILL LIST
===================================================== */
function renderRefillList(inventory) {
  const list = document.getElementById("spRefillList");
  if (!list) return;

  list.innerHTML = "";

  inventory
    .filter(i => i.shelfStock < 5)
    .forEach(i => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>SKU ${i.sku}</strong> – Refill raft recomandat
        <div style="font-size:0.8rem;color:#666;">
          Motiv: stoc raft scăzut
        </div>
      `;
      list.appendChild(li);
    });

  if (!list.children.length) {
    list.innerHTML = "<li>Niciun refill urgent</li>";
  }
}

/* =====================================================
   EXPIRY
===================================================== */
function renderExpiryTable(batches) {
  const table = document.getElementById("spExpiryTable");
  if (!table) return;

  table.innerHTML = "";

  batches.forEach(b => {
    const days = Math.round(
      (new Date(b.expiryDate) - new Date()) / 86400000
    );

    let rec = "OK";
    if (days <= 2) rec = "Retragere / discount urgent";
    else if (days <= 5) rec = "Mutare la raft frontal";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.sku}</td>
      <td>${b.quantity}</td>
      <td>${b.expiryDate}</td>
      <td>${rec}</td>
    `;
    table.appendChild(tr);
  });

  if (!batches.length) {
    table.innerHTML = `<tr><td colspan="4">Nicio expirare critică</td></tr>`;
  }
}

/* =====================================================
   POS EVENTS
===================================================== */
function renderPosEvents(events) {
  const table = document.getElementById("spPosEvents");
  if (!table) return;

  table.innerHTML = "";

  events.slice(-20).reverse().forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.timestamp}</td>
      <td>${e.sku}</td>
      <td>${e.quantity}</td>
      <td>${e.type}</td>
    `;
    table.appendChild(tr);
  });

  if (!events.length) {
    table.innerHTML = `<tr><td colspan="4">Nicio vânzare simulată</td></tr>`;
  }
}

/* =====================================================
   AUDIT
===================================================== */
function renderAuditTrail(audit) {
  const table = document.getElementById("spAuditTable");
  if (!table) return;

  table.innerHTML = "";

  audit.slice(-20).reverse().forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.timestamp}</td>
      <td>${a.action}</td>
      <td>${a.actor || "system"}</td>
      <td>${a.details || ""}</td>
    `;
    table.appendChild(tr);
  });

  if (!audit.length) {
    table.innerHTML = `<tr><td colspan="4">Nicio acțiune auditabilă</td></tr>`;
  }
}
