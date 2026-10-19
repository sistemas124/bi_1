function initSilaboPage() {
  const navLinks = [...document.querySelectorAll("#syllabusNav a")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const backToTop = document.getElementById("backToTop");
  const themeButton = document.querySelector(".theme-toggle");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (localStorage.getItem("aulaDatosTheme") === "dark" || (!localStorage.getItem("aulaDatosTheme") && prefersDark)) document.body.classList.add("theme-dark");

  function updateThemeButton() {
    const dark = document.body.classList.contains("theme-dark");
    themeButton.setAttribute("aria-label", dark ? "Activar tema claro" : "Activar tema oscuro");
    themeButton.innerHTML = `<i class="bi ${dark ? "bi-sun" : "bi-moon-stars"}" aria-hidden="true"></i>`;
  }

  updateThemeButton();
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("aulaDatosTheme", document.body.classList.contains("theme-dark") ? "dark" : "light");
    updateThemeButton();
  });

  navLinks.forEach(link => link.addEventListener("click", () => {
    navLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  }));

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const activeLink = navLinks.find(link => link.hash === `#${entry.target.id}`);
      if (!activeLink) return;
      navLinks.forEach(link => link.classList.toggle("active", link === activeLink));
    });
  }, { rootMargin: "-24% 0px -66% 0px", threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

  function toggleBackToTop() {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();
}

document.addEventListener("DOMContentLoaded", initSilaboPage);
