const categorySelect = document.getElementById('category');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const resultBox = document.getElementById('result');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');

const units = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
  },
  temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
  volume: {
    liter: 1,
    milliliter: 0.001,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.24,
    fluid_ounce: 0.0295735,
  }
};

// Populate unit dropdowns based on category
function populateUnits() {
  const category = categorySelect.value;
  fromUnitSelect.innerHTML = '';
  toUnitSelect.innerHTML = '';

  if (category === 'temperature') {
    units.temperature.forEach(unit => {
      const option1 = document.createElement('option');
      option1.value = unit;
      option1.textContent = unit;
      fromUnitSelect.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = unit;
      option2.textContent = unit;
      toUnitSelect.appendChild(option2);
    });
  } else {
    for (let unit in units[category]) {
      const option1 = document.createElement('option');
      option1.value = unit;
      option1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ');
      fromUnitSelect.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = unit;
      option2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ');
      toUnitSelect.appendChild(option2);
    }
  }
  fromUnitSelect.selectedIndex = 0;
  toUnitSelect.selectedIndex = 1;
  resultBox.textContent = 'Result will appear here';
}

function convertTemperature(value, from, to) {
  let celsius;

  switch (from) {
    case 'Celsius':
      celsius = value;
      break;
    case 'Fahrenheit':
      celsius = (value - 32) * (5 / 9);
      break;
    case 'Kelvin':
      celsius = value - 273.15;
      break;
  }

  switch (to) {
    case 'Celsius':
      return celsius;
    case 'Fahrenheit':
      return (celsius * 9/5) + 32;
    case 'Kelvin':
      return celsius + 273.15;
  }
}

function convertUnits() {
  const category = categorySelect.value;
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;
  const input = parseFloat(inputValue.value);

  if (isNaN(input)) {
    resultBox.textContent = 'Please enter a valid number.';
    return;
  }

  if (category === 'temperature') {
    const converted = convertTemperature(input, fromUnit, toUnit);
    resultBox.textContent = `${input} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`;
  } else {
    const fromFactor = units[category][fromUnit];
    const toFactor = units[category][toUnit];
    const baseValue = input * fromFactor; 
    const converted = baseValue / toFactor;
    resultBox.textContent = `${input} ${fromUnit.charAt(0).toUpperCase() + fromUnit.slice(1).replace('_', ' ')} = ${converted.toFixed(4)} ${toUnit.charAt(0).toUpperCase() + toUnit.slice(1).replace('_', ' ')}`;
  }
}

function swapUnits() {
  const from = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = from;
  convertUnits();
}

categorySelect.addEventListener('change', () => {
  populateUnits();
  inputValue.value = '';
  resultBox.textContent = 'Result will appear here';
});

convertBtn.addEventListener('click', convertUnits);
swapBtn.addEventListener('click', swapUnits);
document.addEventListener('DOMContentLoaded', () => {
  populateUnits();
});

