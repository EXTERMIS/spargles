// Drag and drop logic for the converter
const boxes = document.querySelectorAll('.draggable-box');
const dropzones = document.querySelectorAll('.dropzone');

let draggedBox = null;
let fromZone = document.getElementById('from-zone');
let toZone = document.getElementById('to-zone');

const convertBtn = document.getElementById('convert-btn');

function updateConvertBtn() {
    if (
        fromZone.getAttribute('data-value') &&
        toZone.getAttribute('data-value')
    ) {
        convertBtn.disabled = false;
    } else {
        convertBtn.disabled = true;
    }
}

function resetZone(zone) {
    zone.textContent = '___';
    zone.removeAttribute('data-value');
    updateConvertBtn();
}

// No longer hide boxes when used
function updateBoxVisibility() {
    boxes.forEach(box => {
        box.style.visibility = '';
    });
    // Update dropzone border style if filled
    dropzones.forEach(zone => {
        if (zone.getAttribute('data-value')) {
            zone.classList.add('filled');
        } else {
            zone.classList.remove('filled');
        }
    });
    updateConvertBtn();
}

boxes.forEach(box => {
    box.addEventListener('dragstart', (e) => {
        draggedBox = box;
    });
    box.addEventListener('dragend', (e) => {
        draggedBox = null;
    });
});

dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('active');
    });
    zone.addEventListener('dragleave', (e) => {
        zone.classList.remove('active');
    });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('active');
        if (draggedBox) {
            // If zone already has a value, just replace
            zone.textContent = draggedBox.textContent;
            zone.setAttribute('data-value', draggedBox.id);
            updateBoxVisibility();
            updateConvertBtn();
        }
    });
    // Allow removing a box by double-clicking the dropzone
    zone.addEventListener('dblclick', () => {
        resetZone(zone);
        updateBoxVisibility();
        updateConvertBtn();
    });
});

// Allow dragging a box out of a dropzone to remove it
dropzones.forEach(zone => {
    zone.addEventListener('dragstart', (e) => {
        const value = zone.getAttribute('data-value');
        if (value) {
            e.dataTransfer.setData('text/plain', value);
        }
    });
    zone.setAttribute('draggable', 'true');
    zone.addEventListener('dragend', (e) => {
        const value = zone.getAttribute('data-value');
        if (value) {
            const box = document.getElementById(value);
            if (box) box.style.visibility = '';
            resetZone(zone);
            updateBoxVisibility();
            updateConvertBtn();
        }
    });
});

// Convert button logic: open google-converter.html with params if valid
convertBtn.addEventListener('click', () => {
    const from = fromZone.getAttribute('data-value');
    const to = toZone.getAttribute('data-value');
    if (
        (from === 'metric' && to === 'imperial') ||
        (from === 'imperial' && to === 'metric') ||
        (from === 'metric' && to === 'metric') ||
        (from === 'imperial' && to === 'imperial') ||
        (from === 'devin' && (to === 'metric' || to === 'imperial' || to === 'devin')) ||
        ((from === 'metric' || from === 'imperial') && to === 'devin')
    ) {
        window.open(`google-converter.html?from=${from}&to=${to}`, '_blank');
    } else {
        alert('Only Metric, Imperial, and Devin conversions are supported for now.');
    }
});
