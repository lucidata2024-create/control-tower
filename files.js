window.LuciData = window.LuciData || {};
LuciData.files = LuciData.files || {};

LuciData.files.key = function() {
  const storeId = window.STORE_CONTEXT?.storeId || "DEMO_STORE";
  return `LD_FILES_${storeId}`;
};

LuciData.files.load = function() {
  try {
    return JSON.parse(localStorage.getItem(LuciData.files.key())) || [];
  } catch { return []; }
};

LuciData.files.save = function(list) {
  localStorage.setItem(LuciData.files.key(), JSON.stringify(list));
};

LuciData.files.upsert = function({ name, channelId }) {
  const list = LuciData.files.load();
  const idx = list.findIndex(f => f.name === name && f.channelId === channelId);

  if (idx >= 0) {
    list[idx].version += 1;
    list[idx].updatedAt = new Date().toISOString();
  } else {
    list.push({
      id: `f_${Date.now()}`,
      name,
      channelId,
      version: 1,
      updatedAt: new Date().toISOString()
    });
  }

  LuciData.files.save(list);
  return list;
};
