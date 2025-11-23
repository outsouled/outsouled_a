// Simple mobile menu toggle + dynamic year
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "flex";
    mobileNav.style.display = isOpen ? "none" : "flex";
  });

  // Close mobile nav when clicking a link
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.style.display = "none";
    });
  });
}
