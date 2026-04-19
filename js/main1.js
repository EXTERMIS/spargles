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

const mascotMessages = [
  "Hey there!",
  "Yo!",
  "Thanks for Visiting!",
  "Hello, friend!",
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
