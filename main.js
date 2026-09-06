document.addEventListener("DOMContentLoaded", () => {
  const bravepopup = document.querySelector('.popup');

  async function checkBrave() {
    if (navigator.brave && await navigator.brave.isBrave()) {
      bravepopup.style.display = 'block';
    } else {
      bravepopup.style.display = 'nonde'; 
    }
  }

  checkBrave();
});

function closePopup() {
  const bravepopup = document.querySelector('.popup');
  bravepopup.style.display = 'none';
}
