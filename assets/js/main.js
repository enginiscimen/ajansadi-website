/* ============================================
   MAIN — navigation, smooth scroll, reveal, marquee, cursor, parallax, counter
   ============================================ */

(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---- Sticky topbar shadow ---- */

  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const onScroll = () => {
      topbar.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile drawer ---- */

  const menuBtn = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".drawer");

  if (menuBtn && drawer) {
    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    menuBtn.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeDrawer);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) closeDrawer();
    });
  }

  /* ---- Reveal on scroll (IntersectionObserver) ---- */

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Hero parallax ---- */

  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !prefersReduced) {
    let scrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.18;
        el.style.transform = `translate3d(0, ${scrollY * speed * -1}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        scrollY = window.scrollY;
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* ---- Counter ---- */

  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length && "IntersectionObserver" in window) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.counter);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const duration = parseInt(el.dataset.duration || "1400", 10);
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const value = target * ease(t);
        el.textContent = value.toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      };

      if (prefersReduced) {
        el.textContent = target.toFixed(decimals);
      } else {
        requestAnimationFrame(tick);
      }
    };

    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ---- Custom cursor ---- */

  const cursor = document.querySelector(".cursor");
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    .matches;

  if (cursor && isFinePointer && !prefersReduced) {
    const ring = cursor.querySelector(".cursor__ring");
    const dot = cursor.querySelector(".cursor__dot");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();

    const hoverables = "a, button, summary, .service-card, [data-cursor-hover]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove("is-hover");
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "";
    });
  }

  /* ---- Smooth-scroll offset for anchor links ---- */

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    a.addEventListener("click", (e) => {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---- Active nav link by scroll position (anasayfa) ---- */

  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll(".nav a[data-nav]");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.section;
            navLinks.forEach((a) => {
              a.classList.toggle("is-active", a.dataset.nav === id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => so.observe(s));
  }
})();
