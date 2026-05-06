/* ============================================
   FORM — Web3Forms entegrasyonu + validation
   ============================================ */

(() => {
  /**
   * KULLANIM: https://web3forms.com adresinden ücretsiz access key al,
   * aşağıdaki sabite yapıştır. Anahtar olmadan form gönderim hatası
   * verir, fakat UI tamamen çalışır (test için elverişli).
   */
  const WEB3FORMS_ACCESS_KEY = "BURAYA_WEB3FORMS_ACCESS_KEY";

  const form = document.querySelector(".js-contact-form");
  if (!form) return;

  const notice = form.querySelector(".form__notice");
  const success = form.parentElement.querySelector(".form__success");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setInvalid = (field, invalid) => {
    field.classList.toggle("field--invalid", invalid);
  };

  const validate = () => {
    let ok = true;
    form.querySelectorAll(".field").forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      if (!input) return;
      if (input.required && !input.checkValidity()) {
        setInvalid(field, true);
        ok = false;
      } else {
        setInvalid(field, false);
      }
    });
    return ok;
  };

  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("blur", () => {
      const field = input.closest(".field");
      if (!field) return;
      if (input.required && !input.checkValidity()) {
        setInvalid(field, true);
      } else {
        setInvalid(field, false);
      }
    });
  });

  const showNotice = (msg) => {
    if (!notice) return;
    notice.textContent = msg;
    notice.classList.add("is-visible");
  };

  const hideNotice = () => {
    if (!notice) return;
    notice.classList.remove("is-visible");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideNotice();

    if (!validate()) {
      const firstInvalid = form.querySelector(".field--invalid input, .field--invalid select, .field--invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("from_name", "AjansAdı Web Formu");
    data.append("subject", "Yeni iletişim formu mesajı");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent =
        document.documentElement.lang === "en"
          ? "Sending…"
          : "Gönderiliyor…";
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        form.style.display = "none";
        if (success) success.classList.add("is-visible");
      } else {
        const msg =
          document.documentElement.lang === "en"
            ? "Couldn't send your message. Please try again, or email us directly."
            : "Mesajınız gönderilemedi. Lütfen tekrar deneyin veya doğrudan e-posta yollayın.";
        showNotice(msg);
      }
    } catch (err) {
      const msg =
        document.documentElement.lang === "en"
          ? "Network error — please try again or email us directly."
          : "Bağlantı hatası — lütfen tekrar deneyin veya doğrudan e-posta yollayın.";
      showNotice(msg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Gönder";
      }
    }
  });
})();
