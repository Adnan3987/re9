const items = document.querySelectorAll(".codex-item");
const sections = document.querySelectorAll(".codex-section");
const hint = document.querySelector(".codex-scroll-hint");
const panel = document.querySelector(".codex-panel");
const menuScroll = document.querySelector(".codex-menu-scroll");

items.forEach(item => {
  item.addEventListener("click", () => {
    const targetId = item.dataset.target;
    const nextSection = document.getElementById(targetId);
    const currentSection = document.querySelector(".codex-section.active");

    if (currentSection === nextSection) return;

    // menu active
    items.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // OUT animacija
    gsap.to(currentSection, {
      opacity: 0,
      x: 20,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        currentSection.classList.remove("active");

        // IN animacija
        nextSection.classList.add("active");
        gsap.fromTo(
          nextSection,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }
        );

        panel.scrollTop = 0;
        hint.style.opacity = "0.6";
      }
    });
  });
});

panel.addEventListener("scroll", () => {
  hint.style.opacity = "0";
});

function goBack() {
  window.location.href = "/";
}
