
(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-navigation");
  const form = document.querySelector("#consultation-form");
  const feedback = document.querySelector("#form-feedback");
  const year = document.querySelector("#current-year");

  // Automatically update the copyright year.
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Mobile navigation.
  const closeMenu = () => {
    if (!menuToggle || !navigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  const syncMenuTop = () => {
    if (!header || !navigation) return;

    navigation.style.setProperty(
      "--menu-top",
      `${header.getBoundingClientRect().bottom}px`
    );
  };

  if (menuToggle && navigation) {
    syncMenuTop();

    window.addEventListener("resize", syncMenuTop, {
      passive: true
    });

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        syncMenuTop();

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");

        navigation.classList.add("is-open");
        body.classList.add("menu-open");
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Gentle entrance animations.
  // Content remains visible if animation support is unavailable.
  try {
    if (
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      body.classList.add("js-ready");

      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              currentObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -35px 0px"
        }
      );

      document.querySelectorAll(".reveal").forEach((element) => {
        observer.observe(element);
      });
    }
  } catch (error) {
    body.classList.remove("js-ready");
  }

  // DEMO FORM ONLY.
  // This form does not send or store enquiries.
  if (form && feedback) {
    const fields = [
      {
        id: "full-name",
        errorId: "full-name-error",
        validate: (value) => value.trim().length > 1,
        message: "Please enter your name."
      },
      {
        id: "email",
        errorId: "email-error",
        validate: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: "Please enter a valid email address."
      },
      {
        id: "service",
        errorId: "service-error",
        validate: (value) => value.trim() !== "",
        message: "Please choose a service area."
      },
      {
        id: "message",
        errorId: "message-error",
        validate: (value) => value.trim().length >= 10,
        message:
          "Please add a little more detail (at least 10 characters)."
      }
    ];

    const clearFieldError = (field) => {
      const input = document.getElementById(field.id);
      const error = document.getElementById(field.errorId);

      if (input) input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    };

    fields.forEach((field) => {
      const input = document.getElementById(field.id);

      if (input) {
        input.addEventListener("input", () => {
          clearFieldError(field);
          feedback.hidden = true;
          feedback.textContent = "";
        });

        input.addEventListener("change", () => {
          clearFieldError(field);
        });
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      feedback.hidden = true;
      feedback.textContent = "";

      let firstInvalid = null;
      let valid = true;

      fields.forEach((field) => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.errorId);
        const value = input ? input.value : "";
        const fieldValid = input && field.validate(value);

        if (!fieldValid) {
          valid = false;

          if (input) {
            input.setAttribute("aria-invalid", "true");
          }

          if (error) {
            error.textContent = field.message;
          }

          if (!firstInvalid) {
            firstInvalid = input;
          }
        } else {
          clearFieldError(field);
        }
      });

      if (!valid) {
        feedback.textContent =
          "Please check the highlighted fields and try again. " +
          "This demonstration does not send your information.";

        feedback.hidden = false;

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      const name = document
        .getElementById("full-name")
        .value.trim();

      const service = document.getElementById("service").value;

      feedback.textContent =
        `Thank you, ${name}. Your sample enquiry for ${service} ` +
        "has passed the demo checks. Nothing has been sent or " +
        "stored because this is a portfolio concept.";

      feedback.hidden = false;

      feedback.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  }
})();
    
