// ============================================================
// DAILY-TASKS.JS — Ежедневные задания (localStorage)
// ============================================================

const DailyTasksModule = {

  KEY: "anya_daily_tasks",

  // ============================================================
  // БАЗА ЗАДАНИЙ
  // ============================================================
  tasks: {
    health: [
      "🏃 Сделай 20 приседаний",
      "💪 Сделай 10 отжиманий",
      "🚶 Прогуляйся 30 минут на улице",
      "💧 Выпей 6 стаканов воды за день",
      "🧘 Потянись 5 минут утром и вечером",
      "🛌 Ляг спать до 22:00",
      "👀 Сделай перерыв от экрана на 1 час",
      "🍎 Съешь 2 фрукта или овоща"
    ],
    mind: [
      "📖 Прочитай 10 страниц книги",
      "✍️ Запиши 3 вещи, за которые благодарен",
      "🧠 Реши 3 задачи по математике",
      "📚 Выучи 5 новых английских слов",
      "✏️ Напиши короткий рассказ (5 предложений)",
      "🎨 Нарисуй что-нибудь",
      "💭 Подумай о своей мечте и запиши её"
    ],
    social: [
      "📞 Позвони бабушке или дедушке",
      "💬 Напиши другу, спроси как дела",
      "😊 Сделай кому-то комплимент",
      "🤝 Помоги родителям с домашними делами",
      "💌 Напиши тёплое сообщение близкому",
      "🎁 Сделай маленький подарок кому-то"
    ],
    fun: [
      "🎵 Послушай любимую песню",
      "📸 Сделай смешное фото",
      "🎮 Поиграй с Аней в игру",
      "😄 Расскажи кому-то шутку",
      "🎨 Нарисуй смешного персонажа",
      "🎬 Посмотри добрый мультфильм"
    ],
    kind: [
      "💖 Скажи кому-то «спасибо»",
      "🌱 Полей растение",
      "🧹 Убери свою комнату",
      "📚 Помоги кому-то с учёбой",
      "🐾 Покорми животное",
      "🌍 Не мусори сегодня нигде"
    ]
  },

  // ============================================================
  // ЗАГРУЗКА / СОХРАНЕНИЕ
  // ============================================================
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : { history: [], today: null };
    } catch (e) {
      return { history: [], today: null };
    }
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {}
  },

  // ============================================================
  // ДАТА СЕГОДНЯ
  // ============================================================
  todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  },

  // ============================================================
  // ДАТЬ ЗАДАНИЕ НА ДЕНЬ
  // ============================================================
  getTodayTask() {
    const data = this.load();

    // Если на сегодня задание уже есть — возвращаем его
    if (data.today && data.today.date === this.todayKey()) {
      return data.today;
    }

    // Иначе — генерируем новое
    const categories = Object.keys(this.tasks);
    const category = pick(categories);
    const task = pick(this.tasks[category]);

    const todayTask = {
      date: this.todayKey(),
      category: category,
      text: task,
      done: false
    };

    data.today = todayTask;
    this.save(data);
    return todayTask;
  },

  // ============================================================
  // ОТМЕТИТЬ ВЫПОЛНЕННЫМ
  // ============================================================
  markDone() {
    const data = this.load();
    if (!data.today || data.today.date !== this.todayKey()) {
      return null;
    }

    if (data.today.done) {
      return { already: true, task: data.today };
    }

    data.today.done = true;
    data.today.doneAt = new Date().toISOString();

    // Добавляем в историю
    data.history.unshift({
      date: data.today.date,
      text: data.today.text,
      category: data.today.category
    });

    // Ограничим 365 записей
    if (data.history.length > 365) data.history.length = 365;

    this.save(data);
    return { task: data.today };
  },

  // ============================================================
  // СТАТИСТИКА
  // ============================================================
  getStreak() {
    const data = this.load();
    if (data.history.length === 0) return 0;

    let streak = 0;
    let checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const key = checkDate.getFullYear() + "-" +
                  String(checkDate.getMonth() + 1).padStart(2, "0") + "-" +
                  String(checkDate.getDate()).padStart(2, "0");

      const done = data.history.find(h => h.date === key);
      if (done) {
        streak++;
      } else if (i > 0) {
        // Первый пропуск после сегодня/вчера — обрываем
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  },

  getTotalDone() {
    const data = this.load();
    return data.history.length;
  },

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    // === ДАТЬ ЗАДАНИЕ ===
    if (/(дай задание|задание на день|задание на сегодня|что делать сегодня|дай задачу)/.test(t)) {
      const task = this.getTodayTask();
      const status = task.done ? "\n\n✅ Уже выполнено!" : "";
      return { text:
        "🎯 ЗАДАНИЕ НА СЕГОДНЯ:\n\n" +
        task.text + "\n\n" +
        "Когда выполнишь — напиши «выполнил»" + status
      };
    }

    // === ВЫПОЛНИЛ ===
    if (/^(выполнил|выполнила|сделал|сделала|готово|done)[!?.\s]*$/.test(t)) {
      const result = this.markDone();
      if (!result) {
        return { text: "🎯 Сначала получи задание — напиши «дай задание»." };
      }
      if (result.already) {
        return { text: "✅ Ты уже отмечал это задание выполненным! Молодец! 💖\n\nЗавтра будет новое." };
      }

      const streak = this.getStreak();
      const total = this.getTotalDone();

      let out = "🎉 МОЛОДЕЦ! Задание выполнено!\n\n";
      out += "«" + result.task.text + "»\n\n";
      out += "🔥 Стрик: " + streak + " " + this.plural(streak, "день", "дня", "дней") + "\n";
      out += "📊 Всего выполнено: " + total + "\n\n";
      out += "Ты классный! ✨";

      return { text: out };
    }

    // === СТАТИСТИКА ЗАДАНИЙ ===
    if (/(статистик.*задани|сколько.*задани.*выполнил|мои задания|стрик заданий)/.test(t)) {
      const streak = this.getStreak();
      const total = this.getTotalDone();
      const data = this.load();

      let out = "📊 СТАТИСТИКА ЗАДАНИЙ:\n\n";
      out += "🔥 Стрик: " + streak + " " + this.plural(streak, "день", "дня", "дней") + "\n";
      out += "✅ Всего выполнено: " + total + "\n\n";

      if (data.history.length > 0) {
        out += "📜 Последние 5:\n";
        data.history.slice(0, 5).forEach((h, i) => {
          out += (i + 1) + ". [" + h.date + "] " + h.text + "\n";
        });
      }

      return { text: out };
    }

    // === СБРОСИТЬ ЗАДАНИЕ (сменить) ===
    if (/(смени задание|другое задание|новое задание|перезагадай)/.test(t)) {
      const data = this.load();
      data.today = null;
      this.save(data);
      const task = this.getTodayTask();
      return { text: "🎯 Новое задание на сегодня:\n\n" + task.text };
    }

    // === ОЧИСТИТЬ ИСТОРИЮ ===
    if (/(очисти.*задани|удали.*задани|сбрось.*задани)/.test(t)) {
      try {
        localStorage.removeItem(this.KEY);
      } catch (e) {}
      return { text: "🗑 История заданий очищена." };
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
  }
};
