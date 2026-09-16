const DialoguesModule = {
  state: { active: null, step: 0 },

  handle(text) {
    const t = text.toLowerCase();

    // Запуск: «поговорим», «давай поговорим», «скучно»
    if (/(давай поговорим|поговори со мной|хочу поговорить|скучно.*поговор|поболтаем)/.test(t) && !this.state.active) {
      this.state.active = "talk";
      this.state.step = 1;
      return { text: "💬 Конечно! Как у тебя сегодня настроение?" };
    }

    // Продолжение «talk»
    if (this.state.active === "talk") {
      this.state.step++;

      if (this.state.step === 2) {
        return { text: "Поняла 💖 А что тебя сейчас больше всего занимает?" };
      }
      if (this.state.step === 3) {
        return { text: "Спасибо, что делишься 🌸 Хочешь, чтобы я что-то посоветовала, или просто слушаю?" };
      }
      if (this.state.step === 4) {
        return { text: "Я всегда рядом 💫 Расскажи, что происходит?" };
      }
      if (this.state.step >= 5) {
        this.state.active = null;
        this.state.step = 0;
        return { text: "Ты классный собеседник 💖 Если что — пиши «поговорим» ещё." };
      }
    }

    // Запуск утреннего диалога
    if (/доброе утро|с добрым утром/.test(t)) {
      const hour = new Date().getHours();
      const greet = hour < 6 ? "Ого, ты рано встал!" : hour < 12 ? "Доброе утро!" : "Доброе утро! (хоть уже и день 😄)";
      return { text: `${greet} 💖 Как спалось?` };
    }

    // Добрый день
    if (/добрый день|добрый денёк/.test(t)) {
      return { text: "Добрый день! 🌸 Как твои дела?" };
    }

    // Добрый вечер
    if (/добрый вечер/.test(t)) {
      return { text: "Добрый вечер! 🌙 Как прошёл день?" };
    }

    // Спокойной ночи
    if (/спокойной ночи|сладких снов|баю|спать иду/.test(t)) {
      return { text: "🌙 Спокойной ночи! Пусть снятся добрые сны. Я буду тут, если что." };
    }

    return null;
  }
};