// ============================================================
// CHATS.JS — Логика чатов (создание, удаление, переименование)
// ============================================================

const Chats = {
  currentChatId: null,
  chats: [],

  async init() {
    await ChatsDB.init();

    // Загружаем текущий чат из мета
    let currentId = await ChatsDB.getMeta("currentChatId");

    // Загружаем все чаты
    this.chats = await ChatsDB.getAllChats();

    // Если нет чатов — создаём первый
    if (this.chats.length === 0) {
      const chat = await ChatsDB.createChat("Первый чат");
      this.chats = [chat];
      currentId = chat.id;
    }

    // Если текущий не найден — берём первый
    if (!currentId || !this.chats.find(c => c.id === currentId)) {
      currentId = this.chats[0].id;
    }

    this.currentChatId = currentId;
    await ChatsDB.setMeta("currentChatId", currentId);

    this.renderList();
  },

  // === СОЗДАНИЕ НОВОГО ЧАТА ===
  async createNew() {
    const chat = await ChatsDB.createChat("Новый чат");
    this.chats.unshift(chat);
    await this.switchTo(chat.id);
    this.renderList();
    return chat;
  },

  // === ПЕРЕКЛЮЧЕНИЕ ===
  async switchTo(chatId) {
    this.currentChatId = chatId;
    await ChatsDB.setMeta("currentChatId", chatId);

    // Очищаем окно чата
    const chatEl = document.getElementById("chat");
    if (chatEl) chatEl.innerHTML = "";

    // Загружаем сообщения
    const messages = await ChatsDB.getMessages(chatId);

    if (messages.length === 0) {
      // Приветствие
      if (typeof sendGreeting === "function") {
        await sendGreeting();
      }
    } else {
      // Восстанавливаем историю
      let lastDate = null;
      for (const msg of messages) {
        const msgDate = new Date(msg.time).toISOString().slice(0, 10);

        // Разделитель дат
        if (msgDate !== lastDate) {
          const divider = document.createElement("div");
          divider.className = "date-divider";
          divider.textContent = formatDateLabel(msgDate);
          chatEl.appendChild(divider);
          lastDate = msgDate;
        }

        // Сообщение пользователя
        if (msg.user && typeof addMsg === "function") {
          addMsg(msg.user, "user");
        }
        // Сообщение Ани
        if (msg.bot && typeof addMsg === "function") {
          const isHTML = /<pre>|<a |<code>/.test(msg.bot);
          addMsg(msg.bot, "bot", isHTML, msg.photo || null);
        }
      }

      // Обновляем контекст
      if (typeof Context !== "undefined") {
        Context.clear();
        for (const msg of messages.slice(-50)) {
          Context.push(msg.user, msg.bot);
        }
      }
    }

    this.renderList();
  },

  // === ПЕРЕИМЕНОВАНИЕ ===
  async rename(chatId, newTitle) {
    if (!newTitle || !newTitle.trim()) return;
    await ChatsDB.renameChat(chatId, newTitle.trim());

    const chat = this.chats.find(c => c.id === chatId);
    if (chat) chat.title = newTitle.trim();

    this.renderList();
  },

  // === УДАЛЕНИЕ ===
  async deleteChat(chatId) {
    await ChatsDB.deleteChat(chatId);

    this.chats = this.chats.filter(c => c.id !== chatId);

    // Если удалили текущий — переключаемся на первый или создаём новый
    if (chatId === this.currentChatId) {
      if (this.chats.length > 0) {
        await this.switchTo(this.chats[0].id);
      } else {
        await this.createNew();
      }
    }

    this.renderList();
  },

  // === ОЧИСТИТЬ ТЕКУЩИЙ ЧАТ ===
  async clearCurrent() {
    if (!this.currentChatId) return;
    await ChatsDB.clearMessages(this.currentChatId);

    const chatEl = document.getElementById("chat");
    if (chatEl) chatEl.innerHTML = "";

    if (typeof Context !== "undefined") Context.clear();
    if (typeof sendGreeting === "function") {
      await sendGreeting();
    }
  },

  // === СОХРАНИТЬ СООБЩЕНИЕ В ТЕКУЩИЙ ЧАТ ===
  async saveMessage(userText, botText, photo = null) {
    if (!this.currentChatId) return;
    await ChatsDB.addMessage(this.currentChatId, userText, botText, photo);

    // Обновляем время чата
    const chat = this.chats.find(c => c.id === this.currentChatId);
    if (chat) {
      chat.updated = Date.now();
      await ChatsDB.renameChat(this.currentChatId, chat.title); // обновляет updated
    }

    // Автопереименование: если название "Новый чат" — берём первые 30 символов
    if (chat && /^(Новый чат|Первый чат)$/.test(chat.title)) {
      const title = userText.slice(0, 30) + (userText.length > 30 ? "..." : "");
      await this.rename(this.currentChatId, title);
    }

    this.renderList();
  },

  // === ОТРИСОВКА СПИСКА ===
  renderList() {
    const list = document.getElementById("chatsList");
    if (!list) return;

    list.innerHTML = "";

    for (const chat of this.chats) {
      const item = document.createElement("div");
      item.className = "chat-item";
      if (chat.id === this.currentChatId) item.classList.add("active");

      const title = document.createElement("span");
      title.className = "chat-title";
      title.textContent = chat.title;
      title.title = chat.title;

      const actions = document.createElement("div");
      actions.className = "chat-actions";

      // Переименовать
      const renameBtn = document.createElement("button");
      renameBtn.className = "chat-action-btn";
      renameBtn.title = "Переименовать";
      renameBtn.textContent = "✏️";
      renameBtn.onclick = (e) => {
        e.stopPropagation();
        this.promptRename(chat.id);
      };

      // Удалить
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "chat-action-btn danger";
      deleteBtn.title = "Удалить";
      deleteBtn.textContent = "🗑";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.promptDelete(chat.id);
      };

      actions.appendChild(renameBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(title);
      item.appendChild(actions);

      item.onclick = () => this.switchTo(chat.id);

      list.appendChild(item);
    }
  },

  // === ДИАЛОГ ПЕРЕИМЕНОВАНИЯ ===
  promptRename(chatId) {
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) return;

    const newTitle = prompt("Новое название чата:", chat.title);
    if (newTitle !== null && newTitle.trim()) {
      this.rename(chatId, newTitle.trim());
    }
  },

  // === ДИАЛОГ УДАЛЕНИЯ ===
  promptDelete(chatId) {
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) return;

    if (confirm(`Удалить чат «${chat.title}»?`)) {
      this.deleteChat(chatId);
    }
  },

  // === ПЕРЕКЛЮЧИТЬ ПАНЕЛЬ ===
  togglePanel() {
    const panel = document.getElementById("chatsPanel");
    if (panel) panel.classList.toggle("open");
  }
};