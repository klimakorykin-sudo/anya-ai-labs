const TimerModule = {
  timers: [],

  handle(text) {
    const t = text.toLowerCase();

    // «Напомни через 5 минут ...»
    const m = t.match(/через\s+(\d+)\s*(минут|мин|секунд|сек|час|ч)/);
    if (m && /(напомни|таймер|через|поставь)/.test(t)) {
      const num = parseInt(m[1]);
      const unit = m[2];
      let ms = 0;
      let unitName = "";

      if (unit.startsWith("мин")) { ms = num * 60000; unitName = "мин"; }
      else if (unit.startsWith("сек")) { ms = num * 1000; unitName = "сек"; }
      else { ms = num * 3600000; unitName = "ч"; }

      const what = text
        .replace(/.*?(минут|мин|секунд|сек|час|ч)\w*\s*/i, "")
        .trim() || "напоминание";

      const timerId = Date.now();
      this.timers.push(timerId);

      setTimeout(() => {
        if (typeof addMsg === "function") {
          addMsg(`⏰ Напоминание: ${what}`, "bot");
        }
        if (window.speakAnya) speakAnya(`Напоминание: ${what}`);
        // Проигрываем звук (если есть)
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQBvT18AAAA=");
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (e) {}
      }, ms);

      return { text: `⏳ Ок! Напомню через ${num} ${unitName} — «${what}»` };
    }

    // «Поставь таймер на 10 минут»
    const m2 = t.match(/таймер\s+на\s+(\d+)\s*(минут|мин|секунд|сек|час|ч)?/);
    if (m2) {
      const num = parseInt(m2[1]);
      const unit = m2[2] || "мин";
      let ms = 0, unitName = "";

      if (unit.startsWith("мин")) { ms = num * 60000; unitName = "мин"; }
      else if (unit.startsWith("сек")) { ms = num * 1000; unitName = "сек"; }
      else { ms = num * 3600000; unitName = "ч"; }

      setTimeout(() => {
        if (typeof addMsg === "function") {
          addMsg(`⏰ Таймер сработал! Прошло ${num} ${unitName}.`, "bot");
        }
      }, ms);

      return { text: `⏳ Таймер на ${num} ${unitName} запущен!` };
    }

    return null;
  }
};