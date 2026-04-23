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

function signup() {
  window.location.assign("https://signup.spargles.com");
}

function login() {
  window.location.assign("https://login.spargles.com");
}

function personal() {
  window.location.assign("https://personal.spargles.com");
}

function contact() {
  window.location.assign("https://contact.spargles.com");
}

function terms() {
  window.location.assign("https://spargles.com/terms");
}

function BobTool1() {
  window.location.assign("https://spargles.com/Bobto/Converter");
}

function PEVideo() {
  window.location.assign("https://www.youtube.com/watch?v=HNpi5DM8DRA");
}

const mascotMessages = [
  "Hey there!",
  "Yo!",
  "Hola!",
  "Hello, human!",
  "Choose BobTo!",
  "FInd Secrets!",
  "EST. 2026!",
  "Glitch Died...",
  "That Tickles!!",
  "Welcome!"
];

let currentMessageIndex = 0;

function mascotClick(element) {
  const sound = new Audio("audio/ping.mp3");
  sound.volume = 0.2;
  sound.play();

  // animation
  element.classList.add('active');
  setTimeout(() => {
    element.classList.remove('active');
  }, 200);

  // change text
  const textElement = document.getElementById("mascot-text");

  textElement.textContent = mascotMessages[currentMessageIndex];

  // move to next message
  currentMessageIndex++;
  if (currentMessageIndex >= mascotMessages.length) {
    currentMessageIndex = 0; // loop back to start
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  let current = 0;

  let isScrolling = false;
  let lastScrollTime = 0;
  const scrollDelay = 900;

  // 🔥 Detect which section is currently in view
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

  // 🔥 Set correct starting section on load
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

  // 🖱️ WHEEL (desktop + touchpad)
  window.addEventListener("wheel", (e) => {
    const now = Date.now();

    if (isScrolling || now - lastScrollTime < scrollDelay) return;
    if (Math.abs(e.deltaY) < 30) return; // ignore tiny touchpad movement

    lastScrollTime = now;

    if (e.deltaY > 0) {
      scrollToSection(current + 1);
    } else {
      scrollToSection(current - 1);
    }
  });

  // 📱 TOUCH (mobile)
  let touchStartY = 0;

  window.addEventListener("touchstart", (e) => {
    touchStartY = e.changedTouches[0].screenY;
  });

  window.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (isScrolling || now - lastScrollTime < scrollDelay) return;

    const touchEndY = e.changedTouches[0].screenY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) < 50) return; // ignore small swipes

    lastScrollTime = now;

    if (diff > 0) {
      scrollToSection(current + 1);
    } else {
      scrollToSection(current - 1);
    }
  });

  // 🔁 Keep current section synced if user scrolls manually
  window.addEventListener("scroll", () => {
    if (isScrolling) return;
    current = getCurrentSection();
  });
});
