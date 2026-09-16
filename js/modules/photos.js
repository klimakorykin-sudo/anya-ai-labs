const PhotosModule = {
  list: ["anya/1.jpg", "anya/2.jpg", "anya/3.jpg"],

  random() {
    return pick(this.list);
  },

  handle(text) {
    const t = text.toLowerCase();
    const wantsPhoto = /(фото|фотк|покажи.*(себя|аню)|picture|photo|img|картинк)/.test(t)
                    && !/(код|сочинени|поищи|найди)/.test(t);

    if (wantsPhoto) {
      return {
        text: pick(PHRASES.photo),
        photo: this.random()
      };
    }
    return null;
  }
};