// =======================
// Currency Data (moved up so it's available everywhere)
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
  // Currency Alerts Manager
  // =======================
  class CurrencyAlertsManager {
    constructor() {
      this.alerts = JSON.parse(localStorage.getItem('currencyAlerts') || '[]');
      this.alertsModal = document.getElementById('alerts-modal');
      this.alertsBtn = document.getElementById('alerts-btn');
      this.closeModalBtn = document.getElementById('close-alerts-modal');
      this.alertForm = document.getElementById('alert-form');
      this.alertsList = document.getElementById('alerts-list');
      this.init();
    }
  
    init() {
      if (this.alertsBtn) this.alertsBtn.addEventListener('click', () => this.openModal());
      if (this.closeModalBtn) this.closeModalBtn.addEventListener('click', () => this.closeModal());
      if (this.alertsModal) {
        this.alertsModal.addEventListener('click', e => {
          if (e.target === this.alertsModal) this.closeModal();
        });
      }
      if (this.alertForm) {
        this.alertForm.addEventListener('submit', e => this.handleCreateAlert(e));
      }
  
      this.populateAlertCurrencies();
      this.renderAlerts();
    }
  
    populateAlertCurrencies() {
      const fromSelect = document.getElementById('alert-from-currency');
      const toSelect = document.getElementById('alert-to-currency');
      if (!fromSelect || !toSelect) return;
  
      // clear old options before repopulating
      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';
  
      Object.keys(currencies).forEach(code => {
        const { name, flag } = currencies[code];
        fromSelect.add(new Option(`${flag} ${code} - ${name}`, code));
        toSelect.add(new Option(`${flag} ${code} - ${name}`, code));
      });
  
      fromSelect.value = 'USD';
      toSelect.value = 'INR';
    }
  
    openModal() {
      if (this.alertsModal) {
        this.alertsModal.style.display = 'flex';
        this.renderAlerts();
      }
    }
  
    closeModal() {
      if (this.alertsModal) this.alertsModal.style.display = 'none';
    }
  
    async handleCreateAlert(e) {
      e.preventDefault();
      const fromCurrency = document.getElementById('alert-from-currency').value;
      const toCurrency = document.getElementById('alert-to-currency').value;
      const targetRate = parseFloat(document.getElementById('alert-target-rate').value);
      const email = document.getElementById('alert-email').value.trim();
  
      if (!fromCurrency || !toCurrency || !targetRate || !email) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      if (fromCurrency === toCurrency) {
        showNotification('Please select different currencies', 'error');
        return;
      }
  
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await res.json();
        const currentRate = data.rates[toCurrency];
  
        const alert = {
          id: Date.now().toString(),
          fromCurrency,
          toCurrency,
          targetRate,
          email,
          currentRate,
          createdAt: new Date().toISOString(),
          isActive: true
        };
  
        this.alerts.push(alert);
        this.saveAlerts();
        this.renderAlerts();
        this.alertForm.reset();
  
        showNotification(`Alert created! You'll be notified when 1 ${fromCurrency} = ${targetRate} ${toCurrency}`, 'success');
      } catch {
        showNotification('Error creating alert. Please try again.', 'error');
      }
    }
  
    deleteAlert(id) {
      this.alerts = this.alerts.filter(a => a.id !== id);
      this.saveAlerts();
      this.renderAlerts();
      showNotification('Alert deleted successfully', 'success');
    }
  
    renderAlerts() {
      if (!this.alertsList) return;
      if (this.alerts.length === 0) {
        this.alertsList.innerHTML = `
          <div class="empty-alerts">
            <i class="fas fa-bell-slash" style="font-size:48px;opacity:0.5;margin-bottom:16px;"></i>
            <p>No active alerts yet</p>
            <p>Create your first currency alert above</p>
          </div>`;
        return;
      }
  
      this.alertsList.innerHTML = this.alerts
        .map(
          a => `
          <div class="alert-item">
            <div class="alert-info">
              <div class="alert-pair">
                ${currencies[a.fromCurrency].flag} ${a.fromCurrency}/${a.toCurrency} ${currencies[a.toCurrency].flag}
              </div>
              <div class="alert-details">Target: ${a.targetRate} | Email: ${a.email}</div>
              <div class="alert-details">Created: ${new Date(a.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="alert-actions">
              <button class="alert-delete" onclick="alertsManager.deleteAlert('${a.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>`
        )
        .join('');
    }
  
    saveAlerts() {
      localStorage.setItem('currencyAlerts', JSON.stringify(this.alerts));
    }
  }
  
  // =======================
  // Conversion History Manager
  // =======================
  class ConversionHistoryManager {
    constructor() {
      this.history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
      this.init();
    }
  
    init() {
      this.displayHistory();
      this.updateStats();
      this.setupFilters();
      this.setupActions();
    }
  
    addConversion(from, to, amount, result, rate) {
      this.history.unshift({
        id: Date.now().toString(),
        from,
        to,
        amount,
        result,
        rate,
        timestamp: new Date().toISOString()
      });
      this.saveHistory();
      this.displayHistory();
      this.updateStats();
    }
  
    saveHistory() {
      localStorage.setItem('conversionHistory', JSON.stringify(this.history));
    }
  
    clearHistory() {
      this.history = [];
      this.saveHistory();
      this.displayHistory();
      this.updateStats();
      showNotification('Conversion history cleared', 'success');
    }
  
    exportHistory() {
      if (this.history.length === 0) {
        showNotification('No history to export', 'error');
        return;
      }
      const csvContent = [
        'Date,Time,From Currency,To Currency,Amount,Result,Rate',
        ...this.history.map(h => {
          const d = new Date(h.timestamp);
          return `${d.toLocaleDateString()},${d.toLocaleTimeString()},${h.from},${h.to},${h.amount},${h.result},${h.rate}`;
        })
      ].join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversion-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('History exported successfully', 'success');
    }
  
    displayHistory() {
      const list = document.getElementById('history-list');
      if (!list) return;
  
      if (this.history.length === 0) {
        list.innerHTML = `
          <div class="empty-history">
            <i class="fas fa-history" style="font-size:64px;opacity:0.3;margin-bottom:24px;"></i>
            <h3>No conversion history yet</h3>
            <p>Start converting currencies to see your history here</p>
            <a href="converter.html" class="btn primary" style="margin-top:20px;text-decoration:none;">
              <i class="fas fa-exchange-alt"></i> Start Converting
            </a>
          </div>`;
        return;
      }
  
      list.innerHTML = this.history
        .map(h => {
          const d = new Date(h.timestamp);
          return `
            <div class="history-item" data-currency="${h.from}-${h.to}" data-date="${d.toISOString()}">
              <div class="history-conversion">
                <div class="conversion-currencies">
                  <span>${currencies[h.from].flag} ${h.amount} ${h.from}</span>
                  <i class="fas fa-arrow-right"></i>
                  <span>${currencies[h.to].flag} ${h.result} ${h.to}</span>
                </div>
                <div class="conversion-rate">1 ${h.from} = ${h.rate} ${h.to}</div>
              </div>
              <div class="history-meta">
                <span><i class="fas fa-clock"></i> ${this.getTimeAgo(d)}</span>
                <span>${d.toLocaleDateString()}</span>
              </div>
            </div>`;
        })
        .join('');
    }
  
    updateStats() {
      const totalEl = document.getElementById('total-conversions');
      const usedEl = document.getElementById('currencies-used');
      const todayEl = document.getElementById('today-conversions');
      if (!totalEl || !usedEl || !todayEl) return;
  
      const today = new Date().toDateString();
      const total = this.history.length;
      const used = new Set([...this.history.map(h => h.from), ...this.history.map(h => h.to)]).size;
      const todayCount = this.history.filter(h => new Date(h.timestamp).toDateString() === today).length;
  
      totalEl.textContent = total;
      usedEl.textContent = used;
      todayEl.textContent = todayCount;
    }
  
    setupFilters() {
      const currencyFilter = document.getElementById('currency-filter');
      const dateFilter = document.getElementById('date-filter');
      if (!currencyFilter || !dateFilter) return;
  
      currencyFilter.innerHTML = '<option value="">All</option>';
      const usedCurrencies = new Set([...this.history.map(h => h.from), ...this.history.map(h => h.to)]);
      usedCurrencies.forEach(c => {
        if (currencies[c]) {
          const opt = new Option(`${currencies[c].flag} ${c}`, c);
          currencyFilter.add(opt);
        }
      });
  
      const applyFilters = () => {
        const cur = currencyFilter.value;
        const range = dateFilter.value;
        document.querySelectorAll('.history-item').forEach(item => {
          let show = true;
          if (cur && !item.dataset.currency.includes(cur)) show = false;
          if (range) {
            const d = new Date(item.dataset.date);
            const now = new Date();
            if (range === 'today') show = show && d.toDateString() === now.toDateString();
            if (range === 'week') show = show && d >= new Date(now - 7 * 864e5);
            if (range === 'month') show = show && d >= new Date(now - 30 * 864e5);
          }
          item.style.display = show ? 'flex' : 'none';
        });
      };
  
      currencyFilter.addEventListener('change', applyFilters);
      dateFilter.addEventListener('change', applyFilters);
    }
  
    setupActions() {
      const clearBtn = document.getElementById('clear-history-btn');
      const exportBtn = document.getElementById('export-history-btn');
      if (clearBtn) clearBtn.addEventListener('click', () => confirm('Clear all history?') && this.clearHistory());
      if (exportBtn) exportBtn.addEventListener('click', () => this.exportHistory());
    }
  
    getTimeAgo(d) {
      const diff = Date.now() - d;
      const min = Math.floor(diff / 60000);
      const hr = Math.floor(diff / 3600000);
      const day = Math.floor(diff / 86400000);
      if (min < 1) return 'Just now';
      if (min < 60) return `${min}m ago`;
      if (hr < 24) return `${hr}h ago`;
      return `${day}d ago`;
    }
  }
  
  // =======================
  // Notification System
  // =======================
  function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 4000);
  }
  
  // =======================
  // Logout
  // =======================
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showNotification('Logging out...', 'info');
      setTimeout(() => (window.location.href = 'login.html'), 800);
    });
  }
  
  // =======================
  // Initialize Managers
  // =======================
  const themeManager = new ThemeManager();
  const alertsManager = new CurrencyAlertsManager();
  const historyManager = new ConversionHistoryManager();
  
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s';
      document.body.style.opacity = '1';
    }, 100);
  });
  
