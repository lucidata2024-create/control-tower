window.LuciData = window.LuciData || {};
LuciData.notifs = LuciData.notifs || {};

LuciData.notifs.count = 0;

LuciData.notifs.bump = function(n=1){
  LuciData.notifs.count += n;
  const badge = document.getElementById("notifBadge");
  if (!badge) return;
  badge.style.display = LuciData.notifs.count > 0 ? "inline-flex" : "none";
  badge.textContent = String(LuciData.notifs.count);
};

LuciData.notifs.toast = function(title, body){
  // MVP: simplu alert + badge (ulterior: toast UI)
  console.log("[NOTIF]", title, body);
  LuciData.notifs.bump(1);
};
