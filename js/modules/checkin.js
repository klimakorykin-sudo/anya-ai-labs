const CheckinModule = {

  async shouldCheckin() {
    const last = await MemoryDB.get("last_checkin");
    return last !== todayKey();
  },

  async markCheckedIn() {
    await MemoryDB.set("last_checkin", todayKey());
  },

  async getCheckinMessage() {
    const name = await MemoryDB.get("name");
    const hour = new Date().getHours();

    let greet;
    if (hour < 6) greet = "Ого, ты не спишь? 🌙";
    else if (hour < 12) greet = "Доброе утро";
    else if (hour < 18) greet = "Добрый день";
    else if (hour < 23) greet = "Добрый вечер";
    else greet = "Поздновато 🌙";

    const nameStr = name ? `, ${name}` : "";

    // Проверяем прошлое настроение
    const yesterday = await this.getYesterdayMood();
    let extra = "";
    if (yesterday === "sad" || yesterday === "anxious") {
      extra = "\n\n💖 Вчера тебе было грустно. Как ты сегодня?";
    } else if (yesterday === "happy") {
      extra = "\n\n✨ Вчера ты был(а) рад(а) — сегодня тоже?";
    }

    await this.markCheckedIn();

    return `${greet}${nameStr}! 💖\n\nКак ты сегодня? Отправь эмодзи — я запомню:\n😢 😐 🙂 😊 😄 😡 😰 😴 😍${extra}`;
  },

  async getYesterdayMood() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const key = d.getFullYear() + "-" +
                String(d.getMonth() + 1).padStart(2, "0") + "-" +
                String(d.getDate()).padStart(2, "0");
    return await MemoryDB.getMood(key);
  },

  async weekReport() {
    const all = await MemoryDB.allMoods();
    if (all.length < 3) return null;

    const last7 = all.slice(-7);
    const counts = {};
    last7.forEach(m => counts[m.mood] = (counts[m.mood] || 0) + 1);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    const moodNames = MoodModule.moodNames;

    let out = "📊 ОТЧЁТ ЗА НЕДЕЛЮ:\n\n";
    out += `Чаще всего настроение: ${moodNames[top[0]] || top[0]}\n`;
    out += `Записей: ${last7.length}\n\n`;

    if (top[0] === "sad" || top[0] === "anxious") {
      out += "🫂 Ты в последнее время часто грустишь.\nВсё ли хорошо? Если что — пиши «мне плохо».";
    } else if (top[0] === "happy" || top[0] === "love") {
      out += "✨ Рада, что у тебя хорошее настроение! Продолжай сиять 💖";
    } else {
      out += "💫 Спасибо, что делишься. Я рядом.";
    }

    return out;
  },

  async handle(text) {
    const t = text.toLowerCase();

    if (/(отчёт.*недел|за неделю|статистик.*недел)/.test(t)) {
      const report = await this.weekReport();
      return { text: report || "📊 Пока мало данных. Отмечай настроение эмодзи каждый день!" };
    }

    return null;
  }
};