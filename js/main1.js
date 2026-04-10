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

const clickSound = new Audio("audio/ping.mp3");

function mascotClick(element) {
  clickSound.volume = 0.1;
  clickSound.currentTime = 0; // restart if spam clicked
  clickSound.play();
  element.classList.add('active');

  setTimeout(() => {
    element.classList.remove('active');
    element.classList.add('pop');

    setTimeout(() => {
      element.classList.remove('pop');
    }, 150);
  }, 150);
}

document.addEventListener("scroll", function () {
        const scrollPosition = window.pageYOffset;
        const fadeText = document.querySelector(".fade-text");
        const fadeEffect = 1 - (scrollPosition * 3.5) / window.innerHeight;

        fadeText.style.opacity = fadeEffect >= 0 ? fadeEffect : 0;
      });

      window.addEventListener("scroll", function () {
        var element = document.querySelector(".pls-scroll");
        var scrollPosition = window.scrollY * 2;
        var fadeStart = 100; // Start fading at this scroll position
        var fadeEnd = 300; // Fully faded by this scroll position

        if (scrollPosition >= fadeStart && scrollPosition <= fadeEnd) {
          var opacity =
            1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
          element.style.opacity = opacity;
        } else if (scrollPosition > fadeEnd) {
          element.style.opacity = 0;
        } else {
          element.style.opacity = 1;
        }
      });

      window.addEventListener("scroll", function () {
        var element = document.querySelector(".bg-img");
        var scrollPosition = window.scrollY;
        var maxScroll = document.body.scrollHeight - window.innerHeight;

        // Calculate opacity: 1.0 when at the top, 0.25 when scrolled to the bottom
        var opacity = 1.0 - (scrollPosition / maxScroll) * 0.75;

        // Limit opacity to 0.25 (25%)
        if (opacity < 0.25) {
          opacity = 0.25;
        }

        element.style.opacity = opacity;
      });

      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      };

