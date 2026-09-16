const TeacherModule = {
  state: { active: null, current: null, correct: 0, total: 0 },

  mathTasks: [
    { q: "7 + 8 = ?", a: 15 },
    { q: "15 - 9 = ?", a: 6 },
    { q: "6 × 4 = ?", a: 24 },
    { q: "48 ÷ 6 = ?", a: 8 },
    { q: "12 + 17 = ?", a: 29 },
    { q: "9 × 9 = ?", a: 81 },
    { q: "35 - 18 = ?", a: 17 },
    { q: "72 ÷ 8 = ?", a: 9 },
    { q: "13 × 3 = ?", a: 39 },
    { q: "25 + 47 = ?", a: 72 },
    { q: "64 ÷ 4 = ?", a: 16 },
    { q: "14 × 6 = ?", a: 84 },
    { q: "100 - 37 = ?", a: 63 },
    { q: "11 × 7 = ?", a: 77 },
    { q: "8 × 12 = ?", a: 96 }
  ],

  spellingTasks: [
    { word: "карова", correct: "корова" },
    { word: "сабака", correct: "собака" },
    { word: "малоко", correct: "молоко" },
    { word: "каньки", correct: "коньки" },
    { word: "марковь", correct: "морковь" },
    { word: "харашо", correct: "хорошо" },
    { word: "класс", correct: "класс" },
    { word: "руский", correct: "русский" },
    { word: "праграма", correct: "программа" },
    { word: "учится", correct: "учится" }
  ],

  handle(text) {
    const t = text.toLowerCase();

    // Запуск
    if (/(режим.*учител|тренир.*матем|тренир.*русск|задай.*пример|проверь.*знани)/.test(t) && !this.state.active) {
      if (/русск|орфограф|слов/.test(t)) {
        this.state.active = "spelling";
        this.state.correct = 0;
        this.state.total = 0;
        return this.nextSpelling();
      }
      this.state.active = "math";
      this.state.correct = 0;
      this.state.total = 0;
      return this.nextMath();
    }

    // Режим математики
    if (this.state.active === "math") {
      if (/хватит|стоп|закончить|выход/.test(t)) {
        const { correct, total } = this.state;
        this.state.active = null;
        return { text: `📊 Итог: ${correct}/${total} правильных.\n\nМолодец! Можешь вернуться в любой момент — напиши «задай пример».` };
      }

      const userAnswer = parseInt(text.replace(/\D/g, ""));
      if (isNaN(userAnswer)) {
        return { text: `Напиши число! ${this.state.current.q}` };
      }

      this.state.total++;
      if (userAnswer === this.state.current.a) {
        this.state.correct++;
        return { text: `✅ Верно! 🎉\n\n${this.nextMath().text}` };
      }

      const correct = this.state.current.a;
      return { text: `❌ Не то. Правильный ответ: ${correct}\n\n${this.nextMath().text}` };
    }

    // Режим орфографии
    if (this.state.active === "spelling") {
      if (/хватит|стоп|закончить|выход/.test(t)) {
        const { correct, total } = this.state;
        this.state.active = null;
        return { text: `📊 Итог: ${correct}/${total} правильных. Молодец!` };
      }

      const userWord = text.trim().toLowerCase();
      this.state.total++;

      if (userWord === this.state.current.correct) {
        this.state.correct++;
        return { text: `✅ Верно! 🎉\n\n${this.nextSpelling().text}` };
      }

      const correctWord = this.state.current.correct;
      return { text: `❌ Не то. Правильно: «${correctWord}»\n\n${this.nextSpelling().text}` };
    }

    return null;
  },

  nextMath() {
    const task = pick(this.mathTasks);
    this.state.current = task;
    return { text: `🧮 ${task.q}\n\n(или напиши «стоп» — закончить)` };
  },

  nextSpelling() {
    const task = pick(this.spellingTasks);
    this.state.current = task;
    return { text: `📝 Как правильно написать: «${task.word}»?\n\nНапиши слово правильно.\n(или «стоп» — закончить)` };
  }
};