chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.sync.get(["notes"], (data) => {
    const notes = data.notes || [];
    const note = notes.find((n) => n.title === alarm.name);

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: `📌 Đến giờ: ${alarm.name}`,
      message: note
        ? note.description || "Không có mô tả"
        : "Không tìm thấy ghi chú",
    });
  });
});
