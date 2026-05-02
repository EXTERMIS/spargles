function home() {
  window.location.assign("https://spargles.com/");
}

function shop() {
  window.location.assign("https://shop.spargles.com");
}

function games() {
  window.location.assign("https://games.spargles.com");
}

function project() {
  window.location.assign("https://projects.spargles.com");
}

function gallery() {
  window.location.assign("https://gallery.spargles.com");
}

function programs() {
  window.location.assign("https://programs.spargles.com");
}

function personal() {
  window.location.assign("https://personal.spargles.com");
}

function contact() {
  window.location.assign("https://contact.spargles.com");
}

window.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  let current = 0;

  let isScrolling = false;
  let lastScrollTime = 0;
  const scrollDelay = 900;

  // 🎯 Detect input type
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  function getCurrentSection() {
    let closestIndex = 0;
    let minDistance = Infinity;

    sections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    return closestIndex;
  }

  current = getCurrentSection();

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;

    isScrolling = true;
    current = index;

    sections[index].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setTimeout(() => {
      isScrolling = false;
    }, scrollDelay);
  }

  // 🖱️ ONLY enable snap scrolling for mouse users
  if (!isTouchDevice) {
    window.addEventListener("wheel", (e) => {
      const now = Date.now();

      if (isScrolling || now - lastScrollTime < scrollDelay) return;
      if (Math.abs(e.deltaY) < 30) return;

      lastScrollTime = now;

      if (e.deltaY > 0) {
        scrollToSection(current + 1);
      } else {
        scrollToSection(current - 1);
      }
    });
  }

  // 📱 Touch users get NORMAL scrolling → no override

  // 🔁 Keep section tracking for both
  window.addEventListener("scroll", () => {
    if (isScrolling) return;
    current = getCurrentSection();
  });
});
