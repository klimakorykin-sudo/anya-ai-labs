// ============================================================
// CORE.JS — Ядро Ани (с системой чатов)
// ============================================================

// ============ ЭЛЕМЕНТЫ ============
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const micBtn = document.getElementById("micBtn");
const helpBtn = document.getElementById("helpBtn");
const helpOverlay = document.getElementById("helpOverlay");
const helpContent = document.getElementById("helpContent");
const closeHelp = document.getElementById("closeHelp");
const statusLabel = document.getElementById("statusLabel");

// ============ СОСТОЯНИЕ ============
let isProcessing = false;
let lastMessageDate = null;

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
async function initAnya() {
  try {
    // 1. Инициализация памяти
    await MemoryDB.init();
    await Achievements.init();

    // 2. Инициализация чатов
    if (typeof Chats !== "undefined") {
      await Chats.init();
    }

    // 3. Инициализация микрофона
    if (typeof VoiceInput !== "undefined") {
      VoiceInput.init();
    }

    // 4. Загрузка контекста из истории
    await loadContextFromHistory();

    // 5. Установка обработчиков
    setupListeners();

    // 6. Частицы при загрузке
    spawnParticles();

    // 7. Приветствие — только если в текущем чате нет сообщений
    const chatEl = document.getElementById("chat");
    if (chatEl && chatEl.children.length === 0) {
      await sendGreeting();
    }

    // 8. Ежедневный чек-ин
    await maybeCheckin();

    // 9. Проверка достижений
    const stats = await Stats.getStats();
    await Achievements.checkAll(stats);

    // 10. Проверка праздника
    const holiday = Secrets.checkHoliday();
    if (holiday) {
      setTimeout(() => addMsg(holiday, "bot"), 2000);
    }

  } catch (e) {
    console.error("Ошибка инициализации:", e);
    addMsg("Ой, что-то пошло не так при загрузке 😅 Но я всё равно рядом!", "bot");
  }
}

// ============================================================
// ОБРАБОТЧИКИ
// ============================================================
function setupListeners() {
  // === Отправка ===
  if (sendBtn) sendBtn.addEventListener("click", () => handleSend());
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    input.addEventListener("input", updateSendButton);
  }

  // === Кнопка Помощь ===
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      if (helpContent) helpContent.textContent = allHotlinesText();
      if (helpOverlay) helpOverlay.classList.add("open");
    });
  }
  if (closeHelp) {
    closeHelp.addEventListener("click", () => {
      if (helpOverlay) helpOverlay.classList.remove("open");
    });
  }
  if (helpOverlay) {
    helpOverlay.addEventListener("click", e => {
      if (e.target === helpOverlay) helpOverlay.classList.remove("open");
    });
  }

  // === Konami-код ===
  document.addEventListener("keydown", e => {
    if (Secrets.checkKonami(e.key)) {
      addMsg(Secrets.konamiReward(), "bot");
    }
  });

  // === ЧАТЫ ===
  const chatsToggle = document.getElementById("chatsToggle");
  const closeChatsBtn = document.getElementById("closeChatsBtn");
  const newChatBtn = document.getElementById("newChatBtn");
  const chatsPanel = document.getElementById("chatsPanel");
  const chatsBackdrop = document.getElementById("chatsBackdrop");

  if (chatsToggle && chatsPanel && chatsBackdrop) {
    chatsToggle.addEventListener("click", () => {
      chatsPanel.classList.add("open");
      chatsBackdrop.classList.add("open");
    });
  }

  if (closeChatsBtn && chatsPanel && chatsBackdrop) {
    closeChatsBtn.addEventListener("click", () => {
      chatsPanel.classList.remove("open");
      chatsBackdrop.classList.remove("open");
    });
  }

  if (chatsBackdrop && chatsPanel) {
    chatsBackdrop.addEventListener("click", () => {
      chatsPanel.classList.remove("open");
      chatsBackdrop.classList.remove("open");
    });
  }

  if (newChatBtn) {
    newChatBtn.addEventListener("click", async () => {
      if (typeof Chats !== "undefined") {
        await Chats.createNew();
        if (chatsPanel) chatsPanel.classList.remove("open");
        if (chatsBackdrop) chatsBackdrop.classList.remove("open");
      }
    });
  }

  // === Закрытие панели чатов по Escape ===
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (chatsPanel) chatsPanel.classList.remove("open");
      if (chatsBackdrop) chatsBackdrop.classList.remove("open");
      if (helpOverlay) helpOverlay.classList.remove("open");
    }
  });
}

function updateSendButton() {
  if (sendBtn && input) {
    sendBtn.disabled = !input.value.trim();
  }
}

// ============================================================
// ЗАГРУЗКА КОНТЕКСТА ИЗ ПАМЯТИ
// ============================================================
async function loadContextFromHistory() {
  try {
    // Если есть текущий чат — берём его сообщения
    if (typeof Chats !== "undefined" && Chats.currentChatId) {
      const messages = await ChatsDB.getMessages(Chats.currentChatId);
      if (messages.length > 0) {
        Context.clear();
        for (const msg of messages.slice(-50)) {
          Context.push(msg.user, msg.bot);
        }
        return;
      }
    }

    // Иначе — из общей истории
    const history = await MemoryDB.recentHistory(30);
    if (history.length > 0) {
      Context.history = history;
    }
  } catch (e) {
    console.warn("Не удалось загрузить историю:", e);
  }
}

