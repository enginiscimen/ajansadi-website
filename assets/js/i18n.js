/* ============================================
   I18N — TR / EN switcher (data-attribute tabanlı)
   ============================================ */

(() => {
  const STORAGE_KEY = "lang";
  const DEFAULT_LANG = "tr";
  const supported = ["tr", "en"];

  const initial =
    localStorage.getItem(STORAGE_KEY) ||
    (document.documentElement.lang || DEFAULT_LANG).slice(0, 2);

  const lang = supported.includes(initial) ? initial : DEFAULT_LANG;

  const applyLang = (target) => {
    document.documentElement.lang = target;

    document.querySelectorAll("[data-tr]").forEach((el) => {
      const text = el.dataset[target];
      if (typeof text === "string") {
        el.textContent = text;
      }
    });

    document.querySelectorAll("[data-tr-html]").forEach((el) => {
      const html = el.dataset[`${target}Html`];
      if (typeof html === "string") {
        el.innerHTML = html;
      }
    });

    document.querySelectorAll("[data-tr-attr]").forEach((el) => {
      const attrs = el.dataset.trAttr.split(",").map((s) => s.trim());
      attrs.forEach((attr) => {
        const value = el.dataset[`${target}${capitalize(attr)}`];
        if (typeof value === "string") {
          el.setAttribute(attr, value);
        }
      });
    });

    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.lang === target);
    });

    localStorage.setItem(STORAGE_KEY, target);
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  applyLang(lang);
})();
