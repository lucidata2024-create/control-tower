document.addEventListener("DOMContentLoaded", () => {
  // Header store
  const s = window.STORE_CONTEXT || { storeName:"—", county:"—", city:"—" };
  const nameEl = document.getElementById("tStoreName");
  const metaEl = document.getElementById("tStoreMeta");
  if (nameEl) nameEl.textContent = s.storeName || "—";
  if (metaEl) metaEl.textContent = `${s.city || "—"}, ${s.county || "—"} • ${s.storeId || "—"}`;

  // State
  const state = LuciData.comm.load();

  // Sidebar render
  renderTeams(state);
  renderChannels(state);

  // Chat render
  renderMessages(state);

  // Rail switching
  document.querySelectorAll(".t-railbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".t-railbtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const viewId = btn.getAttribute("data-view");
      document.querySelectorAll(".t-view").forEach(v => v.classList.remove("active"));
      document.getElementById(viewId)?.classList.add("active");
    });
  });

  // Send message
  const input = document.getElementById("msgInput");
  document.getElementById("btnSend")?.addEventListener("click", () => send());
  input?.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  function send(){
    const text = (input?.value || "").trim();
    if (!text) return;
    LuciData.comm.addMessage(state, text, "Me", "user");
    input.value = "";
    renderMessages(state);
    LuciData.notifs.toast("Mesaj trimis", "Mesajul a fost salvat în istoric.");
  }

  // Files upload (MVP metadata)
  document.getElementById("fileInput")?.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const channelId = state.activeChannelId;
    const list = LuciData.files.upsert({ name: f.name, channelId });
    renderFiles(list, state);
    LuciData.notifs.toast("Fișier încărcat", `${f.name} • versiune actualizată`);
    e.target.value = "";
  });

  // Meetings
  document.getElementById("btnSaveMeeting")?.addEventListener("click", () => {
    const title = (document.getElementById("meetTitle")?.value || "").trim();
    const date = document.getElementById("meetDate")?.value;
    const att = (document.getElementById("meetAtt")?.value || "").trim();
    if (!title || !date) return;

    const list = LuciData.productivity.loadMeetings();
    list.push({ id:`mt_${Date.now()}`, title, date, att, createdAt: new Date().toISOString() });
    LuciData.productivity.saveMeetings(list);
    renderMeetings(list);
    LuciData.notifs.toast("Întâlnire creată", title);
  });

  // Tasks
  document.getElementById("btnSaveTask")?.addEventListener("click", () => {
    const title = (document.getElementById("taskTitle")?.value || "").trim();
    const assignee = (document.getElementById("taskAssignee")?.value || "").trim();
    const deadline = document.getElementById("taskDeadline")?.value;
    if (!title) return;

    const list = LuciData.productivity.loadTasks();
    list.push({ id:`tk_${Date.now()}`, title, assignee, deadline, status:"Open", createdAt: new Date().toISOString() });
    LuciData.productivity.saveTasks(list);
    renderTasks(list);
    LuciData.notifs.toast("Task creat", title);
  });

  // Calls (demo state)
  document.getElementById("btnStartAudio")?.addEventListener("click", () => LuciData.calls.setStatus("Audio call: Connected"));
  document.getElementById("btnStartVideo")?.addEventListener("click", () => LuciData.calls.setStatus("Video meeting: Connected"));
  document.getElementById("btnShareScreen")?.addEventListener("click", () => LuciData.calls.setStatus("Screen share: Active"));

  document.getElementById("btnQuickCall")?.addEventListener("click", () => {
    selectView("callsView");
    LuciData.calls.setStatus("Quick call: Connecting...");
  });

  document.getElementById("btnQuickMeet")?.addEventListener("click", () => {
    selectView("callsView");
    LuciData.calls.setStatus("Quick meeting: Connecting...");
  });

  function selectView(viewId){
    document.querySelectorAll(".t-railbtn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".t-view").forEach(v => v.classList.remove("active"));

    document.querySelector(`.t-railbtn[data-view="${viewId}"]`)?.classList.add("active");
    document.getElementById(viewId)?.classList.add("active");
  }

  // Initial render for files/meetings/tasks
  renderFiles(LuciData.files.load(), state);
  renderMeetings(LuciData.productivity.loadMeetings());
  renderTasks(LuciData.productivity.loadTasks());

  // ----------------- Renders -----------------
  function renderTeams(state){
    const el = document.getElementById("teamsList");
    if (!el) return;
    el.innerHTML = "";
    state.teams.forEach(t => {
      const div = document.createElement("div");
      div.className = `t-item ${t.id === state.activeTeamId ? "active" : ""}`;
      div.innerHTML = `<div class="t-item-title">${t.name}</div><div class="t-item-sub">${t.desc}</div>`;
      div.addEventListener("click", () => {
        LuciData.comm.setActive(state, t.id, (state.channelsByTeam[t.id]?.[0]?.id || "general"));
        renderTeams(state);
        renderChannels(state);
        renderMessages(state);
        renderFiles(LuciData.files.load(), state);
      });
      el.appendChild(div);
    });
  }

  function renderChannels(state){
    const el = document.getElementById("channelsList");
    if (!el) return;
    el.innerHTML = "";
    (state.channelsByTeam[state.activeTeamId] || []).forEach(c => {
      const div = document.createElement("div");
      div.className = `t-item ${c.id === state.activeChannelId ? "active" : ""}`;
      div.innerHTML = `<div class="t-item-title">${c.name}</div><div class="t-item-sub">Mesaje persistente</div>`;
      div.addEventListener("click", () => {
        LuciData.comm.setActive(state, state.activeTeamId, c.id);
        renderChannels(state);
        renderMessages(state);
        renderFiles(LuciData.files.load(), state);
        document.getElementById("activeChannelTitle").textContent = c.name;
      });
      el.appendChild(div);
    });

    const activeName = (state.channelsByTeam[state.activeTeamId] || []).find(x => x.id === state.activeChannelId)?.name || "# General";
    document.getElementById("activeChannelTitle").textContent = activeName;
  }

  function renderMessages(state){
    const el = document.getElementById("messageList");
    if (!el) return;
    const key = LuciData.comm.getThreadKey(state);
    const list = state.messages[key] || [];
    el.innerHTML = "";
    list.forEach(m => {
      const div = document.createElement("div");
      if (m.type === "sys") {
        div.className = "t-msg sys";
        div.innerHTML = `<div class="b">${m.text}</div>`;
      } else {
        const isMe = m.author === "Me";
        div.className = `t-msg ${isMe ? "me" : ""}`;
        div.innerHTML = `
          ${!isMe ? `<div class="a">${m.author}</div>` : ""}
          <div class="b">${escapeHtml(m.text)}</div>
          <div class="t">${new Date(m.ts).toLocaleString()}</div>
        `;
      }
      el.appendChild(div);
    });
    el.scrollTop = el.scrollHeight;
  }

  function renderFiles(list, state){
    const tbody = document.getElementById("filesTableBody");
    if (!tbody) return;

    const chanName = (state.channelsByTeam[state.activeTeamId] || []).find(x => x.id === state.activeChannelId)?.name || "# General";
    const filtered = (list || []).filter(f => f.channelId === state.activeChannelId);

    tbody.innerHTML = "";
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="color:#64748b;">Niciun fișier încărcat în ${chanName}.</td></tr>`;
      return;
    }

    filtered
      .sort((a,b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
      .forEach(f => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(f.name)}</td>
          <td>${escapeHtml(chanName)}</td>
          <td>v${f.version} • ${new Date(f.updatedAt).toLocaleString()}</td>
          <td><button class="t-btn" data-del="${f.id}">Remove</button></td>
        `;
        tbody.appendChild(tr);
      });

    tbody.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del");
        const all = LuciData.files.load();
        const next = all.filter(x => x.id !== id);
        LuciData.files.save(next);
        renderFiles(next, state);
        LuciData.notifs.toast("Fișier eliminat", "Metadata actualizat (MVP).");
      });
    });
  }

  function renderMeetings(list){
    const el = document.getElementById("meetList");
    if (!el) return;
    el.innerHTML = "";

    const sorted = (list || []).slice().sort((a,b) => (a.date||"").localeCompare(b.date||""));
    if (!sorted.length) {
      el.innerHTML = `<div class="t-list-item"><div class="h">Nicio întâlnire</div><div class="s">Creează o întâlnire pentru a începe.</div></div>`;
      return;
    }

    sorted.forEach(m => {
      const div = document.createElement("div");
      div.className = "t-list-item";
      div.innerHTML = `<div class="h">${escapeHtml(m.title)}</div><div class="s">${new Date(m.date).toLocaleString()} • ${escapeHtml(m.att || "—")}</div>`;
      el.appendChild(div);
    });
  }

  function renderTasks(list){
    const el = document.getElementById("taskList");
    if (!el) return;
    el.innerHTML = "";

    const sorted = (list || []).slice().sort((a,b) => (b.createdAt||"").localeCompare(a.createdAt||""));
    if (!sorted.length) {
      el.innerHTML = `<div class="t-list-item"><div class="h">Niciun task</div><div class="s">Adaugă sarcini pentru echipă.</div></div>`;
      return;
    }

    sorted.forEach(t => {
      const div = document.createElement("div");
      div.className = "t-list-item";
      div.innerHTML = `
        <div class="h">${escapeHtml(t.title)}</div>
        <div class="s">Assignee: ${escapeHtml(t.assignee || "—")} • Deadline: ${t.deadline ? new Date(t.deadline).toLocaleString() : "—"} • Status: ${escapeHtml(t.status)}</div>
      `;
      el.appendChild(div);
    });
  }

  function escapeHtml(str){
    return String(str || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
});
