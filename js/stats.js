// Статистика: сообщения, дни, топ-слова, время активности
const Stats = {

  async bump() {
    const count = (await MemoryDB.get("msg_count")) || 0;
    await MemoryDB.set("msg_count", count + 1);

    // Первый визит
    let firstVisit = await MemoryDB.get("first_visit");
    if (!firstVisit) {
      firstVisit = Date.now();
      await MemoryDB.set("first_visit", firstVisit);
    }

    // Стрик (сколько дней подряд)
    const today = todayKey();
    const lastDay = await MemoryDB.get("last_day");
    if (lastDay !== today) {
      const yesterday = this._yesterdayKey();
      let streak = (await MemoryDB.get("streak")) || 0;
      if (lastDay === yesterday) streak++;
      else streak = 1;
      await MemoryDB.set("streak", streak);
      await MemoryDB.set("last_day", today);

      // Счётчик дней всего
      const totalDays = ((await MemoryDB.get("total_days")) || 0) + 1;
      await MemoryDB.set("total_days", totalDays);
    }

    // Время активности
    const hour = new Date().getHours();
    const hourStats = (await MemoryDB.get("hour_stats")) || {};
    hourStats[hour] = (hourStats[hour] || 0) + 1;
    await MemoryDB.set("hour_stats", hourStats);

    // День недели
    const day = new Date().getDay();
    const dayStats = (await MemoryDB.get("day_stats")) || {};
    dayStats[day] = (dayStats[day] || 0) + 1;
    await MemoryDB.set("day_stats", dayStats);
  },

  _yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  },

  async trackWords(text) {
    if (!text) return;
    const stopWords = new Set([
      "и", "в", "не", "на", "я", "быть", "он", "с", "что", "а", "по",
      "это", "она", "этот", "к", "но", "они", "мы", "как", "из", "у",
      "который", "то", "за", "свой", "весь", "год", "от", "так", "о",
      "для", "ты", "же", "все", "тот", "мочь", "вы", "человек", "такой",
      "себя", "один", "ещё", "если", "уже", "или", "ни", "бы", "был",
      "ну", "да", "нет", "вот", "мне", "меня", "тебя", "тебе"
    ]);
    const words = text.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    const wordStats = (await MemoryDB.get("word_stats")) || {};
    words.forEach(w => {
      wordStats[w] = (wordStats[w] || 0) + 1;
    });
    await MemoryDB.set("word_stats", wordStats);
  },

  async getStats() {
    const count = (await MemoryDB.get("msg_count")) || 0;
    const firstVisit = (await MemoryDB.get("first_visit")) || Date.now();
    const streak = (await MemoryDB.get("streak")) || 0;
    const totalDays = (await MemoryDB.get("total_days")) || 0;

    const daysWith = Math.floor((Date.now() - firstVisit) / (1000 * 60 * 60 * 24)) + 1;

    return { count, firstVisit, daysWith, streak, totalDays };
  },

  async getTopWords(limit = 5) {
    const wordStats = (await MemoryDB.get("word_stats")) || {};
    return Object.entries(wordStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  },

  async getFavoriteHour() {
    const hourStats = (await MemoryDB.get("hour_stats")) || {};
    const entries = Object.entries(hourStats);
    if (entries.length === 0) return null;
    const [hour, count] = entries.sort((a, b) => b[1] - a[1])[0];
    return { hour: parseInt(hour), count };
  },

  async getFavoriteDay() {
    const dayStats = (await MemoryDB.get("day_stats")) || {};
    const entries = Object.entries(dayStats);
    if (entries.length === 0) return null;
    const [day, count] = entries.sort((a, b) => b[1] - a[1])[0];
    return { day: parseInt(day), count };
  },

  async format() {
    const s = await this.getStats();
    const topWords = await this.getTopWords(5);
    const favHour = await this.getFavoriteHour();
    const favDay = await this.getFavoriteDay();

    const dayNames = ["воскресенье", "понедельник", "вторник", "среда",
                      "четверг", "пятница", "суббота"];

    let out = "📊 ТВОЯ СТАТИСТИКА:\n\n";
    out += `💬 Сообщений: ${s.count}\n`;
    out += `📅 Дней с Аней: ${s.daysWith}\n`;
    out += `🔥 Стрик (подряд): ${s.streak} ${this._plural(s.streak, "день", "дня", "дней")}\n`;
    out += `📆 Активных дней: ${s.totalDays}\n`;

    if (topWords.length > 0) {
      out += `\n🏆 Топ слов:\n`;
      topWords.forEach(([w, c], i) => {
        out += `${i + 1}. ${w} (${c})\n`;
      });
    }

    if (favHour) {
      out += `\n⏰ Любимое время: ${favHour.hour}:00\n`;
    }
    if (favDay) {
      out += `📅 Любимый день: ${dayNames[favDay.day]}\n`;
    }

    return out;
  },

  _plural(n, one, few, many) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }
};