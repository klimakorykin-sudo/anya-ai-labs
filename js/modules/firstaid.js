const FirstAidModule = {

  detectTopic(t) {
    if (/(слр|cpr|сердеч|реанимац|не дышит|без сознания|остановк.*сердц)/.test(t)) return "CPR";
    if (/(кровотеч|кровь.*льёт|рана|порез|жгут)/.test(t)) return "bleeding";
    if (/(ожог|обжёг|обжог|кипяток|огонь.*кож|burn)/.test(t)) return "burn";
    if (/(подав|задых|удуш|choking|поперхнул)/.test(t)) return "choking";
    if (/(обморок|потерял сознани|упал в обморок|faint)/.test(t)) return "fainting";
    if (/(перелом|вывих|сломал|трещин.*кост|fracture)/.test(t)) return "fracture";
    if (/(отравл|яд|poison|траванул)/.test(t)) return "poisoning";
    if (/(судорог|приступ|эпилепс|seizure)/.test(t)) return "seizure";
    if (/(кровь.*нос|нос.*кров|из носа)/.test(t)) return "nosebleed";
    if (/(укус|пчела|оса|комар.*укус|insect)/.test(t)) return "insect_bite";
    if (/(обморож|замёрз|переохлажд|frostbite)/.test(t)) return "frostbite";
    if (/(теплов.*удар|перегрев|heatstroke)/.test(t)) return "heatstroke";
    return null;
  },

  format(key) {
    const d = FIRSTAID[key];
    if (!d) return null;

    let out = `⚠️ ${d.title}\n\n`;
    out += `📌 Когда применять:\n`;
    d.when.forEach(w => out += `• ${w}\n`);
    out += `\n🛠 Что делать:\n`;
    d.steps.forEach(s => out += `${s}\n`);

    if (d.warning) out += `\n❗ ВАЖНО: ${d.warning}`;
    if (d.call) out += `\n📞 Звони: ${d.call}`;
    out += `\n\n⚠️ Это учебная информация — в реальной ситуации зови взрослых и скорую (103/112)!`;

    return out;
  },

  handle(text) {
    const t = text.toLowerCase();
    const topic = this.detectTopic(t);
    if (!topic) return null;
    return { text: this.format(topic) };
  }
};