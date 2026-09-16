const PasswordModule = {
  handle(text) {
    const t = text.toLowerCase();
    if (!/(пароль|password|сгенерируй.*пароль|придумай.*пароль|сделай.*пароль)/.test(t)) return null;

    // Длина пароля (по умолчанию 16)
    const lenMatch = t.match(/(\d+)/);
    const len = lenMatch ? Math.min(Math.max(parseInt(lenMatch[1]), 6), 64) : 16;

    // Простой или сложный?
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let type = "обычный";
    if (/(сложн|strong|крепк|надёжн)/.test(t)) {
      chars += "!@#$%^&*()-_=+[]{};:,.?/";
      type = "сложный";
    } else if (/(прост|легк|запомин)/.test(t)) {
      // Только буквы и цифры, без спецсимволов
      type = "простой";
    } else {
      chars += "!@#$%^&*";
      type = "стандартный";
    }

    let pass = "";
    const arr = new Uint32Array(len);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) {
        pass += chars[arr[i] % chars.length];
      }
    } else {
      for (let i = 0; i < len; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return { text:
      `🔐 ${type.charAt(0).toUpperCase() + type.slice(1)} пароль (${len} символов):\n\n` +
      `<pre>${pass}</pre>\n\n` +
      `💡 Совет: сохрани его в надёжном месте и никому не говори!`
    };
  }
};