// ============================================================
// CHATS-DB.JS — Хранение чатов в IndexedDB
// ============================================================

const ChatsDB = {
  db: null,
  ready: false,

  async init() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open("anya_chats_db", 1);

        req.onupgradeneeded = e => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("chats")) {
            db.createObjectStore("chats", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("messages")) {
            const store = db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
            store.createIndex("chatId", "chatId", { unique: false });
          }
          if (!db.objectStoreNames.contains("meta")) {
            db.createObjectStore("meta");
          }
        };

        req.onsuccess = e => {
          this.db = e.target.result;
          this.ready = true;
          resolve();
        };

        req.onerror = () => {
          console.warn("ChatsDB не работает");
          this.ready = false;
          resolve();
        };
      } catch (e) {
        console.warn("ChatsDB ошибка:", e);
        this.ready = false;
        resolve();
      }
    });
  },

  // === ЧАТЫ ===
  async createChat(title = "Новый чат") {
    const id = "chat_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const chat = {
      id,
      title,
      created: Date.now(),
      updated: Date.now()
    };

    if (!this.ready) {
      const chats = JSON.parse(localStorage.getItem("anya_chats") || "[]");
      chats.unshift(chat);
      localStorage.setItem("anya_chats", JSON.stringify(chats));
      return chat;
    }

    return new Promise(res => {
      const tx = this.db.transaction("chats", "readwrite");
      tx.objectStore("chats").put(chat);
      tx.oncomplete = () => res(chat);
      tx.onerror = () => res(chat);
    });
  },

  async getAllChats() {
    if (!this.ready) {
      return JSON.parse(localStorage.getItem("anya_chats") || "[]");
    }
    return new Promise(res => {
      const tx = this.db.transaction("chats", "readonly");
      const req = tx.objectStore("chats").getAll();
      req.onsuccess = () => {
        const chats = req.result || [];
        chats.sort((a, b) => b.updated - a.updated);
        res(chats);
      };
      req.onerror = () => res([]);
    });
  },

  async getChat(id) {
    if (!this.ready) {
      const chats = JSON.parse(localStorage.getItem("anya_chats") || "[]");
      return chats.find(c => c.id === id) || null;
    }
    return new Promise(res => {
      const tx = this.db.transaction("chats", "readonly");
      const req = tx.objectStore("chats").get(id);
      req.onsuccess = () => res(req.result || null);
      req.onerror = () => res(null);
    });
  },

  async renameChat(id, newTitle) {
    if (!this.ready) {
      const chats = JSON.parse(localStorage.getItem("anya_chats") || "[]");
      const chat = chats.find(c => c.id === id);
      if (chat) {
        chat.title = newTitle;
        chat.updated = Date.now();
        localStorage.setItem("anya_chats", JSON.stringify(chats));
      }
      return;
    }
    const chat = await this.getChat(id);
    if (!chat) return;
    chat.title = newTitle;
    chat.updated = Date.now();
    return new Promise(res => {
      const tx = this.db.transaction("chats", "readwrite");
      tx.objectStore("chats").put(chat);
      tx.oncomplete = () => res();
    });
  },

  async deleteChat(id) {
    if (!this.ready) {
      let chats = JSON.parse(localStorage.getItem("anya_chats") || "[]");
      chats = chats.filter(c => c.id !== id);
      localStorage.setItem("anya_chats", JSON.stringify(chats));
      let messages = JSON.parse(localStorage.getItem("anya_messages") || "[]");
      messages = messages.filter(m => m.chatId !== id);
      localStorage.setItem("anya_messages", JSON.stringify(messages));
      return;
    }

    return new Promise(res => {
      // Удаляем чат
      const tx1 = this.db.transaction("chats", "readwrite");
      tx1.objectStore("chats").delete(id);
      tx1.oncomplete = () => {
        // Удаляем сообщения чата
        const tx2 = this.db.transaction("messages", "readwrite");
        const store = tx2.objectStore("messages");
        const index = store.index("chatId");
        const req = index.openCursor(IDBKeyRange.only(id));
        req.onsuccess = e => {
          const cursor = e.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
        tx2.oncomplete = () => res();
      };
    });
  },

  // === СООБЩЕНИЯ ===
  async addMessage(chatId, userText, botText, photo = null) {
    const msg = {
      chatId,
      user: userText,
      bot: botText,
      photo,
      time: Date.now()
    };

    if (!this.ready) {
      const messages = JSON.parse(localStorage.getItem("anya_messages") || "[]");
      messages.push({ ...msg, id: Date.now() + Math.random() });
      if (messages.length > 2000) messages.shift();
      localStorage.setItem("anya_messages", JSON.stringify(messages));
      return;
    }

    return new Promise(res => {
      const tx = this.db.transaction("messages", "readwrite");
      tx.objectStore("messages").add(msg);
      tx.oncomplete = () => res();
    });
  },

  async getMessages(chatId) {
    if (!this.ready) {
      const messages = JSON.parse(localStorage.getItem("anya_messages") || "[]");
      return messages.filter(m => m.chatId === chatId);
    }
    return new Promise(res => {
      const tx = this.db.transaction("messages", "readonly");
      const store = tx.objectStore("messages");
      const index = store.index("chatId");
      const req = index.getAll(IDBKeyRange.only(chatId));
      req.onsuccess = () => {
        const msgs = req.result || [];
        msgs.sort((a, b) => a.time - b.time);
        res(msgs);
      };
      req.onerror = () => res([]);
    });
  },

  async clearMessages(chatId) {
    if (!this.ready) {
      let messages = JSON.parse(localStorage.getItem("anya_messages") || "[]");
      messages = messages.filter(m => m.chatId !== chatId);
      localStorage.setItem("anya_messages", JSON.stringify(messages));
      return;
    }

    return new Promise(res => {
      const tx = this.db.transaction("messages", "readwrite");
      const store = tx.objectStore("messages");
      const index = store.index("chatId");
      const req = index.openCursor(IDBKeyRange.only(chatId));
      req.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.oncomplete = () => res();
    });
  },

  // === МЕТА (текущий чат) ===
  async setMeta(key, value) {
    if (!this.ready) {
      localStorage.setItem("anya_meta_" + key, JSON.stringify(value));
      return;
    }
    return new Promise(res => {
      const tx = this.db.transaction("meta", "readwrite");
      tx.objectStore("meta").put(value, key);
      tx.oncomplete = () => res();
    });
  },

  async getMeta(key) {
    if (!this.ready) {
      const v = localStorage.getItem("anya_meta_" + key);
      return v ? JSON.parse(v) : null;
    }
    return new Promise(res => {
      const tx = this.db.transaction("meta", "readonly");
      const req = tx.objectStore("meta").get(key);
      req.onsuccess = () => res(req.result);
      req.onerror = () => res(null);
    });
  }
};