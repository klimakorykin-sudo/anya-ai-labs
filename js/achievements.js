// 30+ достижений
const ACHIEVEMENTS = {
  first_message: { icon: "🎉", name: "Первое сообщение", desc: "Ты написал Ане впервые!" },
  msgs_10: { icon: "💬", name: "10 сообщений", desc: "Разговор пошёл!" },
  msgs_50: { icon: "💭", name: "50 сообщений", desc: "Ты болтлив!" },
  msgs_100: { icon: "🗣", name: "100 сообщений", desc: "Сотня! Круто!" },
  msgs_500: { icon: "📢", name: "500 сообщений", desc: "Полтысячи!" },
  msgs_1000: { icon: "🏆", name: "1000 сообщений", desc: "Легенда!" },
  days_2: { icon: "📅", name: "2 дня с Аней", desc: "Возвращаешься!" },
  days_7: { icon: "🔥", name: "Неделя вместе", desc: "7 дней!" },
  days_30: { icon: "🌟", name: "Месяц с Аней", desc: "30 дней!" },
  days_100: { icon: "💎", name: "100 дней", desc: "100 дней вместе!" },
  streak_3: { icon: "🔥", name: "Стрик 3 дня", desc: "3 дня подряд!" },
  streak_7: { icon: "🔥🔥", name: "Стрик 7 дней", desc: "Неделя подряд!" },
  streak_30: { icon: "🔥🔥🔥", name: "Стрик 30 дней", desc: "Месяц подряд!" },
  first_photo: { icon: "📸", name: "Первое фото", desc: "Ты посмотрел фото Ани!" },
  first_joke: { icon: "😄", name: "Первая шутка", desc: "Ты услышал шутку!" },
  first_fact: { icon: "💡", name: "Первый факт", desc: "Узнал что-то новое!" },
  first_riddle: { icon: "🧩", name: "Первая загадка", desc: "Разгадал загадку!" },
  first_essay: { icon: "📝", name: "Первое сочинение", desc: "Попросил сочинение!" },
  first_code: { icon: "💻", name: "Первый код", desc: "Попросил код!" },
  first_calm: { icon: "🌬", name: "Первое дыхание", desc: "Попробовал дыхание!" },
  first_search: { icon: "🌐", name: "Первый поиск", desc: "Попросил поискать!" },
  first_love: { icon: "💖", name: "Первое «люблю»", desc: "Сказал Ане «люблю»!" },
  night_owl: { icon: "🦉", name: "Полуночник", desc: "Писал Ане после 2:00!" },
  early_bird: { icon: "🐦", name: "Ранняя пташка", desc: "Писал Ане до 6:00!" },
  sad_support: { icon: "🫂", name: "Поддержка", desc: "Аня тебя поддержала!" },
  crisis_hero: { icon: "🦸", name: "Ты справился", desc: "Обратился за помощью!" },
  moon_walker: { icon: "🌙", name: "Лунатик", desc: "Писал Ане ночью!" },
  weekend: { icon: "🎮", name: "Выходной", desc: "Написал в выходной!" },
  early_msg: { icon: "☀️", name: "С добрым утром!", desc: "Первое сообщение утром!" },
  weather_pro: { icon: "☀️", name: "Метеоролог", desc: "Спросил про погоду!" },
  recipe_master: { icon: "🍳", name: "Кулинар", desc: "Попросил рецепт!" },
  horoscope_fan: { icon: "🌠", name: "Астролог", desc: "Узнал свой знак!" },
  note_keeper: { icon: "📝", name: "Хранитель заметок", desc: "Добавил заметку!" },
  tell_name: { icon: "👋", name: "Знакомство", desc: "Сказал Ане своё имя!" }
};

const Achievements = {
  unlocked: [],

  async init() {
    this.unlocked = (await MemoryDB.get("achievements")) || [];
  },

  async unlock(key) {
    if (!ACHIEVEMENTS[key]) return null;
    if (this.unlocked.includes(key)) return null;

    this.unlocked.push(key);
    await MemoryDB.set("achievements", this.unlocked);

    return ACHIEVEMENTS[key];
  },

  async checkAll(stats) {
    const count = stats.count || 0;
    const daysWith = stats.daysWith || 1;
    const streak = stats.streak || 1;

    if (count >= 1) await this.unlock("first_message");
    if (count >= 10) await this.unlock("msgs_10");
    if (count >= 50) await this.unlock("msgs_50");
    if (count >= 100) await this.unlock("msgs_100");
    if (count >= 500) await this.unlock("msgs_500");
    if (count >= 1000) await this.unlock("msgs_1000");

    if (daysWith >= 2) await this.unlock("days_2");
    if (daysWith >= 7) await this.unlock("days_7");
    if (daysWith >= 30) await this.unlock("days_30");
    if (daysWith >= 100) await this.unlock("days_100");

    if (streak >= 3) await this.unlock("streak_3");
    if (streak >= 7) await this.unlock("streak_7");
    if (streak >= 30) await this.unlock("streak_30");
  },

  async format() {
    if (this.unlocked.length === 0) {
      return "🏆 Пока достижений нет. Общайся с Аней — они появятся!";
    }

    let out = `🏆 ТВОИ ДОСТИЖЕНИЯ (${this.unlocked.length}/${Object.keys(ACHIEVEMENTS).length}):\n\n`;
    this.unlocked.forEach(key => {
      const a = ACHIEVEMENTS[key];
      if (a) out += `${a.icon} ${a.name}\n   ${a.desc}\n\n`;
    });
    return out.trim();
  }
};