// ============================================================
// ДОБАВЛЕНИЕ СООБЩЕНИЙ
// ============================================================
function addMsg(text, who = "bot", isHTML = false, photo = null) {
  if (!chat) return;

  // Разделитель дат
  const today = todayKey();
  if (lastMessageDate !== today) {
    const divider = document.createElement("div");
    divider.className = "date-divider";
    divider.textContent = formatDateLabel(today);
    chat.appendChild(divider);
    lastMessageDate = today;
  }

  const div = document.createElement("div");
  div.className = "msg " + who;

  if (isHTML) {
    div.innerHTML = text;
  } else {
    div.textContent = text;
  }

  if (photo) {
    const img = document.createElement("img");
    img.src = photo;
    img.className = "photo";
    img.alt = "Фото Ани";
    img.onerror = () => {
      img.alt = "Фото не найдено 😢";
      img.style.display = "none";
    };
    div.appendChild(img);
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function formatDateLabel(dateKey) {
  const today = todayKey();
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  })();

  if (dateKey === today) return "Сегодня";
  if (dateKey === yesterday) return "Вчера";

  const [y, m, d] = dateKey.split("-");
  const months = ["янв", "фев", "мар", "апр", "мая", "июн",
                  "июл", "авг", "сен", "окт", "ноя", "дек"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

// ============================================================
// ИНДИКАТОР ПЕЧАТИ
// ============================================================
function showTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.id = "typingIndicator";
  div.textContent = "печатает";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  if (statusLabel) statusLabel.textContent = "печатает...";
}

function hideTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
  if (statusLabel) statusLabel.textContent = "онлайн";
}

// ============================================================
// ОТПРАВКА
// ============================================================
async function handleSend(customText) {
  if (isProcessing) return;

  const text = (customText || input.value).trim();
  if (!text) return;

  isProcessing = true;
  if (sendBtn) sendBtn.disabled = true;

  // Добавляем сообщение пользователя
  addMsg(text, "user");
  if (input) input.value = "";

  // Память: имя
  const nameMatch = text.match(/меня зовут ([А-Яа-яЁёA-Za-z]+)/i);
  if (nameMatch) {
    await MemoryDB.set("name", nameMatch[1]);
    const ach = await Achievements.unlock("tell_name");
    if (ach) setTimeout(() => addMsg(`${ach.icon} Достижение: ${ach.name}!`, "bot"), 1500);
  }

  // Статистика
  try {
    await Stats.bump();
    await Stats.trackWords(text);
  } catch (e) {}

  // Показываем «печатает»
  showTyping();

  // Небольшая задержка для естественности
  const delay = rnd(500, 1400);
  await new Promise(r => setTimeout(r, delay));

  try {
    // Снимаем обращение «Аня, ...»
    const cleanText = Brain.cleanInput(text);

    // Думаем
    const reply = await Brain.think(cleanText);

    hideTyping();

    // Выводим ответ
    if (reply.photo) {
      addMsg(reply.text, "bot", false, reply.photo);
      const ach = await Achievements.unlock("first_photo");
      if (ach) setTimeout(() => addMsg(`${ach.icon} Достижение: ${ach.name}!`, "bot"), 1500);
    } else if (reply.isHTML || /<pre>|<a |<code>|<b>/.test(reply.text || "")) {
      addMsg(reply.text, "bot", true);
    } else {
      addMsg(reply.text, "bot");
    }

    // Сохраняем в контекст
    Context.push(text, reply.text);

    // ⭐ Сохраняем в текущий чат И общую память
    try {
      if (typeof Chats !== "undefined") {
        await Chats.saveMessage(text, reply.text, reply.photo || null);
      }
      await MemoryDB.addHistory(text, reply.text);
    } catch (e) {}

    // Озвучка (если включена)
    if (window.speakAnya && window.VoiceOutput && VoiceOutput.enabled) {
      VoiceOutput.speak(reply.text);
    }

    // Проверяем достижения
    const stats = await Stats.getStats();
    const newAch = await Achievements.checkAll(stats);
    if (newAch) {
      setTimeout(() => addMsg(`${newAch.icon} Достижение: ${newAch.name}!`, "bot"), 2000);
    }

  } catch (e) {
    console.error("Ошибка обработки:", e);
    hideTyping();
    addMsg("Ой, я запуталась 😅 Попробуй ещё раз!", "bot");
  }

  isProcessing = false;
  if (sendBtn) updateSendButton();
}

