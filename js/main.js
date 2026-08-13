(function () {
  const WA_NUMBER = "523331410467";
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mob-menu");
  const form = document.getElementById("wa-form");
  const year = document.getElementById("year");
  const marquee = document.getElementById("marquee");
  const canvas = document.getElementById("hero-canvas");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("loading", "animations-ready");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (marquee) {
    const items = [
      "Cajas de plastico",
      "Rafias",
      "Esquineros plasticos",
      "Pallets de madera",
      "Ciudad Guzman, Jalisco",
      "Materiales resistentes",
      "Cotizacion directa"
    ];

    const sequence = [...items, ...items, ...items, ...items]
      .map((item) => `<span>${item}</span>`)
      .join("");

    marquee.innerHTML = sequence;
  }

  const minimumLoad = new Promise((resolve) => window.setTimeout(resolve, 1800));
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    window.addEventListener("load", resolve, { once: true });
  });

  Promise.all([minimumLoad, pageLoaded]).then(() => {
    if (loader) {
      loader.classList.add("loaded");
      window.setTimeout(() => loader.remove(), 950);
    }
    document.body.classList.remove("loading");
  });

  function updateNav() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  if (hamburger && mobileMenu && navbar) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      navbar.classList.toggle("menu-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        navbar.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px" });

  revealItems.forEach((item) => revealObserver.observe(item));

  const counters = document.querySelectorAll(".stat-num");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => counterObserver.observe(counter));

  function animateCounter(element) {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    const duration = prefersReducedMotion ? 1 : 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("f-name");
      const interest = document.getElementById("f-interest");
      const phone = document.getElementById("f-phone");
      const message = document.getElementById("f-msg");

      const nameValue = name.value.trim();
      const interestValue = interest.value.trim();
      const phoneValue = phone.value.trim();
      const messageValue = message.value.trim();

      if (!nameValue || !messageValue) {
        [name, message].forEach((field) => {
          field.style.borderColor = field.value.trim() ? "" : "rgba(246, 207, 31, .9)";
        });
        alert("Por favor completa tu nombre y el detalle del pedido para preparar el mensaje.");
        return;
      }

      const text = [
        "Hola, visite la pagina de Comercializadora Restan y quiero solicitar una cotizacion.",
        `Nombre: ${nameValue}`,
        `Producto de interes: ${interestValue}`,
        phoneValue ? `Telefono: ${phoneValue}` : "",
        `Detalle: ${messageValue}`
      ].filter(Boolean).join("\n");

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const zoomItems = document.querySelectorAll("[data-lightbox-src]");

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    const frame = lightbox.querySelector(".lightbox-frame");
    lightboxImg.src = item.dataset.lightboxSrc;
    lightboxImg.alt = item.dataset.lightboxAlt || item.querySelector("img")?.alt || "Imagen ampliada";
    lightbox.classList.add("open");
    frame?.classList.toggle("is-zoomed", window.innerWidth < 760);
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("loading");
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    const frame = lightbox.querySelector(".lightbox-frame");
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("loading");
    window.setTimeout(() => {
      if (!lightbox.classList.contains("open")) {
        lightboxImg.src = "";
        frame?.classList.remove("is-zoomed");
      }
    }, 280);
  }

  zoomItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(item);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxImg?.addEventListener("click", () => {
    lightboxImg.closest(".lightbox-frame")?.classList.toggle("is-zoomed");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("open")) {
      closeLightbox();
    }
  });

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    const pointer = { x: 0, y: 0, active: false };

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.offsetWidth * ratio);
      canvas.height = Math.floor(canvas.offsetHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      seedParticles();
    }

    function seedParticles() {
      particles.length = 0;
      const count = window.innerWidth < 760 ? 38 : 76;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          r: Math.random() * 2.2 + .7,
          vx: (Math.random() - .5) * .35,
          vy: (Math.random() - .5) * .35,
          a: Math.random() * .45 + .18
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            p.x -= dx * .003;
            p.y -= dy * .003;
          }
        }

        if (p.x < -20) p.x = canvas.offsetWidth + 20;
        if (p.x > canvas.offsetWidth + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.offsetHeight + 20;
        if (p.y > canvas.offsetHeight + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 207, 31, ${p.a})`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 118) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(76, 175, 80, ${.14 * (1 - dist / 118)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawParticles);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    }, { passive: true });
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    resizeCanvas();
    drawParticles();
  }
}());
