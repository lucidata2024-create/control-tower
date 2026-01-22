window.LuciData = window.LuciData || {};
LuciData.calls = LuciData.calls || {};

LuciData.calls.setStatus = function(txt){
  const el = document.getElementById("callStatus");
  if (el) el.textContent = txt;
};
