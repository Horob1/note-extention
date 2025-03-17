chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["notes"], (data) => {
    if (!data.notes) {
      chrome.storage.sync.set({ notes: [] });
    }
  });
});
