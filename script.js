'use strict';

document.documentElement.classList.add('js-ready');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const siteHeader = document.querySelector('.site-header');

function syncNavigationTop() {
  if (!navigation || !siteHeader) return;
  if (window.innerWidth <= 680) {
    navigation.style.setProperty('--navigation-top', `${Math.round(siteHeader.getBoundingClientRect().bottom)}px`);
  } else {
    navigation.style.removeProperty('--navigation-top');
  }
}

syncNavigationTop();
window.addEventListener('scroll', syncNavigationTop, { passive: true });
window.addEventListener('resize', syncNavigationTop);

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

// Reveal sections as they enter the viewport. Content remains visible if this API is unavailable.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Service links preselect a relevant enquiry category.
document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    const serviceSelect = document.querySelector('#service-interest');
    if (!serviceSelect) return;
    const targetValue = link.dataset.service;
    const matchingOption = Array.from(serviceSelect.options).find((option) => option.textContent.trim() === targetValue);
    if (matchingOption) serviceSelect.value = matchingOption.value;
  });
});

// Client-side demo interaction only: no information is sent or stored.
const contactForm = document.querySelector('#consultation-form');
const formFeedback = document.querySelector('#form-feedback');

if (contactForm && formFeedback) {
  const requiredFields = Array.from(contactForm.querySelectorAll('[required]'));

  requiredFields.forEach((field) => {
    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
      field.setCustomValidity('');
    });
    field.addEventListener('change', () => {
      field.removeAttribute('aria-invalid');
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formFeedback.hidden = true;

    const invalidField = requiredFields.find((field) => !field.checkValidity());
    if (invalidField) {
      requiredFields.forEach((field) => {
        if (!field.checkValidity()) field.setAttribute('aria-invalid', 'true');
      });
      invalidField.reportValidity();
      invalidField.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const firstName = String(formData.get('fullName') || '').trim().split(/\s+/)[0] || 'there';
    formFeedback.textContent = `Thank you, ${firstName}. This demo form has validated your enquiry, but it has not sent or stored anything. Before launch, connect the form to the real firm's approved email or enquiry system.`;
    formFeedback.hidden = false;
    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

const yearNode = document.querySelector('#current-year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

                        