// ============================================================
// ПРИВЕТСТВИЕ
// ============================================================
async function sendGreeting() {
  const name = await MemoryDB.get("name");
  const stats = await Stats.getStats();
  const hour = new Date().getHours();

  let greet;
  if (hour < 6) greet = "Ого, ты не спишь? 🌙";
  else if (hour < 12) greet = "Доброе утро";
  else if (hour < 18) greet = "Привет";
  else greet = "Добрый вечер";

  let msg;
  if (name) {
    msg = `${greet}, ${name}! 💖 Рада тебя видеть!`;
  } else {
    msg = `${greet}! ✨ Я Аня. Как тебя зовут?`;
  }

  if (stats.count > 1) {
    msg += "\n\n💫 Я помню наши прошлые разговоры.";
  }

  addMsg(msg, "bot");

  // Сохраняем приветствие в чат
  try {
    if (typeof Chats !== "undefined") {
      await Chats.saveMessage("", msg);
    }
  } catch (e) {}
}

// ============================================================
// ЕЖЕДНЕВНЫЙ ЧЕК-ИН
// ============================================================
async function maybeCheckin() {
  try {
    if (await CheckinModule.shouldCheckin()) {
      setTimeout(async () => {
        const checkinMsg = await CheckinModule.getCheckinMessage();
        addMsg(checkinMsg, "bot");

        if (typeof Chats !== "undefined") {
          await Chats.saveMessage("", checkinMsg);
        }
      }, 3000);
    }
  } catch (e) {
    console.warn("Ошибка чек-ина:", e);
  }
}

// ============================================================
// ЧАСТИЦЫ
// ============================================================
function spawnParticles() {
  const symbols = ["💖", "✨", "🌸", "💫", "⭐"];
  const container = document.getElementById("particles");
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const p = document.createElement("div");
      p.className = "particle";
      p.textContent = pick(symbols);
      p.style.left = rnd(5, 95) + "%";
      p.style.top = rnd(60, 95) + "%";
      container.appendChild(p);
      setTimeout(() => p.remove(), 3500);
    }, i * 250);
  }
}

// ============================================================
// ЭКСПОРТ ДИАЛОГА
// ============================================================
async function exportDialog() {
  try {
    let history = [];

    if (typeof Chats !== "undefined" && Chats.currentChatId) {
      history = await ChatsDB.getMessages(Chats.currentChatId);
    } else {
      history = await MemoryDB.recentHistory(200);
    }

    if (!history.length) {
      addMsg("📥 Пока нечего экспортировать — поговори со мной!", "bot");
      return;
    }

    let out = "💬 Диалог с Аней\n" + "=".repeat(40) + "\n\n";
    history.forEach(h => {
      const date = new Date(h.time).toLocaleString("ru-RU");
      out += `[${date}]\n`;
      if (h.user) out += `Ты: ${h.user}\n`;
      out += `Аня: ${h.bot}\n\n`;
    });

    const blob = new Blob([out], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anya_dialog_${todayKey()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    addMsg("📥 Диалог сохранён в файл!", "bot");
  } catch (e) {
    addMsg("😅 Не получилось сохранить.", "bot");
  }
}

// ============================================================
// СБРОС ПАМЯТИ
// ============================================================
async function resetMemory() {
  try {
    await MemoryDB.clearAll();
    Context.clear();
    addMsg("🗑 Память стёрта. Начнём сначала! Как тебя зовут?", "bot");
  } catch (e) {
    addMsg("😅 Не получилось стереть.", "bot");
  }
}

// ============================================================
// ПРОФИЛЬ
// ============================================================
async function showProfile() {
  const name = await MemoryDB.get("name");
  const facts = await MemoryDB.allFacts();
  const notes = await MemoryDB.allNotes();
  const stats = await Stats.getStats();
  const topWords = await Stats.getTopWords(5);
  const moods = await MemoryDB.allMoods();

  let out = "👤 Что Аня знает обо мне:\n\n";
  out += `📛 Имя: ${name || "(не сказал)"}\n`;
  out += `💬 Сообщений: ${stats.count}\n`;
  out += `📅 Дней с Аней: ${stats.daysWith}\n`;
  out += `🔥 Стрик: ${stats.streak}\n\n`;

  if (topWords.length) {
    out += `🏆 Любимые слова: ${topWords.map(w => w[0]).join(", ")}\n\n`;
  }

  if (facts.length) {
    out += `💾 Запомненные факты (${facts.length}):\n`;
    facts.slice(-5).forEach(f => out += `• ${f.fact.slice(0, 80)}\n`);
  }

  if (notes.length) {
    out += `\n📝 Заметки: ${notes.length}\n`;
  }

  if (moods.length) {
    const last = moods[moods.length - 1];
    out += `\n😊 Последнее настроение: ${MoodModule.moodNames[last.mood] || last.mood}\n`;
  }

  addMsg(out, "bot");
}

// ============================================================
// СТАТИСТИКА
// ============================================================
async function showStats() {
  const statsText = await Stats.format();
  addMsg(statsText, "bot");
}

// ============================================================
// ДОСТИЖЕНИЯ
// ============================================================
async function showAchievements() {
  const achText = await Achievements.format();
  addMsg(achText, "bot");
}

// ============================================================
// ЗАПУСК
// ============================================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnya);
} else {
  initAnya();
}

// Экспорт функций
window.anyaExport = exportDialog;
window.anyaReset = resetMemory;
window.anyaProfile = showProfile;
window.anyaStats = showStats;
window.anyaAchievements = showAchievements;