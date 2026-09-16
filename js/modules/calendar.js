const CalendarModule = {

  holidays: {
    "01-01": "🎄 Новый год",
    "01-07": "🎄 Рождество",
    "02-14": "💖 День всех влюблённых",
    "02-23": "🎖 День защитника Отечества",
    "03-08": "🌸 Международный женский день",
    "04-12": "🚀 День космонавтики",
    "05-01": "🌷 Праздник Весны и Труда",
    "05-09": "🎖 День Победы",
    "06-01": "🎈 День защиты детей",
    "06-12": "🇷🇺 День России",
    "09-01": "📚 День знаний",
    "10-05": "👩‍🏫 День учителя",
    "12-31": "🎄 Канун Нового года"
  },

  handle(text) {
    const t = text.toLowerCase();
    const now = new Date();

    // «Сколько дней до ...»
    if (/(сколько.*дней|дней до|когда будет|сколько до)/.test(t)) {
      return this.daysTo(text);
    }

    // «Какой сегодня день / число / дата»
    if (/(какой.*сегодня.*день|какое.*число|какая.*дата|сегодня.*праздник|какой.*праздник)/.test(t)) {
      return this.today();
    }

    // «Какой сегодня день недели»
    if (/(какой.*день недели|день недели)/.test(t)) {
      const days = ["воскресенье", "понедельник", "вторник", "среда",
                    "четверг", "пятница", "суббота"];
      return { text: `📅 Сегодня — ${days[now.getDay()]}` };
    }

    return null;
  },

  today() {
    const now = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const days = ["воскресенье", "понедельник", "вторник", "среда",
                  "четверг", "пятница", "суббота"];

    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const dayStr = days[now.getDay()];

    // Проверяем праздник
    const key = String(now.getMonth() + 1).padStart(2, "0") + "-" +
                String(now.getDate()).padStart(2, "0");
    const holiday = this.holidays[key];

    let out = `📅 Сегодня: ${dateStr}\n`;
    out += `🗓 ${dayStr.charAt(0).toUpperCase() + dayStr.slice(1)}`;

    if (holiday) {
      out += `\n\n🎉 ${holiday}! Поздравляю!`;
    }

    return { text: out };
  },

  daysTo(text) {
    const t = text.toLowerCase();
    const now = new Date();
    const year = now.getFullYear();

    const targets = {
      "нова.*год|новому году|нг": new Date(year + 1, 0, 1),
      "лето|лета|лету": new Date(year, 5, 1),
      "зим[аеуы]|зим": new Date(year, 11, 1),
      "весн[аеуы]|весн": new Date(year, 2, 1),
      "осен[ьию]|осен": new Date(year, 8, 1),
      "день рождени": null,
      "каникул": new Date(year, 5, 1),
      "8 марта|восьмое марта": new Date(year, 2, 8),
      "23 февраля": new Date(year, 1, 23),
      "1 сентября|первое сентября": new Date(year, 8, 1),
      "хэллоуин|halloween": new Date(year, 9, 31),
      "рождеств": new Date(year, 0, 7),
      "пасх": null,
      "день победы|9 мая": new Date(year, 4, 9)
    };

    for (const [pattern, date] of Object.entries(targets)) {
      const re = new RegExp(pattern);
      if (re.test(t)) {
        if (!date) return { text: "🤔 Не могу посчитать точную дату. Попробуй конкретнее." };

        // Если дата уже прошла в этом году — берём следующий год
        let target = date;
        if (target < now) {
          target = new Date(target.getFullYear() + 1, target.getMonth(), target.getDate());
        }

        const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
                        "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const dateStr = `${target.getDate()} ${months[target.getMonth()]} ${target.getFullYear()}`;

        if (diff === 0) return { text: `🎉 Это сегодня! ${dateStr}` };
        if (diff === 1) return { text: `📅 Завтра! ${dateStr}` };

        return { text:
          `📅 До этого события: ${diff} ${this.plural(diff, "день", "дня", "дней")}\n\n` +
          `Это будет ${dateStr}`
        };
      }
    }

    return { text: "🤔 Не поняла, до какого события считать. Спроси, например: «Сколько дней до лета?»" };
  },

  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
};