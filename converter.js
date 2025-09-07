// =======================
// Currency Data
// =======================
const currencies = {
    'USD': { name: 'US Dollar', flag: '🇺🇸' },
    'EUR': { name: 'Euro', flag: '🇪🇺' },
    'GBP': { name: 'British Pound', flag: '🇬🇧' },
    'JPY': { name: 'Japanese Yen', flag: '🇯🇵' },
    'AUD': { name: 'Australian Dollar', flag: '🇦🇺' },
    'CAD': { name: 'Canadian Dollar', flag: '🇨🇦' },
    'CHF': { name: 'Swiss Franc', flag: '🇨🇭' },
    'CNY': { name: 'Chinese Yuan', flag: '🇨🇳' },
    'INR': { name: 'Indian Rupee', flag: '🇮🇳' },
    'KRW': { name: 'South Korean Won', flag: '🇰🇷' },
    'SGD': { name: 'Singapore Dollar', flag: '🇸🇬' },
    'HKD': { name: 'Hong Kong Dollar', flag: '🇭🇰' },
    'NZD': { name: 'New Zealand Dollar', flag: '🇳🇿' },
    'MXN': { name: 'Mexican Peso', flag: '🇲🇽' },
    'BRL': { name: 'Brazilian Real', flag: '🇧🇷' },
    'ZAR': { name: 'South African Rand', flag: '🇿🇦' },
    'RUB': { name: 'Russian Ruble', flag: '🇷🇺' },
    'TRY': { name: 'Turkish Lira', flag: '🇹🇷' },
    'SEK': { name: 'Swedish Krona', flag: '🇸🇪' },
    'NOK': { name: 'Norwegian Krone', flag: '🇳🇴' }
  };
  
  const popularPairs = [
    ['USD', 'EUR'],
    ['GBP', 'USD'],
    ['USD', 'JPY'],
    ['EUR', 'GBP'],
    ['AUD', 'USD'],
    ['USD', 'CAD']
  ];
  
  // =======================
  // Theme Manager
  // =======================
  class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.themeIcon = document.getElementById('theme-icon');
      this.init();
    }
  
    init() {
      const savedTheme = localStorage.getItem('theme') || 'light';
      this.setTheme(savedTheme);
  
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
    }
  
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
  
      if (this.themeIcon) {
        this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
  
      this.themeToggle.classList.add('rotate');
      setTimeout(() => this.themeToggle.classList.remove('rotate'), 400);
    }
  }
  
  // =======================
  // DOM Elements
  // =======================
  const themeManager = new ThemeManager();
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const amountInput = document.getElementById('amount');
  const resultSection = document.getElementById('result-section');
  const resultDisplay = document.getElementById('result-display');
  const exchangeRateSpan = document.getElementById('exchange-rate');
  const lastUpdatedSpan = document.getElementById('last-updated');
  const swapBtn = document.getElementById('swap-currencies');
  const converterForm = document.getElementById('converter-form');
  const quickButtons = document.querySelectorAll('.amount-btn');
  const popularRatesContainer = document.getElementById('popular-rates');
  const gainerList = document.getElementById('top-gainers');
  const loserList = document.getElementById('top-losers');
  const logoutBtn = document.querySelector('.logout-btn');
  
  // =======================
  // Notification System
  // =======================
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
  
    setTimeout(() => notification.remove(), 4000);
  }
  
  // =======================
  // Converter Functions
  // =======================
  function populateSelects() {
    Object.keys(currencies).forEach(code => {
      const { name, flag } = currencies[code];
      const option1 = new Option(`${flag} ${code} - ${name}`, code);
      const option2 = new Option(`${flag} ${code} - ${name}`, code);
      fromSelect.add(option1);
      toSelect.add(option2);
    });
  
    fromSelect.value = 'USD';
    toSelect.value = 'INR';
    updateFlags();
  }
  
  function updateFlags() {
    document.getElementById('from-flag').textContent = currencies[fromSelect.value].flag;
    document.getElementById('to-flag').textContent = currencies[toSelect.value].flag;
  }
  
  function swapCurrencies() {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    updateFlags();
    if (amountInput.value) convertCurrency();
  }
  
  async function convertCurrency() {
    const from = fromSelect.value;
    const to = toSelect.value;
    const amount = parseFloat(amountInput.value);
  
    if (!amount || amount <= 0) {
      showNotification('Enter a valid amount', 'error');
      return;
    }
  
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await response.json();
      const rate = data.rates[to];
      const converted = (amount * rate).toFixed(2);
  
      resultDisplay.textContent = `${amount} ${from} = ${converted} ${to}`;
      exchangeRateSpan.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
      lastUpdatedSpan.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      resultSection.style.display = 'block';
  
      saveConversionToHistory(from, to, amount, converted, rate);
    } catch (err) {
      showNotification('Error fetching rates', 'error');
    }
  }
  
  function saveConversionToHistory(from, to, amount, result, rate) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    history.unshift({ from, to, amount, result, rate, date: new Date().toISOString() });
    localStorage.setItem('conversionHistory', JSON.stringify(history));
  }
  
  // =======================
  // Rates + Gainers/Losers
  // =======================
  let previousRates = {};
  
  async function loadPopularRates() {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
  
      // Popular Pairs
      popularRatesContainer.innerHTML = '';
      popularPairs.forEach(([from, to]) => {
        const rate = from === 'USD' ? data.rates[to] : data.rates[to] / data.rates[from];
        const div = document.createElement('div');
        div.className = 'popular-rate';
        div.innerHTML = `${currencies[from].flag} ${from}/${to} ${currencies[to].flag} → ${rate.toFixed(4)}`;
        popularRatesContainer.appendChild(div);
      });
  
      // Top Gainers & Losers
      if (previousRates && Object.keys(previousRates).length) {
        const changes = Object.keys(data.rates).map(code => {
          if (!previousRates[code]) return null;
          const change = ((data.rates[code] - previousRates[code]) / previousRates[code]) * 100;
          return { code, change };
        }).filter(Boolean);
  
        changes.sort((a, b) => b.change - a.change);
        gainerList.innerHTML = changes.slice(0, 5).map(c => `<div>${c.code}: +${c.change.toFixed(2)}%</div>`).join('');
        loserList.innerHTML = changes.slice(-5).map(c => `<div>${c.code}: ${c.change.toFixed(2)}%</div>`).join('');
      }
  
      previousRates = data.rates;
    } catch (err) {
      console.error(err);
    }
  }
  
  // =======================
  // Event Listeners
  // =======================
  fromSelect.addEventListener('change', updateFlags);
  toSelect.addEventListener('change', updateFlags);
  swapBtn.addEventListener('click', swapCurrencies);
  converterForm.addEventListener('submit', e => {
    e.preventDefault();
    convertCurrency();
  });
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountInput.value = btn.dataset.amount;
      convertCurrency();
    });
  });
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  });
  
  // =======================
  // Initialization
  // =======================
  document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    loadPopularRates();
    setInterval(loadPopularRates, 60000);
  });
  
