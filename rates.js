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
    'NOK': { name: 'Norwegian Krone', flag: '🇳🇴' },
    'PLN': { name: 'Polish Zloty', flag: '🇵🇱' },
    'DKK': { name: 'Danish Krone', flag: '🇩🇰' },
    'CZK': { name: 'Czech Koruna', flag: '🇨🇿' },
    'HUF': { name: 'Hungarian Forint', flag: '🇭🇺' },
    'ILS': { name: 'Israeli Shekel', flag: '🇮🇱' },
    'THB': { name: 'Thai Baht', flag: '🇹🇭' },
    'PHP': { name: 'Philippine Peso', flag: '🇵🇭' },
    'MYR': { name: 'Malaysian Ringgit', flag: '🇲🇾' },
    'IDR': { name: 'Indonesian Rupiah', flag: '🇮🇩' },
    'VND': { name: 'Vietnamese Dong', flag: '🇻🇳' }
  };
  
  // =======================
  // Theme Management
  // =======================
  class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.themeIcon = document.getElementById('theme-icon');
      this.init();
    }
  
    init() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
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
  
      if (this.themeToggle) {
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => (this.themeToggle.style.transform = 'rotate(0deg)'), 300);
      }
    }
  }
  
  // =======================
  // Notifications
  // =======================
  function showNotification(message, type = 'info') {
    const colors = {
      error: 'var(--error-color)',
      success: 'var(--success-color)',
      info: 'var(--primary-color)'
    };
  
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 80px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
          <span>${message}</span>
        </div>
      </div>
    `;
  
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // =======================
  // Rates Functionality
  // =======================
  let currentRates = {};
  let previousRates = JSON.parse(localStorage.getItem('previousRates') || '{}');
  let previousRatesTimestamp = localStorage.getItem('previousRatesTimestamp') || null;
  
  async function loadAllRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
  
      currentRates = data.rates;
      currentRates.USD = 1;
  
      displayRates();
      displayGainersLosers();
  
      // Save for next comparison
      localStorage.setItem('previousRates', JSON.stringify(currentRates));
      localStorage.setItem('previousRatesTimestamp', Date.now());
  
    } catch (error) {
      console.error('Error loading rates:', error);
      showNotification('Error loading exchange rates. Please try again later.', 'error');
    }
  }
  
  function displayRates() {
    const allRatesList = document.getElementById('all-rates-list');
    if (!allRatesList) return;
  
    const sortedCurrencies = Object.keys(currencies).sort();
  
    allRatesList.innerHTML = sortedCurrencies.map(code => {
      const rate = currentRates[code];
      const previousRate = previousRates[code];
      const change = previousRate ? ((rate - previousRate) / previousRate * 100) : 0;
      const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  
      return `
        <div class="rate-row" data-currency="${code}">
          <div class="rate-currency">
            <span class="currency-flag">${currencies[code]?.flag || ''}</span>
            <div class="currency-info">
              <span class="currency-code">${code}</span>
              <span class="currency-name">${currencies[code]?.name || ''}</span>
            </div>
          </div>
          <div class="rate-value">
            <span class="current-rate">${rate ? rate.toFixed(6) : 'N/A'}</span>
            <span class="rate-change ${changeClass}">
              <i class="fas fa-${change > 0 ? 'arrow-up' : change < 0 ? 'arrow-down' : 'minus'}"></i>
              ${Math.abs(change).toFixed(2)}%
            </span>
          </div>
        </div>
      `;
    }).join('');
  }
  
  function displayGainersLosers() {
    const gainersList = document.getElementById('gainers-list');
    const losersList = document.getElementById('losers-list');
  
    if (!gainersList || !losersList) return;
  
    const changes = Object.keys(currencies).map(code => {
      const rate = currentRates[code];
      const previousRate = previousRates[code];
      const change = previousRate ? ((rate - previousRate) / previousRate * 100) : 0;
      return { code, rate, change };
    }).filter(item => item.change !== 0);
  
    const gainers = changes.filter(i => i.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
    const losers = changes.filter(i => i.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);
  
    gainersList.innerHTML = gainers.length
      ? gainers.map(item => `
        <div class="rate-row gainer">
          <div class="rate-currency">
            <span class="currency-flag">${currencies[item.code]?.flag || ''}</span>
            <div class="currency-info">
              <span class="currency-code">${item.code}</span>
              <span class="currency-name">${currencies[item.code]?.name || ''}</span>
            </div>
          </div>
          <div class="rate-value">
            <span class="current-rate">${item.rate.toFixed(6)}</span>
            <span class="rate-change positive">
              <i class="fas fa-arrow-up"></i>
              +${item.change.toFixed(2)}%
            </span>
          </div>
        </div>
      `).join('')
      : '<div class="no-data">No significant gainers</div>';
  
    losersList.innerHTML = losers.length
      ? losers.map(item => `
        <div class="rate-row loser">
          <div class="rate-currency">
            <span class="currency-flag">${currencies[item.code]?.flag || ''}</span>
            <div class="currency-info">
              <span class="currency-code">${item.code}</span>
              <span class="currency-name">${currencies[item.code]?.name || ''}</span>
            </div>
          </div>
          <div class="rate-value">
            <span class="current-rate">${item.rate.toFixed(6)}</span>
            <span class="rate-change negative">
              <i class="fas fa-arrow-down"></i>
              ${item.change.toFixed(2)}%
            </span>
          </div>
        </div>
      `).join('')
      : '<div class="no-data">No significant losers</div>';
  }
  
  // =======================
  // Search Functionality
  // =======================
  function setupSearch() {
    const searchInput = document.getElementById('currency-search');
    if (!searchInput) return;
  
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rateRows = document.querySelectorAll('#all-rates-list .rate-row');
  
      rateRows.forEach(row => {
        const code = row.dataset.currency.toLowerCase();
        const name = currencies[row.dataset.currency]?.name.toLowerCase() || '';
        row.style.display = (code.includes(searchTerm) || name.includes(searchTerm)) ? 'flex' : 'none';
      });
    });
  }
  
  // =======================
  // Logout Functionality
  // =======================
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showNotification('Logging out...', 'info');
      setTimeout(() => (window.location.href = 'index.html'), 1000);
    });
  }
  
  // =======================
  // Initialize
  // =======================
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in';
      document.body.style.opacity = '1';
    }, 100);
  
    loadAllRates();
    setupSearch();
    setInterval(loadAllRates, 30000);
  
    showNotification('Exchange rates loaded successfully!', 'success');
  });
  
