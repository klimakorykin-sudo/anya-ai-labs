const CrisisModule = {

  // Ключевые слова кризиса (20+)
  triggers: [
    /не хочу жить/i,
    /хочу исчезнуть/i,
    /нет смысла/i,
    /покончить/i,
    /резать себя/i,
    /причинить себе/i,
    /всем будет лучше без меня/i,
    /я никому не нужен/i,
    /я никому не нужна/i,
    /умереть/i,
    /самоубий/i,
    /суицид/i,
    /порезать вены/i,
    /прыгнуть с крыши/i,
    /таблеток.*выпить/i,
    /хочу умереть/i,
    /лучше бы меня не было/i,
    /устал жить/i,
    /устала жить/i,
    /смысла нет/i,
    /не хочу больше/i
  ],

  isCrisis(text) {
    return this.triggers.some(r => r.test(text));
  },

  handle(text) {
    if (!this.isCrisis(text)) return null;

    // Логируем для памяти
    if (typeof MemoryDB !== "undefined") {
      MemoryDB.addFact("⚠️ Кризисное сообщение: " + text.slice(0, 100));
    }

    return { text: crisisText() };
  }
};