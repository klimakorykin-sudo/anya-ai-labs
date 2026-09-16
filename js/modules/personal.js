// ============================================================
// PERSONAL.JS — Личные вопросы про пользователя
// Ловит имя, возраст, класс, интересы
// ============================================================

const PersonalModule = {

  async handle(text) {
    const t = text.toLowerCase();

    // ВОПРОС ПРО ИМЯ
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

    // СОХРАНИТЬ ИМЯ
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

    // ВОПРОС ПРО ВОЗРАСТ
    if (/(сколько мне лет|мой возраст|как.*стар|сколько.*год)/.test(t)) {
      const age = await MemoryDB.get("age");
      if (age) {
        return { text: `Тебе ${age} ${this.plural(age, "год", "года", "лет")}! 🌸` };
      }
      return { text: "Ты не говорил свой возраст 🤔 Напиши: «Мне X лет»" };
    }

    // СОХРАНИТЬ ВОЗРАСТ
    const ageMatch = text.match(/мне\s+(\d{1,3})\s*(?:лет|года|год)/i);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      if (age > 0 && age < 120) {
        await MemoryDB.set("age", age);
        return { text: `Запомнила! Тебе ${age} ${this.plural(age, "год", "года", "лет")} 💖` };
      }
    }

    // ВОПРОС ПРО КЛАСС
    if (/(в каком.*класс|какой.*класс|мой класс|как.*учусь|сколько.*класс)/.test(t)) {
      const grade = await MemoryDB.get("grade");
      if (grade) {
        return { text: `Ты в ${grade} классе! 📚` };
      }
      return { text: "Ты не говорил свой класс 🤔 Напиши: «Я в 7 классе»" };
    }

    // СОХРАНИТЬ КЛАСС
    const gradeMatch = text.match(/(?:я в|учусь в|пошёл в|пошел в|хожу в)\s+(\d{1,2})\s*класс/i);
    if (gradeMatch) {
      const grade = parseInt(gradeMatch[1]);
      if (grade >= 1 && grade <= 11) {
        await MemoryDB.set("grade", grade);
        return { text: `Запомнила! Ты в ${grade} классе 📚` };
      }
    }

    // ЛЮБИМАЯ ТЕМА
    if (/(что я люблю|моя любимая тема|мои интересы|что мне нравится|о чём я люблю)/.test(t)) {
      const topic = await MemoryDB.get("favorite_topic");
      if (topic) {
        return { text: `Ты любишь ${topic}! 💖` };
      }
      return { text: "Ты не рассказывал про интересы 🤔 Напиши: «Я люблю ...»" };
    }

    const topicMatch = text.match(/(я люблю|мне нравится|моя любимая тема[:\s]+)([А-Яа-яЁёA-Za-z\s,]+)/i);
    if (topicMatch && topicMatch[2]) {
      const topic = topicMatch[2].trim().slice(0, 50);
      if (topic && topic.length > 1) {
        await MemoryDB.set("favorite_topic", topic);
        return { text: `Запомнила! Ты любишь ${topic} 💖` };
      }
    }

    // ПРОФИЛЬ
    if (/(что ты обо мне знаешь|что ты знаешь про меня|расскажи.*обо мне|информац.*обо мне|мой профиль)/.test(t)) {
      return { text: await this.getProfile() };
    }

    // СКОЛЬКО ДНЕЙ ЗНАКОМЫ
    if (/(сколько.*(дней|мы знакомы)|как давно.*знакомы)/.test(t)) {
      const first = await MemoryDB.get("first_visit");
      if (first) {
        const days = Math.floor((Date.now() - first) / (1000 * 60 * 60 * 24)) + 1;
        return { text: `Мы знакомы ${days} ${this.plural(days, "день", "дня", "дней")} 💫` };
      }
      return { text: "Пока не знаю. Наверное, мы только познакомились 💫" };
    }

    // ЗАБУДЬ
    if (/(забудь.*меня|удали.*данные|сотри.*память|забудь.*имя)/.test(t)) {
      await MemoryDB.delete("name");
      await MemoryDB.delete("age");
      await MemoryDB.delete("grade");
      await MemoryDB.delete("favorite_topic");
      return { text: "Хорошо, я всё забыла 💫 Если хочешь — расскажи заново!" };
    }

    return null;
  },

  async getProfile() {
    const name = await MemoryDB.get("name");
    const age = await MemoryDB.get("age");
    const grade = await MemoryDB.get("grade");
    const topic = await MemoryDB.get("favorite_topic");
    const facts = await MemoryDB.allFacts();
    const stats = await Stats.getStats();

    let out = "👤 Вот что я знаю о тебе:\n\n";
    out += `📛 Имя: ${name || "неизвестно"}\n`;
    out += `📚 Класс: ${grade ? grade + " класс" : "неизвестно"}\n`;
    out += `🎂 Возраст: ${age ? age + " " + this.plural(age, "год", "года", "лет") : "неизвестно"}\n`;
    out += `💖 Любишь: ${topic || "неизвестно"}\n\n`;
    out += `📊 Статистика:\n`;
    out += `💬 Сообщений: ${stats.count}\n`;
    out += `📅 Дней вместе: ${stats.daysWith}\n`;
    out += `🔥 Стрик: ${stats.streak}\n`;

    return out.trim();
  },

  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
};
