// brightness control code by macarius
const brightnessSlider = document.getElementById('brightness');
if (brightnessSlider) {
  brightnessSlider.addEventListener('input', function () {
    const brightnessValue = brightnessSlider.value;
    document.body.style.filter = `brightness(${brightnessValue}%)`;
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode', themeToggle.checked);
  });
}
