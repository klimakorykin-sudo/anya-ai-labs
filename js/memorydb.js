// Память через IndexedDB (постоянная, переживает перезагрузку)
const MemoryDB = {
  db: null,
  ready: false,

  async init() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open("anya_db", 1);

        req.onupgradeneeded = e => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("profile")) {
            db.createObjectStore("profile");
          }
          if (!db.objectStoreNames.contains("facts")) {
            db.createObjectStore("facts", { keyPath: "id", autoIncrement: true });
          }
          if (!db.objectStoreNames.contains("notes")) {
            db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
          }
          if (!db.objectStoreNames.contains("history")) {
            db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
          }
          if (!db.objectStoreNames.contains("mood")) {
            db.createObjectStore("mood", { keyPath: "date" });
          }
        };

        req.onsuccess = e => {
          this.db = e.target.result;
          this.ready = true;
          resolve();
        };

        req.onerror = () => {
          console.warn("IndexedDB не работает, использую fallback");
          this.ready = false;
          resolve();
        };
      } catch (e) {
        console.warn("IndexedDB ошибка:", e);
        this.ready = false;
        resolve();
      }
    });
  },

  // === ПРОФИЛЬ (key-value) ===
  async set(key, value) {
    if (!this.ready) {
      localStorage.setItem("anya_" + key, JSON.stringify(value));
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("profile", "readwrite");
        tx.objectStore("profile").put(value, key);
        tx.oncomplete = () => res();
        tx.onerror = () => res();
      } catch (e) { res(); }
    });
  },

  async get(key) {
    if (!this.ready) {
      try {
        const v = localStorage.getItem("anya_" + key);
        return v ? JSON.parse(v) : null;
      } catch (e) { return null; }
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("profile", "readonly");
        const req = tx.objectStore("profile").get(key);
        req.onsuccess = () => res(req.result);
        req.onerror = () => res(null);
      } catch (e) { res(null); }
    });
  },

  async delete(key) {
    if (!this.ready) {
      localStorage.removeItem("anya_" + key);
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("profile", "readwrite");
        tx.objectStore("profile").delete(key);
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  },

  // === ФАКТЫ ===
  async addFact(fact) {
    if (!this.ready) {
      const facts = JSON.parse(localStorage.getItem("anya_facts") || "[]");
      facts.push({ fact, time: Date.now() });
      if (facts.length > 100) facts.shift();
      localStorage.setItem("anya_facts", JSON.stringify(facts));
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("facts", "readwrite");
        tx.objectStore("facts").add({ fact, time: Date.now() });
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  },

  async allFacts() {
    if (!this.ready) {
      return JSON.parse(localStorage.getItem("anya_facts") || "[]");
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("facts", "readonly");
        const req = tx.objectStore("facts").getAll();
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => res([]);
      } catch (e) { res([]); }
    });
  },

  // === ЗАМЕТКИ ===
  async addNote(text) {
    if (!this.ready) {
      const notes = JSON.parse(localStorage.getItem("anya_notes") || "[]");
      notes.push({ text, time: Date.now() });
      localStorage.setItem("anya_notes", JSON.stringify(notes));
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("notes", "readwrite");
        tx.objectStore("notes").add({ text, time: Date.now() });
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  },

  async allNotes() {
    if (!this.ready) {
      return JSON.parse(localStorage.getItem("anya_notes") || "[]");
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("notes", "readonly");
        const req = tx.objectStore("notes").getAll();
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => res([]);
      } catch (e) { res([]); }
    });
  },

  async clearNotes() {
    if (!this.ready) {
      localStorage.removeItem("anya_notes");
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("notes", "readwrite");
        tx.objectStore("notes").clear();
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  },

  // === ИСТОРИЯ ДИАЛОГА ===
  async addHistory(userText, botText) {
    if (!this.ready) {
      const h = JSON.parse(localStorage.getItem("anya_history") || "[]");
      h.push({ user: userText, bot: botText, time: Date.now() });
      if (h.length > 200) h.shift();
      localStorage.setItem("anya_history", JSON.stringify(h));
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("history", "readwrite");
        tx.objectStore("history").add({ user: userText, bot: botText, time: Date.now() });
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  },

  async recentHistory(limit = 50) {
    if (!this.ready) {
      const h = JSON.parse(localStorage.getItem("anya_history") || "[]");
      return h.slice(-limit);
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("history", "readonly");
        const req = tx.objectStore("history").getAll();
        req.onsuccess = () => {
          const arr = req.result || [];
          res(arr.slice(-limit));
        };
        req.onerror = () => res([]);
      } catch (e) { res([]); }
    });
  },

  // === НАСТРОЕНИЕ ===
  async setMood(dateKey, mood) {
    if (!this.ready) {
      const m = JSON.parse(localStorage.getItem("anya_mood") || "{}");
      m[dateKey] = mood;
      localStorage.setItem("anya_mood", JSON.stringify(m));
      return;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("mood", "readwrite");
        tx.objectStore("mood").put({ date: dateKey, mood });
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  },

  async getMood(dateKey) {
    if (!this.ready) {
      const m = JSON.parse(localStorage.getItem("anya_mood") || "{}");
      return m[dateKey] || null;
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("mood", "readonly");
        const req = tx.objectStore("mood").get(dateKey);
        req.onsuccess = () => res(req.result ? req.result.mood : null);
        req.onerror = () => res(null);
      } catch (e) { res(null); }
    });
  },

  async allMoods() {
    if (!this.ready) {
      const m = JSON.parse(localStorage.getItem("anya_mood") || "{}");
      return Object.entries(m).map(([date, mood]) => ({ date, mood }));
    }
    return new Promise(res => {
      try {
        const tx = this.db.transaction("mood", "readonly");
        const req = tx.objectStore("mood").getAll();
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => res([]);
      } catch (e) { res([]); }
    });
  },

  // === СТЕРЕТЬ ВСЁ ===
  async clearAll() {
    if (!this.ready) {
      ["profile", "facts", "notes", "history", "mood"].forEach(s => {
        localStorage.removeItem("anya_" + s);
      });
      Object.keys(localStorage)
        .filter(k => k.startsWith("anya_"))
        .forEach(k => localStorage.removeItem(k));
      return;
    }
    return new Promise(res => {
      try {
        const stores = ["profile", "facts", "notes", "history", "mood"];
        const tx = this.db.transaction(stores, "readwrite");
        stores.forEach(s => tx.objectStore(s).clear());
        tx.oncomplete = () => res();
      } catch (e) { res(); }
    });
  }
};

// Хелпер для ключа даты
function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" +
         String(d.getMonth() + 1).padStart(2, "0") + "-" +
         String(d.getDate()).padStart(2, "0");
}