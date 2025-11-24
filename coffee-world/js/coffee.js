// coffee.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== NAVIGATION =====
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  function closeNav() {
    if (nav) nav.style.display = 'none';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  function openNav() {
    if (nav) nav.style.display = 'block';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav();
      else openNav();
    });

    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && window.innerWidth < 768) closeNav();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        nav.style.display = 'block';
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        nav.style.display = 'none';
      }
    });

    if (window.innerWidth < 768) {
      nav.style.display = 'none';
      navToggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.style.display = 'block';
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // ===== RECIPE OVERLAY =====
  const coffeeImg = document.getElementById("coffee-img");
  const recipeSection = document.getElementById("recipe-section");

  if (coffeeImg && recipeSection) {
    coffeeImg.setAttribute('tabindex', '0');
    coffeeImg.style.cursor = 'pointer';

    function openRecipe() {
      recipeSection.classList.add("show");
      recipeSection.setAttribute('aria-hidden', 'false');
      coffeeImg.setAttribute('aria-expanded', 'true');
    }

    function closeRecipe() {
      recipeSection.classList.remove("show");
      recipeSection.setAttribute('aria-hidden', 'true');
      coffeeImg.setAttribute('aria-expanded', 'false');
    }

    coffeeImg.addEventListener("click", openRecipe);
    coffeeImg.addEventListener("keydown", (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRecipe();
      }
    });

    // kliknięcie w overlay (całość) zamyka go
    recipeSection.addEventListener("click", closeRecipe);

    // ESC zamyka overlay
    document.addEventListener("keydown", (e) => {
      if (e.key === 'Escape' && recipeSection.classList.contains("show")) {
        closeRecipe();
      }
    });
  }
});
