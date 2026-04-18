// Shared dark mode logic for all pages
function setDarkMode(on) {
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (on) {
        document.body.classList.add('dark-mode');
        if (darkToggle) darkToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        if (darkToggle) darkToggle.textContent = '🌙';
    }
    localStorage.setItem('darkMode', on ? '1' : '0');
}

function setupDarkModeToggle() {
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            setDarkMode(!document.body.classList.contains('dark-mode'));
        });
    }
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === null) {
        setDarkMode(true);
    } else {
        setDarkMode(savedMode === '1');
    }
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDarkModeToggle);
} else {
    setupDarkModeToggle();
}