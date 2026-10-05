document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle-button");
  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute(
      "aria-label",
      isDark ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع الداكن",
    );
    localStorage.setItem("portfolio-theme", theme);
  }
  const savedTheme =
    localStorage.getItem("portfolio-theme") ||
    (root.classList.contains("dark") ? "dark" : "light");
  applyTheme(savedTheme);
  themeToggle?.addEventListener("click", () => {
    applyTheme(root.classList.contains("dark") ? "light" : "dark");
  });
  const header = document.getElementById("header");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
  function updateActiveNav() {
    const scrollPosition = window.scrollY + 140;
    let currentSection = "hero-section";
    sections.forEach((section) => {
      if (
        scrollPosition >= section.offsetTop &&
        scrollPosition < section.offsetTop + section.offsetHeight
      ) {
        currentSection = section.id;
      }
    });
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${currentSection}`;
      link.classList.toggle("active", active);
    });
    if (header) {
      header.classList.toggle("shadow-lg", window.scrollY > 20);
    }
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
  const filterButtons = [...document.querySelectorAll(".portfolio-filter")];
  const portfolioItems = [...document.querySelectorAll(".portfolio-item")];
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      portfolioItems.forEach((item) => {
        const categories = (item.dataset.category || "").split(" ");
        const show = filter === "all" || categories.includes(filter);
        if (show) {
          item.classList.remove("hidden");
          item.animate(
            [
              {
                opacity: 0,
                transform: "translateY(15px)",
              },
              {
                opacity: 1,
                transform: "translateY(0)",
              },
            ],
            {
              duration: 350,
              easing: "ease",
            },
          );
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
  const carousel = document.getElementById("testimonials-carousel");
  const testimonialCards = [...document.querySelectorAll(".testimonial-card")];
  const indicators = [...document.querySelectorAll(".carousel-indicator")];
  const nextTestimonial = document.getElementById("next-testimonial");
  const prevTestimonial = document.getElementById("prev-testimonial");
  let testimonialIndex = 0;
  let testimonialTimer;
  function getVisibleTestimonials() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }
  function getMaxTestimonialIndex() {
    const visible = getVisibleTestimonials();
    return Math.max(0, testimonialCards.length - visible);
  }
  function updateTestimonialCarousel() {
    if (!carousel || testimonialCards.length === 0) {
      return;
    }
    const visible = getVisibleTestimonials();
    const maxIndex = getMaxTestimonialIndex();
    if (testimonialIndex > maxIndex) {
      testimonialIndex = 0;
    }
    if (testimonialIndex < 0) {
      testimonialIndex = maxIndex;
    }
    carousel.style.display = "flex";
    carousel.style.flexWrap = "nowrap";
    carousel.style.transition = "transform 0.5s ease";
    carousel.style.willChange = "transform";
    testimonialCards.forEach((card) => {
      card.style.flex = `0 0 ${100 / visible}%`;
      card.style.width = `${100 / visible}%`;
      card.style.boxSizing = "border-box";
      card.style.flexShrink = "0";
    });
    const cardWidth = testimonialCards[0].getBoundingClientRect().width;
    const move = testimonialIndex * cardWidth;
    if (document.documentElement.dir === "rtl") {
      carousel.style.transform = `translateX(${move}px)`;
    } else {
      carousel.style.transform = `translateX(-${move}px)`;
    }
    indicators.forEach((indicator, index) => {
      const active = index === testimonialIndex;
      indicator.classList.toggle("bg-accent", active);
      indicator.classList.toggle("bg-slate-400", !active);
      indicator.classList.toggle("dark:bg-slate-600", !active);
      indicator.setAttribute("aria-selected", String(active));
    });
  }
  function goToTestimonial(index) {
    const maxIndex = getMaxTestimonialIndex();
    if (index > maxIndex) {
      index = 0;
    }
    if (index < 0) {
      index = maxIndex;
    }
    testimonialIndex = index;
    updateTestimonialCarousel();
  }
  function nextSlide() {
    goToTestimonial(testimonialIndex + 1);
    restartTestimonialTimer();
  }
  function previousSlide() {
    goToTestimonial(testimonialIndex - 1);
    restartTestimonialTimer();
  }
  nextTestimonial?.addEventListener("click", nextSlide);
  prevTestimonial?.addEventListener("click", previousSlide);
  indicators.forEach((indicator, index) => {
    indicator.dataset.index = String(index);
    indicator.addEventListener("click", () => {
      goToTestimonial(index);
      restartTestimonialTimer();
    });
  });
  function startTestimonialTimer() {
    clearInterval(testimonialTimer);
    if (testimonialCards.length <= getVisibleTestimonials()) {
      return;
    }
    testimonialTimer = setInterval(() => {
      goToTestimonial(testimonialIndex + 1);
    }, 5000);
  }
  function restartTestimonialTimer() {
    clearInterval(testimonialTimer);
    startTestimonialTimer();
  }
  window.addEventListener("resize", () => {
    testimonialIndex = 0;
    updateTestimonialCarousel();
    restartTestimonialTimer();
  });
  updateTestimonialCarousel();
  if (testimonialCards.length > 0) {
    startTestimonialTimer();
  }
  const customSelects = [...document.querySelectorAll(".custom-select")];
  function closeAllCustomSelects(except = null) {
    customSelects.forEach((select) => {
      if (select === except) return;
      const wrapper = select.closest(".custom-select-wrapper");
      const options = wrapper?.querySelector(".custom-options");
      const arrow = select.querySelector("i");
      options?.classList.add("hidden");
      select.setAttribute("aria-expanded", "false");
      arrow?.classList.remove("rotate-180");
    });
  }
  customSelects.forEach((select) => {
    const wrapper = select.closest(".custom-select-wrapper");
    const options = wrapper?.querySelector(".custom-options");
    const selectedText = select.querySelector(".selected-text");
    const arrow = select.querySelector("i");
    if (!wrapper || !options) return;
    function toggleSelect() {
      const isOpen = !options.classList.contains("hidden");
      closeAllCustomSelects(select);
      options.classList.toggle("hidden", isOpen);
      select.setAttribute("aria-expanded", String(!isOpen));
      arrow?.classList.toggle("rotate-180", !isOpen);
    }
    select.addEventListener("click", toggleSelect);
    select.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSelect();
      }
      if (event.key === "Escape") {
        closeAllCustomSelects();
      }
    });
    options.querySelectorAll(".custom-option").forEach((option) => {
      option.addEventListener("click", () => {
        if (selectedText) {
          selectedText.textContent = option.textContent.trim();
          selectedText.classList.remove(
            "text-slate-500",
            "dark:text-slate-400",
          );
        }
        select.dataset.value = option.dataset.value || "";
        options.querySelectorAll(".custom-option").forEach((item) => {
          item.setAttribute("aria-selected", String(item === option));
        });
        closeAllCustomSelects();
      });
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-select-wrapper")) {
      closeAllCustomSelects();
    }
  });
  const contactForm = document.querySelector(
    '#contact form[aria-label="نموذج التواصل"]',
  );
  if (contactForm) {
    contactForm.noValidate = true;
    const nameField = document.getElementById("full-name");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const detailsField = document.getElementById("project-details");
    function removeFieldError(field) {
      if (!field) return;
      const error = field.parentElement?.querySelector(".custom-field-error");
      error?.remove();
    }
    function showFieldError(field, message) {
      if (!field) return;
      removeFieldError(field);
      const error = document.createElement("div");
      error.className = "custom-field-error";
      error.textContent = message;
      error.style.color = "#ff5b63";
      error.style.fontSize = "16px";
      error.style.marginTop = "8px";
      error.style.textAlign = "right";
      error.style.lineHeight = "1.5";
      field.insertAdjacentElement("afterend", error);
    }
    nameField?.addEventListener("input", () => {
      if (nameField.value.trim()) {
        removeFieldError(nameField);
      }
    });
    emailField?.addEventListener("input", () => {
      if (emailField.value.trim()) {
        removeFieldError(emailField);
      }
    });
    detailsField?.addEventListener("input", () => {
      if (detailsField.value.trim()) {
        removeFieldError(detailsField);
      }
    });
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameField?.value.trim();
      const email = emailField?.value.trim();
      const details = detailsField?.value.trim();
      let hasError = false;
      if (!name) {
        showFieldError(nameField, "يرجى إدخال الاسم الكامل");
        hasError = true;
      }
      if (!email) {
        showFieldError(emailField, "يرجى إدخال البريد الإلكتروني");
        hasError = true;
      }
      if (!details) {
        showFieldError(detailsField, "يرجى إدخال تفاصيل المشروع");
        hasError = true;
      }
      if (hasError) {
        return;
      }
      let successModal = document.getElementById("success-modal");
      if (!successModal) {
        successModal = document.createElement("div");
        successModal.id = "success-modal";
        successModal.innerHTML = `
          <div class="success-modal-overlay">
            <div class="success-modal-box">
              <div class="success-icon">
                <i class="fas fa-check"></i>
              </div>
              <h2>تم إرسال رسالتك بنجاح!</h2>
              <p>
                شكرًا لتواصلك. سأرد عليك في أقرب وقت ممكن.
              </p>
              <button type="button" id="success-modal-close">
                حسنًا
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(successModal);
        const style = document.createElement("style");
        style.textContent = `
          #success-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;
          }
          .success-modal-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(2, 8, 23, 0.78);
            backdrop-filter: blur(8px);
            padding: 20px;
          }
          .success-modal-box {
            width: min(440px, 100%);
            padding: 38px 30px;
            text-align: center;
            border-radius: 18px;
            background: #1e2a3f;
            border: 1px solid #3b4b65;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
          }
          .success-icon {
            width: 92px;
            height: 92px;
            margin: 0 auto 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #00d084;
            color: white;
            font-size: 42px;
          }
          .success-modal-box h2 {
            margin: 0 0 14px;
            color: white;
            font-size: 28px;
            font-weight: 700;
          }
          .success-modal-box p {
            margin: 0 0 28px;
            color: #94a3b8;
            font-size: 17px;
            line-height: 1.8;
          }
          .success-modal-box button {
            border: 0;
            border-radius: 12px;
            padding: 12px 34px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
          }
          .success-modal-box button:hover {
            transform: translateY(-2px);
          }
        `;
        document.head.appendChild(style);
        document
          .getElementById("success-modal-close")
          ?.addEventListener("click", () => {
            successModal.remove();
            contactForm.reset();
            customSelects.forEach((select) => {
              const selectedText = select.querySelector(".selected-text");
              const defaultText =
                select.dataset.name === "budget"
                  ? "اختر الميزانية"
                  : "اختر نوع المشروع";
              if (selectedText) {
                selectedText.textContent = defaultText;
                selectedText.classList.add(
                  "text-slate-500",
                  "dark:text-slate-400",
                );
              }
              delete select.dataset.value;
            });
          });
      }
      successModal.style.display = "block";
    });
  }
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsSidebar = document.getElementById("settings-sidebar");
  const closeSettings = document.getElementById("close-settings");
  function openSettings() {
    settingsSidebar?.classList.remove("translate-x-full");
    settingsSidebar?.classList.add("translate-x-0");
    settingsSidebar?.setAttribute("aria-hidden", "false");
    settingsToggle?.setAttribute("aria-expanded", "true");
  }
  function closeSettingsPanel() {
    settingsSidebar?.classList.add("translate-x-full");
    settingsSidebar?.classList.remove("translate-x-0");
    settingsSidebar?.setAttribute("aria-hidden", "true");
    settingsToggle?.setAttribute("aria-expanded", "false");
  }
  settingsToggle?.addEventListener("click", () => {
    const isOpen = settingsSidebar?.classList.contains("translate-x-0");
    if (isOpen) {
      closeSettingsPanel();
    } else {
      openSettings();
    }
  });
  closeSettings?.addEventListener("click", closeSettingsPanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSettingsPanel();
      closeAllCustomSelects();
    }
  });
  const fontOptions = [...document.querySelectorAll(".font-option")];
  function applyFont(font) {
    body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
    body.classList.add(`font-${font}`);
    fontOptions.forEach((button) => {
      const active = button.dataset.font === font;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", String(active));
    });
    localStorage.setItem("portfolio-font", font);
  }
  const savedFont = localStorage.getItem("portfolio-font") || "tajawal";
  applyFont(savedFont);
  fontOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const font = button.dataset.font;
      if (font) {
        applyFont(font);
      }
    });
  });
  const colorsGrid = document.getElementById("theme-colors-grid");
  const colorThemes = [
    {
      name: "Indigo",
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#a855f7",
    },
    {
      name: "Blue",
      primary: "#3b82f6",
      secondary: "#2563eb",
      accent: "#06b6d4",
    },
    {
      name: "Emerald",
      primary: "#10b981",
      secondary: "#059669",
      accent: "#14b8a6",
    },
    {
      name: "Orange",
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#f59e0b",
    },
    {
      name: "Pink",
      primary: "#ec4899",
      secondary: "#db2777",
      accent: "#f43f5e",
    },
    {
      name: "Violet",
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#d946ef",
    },
    {
      name: "Rose",
      primary: "#f43f5e",
      secondary: "#e11d48",
      accent: "#fb7185",
    },
    {
      name: "Cyan",
      primary: "#06b6d4",
      secondary: "#0891b2",
      accent: "#3b82f6",
    },
  ];
  function setThemeColors(theme) {
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);
    document.querySelectorAll(".theme-color-option").forEach((button) => {
      const active = button.dataset.primary === theme.primary;
      button.classList.toggle("ring-2", active);
      button.classList.toggle("ring-offset-2", active);
    });
    localStorage.setItem("portfolio-colors", JSON.stringify(theme));
  }
  function renderColorOptions() {
    if (!colorsGrid) return;
    colorsGrid.innerHTML = "";
    colorThemes.forEach((theme) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "theme-color-option w-12 h-12 rounded-xl border-2 border-white dark:border-slate-700 shadow-md transition-transform duration-200 hover:scale-110 focus:outline-none";
      button.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
      button.dataset.primary = theme.primary;
      button.title = theme.name;
      button.setAttribute("aria-label", `لون ${theme.name}`);
      button.addEventListener("click", () => {
        setThemeColors(theme);
      });
      colorsGrid.appendChild(button);
    });
  }
  renderColorOptions();
  const savedColors = localStorage.getItem("portfolio-colors");
  if (savedColors) {
    try {
      setThemeColors(JSON.parse(savedColors));
    } catch {
      setThemeColors(colorThemes[0]);
    }
  } else {
    setThemeColors(colorThemes[0]);
  }
  const resetSettings = document.getElementById("reset-settings");
  resetSettings?.addEventListener("click", () => {
    localStorage.removeItem("portfolio-theme");
    localStorage.removeItem("portfolio-font");
    localStorage.removeItem("portfolio-colors");
    applyTheme("dark");
    applyFont("tajawal");
    setThemeColors(colorThemes[0]);
    showMessage("تمت إعادة إعدادات المظهر للوضع الافتراضي.");
  });
  const scrollToTop = document.getElementById("scroll-to-top");
  function updateScrollTopButton() {
    if (!scrollToTop) return;
    if (window.scrollY > 500) {
      scrollToTop.classList.remove("opacity-0", "invisible");
    } else {
      scrollToTop.classList.add("opacity-0", "invisible");
    }
  }
  scrollToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  window.addEventListener("scroll", updateScrollTopButton, { passive: true });
  updateScrollTopButton();
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    clearInterval(testimonialTimer);
  }
});