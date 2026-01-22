window.LuciData = window.LuciData || {};
LuciData.productivity = LuciData.productivity || {};

function storeKey(suffix){
  const storeId = window.STORE_CONTEXT?.storeId || "DEMO_STORE";
  return `LD_${suffix}_${storeId}`;
}

LuciData.productivity.loadMeetings = () => {
  try { return JSON.parse(localStorage.getItem(storeKey("MEETINGS"))) || []; }
  catch { return []; }
};
LuciData.productivity.saveMeetings = (list) => localStorage.setItem(storeKey("MEETINGS"), JSON.stringify(list));

LuciData.productivity.loadTasks = () => {
  try { return JSON.parse(localStorage.getItem(storeKey("TASKS"))) || []; }
  catch { return []; }
};
LuciData.productivity.saveTasks = (list) => localStorage.setItem(storeKey("TASKS"), JSON.stringify(list));
