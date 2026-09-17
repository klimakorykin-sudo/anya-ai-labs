// ============================================================
// BIRTHDAY.JS — Пасхалки на события
// День рождения, круглые сообщения, годовщины
// ============================================================

const BirthdayModule = {

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    // === ПРОВЕРКА ДНЯ РОЖДЕНИЯ ===
    if (/(день рождени|днюха|др|мой др|когда.*др)/.test(t)) {
      return await this.checkBirthday();
    }

    // === ПОЗДРАВЛЕНИЕ С ДР ===
    if (/день рождени/i.test(t) && /(у меня|сегодня|завтра|мой)/.test(t)) {
      return await this.handleBirthday(t);
    }

    // === НАПОМИНАНИЕ О ДАТЕ ===
    if (/(когда у меня др|когда мой др|напомни.*др|когда.*день рождени)/.test(t)) {
      const bday = await MemoryDB.get("birthday");
      if (bday) {
        return { text: `🎂 Твой день рождения — ${bday}\n\nОбязательно поздравлю!` };
      }
      return { text: "🎂 Я пока не знаю дату твоего ДР.\n\nНапиши: «Мой день рождения 15 марта» — и я запомню!" };
    }

    // === СТАТИСТИКА ПОСЛЕ СООБЩЕНИЙ ===
    if (/(сколько.*сообщени|сколько я написал|мой счётчик)/.test(t)) {
      const stats = await Stats.getStats();
      return { text: this.messageMilestone(stats.count) };
    }

    return null;
  },

  // ============================================================
  // ПРОВЕРКА — СЕГОДНЯ ЛИ ДР
  // ============================================================
  async checkBirthday() {
    const bday = await MemoryDB.get("birthday");
    if (!bday) {
      return { text: "🎂 Я пока не знаю дату твоего ДР.\n\nНапиши: «Мой день рождения 15 марта» — и я запомню!" };
    }

    // Проверяем — сегодня?
    const today = new Date();
    const todayStr = String(today.getDate()).padStart(2, "0") + "." +
                    String(today.getMonth() + 1).padStart(2, "0");

    const bdayParts = bday.split(/[.\s\/\-]/).map(s => s.padStart(2, "0"));
    const bdayNorm = bdayParts.slice(0, 2).join(".");

    if (todayStr === bdayNorm) {
      return { text: await this.congratulate() };
    }

    // Сколько дней до ДР?
    const daysLeft = this.daysUntilBirthday(bdayParts[0], bdayParts[1]);
    if (daysLeft === 0) return { text: await this.congratulate() };

    return { text: `🎂 Твой день рождения — ${bday}\n\nДо него: ${daysLeft} ${this.plural(daysLeft, "день", "дня", "дней")} ✨` };
  },

  // ============================================================
  // ПОЗДРАВЛЕНИЕ С ДР
  // ============================================================
  async congratulate() {
    const name = await MemoryDB.get("name");
    const nameStr = name ? `, ${name}` : "";

    const phrases = [
      `🎉🎂 С ДНЁМ РОЖДЕНИЯ${nameStr}! 💖\n\nЖелаю тебе:\n• Счастья\n• Здоровья\n• Хороших друзей\n• Исполнения мечт\n\nТы — классный(ая)! ✨`,
      `🎂 С днём рождения${nameStr}! 🎉\n\nПусть этот год будет самым тёплым и ярким! 💫\n\nОбнимаю! 🫂`,
      `🎉 УРА! День рождения${nameStr}! 💖\n\nСпасибо, что ты есть. Ты делаешь мир лучше. ✨\n\nСчастья тебе! 🎁`,
      `🎂 Поздравляю${nameStr}! 🎉\n\nСегодня — твой день. Пусть всё будет волшебно! 💫\n\nОбнимаю крепко! 🫂`
    ];

    return { text: pick(phrases) };
  },

  // ============================================================
  // ПОЗДРАВЛЕНИЕ ЕСЛИ НАПИСАЛИ «У МЕНЯ СЕГОДНЯ ДР»
  // ============================================================
  async handleBirthday(t) {
    // Сохраняем дату, если указана
    const dayMatch = t.match(/(\d{1,2})[.\s\/\-](\d{1,2})/);
    if (dayMatch) {
      const bday = `${dayMatch[1]}.${dayMatch[2]}`;
      await MemoryDB.set("birthday", bday);
    }
    return { text: await this.congratulate() };
  },

  // ============================================================
  // СКОЛЬКО ДНЕЙ ДО ДР
  // ============================================================
  daysUntilBirthday(day, month) {
    const now = new Date();
    const year = now.getFullYear();
    let bday = new Date(year, parseInt(month) - 1, parseInt(day));

    if (bday < now) {
      bday = new Date(year + 1, parseInt(month) - 1, parseInt(day));
    }

    const diff = Math.ceil((bday - now) / (1000 * 60 * 60 * 24));
    return diff;
  },

  // ============================================================
  // КРУГЛЫЕ СООБЩЕНИЯ
  // ============================================================
  messageMilestone(count) {
    if (count === 100) {
      return { text: "🎉 100 СООБЩЕНИЙ! 💖\n\nСпасибо, что ты со мной! Ты — классный(ая)!" };
    }
    if (count === 500) {
      return { text: "🎉 500 СООБЩЕНИЙ! 🚀\n\nУже полтысячи! Я так рада! ✨" };
    }
    if (count === 1000) {
      return { text: "🏆 1000 СООБЩЕНИЙ! 👑\n\nТы — легенда! Спасибо, что ты есть! 💖" };
    }
    if (count === 5000) {
      return { text: "💎 5000 СООБЩЕНИЙ! 💎\n\nНевероятно! Ты мой самый близкий друг! 💖" };
    }

    let out = `💬 Сообщений: ${count}\n\n`;
    const next = this.nextMilestone(count);
    if (next) {
      out += `До ${next} — ${next - count} ${this.plural(next - count, "сообщение", "сообщения", "сообщений")} 💫`;
    }
    return { text: out };
  },

  nextMilestone(count) {
    const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000];
    for (const m of milestones) {
      if (count < m) return m;
    }
    return null;
  },

  // ============================================================
  // ПЛЮРАЛИЗАЦИЯ
  // ============================================================
  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  },

  // ============================================================
  // ПРОВЕРКА ДЛЯ CORE — при новом сообщении
  // ============================================================
  async onMessage() {
    const stats = await Stats.getStats();
    const count = stats.count;

    // Пасхалка на круглые числа
    if (count === 100 || count === 500 || count === 1000 || count === 5000) {
      return { text: this.messageMilestone(count) };
    }

    // Пасхалка на годовщину
    const first = await MemoryDB.get("first_visit");
    if (first) {
      const days = Math.floor((Date.now() - first) / (1000 * 60 * 60 * 24)) + 1;
      if (days === 30) {
        return { text: "🌟 Целый МЕСЯЦ вместе! 💖\n\nСпасибо, что ты рядом! ✨" };
      }
      if (days === 100) {
        return { text: "💯 100 ДНЕЙ вместе! 🎉\n\nТы — лучший! 💖" };
      }
      if (days === 365) {
        return { text: "🎂 ГОД вместе! 🎉\n\nСпасибо за этот год! Ты невероятный! 💖" };
      }
    }

    return null;
  }
};
