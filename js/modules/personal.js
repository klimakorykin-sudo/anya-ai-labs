const PersonalModule = {

  async handle(text) {
    const t = text.toLowerCase();

    // === ВОПРОС ПРО ИМЯ ===
    if (/(как меня зовут|моё имя|мое имя|как звать|вспомни.*имя|знаешь.*имя)/.test(t)) {
      const name = await MemoryDB.get("name");
      if (name) {
        return { text: pick([
          `Тебя зовут ${name}! 💖`,
          `${name} ✨ Как я могу забыть?`,
          `Ты — ${name} 💫 Конечно помню!`,
          `${name} 🌸 Я помню всё, что ты мне говорил!`
        ]) };
      }
      return { text: "Хм, ты ещё не говорил своё имя 🤔 Напиши: «Меня зовут ...»" };
    }

    // === КАК ЗАПОМНИТЬ ИМЯ (из сообщения) ===
    // Это уже делается в core.js, но можно проверить
    const nameMatch = text.match(/меня зовут ([А-Яа-яЁёA-Za-z]+)/i);
    if (nameMatch) {
      const name = nameMatch[1];
      await MemoryDB.set("name", name);
      return { text: pick([
        `Приятно познакомиться, ${name}! 💖`,
        `Запомнила! Ты — ${name} ✨`,
        `${name} — красивое имя 🌸`,
        `Рада знакомству, ${name}! 💫`
      ]) };
    }

    // === СКОЛЬКО МНЕ ЛЕТ ===
    if (/(сколько мне лет|мой возраст|как.*стар|сколько.*год)/.test(t)) {
      const age = await MemoryDB.get("age");
      if (age) {
        return { text: `Тебе ${age}! 🌸` };
      }
      return { text: "Ты не говорил свой возраст 🤔 Напиши: «Мне X лет»" };
    }

    // === ЗАПОМНИТЬ ВОЗРАСТ ===
    const ageMatch = text.match(/мне\s+(\d{1,3})\s*(лет|года|год)/i);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      if (age > 0 && age < 120) {
        await MemoryDB.set("age", age);
        return { text: `Запомнила! Тебе ${age} 💖` };
      }
    }

    // === МОЯ ЛЮБИМАЯ ТЕМА ===
    if (/(что я люблю|моя любимая тема|мои интересы|что мне нравится|о чём я люблю)/.test(t)) {
      const topic = await MemoryDB.get("favorite_topic");
      if (topic) {
        return { text: `Ты любишь ${topic}! 💖` };
      }
      return { text: "Ты не рассказывал про интересы 🤔 Напиши: «Я люблю ...»" };
    }

    // === ЗАПОМНИТЬ ИНТЕРЕС ===
    const topicMatch = text.match(/(я люблю|мне нравится|моя любимая тема[:\s]+)([А-Яа-яЁёA-Za-z\s,]+)/i);
    if (topicMatch && topicMatch[2]) {
      const topic = topicMatch[2].trim().slice(0, 50);
      if (topic && topic.length > 1) {
        await MemoryDB.set("favorite_topic", topic);
        return { text: `Запомнила! Ты любишь ${topic} 💖` };
      }
    }

    // === ЧТО ТЫ ОБО МНЕ ЗНАЕШЬ ===
    if (/(что ты обо мне знаешь|что ты знаешь про меня|расскажи.*обо мне|информац.*обо мне|мой профиль)/.test(t)) {
      return { text: await this.getProfile() };
    }

    // === СКОЛЬКО ДНЕЙ МЫ ЗНАКОМЫ ===
    if (/(сколько.*(дней|мы знакомы)|как давно.*знакомы)/.test(t)) {
      const first = await MemoryDB.get("first_visit");
      if (first) {
        const days = Math.floor((Date.now() - first) / (1000 * 60 * 60 * 24)) + 1;
        const name = await MemoryDB.get("name");
        const nameStr = name ? `, ${name}` : "";
        return { text: pick([
          `Мы знакомы ${days} ${this.plural(days, "день", "дня", "дней")} 💫`,
          `${days} ${this.plural(days, "день", "дня", "дней")} вместе! ✨${nameStr ? " " + nameStr : ""}`,
          `Уже ${days} ${this.plural(days, "день", "дня", "дней")} как мы общаемся 💖`
        ]) };
      }
      return { text: "Пока не знаю. Наверное, мы только познакомились 💫" };
    }

    // === ЗАБУДЬ ПРО МЕНЯ / СБРОС ===
    if (/(забудь.*меня|удали.*данные|сотри.*память|забудь.*имя|очисти.*данные)/.test(t)) {
      await MemoryDB.delete("name");
      await MemoryDB.delete("age");
      await MemoryDB.delete("favorite_topic");
      return { text: "Хорошо, я всё забыла 💫 Если хочешь — расскажи заново!" };
    }

    return null;
  },

  async getProfile() {
    const name = await MemoryDB.get("name");
    const age = await MemoryDB.get("age");
    const topic = await MemoryDB.get("favorite_topic");
    const facts = await MemoryDB.allFacts();
    const stats = await Stats.getStats();
    const topWords = await Stats.getTopWords(5);

    let out = "👤 Вот что я знаю о тебе:\n\n";

    out += `📛 Имя: ${name || "неизвестно"}\n`;
    out += `🎂 Возраст: ${age ? age + " лет" : "неизвестно"}\n`;
    out += `💖 Любишь: ${topic || "неизвестно"}\n\n`;

    out += `📊 Статистика:\n`;
    out += `💬 Сообщений: ${stats.count}\n`;
    out += `📅 Дней вместе: ${stats.daysWith}\n`;
    out += `🔥 Стрик: ${stats.streak}\n\n`;

    if (topWords.length) {
      out += `🏆 Частые слова: ${topWords.map(w => w[0]).join(", ")}\n\n`;
    }

    if (facts.length) {
      out += `💾 Запомненные факты (${facts.length}):\n`;
      facts.slice(-5).forEach(f => out += `• ${f.fact.slice(0, 80)}\n`);
    }

    return out.trim();
  },

  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
};
