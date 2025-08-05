const display = document.getElementById('display');
const keys = document.getElementById('keys');
const scientificKeys = document.getElementById('scientificKeys');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const historyList = document.getElementById('historyList');
const exportHistoryBtn = document.getElementById('exportHistoryBtn');
const importHistoryBtn = document.getElementById('importHistoryBtn');
const importFile = document.getElementById('importFile');

let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;
let powerMode = false; // for xʸ

const HISTORY_KEY = 'calculatorHistory';

let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

// Update display
function updateDisplay() {
  display.value = currentInput;
}

// Render history list
function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<li><em>No history yet</em></li>';
    return;
  }
  history.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

// Save to history & localStorage
function saveHistory(entry) {
  history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

// Calculate function for basic operators
function calculate(first, second, op) {
  first = parseFloat(first);
  second = parseFloat(second);
  switch(op) {
    case 'add': return first + second;
    case 'subtract': return first - second;
    case 'multiply': return first * second;
    case 'divide': return second === 0 ? 'Error' : first / second;
    default: return second;
  }
}

// Helper scientific functions
function factorial(n) {
  n = Math.floor(n);
  if (n < 0) return 'Error';
  if (n === 0) return 1;
  let res = 1;
  for(let i=1; i<=n; i++) res *= i;
  return res;
}

// Apply scientific function to current input
function applyScientificFunc(action) {
  let num = parseFloat(currentInput);
  let result;

  switch(action) {
    case 'sin': result = Math.sin(num * Math.PI / 180); break; // degrees
    case 'cos': result = Math.cos(num * Math.PI / 180); break;
    case 'tan': 
      if ((num % 180) === 90) result = 'Error'; 
      else result = Math.tan(num * Math.PI / 180); 
      break;
    case 'log': result = num <= 0 ? 'Error' : Math.log10(num); break;
    case 'sqrt': result = num < 0 ? 'Error' : Math.sqrt(num); break;
    case 'pow2': result = Math.pow(num, 2); break;
    case 'pow3': result = Math.pow(num, 3); break;
    case 'pi': result = Math.PI; break;
    case 'e': result = Math.E; break;
    case 'abs': result = Math.abs(num); break;
    case 'factorial': 
      result = factorial(num);
      break;
    default: result = num;
  }

  if (typeof result === 'number') {
    currentInput = result.toString();
  } else {
    currentInput = result;
  }
  updateDisplay();
  saveHistory(`${action}(${num}) = ${currentInput}`);
}

// Toggle basic/scientific mode
toggleModeBtn.addEventListener('click', () => {
  if (scientificKeys.style.display === 'none') {
    scientificKeys.style.display = 'grid';
    keys.classList.remove('basic');
    keys.classList.add('scientific');
    toggleModeBtn.textContent = 'Switch to Basic';
  } else {
    scientificKeys.style.display = 'none';
    keys.classList.remove('scientific');
    keys.classList.add('basic');
    toggleModeBtn.textContent = 'Switch to Scientific';
  }
});

// Listen to basic keys clicks
keys.addEventListener('click', e => {
  const target = e.target;
  if (!target.matches('button')) return;

  // Digit or dot
  if (target.dataset.digit !== undefined) {
    if (waitingForSecondOperand) {
      currentInput = target.dataset.digit === '.' ? '0.' : target.dataset.digit;
      waitingForSecondOperand = false;
    } else {
      if (target.dataset.digit === '.') {
        if (!currentInput.includes('.')) currentInput += '.';
      } else {
        currentInput = currentInput === '0' ? target.dataset.digit : currentInput + target.dataset.digit;
      }
    }
    updateDisplay();
    return;
  }

  // Actions
  switch(target.dataset.action) {
    case 'clear':
      currentInput = '0';
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
      powerMode = false;
      updateDisplay();
      break;

    case 'delete':
      if (!waitingForSecondOperand) {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
        updateDisplay();
      }
      break;

    case 'percent':
      currentInput = (parseFloat(currentInput) / 100).toString();
      updateDisplay();
      break;

    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      if (operator && waitingForSecondOperand) {
        operator = target.dataset.action;
        return;
      }
      if (firstOperand === null) {
        firstOperand = currentInput;
      } else if (operator) {
        const result = calculate(firstOperand, currentInput, operator);
        currentInput = result.toString();
        firstOperand = result === 'Error' ? null : result;
        updateDisplay();
      }
      operator = target.dataset.action;
      waitingForSecondOperand = true;
      break;

    case 'equals':
      if (operator === null || waitingForSecondOperand) return;
      if (powerMode) {
        const base = parseFloat(firstOperand);
        const exponent = parseFloat(currentInput);
        currentInput = Math.pow(base, exponent).toString();
        saveHistory(`${base} ^ ${exponent} = ${currentInput}`);
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        powerMode = false;
        updateDisplay();
        return;
      }
      const result = calculate(firstOperand, currentInput, operator);
      const operatorSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
      const expression = `${firstOperand} ${operatorSymbols[operator]} ${currentInput} = ${result}`;
      currentInput = result.toString();
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
      updateDisplay();
      saveHistory(expression);
      break;
  }
});

// Listen to scientific keys clicks
scientificKeys.addEventListener('click', e => {
  const target = e.target;
  if (!target.matches('button')) return;

  const action = target.dataset.action;

  if (action === 'pow') {
    // Activate power mode: waiting for exponent
    if (!waitingForSecondOperand && operator === null) {
      firstOperand = currentInput;
      operator = 'pow';
      waitingForSecondOperand = true;
      powerMode = true;
      currentInput = '0';
      updateDisplay();
    }
    return;
  }

  // Other scientific functions
  applyScientificFunc(action);
});

// Export history JSON
exportHistoryBtn.addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "history.json");
  dlAnchorElem.click();
});

// Import history JSON
importHistoryBtn.addEventListener('click', () => {
  importFile.click();
});

importFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        history = imported;
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistory();
        alert('History imported successfully.');
      } else {
        alert('Invalid history JSON format.');
      }
    } catch {
      alert('Failed to parse JSON.');
    }
  };
  reader.readAsText(file);
  importFile.value = '';
});


// Initial render & display
renderHistory();
updateDisplay();
document.addEventListener('DOMContentLoaded', () => {
  // Set initial display mode
  scientificKeys.style.display = 'none';
  keys.classList.add('basic');
  toggleModeBtn.textContent = 'Switch to Scientific';
});

// Event listener for history panel toggle
document.getElementById('historyPanel').addEventListener('click', (e) => {
  if (e.target.id === 'historyPanel') {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.classList.toggle('collapsed');
  }
});
document.getElementById('historyPanel').classList.add('collapsed'); // Start collapsed
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  // Optional confirmation prompt
  if (confirm('Are you sure you want to clear the history?')) {
    localStorage.removeItem('calcHistory');

    const historyContainer = document.getElementById('history');
    if (historyContainer) {
      historyContainer.innerHTML = '<em>No history yet.</em>';
    }
  }
});


