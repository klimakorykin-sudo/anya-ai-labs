// ============================================================
// NOTIFICATIONS.JS — Уведомления (в чате + браузерные)
// ============================================================

const NotificationsModule = {

  timers: [],

  // ============================================================
  // ЗАПРОС РАЗРЕШЕНИЯ НА БРАУЗЕРНЫЕ УВЕДОМЛЕНИЯ
  // ============================================================
  async requestPermission() {
    if (!("Notification" in window)) {
      return { text: "😅 Твой браузер не поддерживает браузерные уведомления. Но я могу напомнить в чате!" };
    }
    if (Notification.permission === "granted") {
      return { text: "🔔 Браузерные уведомления разрешены! Могу напоминать поверх других окон." };
    }
    if (Notification.permission === "denied") {
      return { text: "😅 Ты запретил уведомления в браузере. Могу напоминать только в чате." };
    }

    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        return { text: "🔔 Отлично! Теперь я могу напоминать даже когда ты на другой вкладке." };
      } else {
        return { text: "😅 Ладно, буду напоминать в чате." };
      }
    } catch (e) {
      return { text: "😅 Не получилось запросить разрешение. Буду напоминать в чате." };
    }
  },

  // ============================================================
  // ПОКАЗАТЬ БРАУЗЕРНОЕ УВЕДОМЛЕНИЕ
  // ============================================================
  showBrowserNotification(title, body) {
    if (!("Notification" in window)) return false;
    if (Notification.permission !== "granted") return false;

    try {
      const n = new Notification(title, {
        body: body,
        icon: "favicon.png",
        tag: "anya-notification"
      });
      setTimeout(() => n.close(), 10000);
      return true;
    } catch (e) {
      return false;
    }
  },

  // ============================================================
  // ПАРСИНГ ВРЕМЕНИ
  // ============================================================
  parseTime(text) {
    const t = text.toLowerCase();

    // "через X минут/секунд/часов"
    const m = t.match(/через\s+(\d+)\s*(минут|мин|секунд|сек|час|ч)/);
    if (m) {
      const num = parseInt(m[1]);
      const unit = m[2];
      let ms = 0;
      let unitName = "";
      if (unit.startsWith("мин")) { ms = num * 60000; unitName = "мин"; }
      else if (unit.startsWith("сек")) { ms = num * 1000; unitName = "сек"; }
      else { ms = num * 3600000; unitName = "ч"; }
      return { ms: ms, num: num, unitName: unitName };
    }

    // "в X:XX"
    const timeMatch = t.match(/в\s+(\d{1,2})[:.\s](\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const now = new Date();
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      if (target < now) target.setDate(target.getDate() + 1);
      const ms = target - now;
      return { ms: ms, num: null, unitName: "по времени", target: target };
    }

    return null;
  },

  // ============================================================
  // ИЗВЛЕЧЬ ТЕКСТ НАПОМИНАНИЯ
  // ============================================================
  extractMessage(text) {
    let msg = text
      .replace(/напомни/gi, "")
      .replace(/через\s+\d+\s*(минут|мин|секунд|сек|час|ч)\w*/gi, "")
      .replace(/в\s+\d{1,2}[:.\s]\d{2}/gi, "")
      .replace(/^[\s,\-:]+/, "")
      .trim();
    return msg || "напоминание";
  },

  // ============================================================
  // ПОСТАВИТЬ НАПОМИНАНИЕ
  // ============================================================
  setReminder(text, useBrowser) {
    const time = this.parseTime(text);
    if (!time) return null;

    const message = this.extractMessage(text);

    const timerId = setTimeout(() => {
      // В чате
      if (typeof addMsg === "function") {
        addMsg("⏰ Напоминание: " + message, "bot");
      }

      // В браузере
      if (useBrowser) {
        this.showBrowserNotification("⏰ Аня напоминает", message);
      }

      // Убираем из списка
      this.timers = this.timers.filter(t => t.id !== timerId);
    }, time.ms);

    this.timers.push({ id: timerId, message: message, ms: time.ms });

    return { message: message, time: time };
  },

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    // === РАЗРЕШЕНИЕ НА УВЕДОМЛЕНИЯ ===
    if (/(разреши уведомлени|включи уведомлени|браузерн.*уведомлени|уведомлени.*браузер)/.test(t)) {
      return await this.requestPermission();
    }

    // === НАПОМИНАНИЯ ===
    if (/(напомни|напоминание|таймер)/.test(t)) {
      // Проверяем — браузерное или в чате
      const useBrowser = /(браузер|поверх|уведомлени)/.test(t);

      const result = this.setReminder(text, useBrowser);
      if (!result) {
        return { text:
          "⏰ КАК ПОСТАВИТЬ НАПОМИНАНИЕ:\n\n" +
          "• «Напомни через 30 минут погулять»\n" +
          "• «Напомни через 1 час сделать уроки»\n" +
          "• «Напомни в 18:30 позвонить маме»\n\n" +
          "🔔 Чтобы уведомление появилось поверх других окон — напиши «браузерное напоминание через 30 минут ...»\n\n" +
          "📌 Пока браузер открыт — напоминаю."
        };
      }

      let out = "⏰ Ок! Напомню";
      if (result.time.num) {
        out += " через " + result.time.num + " " + result.time.unitName;
      } else {
        out += " " + result.time.target.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      }
      out += ":\n«" + result.message + "»";

      if (useBrowser) {
        out += "\n\n🔔 Браузерное уведомление — если разрешено.";
      }

      return { text: out };
    }

    // === СПИСОК АКТИВНЫХ НАПОМИНАНИЙ ===
    if (/(мои напоминани|список напоминаний|активн.*напоминани|какие напоминани)/.test(t)) {
      if (this.timers.length === 0) {
        return { text: "⏰ Активных напоминаний нет." };
      }
      let out = "⏰ АКТИВНЫЕ НАПОМИНАНИЯ (" + this.timers.length + "):\n\n";
      this.timers.forEach((timer, i) => {
        const minutes = Math.round(timer.ms / 60000);
        out += (i + 1) + ". «" + timer.message + "» — через ~" + minutes + " мин\n";
      });
      return { text: out };
    }

    // === ОТМЕНИТЬ ВСЕ ===
    if (/(отмени.*напоминани|удали.*напоминани|сбрось.*напоминани|стоп.*таймер)/.test(t)) {
      this.timers.forEach(t => clearTimeout(t.id));
      const count = this.timers.length;
      this.timers = [];
      return { text: "🗑 Отменила " + count + " " + this.plural(count, "напоминание", "напоминания", "напоминаний") + "." };
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
