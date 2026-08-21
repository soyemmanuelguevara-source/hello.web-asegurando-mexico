const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
const waToggle = document.getElementById("waToggle");
const waMenu = document.getElementById("waMenu");
const toTop = document.getElementById("toTop");
const contactForm = document.getElementById("contactForm");
const loadingScreen = document.getElementById("loading-screen");
const brochureModal = document.getElementById("brochureModal");
const brochureImage = document.getElementById("brochureImage");
const brochureTitle = document.getElementById("brochureTitle");
const brochureClose = document.getElementById("brochureClose");

const setScrolledState = () => {
  const isScrolled = window.scrollY > 24;
  header?.classList.toggle("is-scrolled", isScrolled);
  toTop?.classList.toggle("is-visible", window.scrollY > 640);
};

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loadingScreen?.classList.add("is-hidden");
  }, 450);
});

window.addEventListener("scroll", setScrolledState, { passive: true });
setScrolledState();

navToggle?.addEventListener("click", () => {
  navToggle.classList.toggle("is-open");
  mobileNav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.classList.remove("is-open");
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  });
});

waToggle?.addEventListener("click", () => {
  waMenu?.classList.toggle("is-open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".wa-float")) {
    waMenu?.classList.remove("is-open");
  }
});

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

const animateCounter = (element) => {
  const target = Number(element.dataset.count || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const startCounters = () => {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(animateCounter);
};

if (counters.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startCounters();
        observer.disconnect();
      }
    },
    { threshold: 0.24 }
  );

  counterObserver.observe(counters[0]);
} else {
  startCounters();
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const nombre = String(data.get("nombre") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  const area = String(data.get("area") || "").trim();
  const mensaje = String(data.get("mensaje") || "").trim();

  const text = [
    "Hola, quiero solicitar una cotización con Ruiz Agentes de Seguros.",
    nombre ? `Nombre: ${nombre}` : "",
    telefono ? `Teléfono: ${telefono}` : "",
    area ? `Tipo de seguro: ${area}` : "",
    mensaje ? `Mensaje: ${mensaje}` : ""
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/528999363386?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

const closeBrochure = () => {
  brochureModal?.classList.remove("is-open");
  brochureModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

document.querySelectorAll("[data-brochure]").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.getAttribute("data-brochure") || "";
    const title = button.getAttribute("data-title") || "Folleto";
    const alt = button.querySelector("img")?.getAttribute("alt") || title;

    if (!brochureModal || !brochureImage || !brochureTitle) return;

    brochureImage.src = image;
    brochureImage.alt = alt;
    brochureTitle.textContent = title;
    brochureModal.classList.add("is-open");
    brochureModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    brochureClose?.focus();
  });
});

brochureClose?.addEventListener("click", closeBrochure);

brochureModal?.addEventListener("click", (event) => {
  if (event.target === brochureModal) {
    closeBrochure();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && brochureModal?.classList.contains("is-open")) {
    closeBrochure();
  }
});
