// ============================================================
// SETTINGS.JS — Настройки и управление Аней
// ============================================================

const SettingsModule = {

  async handle(text) {
    const t = text.toLowerCase().trim();

    // === СПИСОК НАСТРОЕК ===
    if (/^(настройки|настройка|опции|параметры|команды|что ты умеешь настроить)[!?.\s]*$/.test(t)) {
      return { text:
        "⚙️ НАСТРОЙКИ АНИ:\n\n" +
        "📋 Профиль:\n" +
        "• «профиль» — что я знаю о тебе\n" +
        "• «статистика» — сообщения, дни, стрик\n" +
        "• «достижения» — что открыто\n\n" +
        "🎨 Внешний вид:\n" +
        "• «смени фон» — выбор фона (тёмный, матрица, аниме, белый)\n" +
        "• «какой фон» — какой сейчас\n\n" +
        "💬 Чаты:\n" +
        "• «очисти чат» — удалить текущую переписку\n" +
        "• «новый чат» — создать новый\n" +
        "• «мои чаты» — список чатов\n\n" +
        "💾 Данные:\n" +
        "• «экспорт» — сохранить диалог в файл\n" +
        "• «сбросить память» — стереть всё\n" +
        "• «забудь меня» — стереть имя/класс/возраст\n\n" +
        "📞 Помощь:\n" +
        "• «помощь» — телефоны доверия"
      };
    }

    // === ПРОФИЛЬ ===
    if (/^(профиль|мой профиль|что ты обо мне знаешь|что знаешь про меня)[!?.\s]*$/.test(t)) {
      if (typeof PersonalModule !== "undefined") {
        return { text: await PersonalModule.getProfile() };
      }
      return null;
    }

    // === СТАТИСТИКА ===
    if (/^(статистика|моя статистика|покажи статистику|сколько сообщений|мой стрик)[!?.\s]*$/.test(t)) {
      if (typeof Stats !== "undefined") {
        return { text: await Stats.format() };
      }
      return null;
    }

    // === ДОСТИЖЕНИЯ ===
    if (/^(достижения|мои достижения|покажи достижения|ачивки)[!?.\s]*$/.test(t)) {
      if (typeof Achievements !== "undefined") {
        return { text: await Achievements.format() };
      }
      return null;
    }

    // === ОЧИСТИТЬ ЧАТ ===
    if (/^(очисти чат|очистить чат|удали переписку|удали текущий чат|стереть чат)[!?.\s]*$/.test(t)) {
      if (typeof Chats !== "undefined" && typeof Chats.clearCurrent === "function") {
        await Chats.clearCurrent();
        return { text: "🗑 Чат очищен. Начнём с чистого листа!" };
      }
      return { text: "🗑 Не получилось очистить. Попробуй ещё раз." };
    }

    // === НОВЫЙ ЧАТ ===
    if (/^(новый чат|создай чат|создать чат|начни новый)[!?.\s]*$/.test(t)) {
      if (typeof Chats !== "undefined" && typeof Chats.createNew === "function") {
        await Chats.createNew();
        return { text: "💬 Новый чат создан! Что расскажешь?" };
      }
      return { text: "💬 Открой меню чатов (☰) и нажми ➕" };
    }

    // === МОИ ЧАТЫ ===
    if (/^(мои чаты|список чатов|покажи чаты|все чаты)[!?.\s]*$/.test(t)) {
      if (typeof Chats !== "undefined" && Chats.chats) {
        if (Chats.chats.length === 0) {
          return { text: "💬 У тебя пока нет чатов. Создай новый — напиши «новый чат»." };
        }
        let out = "💬 ТВОИ ЧАТЫ:\n\n";
        Chats.chats.forEach((c, i) => {
          const isCurrent = c.id === Chats.currentChatId ? " ⬅️" : "";
          out += `${i + 1}. ${c.title}${isCurrent}\n`;
        });
        out += "\nОткрой меню ☰ для переключения.";
        return { text: out };
      }
      return { text: "💬 Открой меню чатов (☰)" };
    }

    // === ЭКСПОРТ ===
    if (/^(экспорт|сохрани диалог|скачать диалог|выгрузи чат)[!?.\s]*$/.test(t)) {
      if (typeof exportDialog === "function") {
        await exportDialog();
        return null;
      }
      return { text: "📥 Не получилось сохранить. Попробуй ещё раз." };
    }

    // === СМЕНИТЬ ФОН ===
    if (/^(смени фон|сменить фон|поменяй фон|выбери фон)[!?.\s]*$/.test(t)) {
      if (typeof Background !== "undefined" && typeof Background.openMenu === "function") {
        Background.openMenu();
        return { text: "🎨 Открыла меню фонов. Выбери любой!" };
      }
      return { text: "🎨 Нажми кнопку 🎨 в шапке, чтобы сменить фон." };
    }

    // === КАКОЙ ФОН ===
    if (/^(какой фон|какой сейчас фон|текущий фон)[!?.\s]*$/.test(t)) {
      if (typeof Background !== "undefined") {
        const labels = {
          dark: "🌙 Тёмный",
          matrix: "🟢 Матрица",
          anime: "🌸 Аниме",
          white: "⚪ Белый"
        };
        const current = Background.current || "dark";
        return { text: `🎨 Сейчас: ${labels[current] || current}` };
      }
      return null;
    }

    // === СМЕНИТЬ ФОН НА КОНКРЕТНЫЙ ===
    const bgMatch = t.match(/^(?:смени|поставь|включи)\s+фон\s+(тёмный|темный|матриц[ауы]|аниме|белый|белую)/i);
    if (bgMatch) {
      const choice = bgMatch[1].toLowerCase();
      let variant = "dark";
      if (/матриц/.test(choice)) variant = "matrix";
      else if (/аниме/.test(choice)) variant = "anime";
      else if (/бел/.test(choice)) variant = "white";
      else variant = "dark";

      if (typeof Background !== "undefined" && typeof Background.set === "function") {
        Background.set(variant);
        return { text: `🎨 Фон изменён на ${choice}` };
      }
      return null;
    }

    // === СБРОСИТЬ ПАМЯТЬ ===
    if (/^(сбросить память|сбрось память|стереть память|стереть всё|очисти всё|удали всё)[!?.\s]*$/.test(t)) {
      if (typeof resetMemory === "function") {
        await resetMemory();
        return null;
      }
      return { text: "🗑 Не получилось сбросить память." };
    }

    // === ЗАБУДЬ МЕНЯ ===
    if (/^(забудь меня|удали мои данные|сотри мои данные)[!?.\s]*$/.test(t)) {
      if (typeof MemoryDB !== "undefined") {
        await MemoryDB.delete("name");
        await MemoryDB.delete("age");
        await MemoryDB.delete("grade");
        await MemoryDB.delete("favorite_topic");
        return { text: "🗑 Я забыла твоё имя, возраст, класс и интересы. Расскажешь заново?" };
      }
      return null;
    }

    // === ПОМОЩЬ ===
    if (/^(помощь|помоги|телефон доверия|номера|кризис)[!?.\s]*$/.test(t)) {
      if (typeof allHotlinesText === "function") {
        return { text: allHotlinesText() };
      }
      return null;
    }

    return null;
  }
};
