document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-note");
  const noteList = document.getElementById("note-list");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // 👉 Chuyển tab
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const tab = button.getAttribute("data-tab");
      tabContents.forEach((content) => content.classList.add("hidden"));
      document.getElementById(tab).classList.remove("hidden");
    });
  });

  // 👉 Lưu ghi chú
  saveButton.addEventListener("click", () => {
    const titleInput = document.getElementById("note-title");
    const descInput = document.getElementById("note-description");
    const timeInput = document.getElementById("note-time");

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const time = timeInput.value;

    if (!title || !time) {
      alert("Vui lòng nhập tiêu đề và thời gian!");
      return;
    }

    const note = { title, description, time };
    chrome.storage.sync.get(["notes"], (data) => {
      const notes = data.notes || [];
      notes.push(note);
      chrome.storage.sync.set({ notes }, () => {
        loadNotes();
        showToast("📝 Ghi chú đã được lưu!");

        // Xoá input sau khi lưu
        titleInput.value = "";
        descInput.value = "";
        timeInput.value = "";
      });
    });

    chrome.alarms.create(title, { when: new Date(time).getTime() });
  });

  // 👉 Xoá ghi chú
  function loadNotes() {
    chrome.storage.sync.get(["notes"], (data) => {
      const notes = data.notes || [];
      noteList.innerHTML = "";
      notes.forEach((note, index) => {
        const li = document.createElement("li");
        li.classList.add("note-item");
        li.innerHTML = `
                    <div class="note-content">
                        <h4>${note.title}</h4>
                        <p>${note.description || "Không có mô tả"}</p>
                        <span class="time">📅 ${new Date(
                          note.time
                        ).toLocaleString()}</span>
                    </div>
                    <button class="delete w-30" data-index="${index}">❌</button>
                `;
        noteList.appendChild(li);
      });

      document.querySelectorAll(".delete").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          notes.splice(index, 1);
          chrome.storage.sync.set({ notes }, () => {
            loadNotes();
            showToast("🗑️ Ghi chú đã bị xoá!");
          });
        });
      });
    });
  }

  // 👉 Thông báo nổi
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // Tải danh sách ghi chú khi mở popup
  loadNotes();
});
