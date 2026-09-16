const MoodModule = {

  moodEmojis: {
    "😢": "sad",
    "😭": "sad",
    "😐": "neutral",
    "🙂": "okay",
    "😊": "happy",
    "😄": "happy",
    "😡": "angry",
    "😤": "angry",
    "😰": "anxious",
    "😱": "anxious",
    "😴": "tired",
    "😍": "love",
    "🥰": "love"
  },

  moodNames: {
    sad: "грустное 😢",
    neutral: "спокойное 😐",
    okay: "нормальное 🙂",
    happy: "радостное 😊",
    angry: "злое 😡",
    anxious: "тревожное 😰",
    tired: "усталое 😴",
    love: "влюблённое 😍"
  },

  async handle(text) {
    const t = text.toLowerCase();

    // Отметить настроение эмодзи
    for (const [emo, mood] of Object.entries(this.moodEmojis)) {
      if (text.includes(emo)) {
        const date = todayKey();
        await MemoryDB.setMood(date, mood);

        // Отдельно записываем эмодзи в статистику
        const recentMoods = (await MemoryDB.get("recent_moods")) || [];
        recentMoods.push({ date, mood, emo });
        if (recentMoods.length > 30) recentMoods.shift();
        await MemoryDB.set("recent_moods", recentMoods);

        // Реакция Ани
        let reaction = "Записала твоё настроение";
        if (mood === "sad") reaction = "🫂 Обнимаю. Всё наладится";
        else if (mood === "happy") reaction = "✨ Рада за тебя!";
        else if (mood === "angry") reaction = "😤 Понимаю. Что случилось?";
        else if (mood === "anxious") reaction = "🫂 Я рядом";
        else if (mood === "tired") reaction = "😴 Отдохни, если можешь";
        else if (mood === "love") reaction = "💖 Как приятно!";

        return { text: `${emo} ${reaction}` };
      }
    }

    // Статистика настроения
    if (/(как.*моё настроени|моё настроени|статистик.*настроени|дневник.*настроени|настроение за неделю)/.test(t)) {
      return await this.getMoodReport();
    }

    // Подсказка
    if (/отметь.*настроение|запиши.*настроение/.test(t)) {
      return { text: "Отправь эмодзи, и я запомню:\n😢 😐 🙂 😊 😄 😡 😰 😴 😍" };
    }

    return null;
  },

  async getMoodReport() {
    const all = await MemoryDB.allMoods();
    if (all.length === 0) {
      return { text: "📊 Пока нет записей о настроении.\n\nОтправь эмодзи 😊 или 😢 — и я запомню!" };
    }

    // Последние 7 дней
    const last7 = all.slice(-7);
    let out = "📊 ТВОЁ НАСТРОЕНИЕ:\n\n";

    last7.forEach(m => {
      const moodName = this.moodNames[m.mood] || m.mood;
      out += `${m.date}: ${moodName}\n`;
    });

    // Анализ
    const counts = {};
    last7.forEach(m => counts[m.mood] = (counts[m.mood] || 0) + 1);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    out += `\n💡 Чаще всего: ${this.moodNames[top[0]] || top[0]}`;

    if (top[0] === "sad" || top[0] === "anxious") {
      out += "\n\n🫂 Ты часто грустишь. Хочешь поговорить? Напиши «мне плохо».";
    } else if (top[0] === "happy") {
      out += "\n\n✨ Отлично! Продолжай сиять!";
    }

    return { text: out };
  },

  async recentMoods() {
    return (await MemoryDB.get("recent_moods")) || [];
  }
};