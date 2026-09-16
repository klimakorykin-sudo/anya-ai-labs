const EmergencyModule = {

  detectTopic(t) {
    if (/(пожар|горит|огонь.*дом|fire|дым)/.test(t)) return "fire";
    if (/(землетряс|трясёт|quake)/.test(t)) return "earthquake";
    if (/(наводнен|затопило|flood|вода.*улиц)/.test(t)) return "flood";
    if (/(гроза|молни|гром|thunder)/.test(t)) return "thunderstorm";
    if (/(газ.*запах|утечк.*газ|пахнет газом)/.test(t)) return "gasLeak";
    if (/(молни.*(попал|удар)|удар.*молни)/.test(t)) return "thunder_injury";
    if (/(током|электрич.*удар|поражен.*ток)/.test(t)) return "electric";
    if (/(утонул|утоплен|тонет)/.test(t)) return "drowned";
    if (/(угарн.*газ|отравлен.*газ|co)/.test(t)) return "poisoning_gas";
    if (/(напал.*собак|укус.*собак|dog)/.test(t)) return "dog_attack";
    if (/(незнакомец|чужой.*человек|преследу|маньяк)/.test(t)) return "stranger";
    return null;
  },

  format(key) {
    const d = EMERGENCY[key];
    if (!d) return null;
    let out = `${d.title}\n\n`;
    d.steps.forEach(s => out += `${s}\n`);
    out += `\n📞 Звони: ${d.call}`;
    return out;
  },

  handle(text) {
    const topic = this.detectTopic(text.toLowerCase());
    if (!topic) return null;
    return { text: this.format(topic) };
  }
};