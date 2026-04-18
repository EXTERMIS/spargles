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

function contentClick() {
  window.location.assign("https://spargles.com/Bobto/Converter/");
}

let clickCount = 0;

function mascotClick(element) {
  // play sound (optional)
  const sound = new Audio("audio/ping.mp3"); // <-- replace with your sound file
  sound.volume = 0.2;
  sound.play();

  // animation
  element.classList.add('active');
  setTimeout(() => {
    element.classList.remove('active');
  }, 200);

  // count clicks
  clickCount++;
  // check for 101 clicks
  if (clickCount === 101) {
    const img = document.querySelector('.content-image img');

    // change the image
    img.src = "images/wedding.png"; // <-- replace with your image
  }
  if (clickCount === 102) {
    const img = document.querySelector('.content-image img');

    // change the image
    img.src = "images/Placeholder.png"; // <-- replace with your image
  }
}
