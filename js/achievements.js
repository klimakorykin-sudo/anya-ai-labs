// ============================================================
// ACHIEVEMENTS.JS — Достижения и пасхалки
// ============================================================

const ACHIEVEMENTS = {
  // === ПЕРВЫЕ ШАГИ ===
  first_message: { icon: "🎉", name: "Первое сообщение", desc: "Ты написал Ане впервые!" },
  tell_name: { icon: "👋", name: "Знакомство", desc: "Сказал Ане своё имя!" },
  tell_age: { icon: "🎂", name: "Возраст", desc: "Рассказал, сколько тебе лет!" },
  tell_grade: { icon: "📚", name: "Школьник", desc: "Рассказал, в каком ты классе!" },
  tell_birthday: { icon: "🎁", name: "День рождения", desc: "Сказал дату ДР!" },
  tell_topic: { icon: "💖", name: "Интересы", desc: "Рассказал, что любишь!" },

  // === СООБЩЕНИЯ ===
  msgs_10: { icon: "💬", name: "10 сообщений", desc: "Разговор пошёл!" },
  msgs_50: { icon: "💭", name: "50 сообщений", desc: "Ты болтлив!" },
  msgs_100: { icon: "🗣", name: "100 сообщений", desc: "Сотня! Круто!" },
  msgs_500: { icon: "📢", name: "500 сообщений", desc: "Полтысячи!" },
  msgs_1000: { icon: "🏆", name: "1000 сообщений", desc: "Легенда!" },
  msgs_5000: { icon: "💎", name: "5000 сообщений", desc: "Невероятно!" },

  // === ДНИ ===
  days_2: { icon: "📅", name: "2 дня с Аней", desc: "Возвращаешься!" },
  days_7: { icon: "🔥", name: "Неделя вместе", desc: "7 дней!" },
  days_30: { icon: "🌟", name: "Месяц с Аней", desc: "30 дней!" },
  days_100: { icon: "💎", name: "100 дней", desc: "100 дней вместе!" },
  days_365: { icon: "🎂", name: "Год вместе", desc: "Целый год!" },

  // === СТРИКИ ===
  streak_3: { icon: "🔥", name: "Стрик 3 дня", desc: "3 дня подряд!" },
  streak_7: { icon: "🔥🔥", name: "Стрик 7 дней", desc: "Неделя подряд!" },
  streak_30: { icon: "🔥🔥🔥", name: "Стрик 30 дней", desc: "Месяц подряд!" },
  streak_100: { icon: "🏅", name: "Стрик 100 дней", desc: "100 дней подряд!" },

  // === ПЕРВЫЕ ИСПОЛЬЗОВАНИЯ ===
  first_photo: { icon: "📸", name: "Первое фото", desc: "Посмотрел фото Ани!" },
  first_joke: { icon: "😄", name: "Первая шутка", desc: "Услышал шутку!" },
  first_fact: { icon: "💡", name: "Первый факт", desc: "Узнал что-то новое!" },
  first_riddle: { icon: "🧩", name: "Первая загадка", desc: "Услышал загадку!" },
  first_essay: { icon: "📝", name: "Первое сочинение", desc: "Попросил сочинение!" },
  first_code: { icon: "💻", name: "Первый код", desc: "Попросил код!" },
  first_calm: { icon: "🌬", name: "Первое дыхание", desc: "Попробовал дыхание!" },
  first_search: { icon: "🌐", name: "Первый поиск", desc: "Попросил поискать!" },
  first_love: { icon: "💖", name: "Первое «люблю»", desc: "Сказал Ане «люблю»!" },
  first_game: { icon: "🎮", name: "Первая игра", desc: "Поиграл с Аней!" },
  first_horoscope: { icon: "🌠", name: "Астролог", desc: "Узнал свой знак!" },
  first_recipe: { icon: "🍳", name: "Кулинар", desc: "Попросил рецепт!" },
  first_weather: { icon: "☀️", name: "Метеоролог", desc: "Спросил про погоду!" },
  first_password: { icon: "🔐", name: "Безопасность", desc: "Создал пароль!" },
  first_note: { icon: "📝", name: "Хранитель заметок", desc: "Добавил заметку!" },
  first_translate: { icon: "🌍", name: "Переводчик", desc: "Перевёл слово!" },
  first_calendar: { icon: "📅", name: "Календарь", desc: "Спросил про дату!" },
  first_story: { icon: "📖", name: "История", desc: "Послушал историю!" },
  first_compliment: { icon: "💐", name: "Комплимент", desc: "Получил комплимент!" },
  first_quote: { icon: "✨", name: "Мотивация", desc: "Услышал цитату!" },
  first_advice: { icon: "💡", name: "Совет", desc: "Получил совет!" },

  // === ЗНАНИЯ ===
  first_firstaid: { icon: "🫀", name: "Первая помощь", desc: "Узнал про первую помощь!" },
  first_emergency: { icon: "🚨", name: "ЧС", desc: "Узнал про ЧС!" },
  first_safety: { icon: "🛡", name: "Безопасность", desc: "Узнал про безопасность!" },
  first_anatomy: { icon: "🧬", name: "Анатомия", desc: "Спросил про тело!" },
  first_biology: { icon: "🔬", name: "Биология", desc: "Спросил про биологию!" },
  first_chemistry: { icon: "🧪", name: "Химия", desc: "Спросил про химию!" },
  first_physics: { icon: "⚛️", name: "Физика", desc: "Спросил про физику!" },
  first_history: { icon: "📜", name: "История", desc: "Спросил про историю!" },
  first_literature: { icon: "📚", name: "Литература", desc: "Спросил про писателя!" },
  first_geography: { icon: "🌍", name: "География", desc: "Спросил про страну!" },
  first_informatics: { icon: "💻", name: "Информатика", desc: "Спросил про информатику!" },
  first_redteam: { icon: "🛡", name: "Кибербезопасность", desc: "Спросил про Red Team!" },

  // === ОСОБЫЕ ===
  night_owl: { icon: "🦉", name: "Полуночник", desc: "Писал Ане после 2:00!" },
  early_bird: { icon: "🐦", name: "Ранняя пташка", desc: "Писал Ане до 6:00!" },
  sad_support: { icon: "🫂", name: "Поддержка", desc: "Аня тебя поддержала!" },
  crisis_hero: { icon: "🦸", name: "Ты справился", desc: "Обратился за помощью!" },
  moon_walker: { icon: "🌙", name: "Лунатик", desc: "Писал Ане ночью!" },
  weekend: { icon: "🎮", name: "Выходной", desc: "Написал в выходной!" },
  early_msg: { icon: "☀️", name: "С добрым утром!", desc: "Первое сообщение утром!" },

  // === ПАСХАЛКИ ===
  secret_found: { icon: "🎁", name: "Секрет найден", desc: "Нашёл секретную команду!" },
  konami: { icon: "🎮", name: "Konami", desc: "Ввёл Konami-код!" },
  developer_found: { icon: "👤", name: "Разработчик", desc: "Нашёл сообщение про разработчика!" },
  snowflake: { icon: "❄️", name: "Новый год", desc: "Зашёл в новогодний период!" },
  valentine: { icon: "💖", name: "14 февраля", desc: "Зашёл в День влюблённых!" },
  birthday_anya: { icon: "🎂", name: "ДР Ани", desc: "Зашёл в день рождения Ани!" },

  // === СОЦИАЛЬНЫЕ ===
  best_friend: { icon: "💖", name: "Лучший друг", desc: "100+ дней общения!" },
  soul_mate: { icon: "✨", name: "Родная душа", desc: "1000+ сообщений и 30+ дней!" },
  legend: { icon: "👑", name: "Легенда", desc: "5000+ сообщений!" },
  close_friend: { icon: "💫", name: "Близкий друг", desc: "500+ сообщений!" },
  trust: { icon: "🤝", name: "Доверие", desc: "Поделился чем-то личным!" }
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

    // Сообщения
    if (count >= 1) await this.unlock("first_message");
    if (count >= 10) await this.unlock("msgs_10");
    if (count >= 50) await this.unlock("msgs_50");
    if (count >= 100) await this.unlock("msgs_100");
    if (count >= 500) await this.unlock("msgs_500");
    if (count >= 1000) await this.unlock("msgs_1000");
    if (count >= 5000) await this.unlock("msgs_5000");

    // Дни
    if (daysWith >= 2) await this.unlock("days_2");
    if (daysWith >= 7) await this.unlock("days_7");
    if (daysWith >= 30) await this.unlock("days_30");
    if (daysWith >= 100) await this.unlock("days_100");
    if (daysWith >= 365) await this.unlock("days_365");

    // Стрики
    if (streak >= 3) await this.unlock("streak_3");
    if (streak >= 7) await this.unlock("streak_7");
    if (streak >= 30) await this.unlock("streak_30");
    if (streak >= 100) await this.unlock("streak_100");

    // Особые
    if (count >= 100 && daysWith >= 100) await this.unlock("best_friend");
    if (count >= 500) await this.unlock("close_friend");
    if (count >= 1000 && daysWith >= 30) await this.unlock("soul_mate");
    if (count >= 5000) await this.unlock("legend");

    // Время суток
    const hour = new Date().getHours();
    if (hour >= 2 && hour < 5) await this.unlock("night_owl");
    if (hour >= 0 && hour < 6) await this.unlock("moon_walker");
    if (hour >= 5 && hour < 7) await this.unlock("early_bird");

    // Выходной
    const day = new Date().getDay();
    if (day === 0 || day === 6) await this.unlock("weekend");

    return null;
  },

  async format() {
    if (this.unlocked.length === 0) {
      return "🏆 Пока достижений нет. Общайся с Аней — они появятся!";
    }

    const total = Object.keys(ACHIEVEMENTS).length;
    let out = `🏆 ТВОИ ДОСТИЖЕНИЯ (${this.unlocked.length}/${total}):\n\n`;
    this.unlocked.forEach(key => {
      const a = ACHIEVEMENTS[key];
      if (a) out += `${a.icon} ${a.name}\n   ${a.desc}\n\n`;
    });
    return out.trim();
  }
};
