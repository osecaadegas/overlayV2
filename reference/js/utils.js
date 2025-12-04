// ==================== UTILITIES MODULE ====================

// Simple debounce function to prevent rapid function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format currency values
function formatCurrency(amount, currency = '€') {
  if (typeof amount !== 'number') return `${currency}0.00`;
  return `${currency}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Format multiplier values
function formatMultiplier(multiplier) {
  if (typeof multiplier !== 'number') return '0.00x';
  return `${multiplier.toFixed(2)}x`;
}

// Get slot image with fallback
function getSlotImage(slotName, fallback = 'https://i.imgur.com/8E3ucNx.png') {
  if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
    const slot = window.slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
    return slot && slot.image ? slot.image : fallback;
  }
  return fallback;
}

// Generate unique ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Make panel draggable and resizable
function makePanelInteractive(panel) {
  if (!panel || panel.dataset.interactive) return;
  panel.dataset.interactive = 'true';

  // Add drag handle to panel title
  const title = panel.querySelector('.middle-panel-title, .tournament-control-header, .customization-header');
  if (title) {
    title.classList.add('draggable-title');
    
    let isDragging = false;
    let offsetX, offsetY;

    title.addEventListener('mousedown', (e) => {
      if (window.isLayoutLocked) return;
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panel.style.position = 'fixed';
      panel.style.zIndex = '1000';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging && !window.isLayoutLocked) {
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.classList.add('panel-dragging');
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Add resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  panel.classList.add('panel-fixed');
  panel.appendChild(resizeHandle);

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizeHandle.addEventListener('mousedown', (e) => {
    if (window.isLayoutLocked) return;
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = panel.offsetWidth;
    startHeight = panel.offsetHeight;
  });

  document.addEventListener('mousemove', (e) => {
    if (isResizing && !window.isLayoutLocked) {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      panel.style.width = Math.max(300, newWidth) + 'px';
      panel.style.height = Math.max(200, newHeight) + 'px';
      panel.style.maxWidth = 'none';
      panel.style.maxHeight = 'none';
    }
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
  });
}

// Local storage helpers
const StorageHelper = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Animation helpers
const AnimationHelper = {
  fadeIn(element, duration = 300) {
    element.style.display = 'block';
    element.classList.remove('fade-out', 'fade-out-slow');
    
    if (duration > 400) {
      element.classList.add('fade-in-slow');
    } else {
      element.classList.add('fade-in');
    }
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      element.classList.remove('fade-in', 'fade-in-slow');
    }, duration);
  },

  fadeOut(element, duration = 300) {
    element.classList.remove('fade-in', 'fade-in-slow');
    
    if (duration > 400) {
      element.classList.add('fade-out-slow');
    } else {
      element.classList.add('fade-out');
    }
    
    // Hide the element after animation completes
    setTimeout(() => {
      element.style.display = 'none';
      element.classList.remove('fade-out', 'fade-out-slow');
    }, duration);
  },

  slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newHeight = Math.max(height - (height * progress / duration), 0);
      
      element.style.height = newHeight + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    
    requestAnimationFrame(animate);
  },

  slideDown(element, duration = 300) {
    element.style.display = 'block';
    const height = element.scrollHeight;
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newHeight = Math.min(height * progress / duration, height);
      
      element.style.height = newHeight + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    
    requestAnimationFrame(animate);
  }
};

// Event emitter for inter-module communication
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

// Global event emitter instance
window.eventEmitter = new EventEmitter();

// Notification system
const NotificationManager = {
  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add to container or create one
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, duration);
    }

    return notification;
  },

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
};

// Modal system
const ModalManager = {
  show(content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">${options.title || 'Modal'}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-content">
          ${content}
        </div>
        ${options.showFooter ? `
          <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button class="modal-btn modal-btn-primary" onclick="this.closest('.modal-overlay').remove()">OK</button>
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(modal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    return modal;
  },

  confirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
      const modal = this.show(`<p>${message}</p>`, {
        title,
        showFooter: false
      });

      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="modal-btn modal-btn-primary confirm-btn">Confirm</button>
      `;

      modal.querySelector('.modal-container').appendChild(footer);

      footer.querySelector('.confirm-btn').addEventListener('click', () => {
        modal.remove();
        resolve(true);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-btn-secondary')) {
          modal.remove();
          resolve(false);
        }
      });
    });
  }
};

// Validation helpers
const Validator = {
  isEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  isPositiveNumber(value) {
    return this.isNumber(value) && parseFloat(value) > 0;
  },

  isInRange(value, min, max) {
    const num = parseFloat(value);
    return this.isNumber(value) && num >= min && num <= max;
  },

  minLength(value, length) {
    return value && value.length >= length;
  },

  maxLength(value, length) {
    return value && value.length <= length;
  }
};

// Customization Manager
const CustomizationManager = {
  init() {
    this.loadSavedSettings();
    this.setupEventListeners();
    
    // Restore saved theme on page load
    setTimeout(() => {
      this.restoreSavedTheme();
    }, 500);
  },

  setupEventListeners() {
    // All color pickers
    const allColorInputs = [
      'primary-color', 'accent-color', 'background-color', 'text-color', 'card-background-color',
      'streamer-name-color', 'website-color', 'gamble-aware-color',
      'slot-title-color', 'slot-bet-color', 'slot-win-color', 
      'bonus-header-color', 'money-display-color',
      'slot-gradient-start', 'slot-gradient-end',
      'button-gradient-start', 'button-gradient-end',
      'sidebar-gradient-start', 'sidebar-gradient-end'
    ];

      allColorInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          this.applyAllColors();
          // Also refresh tournament bracket styling if it exists
          if (window.refreshTournamentBracketStyling) {
            setTimeout(window.refreshTournamentBracketStyling, 50);
          }
        });
      }
    });    // Gradient direction
    const gradientDirection = document.getElementById('gradient-direction');
    if (gradientDirection) {
      gradientDirection.addEventListener('change', () => this.applyAllColors());
    }

    // Effect toggles
    const effectToggles = [
      'glass-effect-toggle',
      'animated-gradients-toggle',
      'glow-effects-toggle',
      'sidebar-backgrounds-toggle',
      'hide-chat-toggle'
    ];

    effectToggles.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.addEventListener('change', () => this.applyEffects());
      }
    });

    // Streamer name
    const streamerNameInput = document.getElementById('custom-streamer-name');
    if (streamerNameInput) {
      streamerNameInput.addEventListener('input', () => {
        const streamerName = document.getElementById('streamer-name');
        if (streamerName) {
          streamerName.textContent = streamerNameInput.value || 'Streamer Name';
        }
        this.saveSettings();
      });
    }

    // Website URL
    const websiteUrlInput = document.getElementById('custom-website-url');
    if (websiteUrlInput) {
      websiteUrlInput.addEventListener('input', () => {
        const websiteLink = document.getElementById('website-link');
        if (websiteLink) {
          websiteLink.textContent = websiteUrlInput.value || 'www.yourwebsite.com';
          websiteLink.href = websiteUrlInput.value || '#';
        }
        this.saveSettings();
      });
    }

    // Logo upload
    const logoBtn = document.getElementById('custom-logo-btn');
    const logoFile = document.getElementById('custom-logo-file');
    const resetLogoBtn = document.getElementById('reset-logo-btn');
    
    if (logoBtn && logoFile) {
      logoBtn.addEventListener('click', () => logoFile.click());
      logoFile.addEventListener('change', (e) => this.handleLogoUpload(e));
    }
    
    if (resetLogoBtn) {
      resetLogoBtn.addEventListener('click', () => this.resetLogo());
    }

    // Sidebar position
    const sidebarPosition = document.getElementById('sidebar-position');
    if (sidebarPosition) {
      sidebarPosition.addEventListener('change', () => this.applySidebarPosition());
    }

    // Tournament bracket layout
    const tournamentLayout = document.getElementById('tournament-bracket-layout');
    if (tournamentLayout) {
      tournamentLayout.addEventListener('change', () => this.applyTournamentLayout());
    }

    // Info panel position
    const infoPanelPosition = document.getElementById('info-panel-position');
    if (infoPanelPosition) {
      infoPanelPosition.addEventListener('change', () => this.applyInfoPanelPosition());
    }

    const tournamentBracketPosition = document.getElementById('tournament-bracket-position');
    if (tournamentBracketPosition) {
      tournamentBracketPosition.addEventListener('change', () => this.applyTournamentBracketPosition());
    }

    const dragResizeToggle = document.getElementById('enable-drag-resize');
    if (dragResizeToggle) {
      dragResizeToggle.addEventListener('change', (e) => this.applyDragResize(e.target.checked));
    }

    // Background settings
    const bgType = document.getElementById('background-type');
    if (bgType) {
      bgType.addEventListener('change', () => this.handleBackgroundType());
    }

    const bgBtn = document.getElementById('custom-bg-btn');
    const bgFile = document.getElementById('custom-bg-file');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    
    if (bgBtn && bgFile) {
      bgBtn.addEventListener('click', () => bgFile.click());
      bgFile.addEventListener('change', (e) => this.handleBackgroundUpload(e));
    }
    
    if (resetBgBtn) {
      resetBgBtn.addEventListener('click', () => this.resetBackground());
    }

    // Note: ad-image-input is now handled by script-new.js for draggable media
    // Background upload is only through the customization panel button

    // Theme presets - handled by ThemeManager
    // Theme event listeners are initialized by ThemeManager.init()

    // Background pattern selector
    const applyPatternBtn = document.getElementById('apply-background-pattern');
    if (applyPatternBtn) {
      applyPatternBtn.addEventListener('click', () => this.applyBackgroundPattern());
    }

    // Apply and Reset buttons
    const applyBtn = document.getElementById('apply-customization');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applyAllColors();
        this.applyEffects();
      });
    }

    const resetAllBtn = document.getElementById('reset-all-btn');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => this.resetAll());
    }
  },

  applyAllColors() {
    // Basic colors
    const primaryColor = document.getElementById('primary-color')?.value || '#9346ff';
    const accentColor = document.getElementById('accent-color')?.value || '#00e1ff';
    const backgroundColor = document.getElementById('background-color')?.value || '#1a1b2e';
    const textColor = document.getElementById('text-color')?.value || '#ffffff';

    // Gradients
    const slotStart = document.getElementById('slot-gradient-start')?.value || '#9346ff';
    const slotEnd = document.getElementById('slot-gradient-end')?.value || '#00e1ff';
    const buttonStart = document.getElementById('button-gradient-start')?.value || '#9346ff';
    const buttonEnd = document.getElementById('button-gradient-end')?.value || '#7c3aed';
    const sidebarStart = document.getElementById('sidebar-gradient-start')?.value || '#1a1b2e';
    const sidebarEnd = document.getElementById('sidebar-gradient-end')?.value || '#16213e';
    const direction = document.getElementById('gradient-direction')?.value || '135deg';

    // Apply to CSS variables
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--slot-gradient-start', slotStart);
    document.documentElement.style.setProperty('--slot-gradient-end', slotEnd);
    document.documentElement.style.setProperty('--button-gradient-start', buttonStart);
    document.documentElement.style.setProperty('--button-gradient-end', buttonEnd);
    document.documentElement.style.setProperty('--sidebar-gradient-start', sidebarStart);
    document.documentElement.style.setProperty('--sidebar-gradient-end', sidebarEnd);
    document.documentElement.style.setProperty('--gradient-direction', direction);

    // Apply colors directly to ALL elements across the entire overlay
    
    // 1. SIDEBAR - Buttons and background
    const sidebarBtns = document.querySelectorAll('.sidebar-btn, .middle-btn, .sidebar-main-btn');
    sidebarBtns.forEach(btn => {
      btn.style.background = `linear-gradient(${direction}, ${buttonStart}, ${buttonEnd})`;
      btn.style.borderColor = accentColor;
    });

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.background = `linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd})`;
      sidebar.style.boxShadow = `0 8px 32px 0 ${accentColor}33, 0 1.5px 0 0 ${accentColor} inset`;
    }

    // 2. ALL PANELS - Info panel, Middle panels, Tournament panels
    const allPanels = document.querySelectorAll('.info-panel, .middle-panel, #random-slot-panel, #tournament-panel, #tournament-control-panel, #bonus-opening-panel');
    allPanels.forEach(panel => {
      panel.style.background = `linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd})`;
      panel.style.boxShadow = `0 8px 32px 0 ${accentColor}33, 0 1.5px 0 0 ${accentColor} inset`;
      panel.style.borderColor = accentColor;
    });

    // 3. TITLES AND HEADERS - All cyan/accent colored text
    const accentElements = document.querySelectorAll('.middle-panel-title, .panel-subtitle, h4, .bracket-title-row h4, .bonus-list-header h4, .tournament-bracket-header h4, .info-section h4, .bh-stat-value');
    accentElements.forEach(el => {
      el.style.color = accentColor;
      el.style.textShadow = `0 1px 8px ${accentColor}80`;
    });

    // 4. BUTTONS - Action buttons across the overlay
    const actionButtons = document.querySelectorAll('.middle-btn, .tournament-action-btn, .bracket-control-btn, button[type="button"], .custom-apply-btn');
    actionButtons.forEach(btn => {
      btn.style.background = `linear-gradient(${direction}, ${buttonStart}, ${buttonEnd})`;
      btn.style.borderColor = primaryColor;
    });

    // 5. INPUTS AND SELECTS
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="url"], select, textarea, .middle-input');
    inputs.forEach(input => {
      input.style.borderColor = accentColor;
      input.classList.add('input-bg-overlay');
      input.style.color = textColor;
    });

    // 6. STATS BAR
    const statsBar = document.querySelector('.bh-stats-bar');
    if (statsBar) {
      statsBar.style.background = `linear-gradient(${direction}, ${sidebarStart}99, ${sidebarEnd}99)`;
      statsBar.style.borderColor = accentColor;
    }

    const statItems = document.querySelectorAll('.bh-stat-item');
    statItems.forEach(item => {
      item.style.background = `${sidebarStart}cc`;
      item.style.borderColor = `${accentColor}33`;
    });

    // 7. BONUS CARDS
    const bonusCards = document.querySelectorAll('.bonus-card, .bonus-content');
    bonusCards.forEach(card => {
      card.style.background = `linear-gradient(${direction}, ${slotStart}22, ${slotEnd}22)`;
      card.style.borderColor = `${accentColor}44`;
    });

    // 8. TOURNAMENT MATCHES
    const matches = document.querySelectorAll('.bracket-match-horizontal, .match-participant, .bracket-match, .bracket-participant');
    matches.forEach(match => {
      match.style.borderColor = `${accentColor}66`;
      const cardBgRgb = this.hexToRgb(cardBgColor);
      match.style.background = `rgba(${cardBgRgb.r}, ${cardBgRgb.g}, ${cardBgRgb.b}, 0.8)`;
    });

    // 9. NAVBAR
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.background = `linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd})`;
      navbar.style.borderBottomColor = accentColor;
    }

    // 10. SLOT CARDS (if any are rendered)
    const slotCards = document.querySelectorAll('.slot-card, .participant-card');
    slotCards.forEach(card => {
      card.style.background = `linear-gradient(${direction}, ${slotStart}, ${slotEnd})`;
      card.style.borderColor = primaryColor;
    });

    // 11. SPECIFIC TEXT COLORS
    const streamerNameColor = document.getElementById('streamer-name-color')?.value;
    if (streamerNameColor) {
      const streamerName = document.getElementById('streamer-name');
      if (streamerName) {
        streamerName.style.setProperty('background', 'none', 'important');
        streamerName.style.setProperty('-webkit-background-clip', 'unset', 'important');
        streamerName.style.setProperty('-webkit-text-fill-color', 'unset', 'important');
        streamerName.style.setProperty('background-clip', 'unset', 'important');
        streamerName.style.setProperty('color', streamerNameColor, 'important');
      }
    }

    const websiteColor = document.getElementById('website-color')?.value;
    if (websiteColor) {
      const websiteLink = document.getElementById('website-link');
      if (websiteLink) {
        websiteLink.style.setProperty('background', 'none', 'important');
        websiteLink.style.setProperty('color', websiteColor, 'important');
      }
    }

    const gambleAwareColor = document.getElementById('gamble-aware-color')?.value;
    if (gambleAwareColor) {
      const gambleAware = document.querySelector('.aware-link');
      if (gambleAware) {
        gambleAware.style.setProperty('background', 'none', 'important');
        gambleAware.style.setProperty('-webkit-background-clip', 'unset', 'important');
        gambleAware.style.setProperty('-webkit-text-fill-color', 'unset', 'important');
        gambleAware.style.setProperty('background-clip', 'unset', 'important');
        gambleAware.style.setProperty('text-shadow', 'none', 'important');
        gambleAware.style.setProperty('border', 'none', 'important');
        gambleAware.style.setProperty('color', gambleAwareColor, 'important');
      }
    }

    const slotTitleColor = document.getElementById('slot-title-color')?.value;
    if (slotTitleColor) {
      const titles = document.querySelectorAll('.slot-name, .participant-name, .bonus-name');
      titles.forEach(el => el.style.color = slotTitleColor);
    }

    const slotBetColor = document.getElementById('slot-bet-color')?.value;
    if (slotBetColor) {
      const bets = document.querySelectorAll('.slot-bet, .bonus-bet, .bonus-metrics');
      bets.forEach(el => el.style.color = slotBetColor);
    }

    const slotWinColor = document.getElementById('slot-win-color')?.value;
    if (slotWinColor) {
      const wins = document.querySelectorAll('.slot-multiplier, .profit-positive');
      wins.forEach(el => el.style.color = slotWinColor);
    }

    const bonusHeaderColor = document.getElementById('bonus-header-color')?.value;
    if (bonusHeaderColor) {
      const headers = document.querySelectorAll('.bonus-list-header h4, .panel-subtitle');
      headers.forEach(el => el.style.color = bonusHeaderColor);
    }

    const moneyDisplayColor = document.getElementById('money-display-color')?.value;
    if (moneyDisplayColor) {
      const moneyDisplays = document.querySelectorAll('.bh-stat-value, #total-bet, #total-payout, #total-profit');
      moneyDisplays.forEach(el => el.style.color = moneyDisplayColor);
    }

    // 12. SCROLLBARS (WebKit browsers) + Override ALL hardcoded colors
    const existingStyle = document.getElementById('theme-override-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'theme-override-styles';
    style.innerHTML = `
      /* Scrollbars */
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(${direction}, ${primaryColor}, ${accentColor}) !important;
      }
      ::-webkit-scrollbar-track {
        background: ${backgroundColor}44 !important;
      }
      
      /* Override all hardcoded colors in customization panel */
      .customization-header h2 {
        color: ${accentColor} !important;
      }
      
      .customization-section h3 {
        color: ${primaryColor} !important;
      }
      
      .customization-row label,
      .customization-row input,
      .customization-row select {
        color: ${textColor} !important;
        border-color: ${accentColor} !important;
      }
      
      .tab-btn {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      .tab-btn:hover {
        color: ${textColor} !important;
      }
      
      .tab-btn.active {
        color: ${accentColor} !important;
        border-bottom-color: ${accentColor} !important;
      }
      
      .theme-preset {
        color: ${textColor} !important;
      }
      
      .theme-preset:hover, .theme-preset.active {
        border-color: ${accentColor} !important;
      }
      
      /* Navbar */
      .navbar {
        background: linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd}) !important;
        border-bottom: 2px solid ${accentColor} !important;
      }
      
      /* Streamer Name Plate */
      .streamer-name, .osecaadegas95-name {
        background: linear-gradient(135deg, ${primaryColor}33, ${accentColor}33) !important;
        padding: 6px 16px !important;
        border-radius: 20px !important;
        border: 2px solid ${accentColor} !important;
        color: ${textColor} !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px ${accentColor}44 !important;
        backdrop-filter: blur(10px) !important;
      }
      
      /* Website Button/Link */
      .navbar-website-btn {
        background: linear-gradient(135deg, ${slotStart}, ${slotEnd}) !important;
        padding: 6px 16px !important;
        border-radius: 20px !important;
        border: 2px solid ${primaryColor} !important;
        color: ${textColor} !important;
        text-decoration: none !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px ${primaryColor}44 !important;
        transition: all 0.3s ease !important;
      }
      
      .navbar-website-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px ${primaryColor}66 !important;
        border-color: ${accentColor} !important;
      }
      
      .website-btn-icon {
        color: ${accentColor} !important;
      }
      
      #website-text {
        color: ${textColor} !important;
      }
      
      /* Be Gamble Aware Link */
      .aware-link {
        background: linear-gradient(135deg, ${buttonStart}, ${buttonEnd}) !important;
        padding: 6px 16px !important;
        border-radius: 20px !important;
        border: 2px solid ${accentColor} !important;
        color: ${textColor} !important;
        text-decoration: none !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px ${accentColor}44 !important;
        transition: all 0.3s ease !important;
      }
      
      .aware-link:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px ${accentColor}66 !important;
        background: linear-gradient(135deg, ${buttonEnd}, ${buttonStart}) !important;
      }
      
      /* Override inline styles */
      #streamer-name-input,
      #website-input {
        background: var(--transparency-overlay) !important;
        color: ${textColor} !important;
        border: 1px solid ${accentColor} !important;
      }
      
      /* BH Panel title */
      .middle-panel-title {
        color: ${accentColor} !important;
      }
      
      /* All text colors */
      body, .customization-panel, .customization-content {
        color: ${textColor} !important;
      }
      
      /* Input placeholders */
      ::placeholder {
        color: ${textColor}99 !important;
      }
      
      /* Bonus list */
      .bonus-list-header {
        background: linear-gradient(135deg, ${primaryColor}22, ${accentColor}22) !important;
        border-bottom: 2px solid ${accentColor} !important;
        backdrop-filter: blur(10px) !important;
      }
      
      .bonus-list-header h4 {
        color: ${accentColor} !important;
        text-shadow: 0 2px 8px ${accentColor}66 !important;
      }
      
      .bonus-list {
        background: linear-gradient(${direction}, ${sidebarStart}dd, ${sidebarEnd}dd) !important;
        border: 2px solid ${accentColor}44 !important;
        backdrop-filter: blur(10px) !important;
      }
      
      .bonus-list li {
        background: linear-gradient(135deg, ${slotStart}11, ${slotEnd}11) !important;
        border: 1px solid ${accentColor}33 !important;
        transition: all 0.3s ease !important;
      }
      
      .bonus-list li:hover {
        background: linear-gradient(135deg, ${slotStart}22, ${slotEnd}22) !important;
        border-color: ${accentColor}66 !important;
        transform: translateX(4px) !important;
        box-shadow: 0 4px 12px ${accentColor}44 !important;
      }
      
      .bonus-list li.opened {
        background: linear-gradient(135deg, ${primaryColor}22, ${accentColor}22) !important;
        border-color: ${accentColor} !important;
      }
      
      .bonus-name {
        color: ${textColor} !important;
        font-weight: 600 !important;
      }
      
      .bonus-bet, .bonus-payout {
        color: ${textColor}cc !important;
      }
      
      .bonus-multiplier {
        color: ${accentColor} !important;
        font-weight: 700 !important;
      }
      
      .profit-positive {
        color: #10b981 !important;
      }
      
      .profit-negative {
        color: #ef4444 !important;
      }
      
      /* Tournament elements */
      .tournament-bracket-header h4,
      .bracket-title-row h4 {
        color: ${accentColor} !important;
      }
      
      /* Stats bar labels */
      .bh-stat-label {
        color: ${textColor}cc !important;
      }
    `;
    document.head.appendChild(style);

    this.saveSettings();
  },

  applyEffects() {
    const glassEffect = document.getElementById('glass-effect-toggle')?.checked || false;
    const animatedGradients = document.getElementById('animated-gradients-toggle')?.checked || false;
    const glowEffects = document.getElementById('glow-effects-toggle')?.checked || false;
    const sidebarBg = document.getElementById('sidebar-backgrounds-toggle')?.checked || false;
    const hideChat = document.getElementById('hide-chat-toggle')?.checked || false;

    document.body.classList.toggle('glass-effect', glassEffect);
    document.body.classList.toggle('animated-gradients', animatedGradients);
    document.body.classList.toggle('glow-effects', glowEffects);
    document.body.classList.toggle('custom-theme', !sidebarBg);
    
    // Hide/show chat box (collapse entire chat section in horizontal layout)
    const chatContainer = document.querySelector('.twitch-chat-container');
    const chatSection = document.querySelector('.info-twitch-chat');
    if (chatContainer) chatContainer.style.display = hideChat ? 'none' : 'flex';
    if (chatSection) chatSection.style.display = hideChat ? 'none' : 'block';

    this.saveSettings();
  },

  applySidebarPosition() {
    const position = document.getElementById('sidebar-position')?.value || 'right';
    const infoPanel = document.querySelector('.info-panel');
    
    console.log('applySidebarPosition called. Position:', position);
    console.log('Info panel found:', !!infoPanel);
    
    if (infoPanel) {
      if (position === 'bottom-left') {
        console.log('Applying bottom-left layout');
        infoPanel.classList.add('sidebar-bottom-left');
        infoPanel.classList.remove('sidebar-right');
      } else {
        console.log('Applying right sidebar layout');
        infoPanel.classList.add('sidebar-right');
        infoPanel.classList.remove('sidebar-bottom-left');
      }
      console.log('Current classes:', infoPanel.className);
    }
    
    this.saveSettings();
  },

  applyTournamentLayout() {
    const layout = document.getElementById('tournament-bracket-layout')?.value || 'vertical';
    const tournamentPanel = document.getElementById('tournament-left-panel');
    
    if (tournamentPanel) {
      if (layout === 'horizontal') {
        tournamentPanel.classList.add('horizontal-layout');
      } else {
        tournamentPanel.classList.remove('horizontal-layout');
      }
      
      // Save preference
      localStorage.setItem('tournamentLayoutHorizontal', layout === 'horizontal');
      console.log(`Tournament layout changed to: ${layout}`);
    }
    
    this.saveSettings();
  },

  applyInfoPanelPosition() {
    const position = document.getElementById('info-panel-position')?.value || 'center-right';
    const infoPanel = document.querySelector('.info-panel');
    
    if (infoPanel) {
      // Remove any previously applied position classes
      infoPanel.classList.remove('pos-upper-right', 'pos-lower-right', 'pos-upper-left', 'pos-lower-left', 'pos-center-right');
      
      // Apply new position class
      infoPanel.classList.add(`pos-${position}`);
      
      // Save preference
      localStorage.setItem('infoPanelPosition', position);
      console.log(`Info panel position changed to: ${position}`);
    }
    
    this.saveSettings();
  },

  applyTournamentBracketPosition() {
    const position = document.getElementById('tournament-bracket-position')?.value || 'center-right';
    const tournamentPanel = document.querySelector('.tournament-left-panel');
    
    if (tournamentPanel) {
      // Remove any previously applied position classes
      tournamentPanel.classList.remove('pos-upper-right', 'pos-lower-right', 'pos-upper-left', 'pos-lower-left', 'pos-center-right');
      
      // Apply new position class
      tournamentPanel.classList.add(`pos-${position}`);
      
      // Save preference
      localStorage.setItem('tournamentBracketPosition', position);
      console.log(`Tournament bracket position changed to: ${position}`);
    }
    
    this.saveSettings();
  },

  applyDragResize(enabled) {
    const infoPanel = document.querySelector('.info-panel');
    if (!infoPanel) return;

    // Reset any inline positioning if disabling
    if (!enabled) {
      infoPanel.classList.remove('draggable', 'resizable');
      infoPanel.style.removeProperty('left');
      infoPanel.style.removeProperty('top');
      infoPanel.style.removeProperty('width');
      infoPanel.style.removeProperty('height');
      // remove visual handle if present
      const handle = infoPanel.querySelector('.resize-handle');
      if (handle) handle.remove();
      this.saveSettings();
      return;
    }

    // Enable classes
    infoPanel.classList.add('draggable', 'resizable');

    // Add a small visual resize hint
    if (!infoPanel.querySelector('.resize-handle')) {
      const handle = document.createElement('div');
      handle.className = 'resize-handle';
      infoPanel.appendChild(handle);
    }

    // Basic drag implementation
    let isDragging = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    const onMouseDown = (e) => {
      // Only left button
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = infoPanel.getBoundingClientRect();
      origLeft = rect.left;
      origTop = rect.top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newLeft = origLeft + dx;
      const newTop = origTop + dy;
      const maxLeft = window.innerWidth - infoPanel.offsetWidth - 10;
      const maxTop = window.innerHeight - infoPanel.offsetHeight - 10;
      infoPanel.style.left = clamp(newLeft, 10, maxLeft) + 'px';
      infoPanel.style.top = clamp(newTop, 10, maxTop) + 'px';
      infoPanel.style.position = 'fixed';
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.saveSettings();
    };

    // Bind to panel background to avoid interfering with inner controls
    infoPanel.addEventListener('mousedown', onMouseDown);

    // Persist position and size
    const rect = infoPanel.getBoundingClientRect();
    StorageHelper.set('panelLayout', {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      enabled: true
    });
  },

  handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoImg = document.getElementById('navbar-logo');
        if (logoImg) {
          logoImg.src = event.target.result;
        }
        StorageHelper.set('customLogo', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  },

  resetLogo() {
    const logoImg = document.getElementById('navbar-logo');
    if (logoImg) {
      logoImg.src = 'https://i.imgur.com/bfVjDYT.png';
    }
    StorageHelper.remove('customLogo');
  },

  handleBackgroundType() {
    const bgType = document.getElementById('background-type')?.value;
    const gradientControls = document.getElementById('gradient-controls');
    const imageControls = document.getElementById('image-controls');

    if (gradientControls) gradientControls.style.display = bgType === 'gradient' ? 'flex' : 'none';
    if (imageControls) imageControls.style.display = bgType === 'image' ? 'flex' : 'none';

    this.saveSettings();
  },

  handleBackgroundUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageSrc = event.target.result;
        
        // Apply background to body
        document.body.classList.add('custom-background');
        document.body.style.setProperty('background', '', 'important');
        document.body.style.setProperty('background-color', '', 'important');
        document.body.style.setProperty('background-image', `url("${imageSrc}")`, 'important');
        document.body.style.setProperty('background-size', 'cover', 'important');
        document.body.style.setProperty('background-position', 'center', 'important');
        document.body.style.setProperty('background-repeat', 'no-repeat', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');
        
        // Save to storage
        StorageHelper.set('customBackground', imageSrc);
        console.log('Background image applied successfully');
      };
      reader.readAsDataURL(file);
    }
  },

  resetBackground() {
    document.body.style.backgroundImage = '';
    document.body.classList.remove('custom-background');
    StorageHelper.remove('customBackground');
  },

  applyBackgroundPattern() {
    const patternSelect = document.getElementById('background-pattern-select');
    if (!patternSelect) return;

    const pattern = patternSelect.value;
    const backgroundColor = document.getElementById('background-color')?.value || '#1a1b2e';

    const patterns = {
      'none': `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor} 100%)`,
      'radial-purple': 'radial-gradient(circle at 20% 50%, rgba(147, 70, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 225, 255, 0.15) 0%, transparent 50%)',
      'stripe-purple': 'repeating-linear-gradient(45deg, #1e1b4b 0px, #1e1b4b 40px, #312e81 40px, #312e81 80px)',
      'grid-blue': 'linear-gradient(0deg, #1e3a8a 0%, #1e40af 100%), repeating-linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0px, transparent 1px, transparent 40px, rgba(59, 130, 246, 0.1) 41px)',
      'radial-green': 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%), linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
      'circle-red': 'repeating-radial-gradient(circle at 0 0, transparent 0, #7f1d1d 40px), repeating-linear-gradient(#991b1b55, #991b1b)',
      'solid-dark': 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
      'stripe-gold': 'repeating-linear-gradient(45deg, #1c1917 0px, #1c1917 20px, #292524 20px, #292524 40px), radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
      'diamond-grey': 'linear-gradient(135deg, #374151 25%, transparent 25%), linear-gradient(225deg, #374151 25%, transparent 25%), linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(315deg, #1f2937 25%, #374151 25%)',
      'radial-black-red': 'radial-gradient(circle at 30% 30%, rgba(127, 29, 29, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
      'horizontal-chrome': 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%), repeating-linear-gradient(0deg, transparent 0px, rgba(229, 231, 235, 0.05) 1px, transparent 2px, transparent 40px)',
      'line-neon-blue': 'repeating-linear-gradient(0deg, #0c4a6e 0px, #0c4a6e 2px, #075985 2px, #075985 4px), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
      'radial-neon-pink': 'radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 100%)',
      'stripe-neon-green': 'repeating-linear-gradient(45deg, #064e3b 0px, #064e3b 40px, #065f46 40px, #065f46 80px), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
      'rainbow-gradient': 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(249, 115, 22, 0.1) 100%), linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
      'black-sky': '#0a0a0a',
      'animated-waves': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'particle-field': '#0f0f23',
      'matrix-rain': '#000000',
      'cyber-grid': 'linear-gradient(0deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px), #0a0a0a',
      'plasma-wave': 'linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      'hexagon-pattern': 'radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), repeating-linear-gradient(60deg, transparent, transparent 35px, rgba(147, 51, 234, 0.1) 35px, rgba(147, 51, 234, 0.1) 70px), repeating-linear-gradient(120deg, transparent, transparent 35px, rgba(59, 130, 246, 0.1) 35px, rgba(59, 130, 246, 0.1) 70px), #0f0f1e',
      'constellation': 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent), radial-gradient(1px 1px at 33% 90%, white, transparent), radial-gradient(1px 1px at 15% 80%, white, transparent), radial-gradient(2px 2px at 70% 25%, white, transparent), #000000',
      'northern-lights': 'linear-gradient(180deg, #0a1628 0%, #1a2f4f 25%, #2a4d6e 50%, #1a2f4f 75%, #0a1628 100%), radial-gradient(ellipse at 50% 20%, rgba(0, 255, 170, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 40%, rgba(138, 43, 226, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0, 191, 255, 0.12) 0%, transparent 50%)',
      'fire-gradient': 'linear-gradient(0deg, #1a0000 0%, #330000 10%, #660000 20%, #990000 30%, #cc0000 40%, #ff3300 50%, #ff6600 60%, #ff9900 70%, #ffcc00 80%, #ffff00 90%, #ffffff 100%)',
      'ocean-depth': 'radial-gradient(ellipse at 50% 0%, rgba(13, 71, 161, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(1, 87, 155, 0.4) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(33, 150, 243, 0.03) 2px, rgba(33, 150, 243, 0.03) 4px), linear-gradient(180deg, #001529 0%, #002b4a 25%, #003d5c 50%, #002b4a 75%, #001529 100%)',
      'sunset-sky': 'linear-gradient(180deg, #0f2027 0%, #203a43 20%, #2c5364 40%, #c31432 70%, #f37335 85%, #fbb034 95%, #ffdd00 100%)',
      'space-nebula': 'radial-gradient(ellipse at 20% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(239, 68, 68, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%), radial-gradient(2px 2px at 10% 20%, white, transparent), radial-gradient(1px 1px at 90% 80%, white, transparent), radial-gradient(1px 1px at 50% 60%, white, transparent), radial-gradient(1px 1px at 30% 90%, white, transparent), radial-gradient(1px 1px at 70% 10%, white, transparent), #0a0a1e'
    };

    const selectedPattern = patterns[pattern] || patterns['none'];
    document.body.style.background = selectedPattern;
    document.body.style.backgroundColor = backgroundColor;
    
    this.saveSettings();
  },

  applyTheme(theme) {
    // Theme functionality moved to ThemeManager
    if (window.ThemeManager) {
      window.ThemeManager.applyTheme(theme);
    } else {
      console.warn('ThemeManager not available');
    }
  },

  // Legacy method - redirects to ThemeManager
  applySeasonalTheme(theme, themeData) {
    if (window.ThemeManager) {
      window.ThemeManager.applySeasonalTheme(theme, themeData);
    }
  },

  // Legacy method - redirects to ThemeManager
  restoreSavedTheme() {
    if (window.ThemeManager) {
      window.ThemeManager.restoreSavedTheme();
    }
  },

  // Legacy method - redirects to ThemeManager
  getThemeEmoji(theme) {
    return window.ThemeManager ? window.ThemeManager.getThemeEmoji(theme) : '🎨';
  },

  // Legacy method - redirects to ThemeManager
  getThemeName(theme) {
    return window.ThemeManager ? window.ThemeManager.getThemeName(theme) : theme;
  },

  // Legacy method - redirects to ThemeManager
  showThemeMessage(message) {
    if (window.ThemeManager) {
      window.ThemeManager.showThemeMessage(message);
    }
  },

  // Remove old theme functions - now handled by ThemeManager
  getChristmasEffects() { return ''; },
  getWinterEffects() { return ''; },
  getHalloweenEffects() { return ''; },
  getValentineEffects() { return ''; },

  resetAll() {
    console.log('🔄 Resetting all customizations...');
    StorageHelper.remove('customization');
    StorageHelper.remove('customLogo');
    StorageHelper.remove('customBackground');
    StorageHelper.remove('selectedTheme');
    StorageHelper.remove('customCardBackground');
    StorageHelper.remove('twitchChatTheme');
    StorageHelper.remove('infoPanelPosition');
    StorageHelper.remove('tournamentLayoutHorizontal');
    
    // Clear any seasonal theme classes and effects
    document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
    const seasonalStyle = document.getElementById('seasonal-effects');
    if (seasonalStyle) seasonalStyle.remove();
    
    // Reset body styles
    document.body.style.background = '';
    document.body.style.fontFamily = '';
    document.body.style.fontWeight = '';
    
    location.reload();
  },

  saveSettings() {
    const settings = {
      default: {
        primary: '#9346ff', accent: '#00e1ff', background: '#1a1b2e', text: '#ffffff',
        cardBg: '#2a2b3d',
        slotStart: '#9346ff', slotEnd: '#00e1ff',
        buttonStart: '#9346ff', buttonEnd: '#7c3aed',
        sidebarStart: '#1a1b2e', sidebarEnd: '#16213e',
        bgPattern: 'radial-gradient(circle at 20% 50%, rgba(147, 70, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 225, 255, 0.15) 0%, transparent 50%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '400'
      },
      purple: {
        primary: '#a855f7', accent: '#c084fc', background: '#1e1b4b', text: '#ffffff',
        cardBg: '#2d1b69',
        slotStart: '#a855f7', slotEnd: '#c084fc',
        buttonStart: '#a855f7', buttonEnd: '#9333ea',
        sidebarStart: '#1e1b4b', sidebarEnd: '#312e81',
        bgPattern: 'repeating-linear-gradient(45deg, #1e1b4b 0px, #1e1b4b 40px, #312e81 40px, #312e81 80px)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500'
      },
      blue: {
        primary: '#3b82f6', accent: '#60a5fa', background: '#1e3a8a', text: '#ffffff',
        cardBg: '#1e40af',
        slotStart: '#3b82f6', slotEnd: '#60a5fa',
        buttonStart: '#3b82f6', buttonEnd: '#2563eb',
        sidebarStart: '#1e3a8a', sidebarEnd: '#1e40af',
        bgPattern: 'linear-gradient(0deg, #1e3a8a 0%, #1e40af 100%), repeating-linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0px, transparent 1px, transparent 40px, rgba(59, 130, 246, 0.1) 41px)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      green: {
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#ffffff',
        cardBg: '#065f46',
        slotStart: '#10b981', slotEnd: '#34d399',
        buttonStart: '#10b981', buttonEnd: '#059669',
        sidebarStart: '#064e3b', sidebarEnd: '#065f46',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%), linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      red: {
        primary: '#ef4444', accent: '#f87171', background: '#7f1d1d', text: '#ffffff',
        cardBg: '#991b1b',
        slotStart: '#ef4444', slotEnd: '#f87171',
        buttonStart: '#ef4444', buttonEnd: '#dc2626',
        sidebarStart: '#7f1d1d', sidebarEnd: '#991b1b',
        bgPattern: 'repeating-radial-gradient(circle at 0 0, transparent 0, #7f1d1d 40px), repeating-linear-gradient(#991b1b55, #991b1b)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '500'
      },
      dark: {
        primary: '#6b7280', accent: '#9ca3af', background: '#111827', text: '#ffffff',
        cardBg: '#1f2937',
        slotStart: '#6b7280', slotEnd: '#9ca3af',
        buttonStart: '#6b7280', buttonEnd: '#4b5563',
        sidebarStart: '#111827', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      // HEAVY THEMES
      gold: {
        primary: '#fbbf24', accent: '#fcd34d', background: '#1c1917', text: '#fef3c7',
        cardBg: '#292524',
        slotStart: '#d97706', slotEnd: '#fbbf24',
        buttonStart: '#b45309', buttonEnd: '#d97706',
        sidebarStart: '#292524', sidebarEnd: '#1c1917',
        bgPattern: 'repeating-linear-gradient(45deg, #1c1917 0px, #1c1917 20px, #292524 20px, #292524 40px), radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'grey-red': {
        primary: '#dc2626', accent: '#ef4444', background: '#374151', text: '#f3f4f6',
        slotStart: '#6b7280', slotEnd: '#dc2626',
        buttonStart: '#991b1b', buttonEnd: '#dc2626',
        sidebarStart: '#374151', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(135deg, #374151 25%, transparent 25%), linear-gradient(225deg, #374151 25%, transparent 25%), linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(315deg, #1f2937 25%, #374151 25%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '500'
      },
      'black-red': {
        primary: '#dc2626', accent: '#f87171', background: '#000000', text: '#ffffff',
        slotStart: '#7f1d1d', slotEnd: '#dc2626',
        buttonStart: '#450a0a', buttonEnd: '#991b1b',
        sidebarStart: '#0a0a0a', sidebarEnd: '#000000',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(127, 29, 29, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600'
      },
      chrome: {
        primary: '#e5e7eb', accent: '#f3f4f6', background: '#1f2937', text: '#ffffff',
        slotStart: '#9ca3af', slotEnd: '#d1d5db',
        buttonStart: '#6b7280', buttonEnd: '#9ca3af',
        sidebarStart: '#374151', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%), repeating-linear-gradient(0deg, transparent 0px, rgba(229, 231, 235, 0.05) 1px, transparent 2px, transparent 40px)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
      },
      'neon-blue': {
        primary: '#06b6d4', accent: '#22d3ee', background: '#0c4a6e', text: '#e0f2fe',
        cardBg: '#075985',
        slotStart: '#0284c7', slotEnd: '#06b6d4',
        buttonStart: '#0369a1', buttonEnd: '#0891b2',
        sidebarStart: '#0c4a6e', sidebarEnd: '#075985',
        bgPattern: 'repeating-linear-gradient(0deg, #0c4a6e 0px, #0c4a6e 2px, #075985 2px, #075985 4px), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'neon-pink': {
        primary: '#ec4899', accent: '#f472b6', background: '#831843', text: '#fce7f3',
        cardBg: '#9f1239',
        slotStart: '#db2777', slotEnd: '#ec4899',
        buttonStart: '#9f1239', buttonEnd: '#db2777',
        sidebarStart: '#831843', sidebarEnd: '#9f1239',
        bgPattern: 'radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'neon-green': {
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#d1fae5',
        cardBg: '#065f46',
        slotStart: '#059669', slotEnd: '#10b981',
        buttonStart: '#047857', buttonEnd: '#059669',
        sidebarStart: '#064e3b', sidebarEnd: '#065f46',
        bgPattern: 'repeating-linear-gradient(45deg, #064e3b 0px, #064e3b 40px, #065f46 40px, #065f46 80px), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      rainbow: {
        primary: '#f472b6', accent: '#a78bfa', background: '#1e1b4b', text: '#ffffff',
        cardBg: '#312e81',
        slotStart: '#ec4899', slotEnd: '#8b5cf6',
        buttonStart: '#f97316', buttonEnd: '#ec4899',
        sidebarStart: '#1e1b4b', sidebarEnd: '#312e81',
        bgPattern: 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(249, 115, 22, 0.1) 100%), linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'black-sky': {
        primary: '#4b5563', accent: '#6b7280', background: '#000000', text: '#e5e7eb',
        slotStart: '#1f2937', slotEnd: '#374151',
        buttonStart: '#111827', buttonEnd: '#1f2937',
        sidebarStart: '#000000', sidebarEnd: '#0a0a0a',
        bgPattern: 'radial-gradient(ellipse at top, rgba(31, 41, 55, 0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(17, 24, 39, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(75, 85, 99, 0.1) 0%, transparent 30%), radial-gradient(circle at 80% 80%, rgba(55, 65, 81, 0.1) 0%, transparent 30%), linear-gradient(180deg, #000000 0%, #050505 50%, #000000 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
      },
      // PREMIUM THEMES
      'cyber-purple': {
        primary: '#ba55d3', accent: '#9370db', background: '#1a0033', text: '#e9d5ff',
        cardBg: '#2d1b4e',
        slotStart: '#6a0dad', slotEnd: '#ba55d3',
        buttonStart: '#6a0dad', buttonEnd: '#9370db',
        sidebarStart: '#1a0033', sidebarEnd: '#2d1b4e',
        bgPattern: 'radial-gradient(circle at 30% 50%, rgba(186, 85, 211, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(147, 112, 219, 0.15) 0%, transparent 50%), linear-gradient(135deg, #1a0033 0%, #2d1b4e 100%)',
        fontFamily: 'Orbitron, monospace',
        fontWeight: '700'
      },
      'ocean-blue': {
        primary: '#00acc1', accent: '#00758f', background: '#001f3f', text: '#e0f7fa',
        cardBg: '#003d5c',
        slotStart: '#003d5c', slotEnd: '#00acc1',
        buttonStart: '#003d5c', buttonEnd: '#00758f',
        sidebarStart: '#001f3f', sidebarEnd: '#003d5c',
        bgPattern: 'linear-gradient(180deg, #001f3f 0%, #003d5c 50%, #001f3f 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      'sunset-orange': {
        primary: '#ffa500', accent: '#ff6347', background: '#1a0f00', text: '#fff3e0',
        cardBg: '#2d1a00',
        slotStart: '#ff4500', slotEnd: '#ffa500',
        buttonStart: '#ff4500', buttonEnd: '#ff6347',
        sidebarStart: '#1a0f00', sidebarEnd: '#2d1a00',
        bgPattern: 'linear-gradient(0deg, #1a0f00 0%, #ff4500 40%, #ff6347 60%, #ffa500 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500'
      },
      'forest-green': {
        primary: '#2e7d32', accent: '#1b5e20', background: '#0b1f0d', text: '#c8e6c9',
        cardBg: '#1b5e20',
        slotStart: '#0b4619', slotEnd: '#2e7d32',
        buttonStart: '#0b4619', buttonEnd: '#1b5e20',
        sidebarStart: '#0b1f0d', sidebarEnd: '#1b5e20',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(46, 125, 50, 0.2) 0%, transparent 60%), linear-gradient(180deg, #0b1f0d 0%, #1b5e20 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      'midnight-purple': {
        primary: '#6a1b9a', accent: '#4a148c', background: '#0a0014', text: '#e1bee7',
        cardBg: '#1a0033',
        slotStart: '#1a0033', slotEnd: '#6a1b9a',
        buttonStart: '#1a0033', buttonEnd: '#4a148c',
        sidebarStart: '#0a0014', sidebarEnd: '#1a0033',
        bgPattern: 'radial-gradient(ellipse at center, rgba(106, 27, 154, 0.3) 0%, transparent 70%), linear-gradient(180deg, #0a0014 0%, #1a0033 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500'
      },
      'lava-red': {
        primary: '#ff5722', accent: '#d32f2f', background: '#1a0000', text: '#ffccbc',
        cardBg: '#2d0000',
        slotStart: '#b71c1c', slotEnd: '#ff5722',
        buttonStart: '#b71c1c', buttonEnd: '#d32f2f',
        sidebarStart: '#1a0000', sidebarEnd: '#2d0000',
        bgPattern: 'radial-gradient(circle at 50% 30%, rgba(211, 47, 47, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255, 87, 34, 0.3) 0%, transparent 50%), linear-gradient(180deg, #1a0000 0%, #2d0000 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'ice-blue': {
        primary: '#80deea', accent: '#b2ebf2', background: '#003d5c', text: '#003d5c',
        cardBg: '#26a69a',
        slotStart: '#e0f7fa', slotEnd: '#80deea',
        buttonStart: '#b2ebf2', buttonEnd: '#80deea',
        sidebarStart: '#e0f7fa', sidebarEnd: '#b2ebf2',
        bgPattern: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
      },
      'toxic-green': {
        primary: '#7cb342', accent: '#558b2f', background: '#1a2e0b', text: '#dcedc8',
        slotStart: '#33691e', slotEnd: '#7cb342',
        buttonStart: '#33691e', buttonEnd: '#558b2f',
        sidebarStart: '#1a2e0b', sidebarEnd: '#33691e',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(124, 179, 66, 0.3) 0%, transparent 60%), linear-gradient(180deg, #1a2e0b 0%, #33691e 100%)',
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: '600'
      },
      'royal-gold': {
        primary: '#ffd54f', accent: '#ffb74d', background: '#2d2000', text: '#3e2723',
        slotStart: '#f9a825', slotEnd: '#ffd54f',
        buttonStart: '#f9a825', buttonEnd: '#ffb74d',
        sidebarStart: '#fff3e0', sidebarEnd: '#ffecb3',
        bgPattern: 'linear-gradient(135deg, #fff3e0 0%, #ffecb3 50%, #ffe082 100%)',
        fontFamily: 'Georgia, serif',
        fontWeight: '600'
      },
      'wine-lovers': {
        primary: '#ad1457', accent: '#880e4f', background: '#000000', text: '#fce4ec',
        cardBg: '#2d0000',
        slotStart: '#000000', slotEnd: '#ad1457',
        buttonStart: '#000000', buttonEnd: '#880e4f',
        sidebarStart: '#000000', sidebarEnd: '#0a0000',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(173, 20, 87, 0.4) 0%, transparent 60%), linear-gradient(180deg, #000000 0%, #0a0000 100%)',
        fontFamily: 'Crimson Text, serif',
        fontWeight: '600'
      },
      'matrix-green': {
        primary: '#00ff00', accent: '#33ff33', background: '#001100', text: '#000000',
        slotStart: '#003300', slotEnd: '#00ff00',
        buttonStart: '#003300', buttonEnd: '#33ff33',
        sidebarStart: '#001100', sidebarEnd: '#003300',
        bgPattern: 'linear-gradient(180deg, #001100 0%, #003300 100%)',
        fontFamily: 'Courier New, monospace',
        fontWeight: '700'
      },
      'synthwave': {
        primary: '#06ffa5', accent: '#3a86ff', background: '#1a0033', text: '#ffffff',
        cardBg: '#2d004d',
        slotStart: '#ff006e', slotEnd: '#06ffa5',
        buttonStart: '#8338ec', buttonEnd: '#3a86ff',
        sidebarStart: '#1a0033', sidebarEnd: '#2d004d',
        bgPattern: 'linear-gradient(135deg, #ff006e 0%, #8338ec 33%, #3a86ff 66%, #06ffa5 100%)',
        fontFamily: 'Orbitron, monospace',
        fontWeight: '700'
      },
      // SEASONAL THEMES
      'christmas-candy-cane': {
        primary: '#dc2626', accent: '#ffffff', background: '#0f1b3c', text: '#ffffff',
        cardBg: '#0f2f4a',
        slotStart: '#dc2626', slotEnd: '#ffffff',
        buttonStart: '#dc2626', buttonEnd: '#b91c1c',
        sidebarStart: '#0f1b3c', sidebarEnd: '#0f2f4a',
        bgPattern: 'radial-gradient(circle at 30% 20%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0a1a2e 0%, #16213e 25%, #1a2650 50%, #0f1b3c 75%, #001122 100%), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.05) 10px, rgba(220, 38, 38, 0.05) 20px)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'winter-wonderland': {
        primary: '#60a5fa', accent: '#e0f2fe', background: '#0c4a6e', text: '#e0f2fe',
        cardBg: '#075985',
        slotStart: '#0284c7', slotEnd: '#60a5fa',
        buttonStart: '#0369a1', buttonEnd: '#0891b2',
        sidebarStart: '#0c4a6e', sidebarEnd: '#075985',
        bgPattern: 'radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(224, 242, 254, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500',
        seasonal: true
      },
      'halloween-spooky': {
        primary: '#f97316', accent: '#1a0b00', background: '#451a03', text: '#f97316',
        cardBg: '#1a0b00',
        slotStart: '#451a03', slotEnd: '#f97316',
        buttonStart: '#451a03', buttonEnd: '#ea580c',
        sidebarStart: '#451a03', sidebarEnd: '#1a0b00',
        bgPattern: 'radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(26, 11, 0, 0.8) 0%, transparent 50%), linear-gradient(135deg, #451a03 0%, #1a0b00 25%, #451a03 50%, #1a0b00 75%, #451a03 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'valentine-love': {
        primary: '#ec4899', accent: '#fce7f3', background: '#831843', text: '#fce7f3',
        cardBg: '#9f1239',
        slotStart: '#be185d', slotEnd: '#ec4899',
        buttonStart: '#9f1239', buttonEnd: '#be185d',
        sidebarStart: '#831843', sidebarEnd: '#9f1239',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(252, 231, 243, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 25%, #be185d 50%, #9f1239 75%, #831843 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500',
        seasonal: true
      }
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
      // Handle seasonal themes with special effects
      if (selectedTheme.seasonal) {
        this.applySeasonalTheme(theme, selectedTheme);
        return;
      }
      
      // Clear any existing seasonal classes for regular themes
      document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
      
      document.getElementById('primary-color').value = selectedTheme.primary;
      document.getElementById('accent-color').value = selectedTheme.accent;
      document.getElementById('background-color').value = selectedTheme.background;
      document.getElementById('text-color').value = selectedTheme.text;
      
      // Set card background if available
      const cardBgInput = document.getElementById('card-background-color');
      if (cardBgInput && selectedTheme.cardBg) {
        cardBgInput.value = selectedTheme.cardBg;
        localStorage.setItem('customCardBackground', selectedTheme.cardBg);
      }
      
      document.getElementById('slot-gradient-start').value = selectedTheme.slotStart;
      document.getElementById('slot-gradient-end').value = selectedTheme.slotEnd;
      document.getElementById('button-gradient-start').value = selectedTheme.buttonStart;
      document.getElementById('button-gradient-end').value = selectedTheme.buttonEnd;
      document.getElementById('sidebar-gradient-start').value = selectedTheme.sidebarStart;
      document.getElementById('sidebar-gradient-end').value = selectedTheme.sidebarEnd;
      
      // Apply background pattern
      if (selectedTheme.bgPattern) {
        document.body.style.background = selectedTheme.bgPattern;
        document.body.style.backgroundColor = selectedTheme.background;
      }
      
      // Apply font family and weight
      if (selectedTheme.fontFamily) {
        document.body.style.fontFamily = selectedTheme.fontFamily;
      }
      if (selectedTheme.fontWeight) {
        document.body.style.fontWeight = selectedTheme.fontWeight;
      }
      
      this.applyAllColors();
      
      // Refresh tournament bracket styling if function exists
      setTimeout(() => {
        if (window.refreshTournamentBracketStyling) {
          window.refreshTournamentBracketStyling();
        }
      }, 100);
    }
  },

  saveSettings() {
    const settings = {
      // Colors
      primaryColor: document.getElementById('primary-color')?.value,
      accentColor: document.getElementById('accent-color')?.value,
      backgroundColor: document.getElementById('background-color')?.value,
      textColor: document.getElementById('text-color')?.value,
      streamerNameColor: document.getElementById('streamer-name-color')?.value,
      websiteColor: document.getElementById('website-color')?.value,
      // Gradients
      slotGradientStart: document.getElementById('slot-gradient-start')?.value,
      slotGradientEnd: document.getElementById('slot-gradient-end')?.value,
      buttonGradientStart: document.getElementById('button-gradient-start')?.value,
      buttonGradientEnd: document.getElementById('button-gradient-end')?.value,
      sidebarGradientStart: document.getElementById('sidebar-gradient-start')?.value,
      sidebarGradientEnd: document.getElementById('sidebar-gradient-end')?.value,
      gradientDirection: document.getElementById('gradient-direction')?.value,
      // Effects
      glassEffect: document.getElementById('glass-effect-toggle')?.checked,
      animatedGradients: document.getElementById('animated-gradients-toggle')?.checked,
      glowEffects: document.getElementById('glow-effects-toggle')?.checked,
      sidebarBackgrounds: document.getElementById('sidebar-backgrounds-toggle')?.checked,
      hideChat: document.getElementById('hide-chat-toggle')?.checked,
      // General
      streamerName: document.getElementById('custom-streamer-name')?.value,
      websiteUrl: document.getElementById('custom-website-url')?.value,
      backgroundType: document.getElementById('background-type')?.value,
      sidebarPosition: document.getElementById('sidebar-position')?.value,
      dragResizeEnabled: document.getElementById('enable-drag-resize')?.checked
    };

    StorageHelper.set('customization', settings);
  },

  loadSavedSettings() {
    const settings = StorageHelper.get('customization');
    if (!settings) return;

    // Load colors
    if (settings.primaryColor) document.getElementById('primary-color').value = settings.primaryColor;
    if (settings.accentColor) document.getElementById('accent-color').value = settings.accentColor;
    if (settings.backgroundColor) document.getElementById('background-color').value = settings.backgroundColor;
    if (settings.textColor) document.getElementById('text-color').value = settings.textColor;
    if (settings.streamerNameColor) document.getElementById('streamer-name-color').value = settings.streamerNameColor;
    if (settings.websiteColor) document.getElementById('website-color').value = settings.websiteColor;
    
    // Load gradients
    if (settings.slotGradientStart) document.getElementById('slot-gradient-start').value = settings.slotGradientStart;
    if (settings.slotGradientEnd) document.getElementById('slot-gradient-end').value = settings.slotGradientEnd;
    if (settings.buttonGradientStart) document.getElementById('button-gradient-start').value = settings.buttonGradientStart;
    if (settings.buttonGradientEnd) document.getElementById('button-gradient-end').value = settings.buttonGradientEnd;
    if (settings.sidebarGradientStart) document.getElementById('sidebar-gradient-start').value = settings.sidebarGradientStart;
    if (settings.sidebarGradientEnd) document.getElementById('sidebar-gradient-end').value = settings.sidebarGradientEnd;
    if (settings.gradientDirection) document.getElementById('gradient-direction').value = settings.gradientDirection;

    // Load effects
    if (settings.glassEffect !== undefined) document.getElementById('glass-effect-toggle').checked = settings.glassEffect;
    if (settings.animatedGradients !== undefined) document.getElementById('animated-gradients-toggle').checked = settings.animatedGradients;
    if (settings.glowEffects !== undefined) document.getElementById('glow-effects-toggle').checked = settings.glowEffects;
    if (settings.sidebarBackgrounds !== undefined) document.getElementById('sidebar-backgrounds-toggle').checked = settings.sidebarBackgrounds;
    if (settings.hideChat !== undefined) document.getElementById('hide-chat-toggle').checked = settings.hideChat;

    // Load general
    if (settings.streamerName) {
      document.getElementById('custom-streamer-name').value = settings.streamerName;
      const streamerName = document.getElementById('streamer-name');
      if (streamerName) streamerName.textContent = settings.streamerName;
    }
    if (settings.websiteUrl) {
      document.getElementById('custom-website-url').value = settings.websiteUrl;
      const websiteLink = document.getElementById('website-link');
      if (websiteLink) {
        websiteLink.textContent = settings.websiteUrl;
        websiteLink.href = settings.websiteUrl;
      }
    }
    if (settings.backgroundType) {
      document.getElementById('background-type').value = settings.backgroundType;
      this.handleBackgroundType();
    }
    if (settings.sidebarPosition) {
      document.getElementById('sidebar-position').value = settings.sidebarPosition;
      this.applySidebarPosition();
    }
    
    // Load tournament bracket layout
    const tournamentLayoutDropdown = document.getElementById('tournament-bracket-layout');
    if (tournamentLayoutDropdown) {
      const isHorizontal = localStorage.getItem('tournamentLayoutHorizontal') === 'true';
      tournamentLayoutDropdown.value = isHorizontal ? 'horizontal' : 'vertical';
    }
    
    // Load info panel position
    const infoPanelPositionDropdown = document.getElementById('info-panel-position');
    if (infoPanelPositionDropdown) {
      const savedPosition = localStorage.getItem('infoPanelPosition') || 'center-right';
      infoPanelPositionDropdown.value = savedPosition;
      this.applyInfoPanelPosition();
    }
    
    if (settings.dragResizeEnabled !== undefined) {
      const toggle = document.getElementById('enable-drag-resize');
      if (toggle) toggle.checked = settings.dragResizeEnabled;
      this.applyDragResize(!!settings.dragResizeEnabled);
    }

    // Load custom logo
    const customLogo = StorageHelper.get('customLogo');
    if (customLogo) {
      const logoImg = document.getElementById('navbar-logo');
      if (logoImg) logoImg.src = customLogo;
    }

    // Load custom background
    const customBackground = StorageHelper.get('customBackground');
    if (customBackground) {
      document.body.style.backgroundImage = `url(${customBackground})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.classList.add('custom-background');
    }

    // Apply loaded settings
    this.applyAllColors();
    this.applyEffects();
  },

  applySeasonalTheme(theme, themeData) {
    // Clear existing seasonal classes
    document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
    
    // Remove existing seasonal effects
    const existingStyle = document.getElementById('seasonal-effects');
    if (existingStyle) existingStyle.remove();
    
    // Add appropriate seasonal class
    let seasonalClass = '';
    let effectsCSS = '';
    
    switch(theme) {
      case 'christmas-candy-cane':
        seasonalClass = 'christmas-theme';
        effectsCSS = this.getChristmasEffects();
        break;
      case 'winter-wonderland':
        seasonalClass = 'winter-theme';
        effectsCSS = this.getWinterEffects();
        break;
      case 'halloween-spooky':
        seasonalClass = 'halloween-theme';
        effectsCSS = this.getHalloweenEffects();
        break;
      case 'valentine-love':
        seasonalClass = 'valentine-theme';
        effectsCSS = this.getValentineEffects();
        break;
    }
    
    document.body.classList.add(seasonalClass);
    
    // Apply seasonal effects
    if (effectsCSS) {
      const styleElement = document.createElement('style');
      styleElement.id = 'seasonal-effects';
      styleElement.textContent = effectsCSS;
      document.head.appendChild(styleElement);
    }
    
    // Apply colors using regular color system
    document.getElementById('primary-color').value = themeData.primary;
    document.getElementById('accent-color').value = themeData.accent;
    document.getElementById('background-color').value = themeData.background;
    document.getElementById('text-color').value = themeData.text;
    
    const cardBgInput = document.getElementById('card-background-color');
    if (cardBgInput && themeData.cardBg) {
      cardBgInput.value = themeData.cardBg;
      localStorage.setItem('customCardBackground', themeData.cardBg);
    }
    
    // Apply theme colors
    this.applyAllColors();
    
    // Save theme selection
    localStorage.setItem('selectedTheme', theme);
    
    console.log(`🎨 Applied ${theme} seasonal theme`);
    
    // Show theme change message
    this.showThemeMessage(`${this.getThemeEmoji(theme)} ${this.getThemeName(theme)} activated!`);
  },

  restoreSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      console.log(`🎨 Restoring saved theme: ${savedTheme}`);
      
      // Check if it's a seasonal theme
      const seasonalThemes = ['christmas-candy-cane', 'winter-wonderland', 'halloween-spooky', 'valentine-love'];
      if (seasonalThemes.includes(savedTheme)) {
        if (window.ThemeManager) {
          window.ThemeManager.applyTheme(savedTheme);
        }
      }
      
      // Update theme button state
      const themeBtn = document.querySelector(`[data-theme="${savedTheme}"]`);
      if (themeBtn) {
        document.querySelectorAll('.theme-preset').forEach(btn => btn.classList.remove('active'));
        themeBtn.classList.add('active');
      }
    }
  },

  getThemeEmoji(theme) {
    const emojis = {
      'christmas-candy-cane': '🎄🍭',
      'winter-wonderland': '❄️⛄',
      'halloween-spooky': '🎃👻',
      'valentine-love': '💖💝'
    };
    return emojis[theme] || '🎨';
  },

  getThemeName(theme) {
    const names = {
      'christmas-candy-cane': 'Christmas Candy Cane',
      'winter-wonderland': 'Winter Wonderland',
      'halloween-spooky': 'Halloween Spooky',
      'valentine-love': 'Valentine Love'
    };
    return names[theme] || theme;
  },

  showThemeMessage(message) {
    // Remove existing message
    const existing = document.getElementById('theme-message');
    if (existing) existing.remove();
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.id = 'theme-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px 30px;
      border-radius: 25px;
      border: 2px solid #00e1ff;
      font-weight: 600;
      font-size: 16px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      animation: theme-message-fade 4s ease-in-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after animation
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 4000);
  },

  getChristmasEffects() {
    return `
      /* Christmas snowflakes animation */
      body.christmas-theme::before {
        content: '❄ ❄ ❄ ❄ ❄ ❄ ❄ ❄ ❄ ❄' !important;
        position: fixed !important;
        top: -50px !important;
        left: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        color: white !important;
        font-size: 20px !important;
        letter-spacing: 80px !important;
        animation: snow-fall 8s linear infinite !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      @keyframes snow-fall {
        0% { transform: translateY(-50px) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }
      
      /* Candy cane borders */
      body.christmas-theme .navbar,
      body.christmas-theme .info-section,
      body.christmas-theme .sidebar {
        border: 3px solid transparent !important;
        background-clip: padding-box !important;
        position: relative !important;
      }
      
      body.christmas-theme .navbar::after,
      body.christmas-theme .info-section::after,
      body.christmas-theme .sidebar::after {
        content: '' !important;
        position: absolute !important;
        top: -3px !important;
        left: -3px !important;
        right: -3px !important;
        bottom: -3px !important;
        background: repeating-linear-gradient(
          45deg,
          #dc2626 0px, #dc2626 8px,
          #ffffff 8px, #ffffff 16px
        ) !important;
        z-index: -1 !important;
        border-radius: inherit !important;
        animation: candy-rotate 3s linear infinite !important;
      }
      
      @keyframes candy-rotate {
        0% { background-position: 0 0; }
        100% { background-position: 32px 32px; }
      }
      
      @keyframes theme-message-fade {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
  },

  getWinterEffects() {
    return `
      /* Winter snowflakes */
      body.winter-theme::before {
        content: '❄️ ⛄ ❄️ 🌨️ ❄️ ⛄ ❄️ 🌨️ ❄️ ⛄' !important;
        position: fixed !important;
        top: -50px !important;
        left: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        font-size: 25px !important;
        letter-spacing: 100px !important;
        animation: winter-fall 12s linear infinite !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      @keyframes winter-fall {
        0% { transform: translateY(-50px) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }
      
      /* Icy borders */
      body.winter-theme .navbar,
      body.winter-theme .info-section,
      body.winter-theme .sidebar {
        border: 2px solid rgba(96, 165, 250, 0.5) !important;
        box-shadow: 0 0 20px rgba(96, 165, 250, 0.3) !important;
      }
      
      @keyframes theme-message-fade {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
  },

  getHalloweenEffects() {
    return `
      /* Halloween bats and pumpkins */
      body.halloween-theme::before {
        content: '🎃 🦇 👻 🕷️ 🎃 🦇 👻 🕷️ 🎃 🦇' !important;
        position: fixed !important;
        top: -50px !important;
        left: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        font-size: 30px !important;
        letter-spacing: 90px !important;
        animation: spooky-float 15s linear infinite !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      @keyframes spooky-float {
        0% { transform: translateY(-50px) translateX(-20px); }
        25% { transform: translateY(25vh) translateX(20px); }
        50% { transform: translateY(50vh) translateX(-10px); }
        75% { transform: translateY(75vh) translateX(30px); }
        100% { transform: translateY(100vh) translateX(-5px); }
      }
      
      /* Spooky glowing borders */
      body.halloween-theme .navbar,
      body.halloween-theme .info-section,
      body.halloween-theme .sidebar {
        border: 2px solid #f97316 !important;
        box-shadow: 0 0 25px rgba(249, 115, 22, 0.6), inset 0 0 15px rgba(26, 11, 0, 0.8) !important;
        animation: spooky-glow 3s ease-in-out infinite alternate !important;
      }
      
      @keyframes spooky-glow {
        0% { box-shadow: 0 0 25px rgba(249, 115, 22, 0.6), inset 0 0 15px rgba(26, 11, 0, 0.8); }
        100% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.9), inset 0 0 25px rgba(26, 11, 0, 0.9); }
      }
      
      @keyframes theme-message-fade {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
  },

  getValentineEffects() {
    return `
      /* Valentine hearts */
      body.valentine-theme::before {
        content: '💖 💕 💗 💘 💝 💖 💕 💗 💘 💝' !important;
        position: fixed !important;
        top: -50px !important;
        left: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        font-size: 28px !important;
        letter-spacing: 85px !important;
        animation: hearts-float 10s linear infinite !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      @keyframes hearts-float {
        0% { transform: translateY(-50px) scale(0.8); }
        25% { transform: translateY(25vh) scale(1.1); }
        50% { transform: translateY(50vh) scale(0.9); }
        75% { transform: translateY(75vh) scale(1.2); }
        100% { transform: translateY(100vh) scale(0.8); }
      }
      
      /* Romantic glowing borders */
      body.valentine-theme .navbar,
      body.valentine-theme .info-section,
      body.valentine-theme .sidebar {
        border: 2px solid #ec4899 !important;
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.5), inset 0 0 10px rgba(252, 231, 243, 0.2) !important;
        animation: romantic-pulse 4s ease-in-out infinite alternate !important;
      }
      
      @keyframes romantic-pulse {
        0% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.5), inset 0 0 10px rgba(252, 231, 243, 0.2); }
        100% { box-shadow: 0 0 35px rgba(236, 72, 153, 0.8), inset 0 0 20px rgba(252, 231, 243, 0.4); }
      }
      
      @keyframes theme-message-fade {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
  }
};

// Initialize customization on page load
document.addEventListener('DOMContentLoaded', () => {
  CustomizationManager.init();
});

// Export utilities to global scope
window.debounce = debounce;
window.formatCurrency = formatCurrency;
window.formatMultiplier = formatMultiplier;
window.getSlotImage = getSlotImage;
window.generateId = generateId;
window.StorageHelper = StorageHelper;
window.CustomizationManager = CustomizationManager;
window.AnimationHelper = AnimationHelper;
window.NotificationManager = NotificationManager;
window.ModalManager = ModalManager;
window.Validator = Validator;
window.CustomizationManager = CustomizationManager;