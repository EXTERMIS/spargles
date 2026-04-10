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
  console.log(clickCount)
  // check for 101 clicks
  if (clickCount === 101) {
    const img = document.querySelector('.content-image img');
    
    // change the image
    img.src = "/images/wedding.png"; // <-- replace with your image
  }
  if (clickCount === 102) {
    const img = document.querySelector('.content-image img');
    
    // change the image
    img.src = "/images/Placeholder.png"; // <-- replace with your image
  }
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

