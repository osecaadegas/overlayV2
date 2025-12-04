// ==================== BONUS HUNT MODULE ====================

class BonusHuntManager {
  constructor() {
    this.bonuses = [];
    this.totalBet = 0;
    this.totalPayout = 0;
    this.customSlotImages = {}; // Store custom image URLs
    this.currentBonusOpeningIndex = 0; // Track current bonus in opening panel
    this.currentBonusIndex = null; // Track active bonus for pulsing effect
    this.isEnteringPayout = false; // Track if we're in payout entry mode
    this.init();
  }

  init() {
    console.log('Bonus Hunt Manager initialized');
    this.currentLayout = localStorage.getItem('bonusLayoutMode') || 'classic';
    console.log('🎯 Current layout from storage:', this.currentLayout);
    this.setupEventListeners();
    // Don't load saved bonuses - start fresh on each page load
    
    // Ensure all panels start hidden
    this.hideAllPanelsOnInit();
    
    // Apply saved layout after a small delay to ensure DOM is ready
    setTimeout(() => {
      console.log('🔄 Applying layout after DOM ready...');
      this.switchLayout(this.currentLayout);
      
      // Also trigger the customization panel update if it exists
      const layoutSelect = document.getElementById('bonus-list-layout-select');
      if (layoutSelect && layoutSelect.value !== this.currentLayout) {
        layoutSelect.value = this.currentLayout;
      }
    }, 200);
    
    // Force initial statistics refresh after a short delay
    setTimeout(() => {
      this.refreshAllStatistics();
    }, 1000);
  }

  hideAllPanelsOnInit() {
    // Ensure all panels are hidden when page loads
    const classicBHPanel = document.getElementById('middle-panel');
    const modernBHPanel = document.getElementById('modern-bh-panel');
    const modernSidebar = document.getElementById('modern-bonus-sidebar');
    const classicBonusOpening = document.getElementById('bonus-opening-panel');
    const modernBonusOpening = document.getElementById('modern-bonus-opening-panel');
    const infoPanel = document.querySelector('.info-panel');
    const bonusStatsPanel = document.getElementById('bonus-stats-panel');
    
    if (classicBHPanel) classicBHPanel.style.display = 'none';
    if (modernBHPanel) modernBHPanel.style.display = 'none';
    if (modernSidebar) modernSidebar.style.display = 'none';
    if (classicBonusOpening) classicBonusOpening.style.display = 'none';
    if (modernBonusOpening) modernBonusOpening.style.display = 'none';
    if (infoPanel) infoPanel.classList.remove('info-panel--visible');
    if (bonusStatsPanel) bonusStatsPanel.style.display = 'none';
    
    // Reset BH button state
    const bhBtn = document.getElementById('bh-btn');
    if (bhBtn) bhBtn.classList.remove('active');
    
    console.log('🚫 All panels hidden on initialization');
  }

  setupEventListeners() {
    // Add bonus button
    const addBonusBtn = document.getElementById('add-bonus-btn');
    if (addBonusBtn) {
      addBonusBtn.addEventListener('click', () => this.addBonus());
    }

    // Slot name input with suggestions
    const slotNameInput = document.getElementById('slot-name-input');
    if (slotNameInput) {
      slotNameInput.addEventListener('input', () => this.handleSlotNameInput());
      slotNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBonus();
        }
      });
    }

    // Bet size input
    const betSizeInput = document.getElementById('bet-size-input');
    if (betSizeInput) {
      betSizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBonus();
        }
      });
    }

    // Super checkbox
    const superCheckbox = document.getElementById('super-checkbox');
    if (superCheckbox) {
      superCheckbox.addEventListener('change', () => this.handleSuperCheckbox());
    }

    // Clear all bonuses
    const clearAllBtn = document.getElementById('clear-all-bonuses');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => this.clearAllBonuses());
    }

    // Export bonuses
    const exportBtn = document.getElementById('export-bonuses');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportBonuses());
    }

    // Bonus opening button
    const bonusOpeningBtn = document.getElementById('bonus-opening-btn');
    if (bonusOpeningBtn) {
      bonusOpeningBtn.addEventListener('click', () => this.showBonusOpeningPanel());
    }

    // Close bonus opening panel
    const closeBonusOpeningBtn = document.getElementById('close-bonus-opening-btn');
    if (closeBonusOpeningBtn) {
      closeBonusOpeningBtn.addEventListener('click', () => this.hideBonusOpeningPanel());
    }

    // Keyboard navigation for bonus opening panel
    document.addEventListener('keydown', (e) => {
      const bonusOpeningPanel = document.getElementById('bonus-opening-panel');
      if (bonusOpeningPanel && bonusOpeningPanel.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.navigateToPreviousBonus();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.navigateToNextBonus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.hideBonusOpeningPanel();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // Move to next bonus after entering payout
          this.navigateToNextBonus();
        }
      }
    });

    // Start money and stop money inputs for stats bar
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    const actualBalanceInput = document.getElementById('actual-balance-input');
    const totalSpentInput = document.getElementById('total-spent-input');
    
    // Comprehensive input event listeners for all balance-related inputs
    const balanceInputs = [startMoneyInput, stopMoneyInput, actualBalanceInput, totalSpentInput];
    
    balanceInputs.forEach(input => {
      if (input) {
        // Add multiple event types to catch all changes
        ['input', 'change', 'keyup', 'paste', 'cut'].forEach(eventType => {
          input.addEventListener(eventType, () => {
            // Small delay to ensure DOM is updated for paste/cut events
            setTimeout(() => {
              this.updateStatsBar();
              // Also trigger calculator update if available
              if (window.bonusHuntUI) {
                window.bonusHuntUI.onBonusDataChanged();
              }
            }, 10);
          });
        });
        
        // Also listen for focus/blur events
        input.addEventListener('blur', () => {
          this.updateStatsBar();
          if (window.bonusHuntUI) {
            window.bonusHuntUI.onBonusDataChanged();
          }
        });
      }
    });

    // Slot image URL button
    const slotImgUrlBtn = document.getElementById('slot-img-url-btn');
    if (slotImgUrlBtn) {
      slotImgUrlBtn.addEventListener('click', () => this.toggleSlotImageUrlInput());
    }

    // Slot image URL input
    const slotImgUrlInput = document.getElementById('slot-img-url-input');
    if (slotImgUrlInput) {
      slotImgUrlInput.addEventListener('blur', () => this.saveCustomSlotImage());
      slotImgUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.saveCustomSlotImage();
        }
      });
    }

    // Add slot button (+Slot button)
    const addSlotBtn = document.getElementById('add-slot-btn');
    if (addSlotBtn) {
      addSlotBtn.addEventListener('click', () => this.addBonus());
    }

    // Modern panel event listeners
    this.setupModernPanelEventListeners();
  }

  handleSlotNameInput() {
    const slotNameInput = document.getElementById('slot-name-input');
    const suggestionBox = document.querySelector('.slot-suggestion-box');
    
    if (!slotNameInput || !suggestionBox) return;

    const value = slotNameInput.value.trim();
    if (value.length < 3) {
      suggestionBox.style.display = 'none';
      return;
    }

    let matches = [];
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      matches = window.slotDatabase
        .filter(slot => slot.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
    }

    if (matches.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }

    suggestionBox.innerHTML = '';
    matches.forEach(slot => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <img src="${slot.image}" alt="${slot.name}" class="suggestion-image">
        <div class="suggestion-info">
          <div class="suggestion-name">${slot.name}</div>
          <div class="suggestion-provider">${slot.provider}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        slotNameInput.value = slot.name;
        suggestionBox.style.display = 'none';
        this.showSelectedSlot(slot);
        
        const betSizeInput = document.getElementById('bet-size-input');
        if (betSizeInput) {
          setTimeout(() => betSizeInput.focus(), 100);
        }
      });
      
      suggestionBox.appendChild(item);
    });

    suggestionBox.style.display = 'block';
  }

  handleModernSlotNameInput() {
    const slotNameInput = document.getElementById('modern-slot-name-input');
    const suggestionBox = document.querySelector('.modern-grid-container .slot-suggestion-box');
    
    if (!slotNameInput || !suggestionBox) return;

    const value = slotNameInput.value.trim();
    if (value.length < 3) {
      suggestionBox.style.display = 'none';
      return;
    }

    let matches = [];
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      matches = window.slotDatabase
        .filter(slot => slot.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
    }

    if (matches.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }

    suggestionBox.innerHTML = '';
    matches.forEach(slot => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <img src="${slot.image}" alt="${slot.name}" class="suggestion-image">
        <div class="suggestion-info">
          <div class="suggestion-name">${slot.name}</div>
          <div class="suggestion-provider">${slot.provider}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        slotNameInput.value = slot.name;
        suggestionBox.style.display = 'none';
        
        const betSizeInput = document.getElementById('modern-bet-size-input');
        if (betSizeInput) {
          setTimeout(() => betSizeInput.focus(), 100);
        }
      });
      
      suggestionBox.appendChild(item);
    });

    suggestionBox.style.display = 'block';
  }

  showSelectedSlot(slot) {
    const selectedSlotDisplay = document.querySelector('.selected-slot-display');
    if (selectedSlotDisplay) {
      selectedSlotDisplay.innerHTML = `
        <div class="selected-slot-content">
          <img src="${slot.image}" alt="${slot.name}" class="selected-slot-image">
          <div class="selected-slot-info">
            <div class="selected-slot-name">${slot.name}</div>
            <div class="selected-slot-provider">${slot.provider}</div>
          </div>
        </div>
      `;
      selectedSlotDisplay.style.display = 'block';
    }
  }

  hideSelectedSlot() {
    const selectedSlotDisplay = document.querySelector('.selected-slot-display');
    if (selectedSlotDisplay) {
      selectedSlotDisplay.style.display = 'none';
    }
  }

  toggleSlotImageUrlInput() {
    const slotImgUrlRow = document.getElementById('slot-img-url-row');
    const slotImgUrlInput = document.getElementById('slot-img-url-input');
    const slotNameInput = document.getElementById('slot-name-input');
    
    if (!slotImgUrlRow || !slotImgUrlInput) return;
    
    const slotName = slotNameInput ? slotNameInput.value.trim() : '';
    
    if (slotImgUrlRow.style.display === 'none') {
      slotImgUrlRow.style.display = 'block';
      // Pre-fill with existing custom image if available
      if (slotName && this.customSlotImages[slotName.toLowerCase()]) {
        slotImgUrlInput.value = this.customSlotImages[slotName.toLowerCase()];
      }
      slotImgUrlInput.focus();
    } else {
      slotImgUrlRow.style.display = 'none';
      slotImgUrlInput.value = '';
    }
  }

  saveCustomSlotImage() {
    const slotNameInput = document.getElementById('slot-name-input');
    const slotImgUrlInput = document.getElementById('slot-img-url-input');
    const slotImgUrlRow = document.getElementById('slot-img-url-row');
    
    if (!slotNameInput || !slotImgUrlInput) return;
    
    const slotName = slotNameInput.value.trim();
    const imageUrl = slotImgUrlInput.value.trim();
    
    if (!slotName) {
      this.showFeedback('Please enter a slot name first', 'error');
      return;
    }
    
    if (imageUrl) {
      this.customSlotImages[slotName.toLowerCase()] = imageUrl;
      this.showFeedback(`Custom image saved for ${slotName}`, 'success');
    } else {
      // Remove custom image if URL is empty
      delete this.customSlotImages[slotName.toLowerCase()];
    }
    
    // Save custom images to localStorage
    this.saveBonuses();
    
    // Hide the input row
    if (slotImgUrlRow) {
      slotImgUrlRow.style.display = 'none';
    }
  }

  handleSuperCheckbox() {
    const superCheckbox = document.getElementById('super-checkbox');
    const slotNameInput = document.getElementById('slot-name-input');
    
    if (superCheckbox && superCheckbox.checked && slotNameInput) {
      slotNameInput.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
      slotNameInput.style.color = '#000';
      slotNameInput.setAttribute('placeholder', 'SUPER BONUS - Enter slot name');
    } else if (slotNameInput) {
      slotNameInput.style.background = '';
      slotNameInput.style.color = '';
      slotNameInput.setAttribute('placeholder', 'Enter slot name');
    }
  }

  addBonus() {
    const slotNameInput = document.getElementById('slot-name-input');
    const betSizeInput = document.getElementById('bet-size-input');
    const superCheckbox = document.getElementById('super-checkbox');
    
    if (!slotNameInput || !betSizeInput) return;

    const slotName = slotNameInput.value.trim();
    const betSize = parseFloat(betSizeInput.value);

    if (!slotName || !betSize || betSize <= 0) {
      this.showFeedback('Please enter valid slot name and bet size', 'error');
      return;
    }

    const bonus = {
      id: Date.now(),
      slot: slotName,
      bet: betSize,
      payout: null,
      multiplier: 0,
      isSuper: superCheckbox ? superCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };

    this.bonuses.push(bonus);
    this.updateTotals();
    this.renderBonusList();
    this.saveBonuses();

    // Clear inputs
    slotNameInput.value = '';
    betSizeInput.value = '';
    if (superCheckbox) superCheckbox.checked = false;
    this.handleSuperCheckbox();
    this.hideSelectedSlot();

    slotNameInput.focus();
    this.showFeedback(`Added ${slotName} - €${betSize.toFixed(2)}`, 'success');
  }

  getSlotImage(slotName) {
    // First check if there's a custom image URL
    if (this.customSlotImages[slotName.toLowerCase()]) {
      return this.customSlotImages[slotName.toLowerCase()];
    }
    
    // Then check the slot database
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      const slot = window.slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
      return slot ? slot.image : 'https://i.imgur.com/8E3ucNx.png';
    }
    return 'https://i.imgur.com/8E3ucNx.png';
  }

  renderBonusList() {
    this.renderBonusCard('#bonus-list-classic');
    this.renderBonusCard('#bonus-list-modern');
    this.renderModernSidebar();
    this.updateBonusListCarousel();
  }

  renderBonusCard(cardSelector) {
    const bonusCard = document.querySelector(cardSelector);
    const bonusListUl = bonusCard ? bonusCard.querySelector('ul') : null;
    const emptyState = bonusCard ? bonusCard.querySelector('.empty-state') : null;
    
    if (!bonusListUl) return;

    bonusListUl.innerHTML = '';

    if (this.bonuses.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    this.bonuses.forEach(bonus => {
      const li = document.createElement('li');
      li.className = `bonus-item${bonus.isSuper ? ' super-slot' : ''}`;
      li.dataset.bonusId = bonus.id;
      
      const slotImage = this.getSlotImage(bonus.slot);
      
      li.innerHTML = `
        <div class="bonus-content">
          <img src="${slotImage}" alt="${bonus.slot}" class="bonus-slot-image">
          <div class="bonus-info-section">
            <div class="bonus-slot-name">${bonus.slot}</div>
            <div class="bonus-metrics">
              <div class="metric-item">
                <div class="metric-value">€${bonus.bet.toFixed(2)}</div>
                <div class="metric-label">BET</div>
              </div>
              <div class="metric-item">
                <div class="metric-value payout-value ${bonus.payout !== null ? 'completed' : 'pending'}">
                  ${bonus.payout !== null ? '€' + bonus.payout.toFixed(2) : '--'}
                </div>
                <div class="metric-label">WIN</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">${bonus.multiplier.toFixed(2)}x</div>
                <div class="metric-label">MULT</div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add click handler to toggle super status
      li.addEventListener('click', () => {
        this.toggleSuperStatus(bonus.id);
      });

      bonusListUl.appendChild(li);
    });
  }

  updateBonusListCarousel() {
    this.updateCarouselForCard('#bonus-list-classic', 'classic');
    this.updateCarouselForCard('#bonus-list-modern', 'modern');
  }

  updateCarouselForCard(cardSelector, layoutType) {
    const bonusCard = document.querySelector(cardSelector);
    const bonusListUl = bonusCard ? bonusCard.querySelector('ul') : null;
    
    if (!bonusListUl) return;

    // Remove existing clones first
    const existingClones = bonusListUl.querySelectorAll('.bonus-item-clone');
    existingClones.forEach(clone => clone.remove());

    if (this.bonuses.length > 2) {
      // Get original items (not clones)
      const originalItems = Array.from(bonusListUl.querySelectorAll('.bonus-item:not(.bonus-item-clone)'));
      
      if (layoutType === 'modern') {
        // Modern layout: Create seamless infinite scroll
        const cloneSet = originalItems.map(item => {
          const clone = item.cloneNode(true);
          clone.classList.add('bonus-item-clone');
          return clone;
        });
        
        // Append clones for seamless loop
        cloneSet.forEach(clone => bonusListUl.appendChild(clone));
        
        bonusListUl.classList.add('carousel-active');
        
        // Calculate duration for modern layout (smoother, longer)
        const duration = Math.max(15, originalItems.length * 2.5);
        bonusListUl.style.animationDuration = `${duration}s`;
      } else {
        // Classic layout: Original implementation
        const firstCloneSet = originalItems.map(item => {
          const clone = item.cloneNode(true);
          clone.classList.add('bonus-item-clone');
          return clone;
        });
        
        const secondCloneSet = originalItems.map(item => {
          const clone = item.cloneNode(true);
          clone.classList.add('bonus-item-clone');
          return clone;
        });
        
        firstCloneSet.forEach(clone => bonusListUl.appendChild(clone));
        secondCloneSet.forEach(clone => bonusListUl.appendChild(clone));
        
        bonusListUl.classList.add('carousel-active');
        
        const duration = originalItems.length * 3;
        bonusListUl.style.animationDuration = `${duration}s`;
      }
    } else {
      bonusListUl.classList.remove('carousel-active');
      bonusListUl.style.animationDuration = '';
    }
  }

  updateActiveSlotInModernSidebar() {
    const modernBonusItems = document.getElementById('modern-bonus-items');
    if (!modernBonusItems) return;

    // Remove active class from all items
    modernBonusItems.querySelectorAll('.modern-bonus-item').forEach(item => {
      item.classList.remove('active-slot');
    });

    // Add active class to current bonus if we're entering payout
    if (this.currentBonusIndex !== null && this.isEnteringPayout) {
      const activeItems = modernBonusItems.querySelectorAll(`[data-index="${this.currentBonusIndex}"]`);
      activeItems.forEach(item => {
        item.classList.add('active-slot');
      });

      // Pause animation when showing active slot
      modernBonusItems.style.animationPlayState = 'paused';
      
      // Update preview window
      this.updateModernSlotPreview();
    } else {
      // Resume animation when not showing active slot
      modernBonusItems.style.animationPlayState = 'running';
      
      // Hide preview window
      this.hideModernSlotPreview();
    }
  }

  updateModernSlotPreview() {
    const previewWindow = document.getElementById('modern-slot-preview');
    const previewImage = document.getElementById('preview-slot-image');
    const previewName = document.getElementById('preview-slot-name');
    const previewBet = document.getElementById('preview-slot-bet');
    const previewCounter = document.getElementById('preview-slot-counter');
    
    if (!previewWindow || this.currentBonusIndex === null || !this.bonuses[this.currentBonusIndex]) {
      return;
    }
    
    const currentBonus = this.bonuses[this.currentBonusIndex];
    const slotImage = this.getSlotImage(currentBonus.slot);
    const bet = parseFloat(currentBonus.bet) || 0;
    
    // Show and update preview window
    previewWindow.style.display = 'block';
    previewImage.src = slotImage;
    previewImage.onerror = function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDEwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTQwIiByeD0iMTIiIGZpbGw9InVybCgjZ3JhZGllbnQwXzFfMSkiLz4KPHN2ZyB4PSIzMCIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA8LjI2TDEyIDJaIiBmaWxsPSIjOTM0NkZGIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4KPGR4ZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCIgeTI9IjE0MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjOTM0NkZGIiBzdG9wLW9wYWNpdHk9IjAuMiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxOTE5MjgiIHN0b3Atb3BhY2l0eT0iMC44Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==';
    };
    previewName.textContent = currentBonus.slot || 'Unknown Slot';
    previewBet.textContent = `€${bet.toFixed(2)}`;
    previewCounter.textContent = `${this.currentBonusOpeningIndex + 1}/${this.bonuses.length}`;
  }

  hideModernSlotPreview() {
    const previewWindow = document.getElementById('modern-slot-preview');
    if (previewWindow) {
      previewWindow.style.display = 'none';
    }
  }

  renderModernSidebar() {
    const modernBonusItems = document.getElementById('modern-bonus-items');
    if (!modernBonusItems) return;

    modernBonusItems.innerHTML = '';

    if (this.bonuses.length === 0) {
      modernBonusItems.innerHTML = `
        <div class="empty-state-modern">
          <div class="empty-icon">🎰</div>
          <div class="empty-text">No bonuses yet</div>
          <div class="empty-subtext">Add slots to get started</div>
        </div>
      `;
      return;
    }

    // Create items for seamless loop (duplicate items)
    const itemsToRender = [...this.bonuses, ...this.bonuses];

    itemsToRender.forEach((bonus, index) => {
      const actualIndex = index >= this.bonuses.length ? index - this.bonuses.length : index;
      const bonusItem = document.createElement('div');
      bonusItem.className = `modern-bonus-item${bonus.isSuper ? ' super-slot' : ''}`;
      bonusItem.dataset.bonusId = bonus.id;
      bonusItem.dataset.index = actualIndex;
      
      const slotImage = this.getSlotImage(bonus.slot);
      const bet = parseFloat(bonus.bet) || 0;
      const win = bonus.payout !== null ? parseFloat(bonus.payout) : 0;
      const multiplier = bonus.multiplier || 0;
      
      bonusItem.innerHTML = `
        <img src="${slotImage}" alt="${bonus.slot}" class="modern-slot-image" 
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQwXzFfMSkiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTM0NkZGIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4KPGR4ZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjcwIiB5Mj0iNzAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzkzNDZGRiIgc3RvcC1vcGFjaXR5PSIwLjIiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuOCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=';">
        <div class="modern-slot-info">
          <div class="modern-slot-bet">€${bet.toFixed(2)}</div>
          <div class="modern-slot-win">${win > 0 ? '€' + win.toFixed(2) : '--'}</div>
          <div class="modern-slot-mult">${multiplier.toFixed(2)}x</div>
        </div>
      `;

      // Add click handler to edit bonus
      bonusItem.addEventListener('click', () => {
        this.editBonus(actualIndex);
      });

      modernBonusItems.appendChild(bonusItem);
    });

    // Update modern sidebar carousel
    this.updateModernSidebarCarousel();
  }

  updateModernSidebarCarousel() {
    const modernBonusItems = document.getElementById('modern-bonus-items');
    if (!modernBonusItems || this.bonuses.length <= 3) {
      if (modernBonusItems) {
        modernBonusItems.classList.remove('carousel-active');
        modernBonusItems.style.animationDuration = '';
      }
      return;
    }

    // Clone items for seamless loop
    const originalItems = Array.from(modernBonusItems.querySelectorAll('.modern-bonus-item:not(.bonus-item-clone)'));
    const existingClones = modernBonusItems.querySelectorAll('.bonus-item-clone');
    existingClones.forEach(clone => clone.remove());

    const cloneSet = originalItems.map(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('bonus-item-clone');
      return clone;
    });

    cloneSet.forEach(clone => modernBonusItems.appendChild(clone));
    
    modernBonusItems.classList.add('carousel-active');
    const duration = Math.max(20, originalItems.length * 3);
    modernBonusItems.style.animationDuration = `${duration}s`;
  }

  updateModernSidebarStats() {
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    const actualBalanceInput = document.getElementById('actual-balance-input');
    
    const startMoney = startMoneyInput ? parseFloat(startMoneyInput.value) || 0 : 0;
    const stopMoney = stopMoneyInput ? parseFloat(stopMoneyInput.value) || 0 : 0;
    const actualBalance = actualBalanceInput ? parseFloat(actualBalanceInput.value) || 0 : 0;
    
    console.log('🔄 Updating modern stats:', { startMoney, stopMoney, actualBalance });
    
    // Update modern sidebar statistics
    this.updateModernStatElement('modern-stat-start', `€${startMoney.toFixed(2)}`);
    this.updateModernStatElement('modern-stat-target', `€${stopMoney.toFixed(2)}`);
    this.updateModernStatElement('modern-stat-current', `€${actualBalance.toFixed(2)}`);
    
    const totalSpent = startMoney - actualBalance;
    this.updateModernStatElement('modern-stat-spent', `€${totalSpent.toFixed(2)}`);
    
    const profit = actualBalance + this.totalPayout - startMoney;
    const profitElement = document.getElementById('modern-stat-profit');
    if (profitElement) {
      profitElement.textContent = `€${profit.toFixed(2)}`;
      profitElement.style.color = profit >= 0 ? '#00ffb8' : '#ff5c5c';
    }
    
    this.updateModernStatElement('modern-stat-bonuses', this.bonuses.length.toString());
    
    const avgX = this.totalBet > 0 ? (this.totalPayout / this.totalBet) : 0;
    this.updateModernStatElement('modern-stat-avg-mult', `${avgX.toFixed(2)}x`);
    
    const reqX = this.totalBet > 0 ? (this.totalBet / (this.totalBet - this.totalPayout + this.totalBet)) : 0;
    this.updateModernStatElement('modern-stat-req-mult', `${reqX.toFixed(2)}x`);
    
    // Best and worst slots
    if (this.bonuses.length > 0) {
      const bestBonus = this.bonuses.reduce((best, bonus) => {
        return (bonus.payout || 0) > (best.payout || 0) ? bonus : best;
      });
      
      this.updateModernStatElement('modern-stat-best', bestBonus.slot);
      this.updateModernStatElement('modern-stat-best-value', `€${(bestBonus.payout || 0).toFixed(2)}`);
      
      const openedBonuses = this.bonuses.filter(b => b.payout && b.payout > 0);
      if (openedBonuses.length > 0) {
        const worstBonus = openedBonuses.reduce((worst, bonus) => {
          return (bonus.payout || 0) < (worst.payout || 0) ? bonus : worst;
        });
        
        this.updateModernStatElement('modern-stat-worst', worstBonus.slot);
        this.updateModernStatElement('modern-stat-worst-value', `€${worstBonus.payout.toFixed(2)}`);
      } else {
        this.updateModernStatElement('modern-stat-worst', '--');
        this.updateModernStatElement('modern-stat-worst-value', '€0.00');
      }
    } else {
      this.updateModernStatElement('modern-stat-best', '--');
      this.updateModernStatElement('modern-stat-best-value', '€0.00');
      this.updateModernStatElement('modern-stat-worst', '--');
      this.updateModernStatElement('modern-stat-worst-value', '€0.00');
    }
  }

  updateModernStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }

  syncPanelInputs() {
    // Sync values from classic to modern panels
    const classicInputs = {
      'start-money-input': 'modern-start-money-input',
      'stop-money-input': 'modern-stop-money-input',
      'actual-balance-input': 'modern-actual-balance-input',
      'total-spent-input': 'modern-total-spent-input',
      'slot-name-input': 'modern-slot-name-input',
      'bet-size-input': 'modern-bet-size-input',
      'slot-img-url-input': 'modern-slot-img-url-input'
    };
    
    const classicCheckboxes = {
      'super-checkbox': 'modern-super-checkbox'
    };
    
    // Sync input values
    Object.keys(classicInputs).forEach(classicId => {
      const classicInput = document.getElementById(classicId);
      const modernInput = document.getElementById(classicInputs[classicId]);
      
      if (classicInput && modernInput) {
        modernInput.value = classicInput.value;
      }
    });
    
    // Sync checkbox values
    Object.keys(classicCheckboxes).forEach(classicId => {
      const classicCheckbox = document.getElementById(classicId);
      const modernCheckbox = document.getElementById(classicCheckboxes[classicId]);
      
      if (classicCheckbox && modernCheckbox) {
        modernCheckbox.checked = classicCheckbox.checked;
      }
    });
  }

  toggleSuperStatus(bonusId) {
    const bonus = this.bonuses.find(b => b.id === bonusId);
    if (bonus) {
      bonus.isSuper = !bonus.isSuper;
      this.renderBonusList();
      this.showFeedback(bonus.isSuper ? 'Super bonus activated!' : 'Super bonus deactivated', bonus.isSuper ? 'success' : 'info');
    }
  }

  showBonusOpeningPanel() {
    if (this.currentLayout === 'modern-sidebar') {
      this.showModernBonusOpeningPanel();
      return;
    }
    
    const middlePanel = document.getElementById('middle-panel');
    const bonusOpeningPanel = document.getElementById('bonus-opening-panel');
    
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to open! Add bonuses first.', 'error');
      return;
    }

    // Reset to first bonus when opening panel
    this.currentBonusOpeningIndex = 0;
    this.currentBonusIndex = 0;
    this.isEnteringPayout = true;

    if (middlePanel) middlePanel.style.display = 'none';
    if (bonusOpeningPanel) {
      bonusOpeningPanel.style.display = 'flex';
      this.makeBonusOpeningPanelDraggable(bonusOpeningPanel);
      this.renderBonusOpeningList();
    }

    // Update active slot in modern sidebar if visible
    this.updateActiveSlotInModernSidebar();
  }

  hideBonusOpeningPanel() {
    // Clear active slot tracking
    this.currentBonusIndex = null;
    this.isEnteringPayout = false;
    this.updateActiveSlotInModernSidebar();
    
    if (this.currentLayout === 'modern-sidebar') {
      this.hideModernBonusOpeningPanel();
      return;
    }
    
    const middlePanel = document.getElementById('middle-panel');
    const bonusOpeningPanel = document.getElementById('bonus-opening-panel');
    
    if (middlePanel) middlePanel.style.display = 'flex';
    if (bonusOpeningPanel) bonusOpeningPanel.style.display = 'none';
  }

  renderBonusOpeningList() {
    const bonusOpeningList = document.getElementById('bonus-opening-list');
    if (!bonusOpeningList) return;

    // Ensure current index is valid
    if (this.currentBonusOpeningIndex >= this.bonuses.length) {
      this.currentBonusOpeningIndex = 0;
    }

    if (this.bonuses.length === 0) return;

    const bonus = this.bonuses[this.currentBonusOpeningIndex];
    const slotImage = this.getSlotImage(bonus.slot);
    
    bonusOpeningList.innerHTML = `
      <div class="bonus-opening-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px;">
        <button class="bonus-nav-btn" id="prev-bonus-btn" ${this.bonuses.length <= 1 ? 'style="visibility: hidden;"' : ''} style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">
          ← Previous
        </button>
        <div class="bonus-counter" style="color: #ffffff; font-size: 14px; font-weight: 700; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
          ${this.currentBonusOpeningIndex + 1} of ${this.bonuses.length}
        </div>
        <button class="bonus-nav-btn" id="next-bonus-btn" ${this.bonuses.length <= 1 ? 'style="visibility: hidden;"' : ''} style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">
          Next →
        </button>
      </div>
      
      <div class="bonus-opening-item" style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <div class="bonus-slot-display" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <img src="${slotImage}" alt="${bonus.slot}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
          <div style="text-align: center;">
            <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 2px;">${bonus.slot}</div>
            <div style="font-size: 13px; color: #00e1ff; font-weight: 600;">Bet: €${bonus.bet.toFixed(2)}</div>
          </div>
        </div>
        <div class="payout-input-section" style="display: flex; align-items: center; gap: 8px;">
          <input type="number" 
                 class="payout-input" 
                 placeholder="Enter payout" 
                 value="${bonus.payout !== null ? bonus.payout : ''}"
                 min="0" 
                 step="0.01"
                 data-bonus-id="${bonus.id}"
                 style="width: 160px; padding: 8px 12px; font-size: 16px; font-weight: 600; background: rgba(255,255,255,0.1); border: 2px solid #00e1ff; border-radius: 6px; color: #ffffff; text-align: center;">
          <span style="color: #9ca3af; font-size: 16px; font-weight: 600;">€</span>
        </div>
      </div>
    `;

    // Set up navigation event listeners
    const prevBtn = document.getElementById('prev-bonus-btn');
    const nextBtn = document.getElementById('next-bonus-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateToPreviousBonus());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateToNextBonus());
      nextBtn.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
      });
      nextBtn.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
      });
      prevBtn.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    }

    // Set up comprehensive payout input listeners
    const payoutInput = bonusOpeningList.querySelector('.payout-input');
    if (payoutInput) {
      // Add multiple event types to catch all payout changes
      const payoutEventTypes = ['input', 'change', 'keyup', 'paste', 'blur'];
      
      payoutEventTypes.forEach(eventType => {
        payoutInput.addEventListener(eventType, (e) => {
          const newPayout = parseFloat(e.target.value) || 0;
          console.log(`Payout input ${eventType} event: ${newPayout}`);
          
          // Small delay for paste events to ensure value is set
          setTimeout(() => {
            this.updateBonusPayout(bonus.id, newPayout);
          }, eventType === 'paste' ? 50 : 10);
        });
      });
      
      // Also listen for Enter key to move to next bonus
      payoutInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const newPayout = parseFloat(e.target.value) || 0;
          this.updateBonusPayout(bonus.id, newPayout);
          // Move to next bonus after a short delay
          setTimeout(() => {
            this.navigateToNextBonus();
          }, 100);
        }
      });
      
      // Auto-focus and select text for easier input
      setTimeout(() => {
        payoutInput.focus();
        payoutInput.select();
      }, 100);
    }
  }

  navigateToNextBonus() {
    if (this.bonuses.length <= 1) return;
    
    this.currentBonusOpeningIndex = (this.currentBonusOpeningIndex + 1) % this.bonuses.length;
    this.currentBonusIndex = this.currentBonusOpeningIndex;
    this.renderBonusOpeningList();
    this.updateActiveSlotInModernSidebar();
  }

  navigateToPreviousBonus() {
    if (this.bonuses.length <= 1) return;
    
    this.currentBonusOpeningIndex = this.currentBonusOpeningIndex === 0 
      ? this.bonuses.length - 1 
      : this.currentBonusOpeningIndex - 1;
    this.currentBonusIndex = this.currentBonusOpeningIndex;
    this.renderBonusOpeningList();
    this.updateActiveSlotInModernSidebar();
  }

  makeBonusOpeningPanelDraggable(panel) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // Add drag cursor to the panel header
    const panelTitle = panel.querySelector('.middle-panel-title');
    if (panelTitle) {
      panelTitle.style.cursor = 'move';
      panelTitle.style.userSelect = 'none';
    }

    const handleMouseDown = (e) => {
      // Only allow dragging from the title bar
      if (!e.target.classList.contains('middle-panel-title')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = panel.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      panel.style.position = 'fixed';
      panel.style.left = initialX + 'px';
      panel.style.top = initialY + 'px';
      panel.style.transform = 'none';
      panel.style.zIndex = '9999';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newX = initialX + deltaX;
      const newY = initialY + deltaY;
      
      // Keep within screen bounds
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      
      panel.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
      panel.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    panel.addEventListener('mousedown', handleMouseDown);
  }

  updateBonusPayout(bonusId, payout) {
    const bonus = this.bonuses.find(b => b.id === bonusId);
    if (bonus) {
      const oldPayout = bonus.payout;
      bonus.payout = payout;
      bonus.multiplier = bonus.bet > 0 ? payout / bonus.bet : 0;
      
      console.log(`Payout updated for ${bonus.slot}: ${oldPayout} -> ${payout} (${bonus.multiplier.toFixed(2)}x)`);
      
      this.updateTotals();
      this.renderBonusList();
      this.saveBonuses(); // Save immediately when payout changes
      
      // Force comprehensive statistics refresh
      this.refreshAllStatistics();
      
      // Trigger calculator update immediately
      if (window.bonusHuntUI) {
        setTimeout(() => {
          console.log('Triggering calculator update after payout change');
          window.bonusHuntUI.onBonusDataChanged();
        }, 50);
      }
    }
  }

  removeBonus(bonusId) {
    this.bonuses = this.bonuses.filter(bonus => bonus.id !== bonusId);
    this.updateTotals();
    this.renderBonusList();
    this.saveBonuses();
    this.showFeedback('Bonus removed', 'info');
  }

  updateTotals() {
    this.totalBet = this.bonuses.reduce((sum, bonus) => sum + bonus.bet, 0);
    this.totalPayout = this.bonuses.reduce((sum, bonus) => sum + (bonus.payout || 0), 0);

    // Update UI
    const totalBetDisplay = document.getElementById('total-bet');
    const totalPayoutDisplay = document.getElementById('total-payout');
    const totalProfitDisplay = document.getElementById('total-profit');

    if (totalBetDisplay) totalBetDisplay.textContent = `€${this.totalBet.toFixed(2)}`;
    if (totalPayoutDisplay) totalPayoutDisplay.textContent = `€${this.totalPayout.toFixed(2)}`;
    if (totalProfitDisplay) {
      const profit = this.totalPayout - this.totalBet;
      totalProfitDisplay.textContent = `€${profit.toFixed(2)}`;
      totalProfitDisplay.className = profit >= 0 ? 'profit-positive' : 'profit-negative';
    }

    // Update stats bar
    this.updateStatsBar();
    
    // Trigger calculator update if available
    if (window.bonusHuntUI) {
      window.bonusHuntUI.onBonusDataChanged();
    }
    
    // Force immediate statistics refresh
    this.refreshAllStatistics();
    
    // Always update modern sidebar stats (regardless of current layout)
    this.updateModernSidebarStats();
    
    // Debug logging for totals update
    console.log('Totals updated:', {
      totalBet: this.totalBet,
      totalPayout: this.totalPayout,
      profit: this.totalPayout - this.totalBet,
      bonusCount: this.bonuses.length,
      openedBonuses: this.bonuses.filter(b => b.payout && b.payout > 0).length
    });
  }

  updateStatsBar() {
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    const actualBalanceInput = document.getElementById('actual-balance-input');
    const totalSpentInput = document.getElementById('total-spent-input');
    
    // Update new stats panel
    const statStart = document.getElementById('bh-stat-start');
    const statTarget = document.getElementById('bh-stat-target');
    const statCurrent = document.getElementById('bh-stat-current');
    const statSpent = document.getElementById('bh-stat-spent');
    const statProfit = document.getElementById('bh-stat-profit');
    const statBest = document.getElementById('bh-stat-best');
    const statBestValue = document.getElementById('bh-stat-best-value');
    const statWorst = document.getElementById('bh-stat-worst');
    const statWorstValue = document.getElementById('bh-stat-worst-value');
    const statCount = document.getElementById('bh-stat-count');
    const statAvgX = document.getElementById('bh-stat-avgx');
    const statReqX = document.getElementById('bh-stat-reqx');

    // START: Current money from start money input
    const startMoney = startMoneyInput ? parseFloat(startMoneyInput.value) || 0 : 0;
    const stopMoney = stopMoneyInput ? parseFloat(stopMoneyInput.value) || 0 : 0;
    const actualBalance = actualBalanceInput ? parseFloat(actualBalanceInput.value) || 0 : 0;
    
    if (statStart) statStart.textContent = `€${startMoney.toFixed(2)}`;
    if (statTarget) statTarget.textContent = `€${stopMoney.toFixed(2)}`;
    
    // Total spent (start money - actual balance)
    const totalSpent = startMoney - actualBalance;
    if (totalSpentInput) totalSpentInput.value = totalSpent.toFixed(2);
    if (statSpent) statSpent.textContent = `€${totalSpent.toFixed(2)}`;
    
    // Current balance from input
    if (statCurrent) statCurrent.textContent = `€${actualBalance.toFixed(2)}`;
    
    // Profit/Loss (actual balance + total payout - start money)
    const profit = actualBalance + this.totalPayout - startMoney;
    if (statProfit) {
      statProfit.textContent = `€${profit.toFixed(2)}`;
      statProfit.style.color = profit >= 0 ? '#00ffb8' : '#ff5c5c';
    }
    
    // Total bonuses count
    if (statCount) statCount.textContent = this.bonuses.length.toString();

    // BEST & WORST: Highest and lowest paying slots
    if (this.bonuses.length > 0) {
      // Find best bonus
      const bestBonus = this.bonuses.reduce((best, bonus) => {
        return (bonus.payout || 0) > (best.payout || 0) ? bonus : best;
      });
      
      if (bestBonus.payout && bestBonus.payout > 0) {
        if (statBest) statBest.textContent = bestBonus.slotName;
        if (statBestValue) statBestValue.textContent = `€${bestBonus.payout.toFixed(2)}`;
      } else {
        if (statBest) statBest.textContent = '--';
        if (statBestValue) statBestValue.textContent = '€0.00';
      }

      // Find worst bonus (only among opened bonuses with payout > 0)
      const openedBonuses = this.bonuses.filter(b => b.payout && b.payout > 0);
      if (openedBonuses.length > 0) {
        const worstBonus = openedBonuses.reduce((worst, bonus) => {
          return (bonus.payout || 0) < (worst.payout || 0) ? bonus : worst;
        });
        
        if (statWorst) statWorst.textContent = worstBonus.slotName;
        if (statWorstValue) statWorstValue.textContent = `€${worstBonus.payout.toFixed(2)}`;
      } else {
        if (statWorst) statWorst.textContent = '--';
        if (statWorstValue) statWorstValue.textContent = '€0.00';
      }
    } else {
      if (statBest) statBest.textContent = '--';
      if (statBestValue) statBestValue.textContent = '€0.00';
      if (statWorst) statWorst.textContent = '--';
      if (statWorstValue) statWorstValue.textContent = '€0.00';
    }

    // AVG X: Average multiplier (total payout / total bet)
    const avgX = this.totalBet > 0 ? (this.totalPayout / this.totalBet) : 0;
    if (statAvgX) statAvgX.textContent = `${avgX.toFixed(2)}x`;

    // REQ X: Required multiplier to break even
    const reqX = this.totalBet > 0 ? (this.totalBet / (this.totalBet - this.totalPayout + this.totalBet)) : 0;
    if (statReqX) statReqX.textContent = `${reqX.toFixed(2)}x`;
    
    // Also update modern sidebar stats
    this.updateModernSidebarStats();
  }

  clearAllBonuses() {
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to clear', 'info');
      return;
    }

    if (confirm('Are you sure you want to clear all bonuses?')) {
      this.bonuses = [];
      this.updateTotals();
      this.renderBonusList();
      this.saveBonuses();
      this.showFeedback('All bonuses cleared', 'success');
    }
  }

  exportBonuses() {
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to export', 'info');
      return;
    }

    const exportData = {
      bonuses: this.bonuses,
      totals: {
        totalBet: this.totalBet,
        totalPayout: this.totalPayout,
        profit: this.totalPayout - this.totalBet
      },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bonus-hunt-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showFeedback('Bonuses exported', 'success');
  }

  saveBonuses() {
    // Save bonuses to localStorage for the overlay page to access
    try {
      const data = {
        bonuses: this.bonuses,
        totalBet: this.totalBet,
        totalPayout: this.totalPayout,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('bonusHuntData', JSON.stringify(data));
      
      // Also save custom slot images
      localStorage.setItem('customSlotImages', JSON.stringify(this.customSlotImages));
    } catch (error) {
      console.error('Error saving bonuses:', error);
    }
  }

  loadSavedBonuses() {
    const saved = localStorage.getItem('bonusHuntData');
    if (saved) {
      try {
        this.bonuses = JSON.parse(saved);
        this.updateTotals();
        this.renderBonusList();
      } catch (error) {
        console.error('Error loading saved bonuses:', error);
      }
    }
  }



  refreshAllStatistics() {
    // Force refresh of all statistics whenever any input changes
    setTimeout(() => {
      if (window.bonusHuntUI) {
        console.log('Force refreshing all bonus hunt statistics...');
        window.bonusHuntUI.updateCalculatorFromInputs();
        window.bonusHuntUI.updateAllDisplays();
      }
    }, 50);
  }

  switchLayout(layout) {
    console.log('🔄 Switching layout to:', layout);
    this.currentLayout = layout;
    localStorage.setItem('bonusLayoutMode', layout);
    
    // Get all layout elements
    const classicCard = document.getElementById('bonus-list-classic');
    const modernCard = document.getElementById('bonus-list-modern');
    const modernSidebar = document.getElementById('modern-bonus-sidebar');
    const classicBHPanel = document.getElementById('middle-panel');
    const modernBHPanel = document.getElementById('modern-bh-panel');
    const classicBonusOpening = document.getElementById('bonus-opening-panel');
    const modernBonusOpening = document.getElementById('modern-bonus-opening-panel');
    const layoutSelect = document.getElementById('bonus-list-layout-select');
    
    console.log('📋 Classic elements found:', !!classicCard, !!classicBHPanel, !!classicBonusOpening);
    console.log('🎠 Modern card found:', !!modernCard);
    console.log('🎆 Modern sidebar elements found:', !!modernSidebar, !!modernBHPanel, !!modernBonusOpening);
    
    // Hide ALL layouts and panels first
    if (classicCard) {
      classicCard.style.display = 'none';
      console.log('🚫 Hid classic card');
    }
    if (modernCard) {
      modernCard.style.display = 'none';
      console.log('🚫 Hid modern card');
    }
    if (modernSidebar) {
      modernSidebar.style.display = 'none';
      console.log('🚫 Hid modern sidebar');
    }
    if (classicBHPanel) classicBHPanel.style.display = 'none';
    if (modernBHPanel) modernBHPanel.style.display = 'none';
    if (classicBonusOpening) classicBonusOpening.style.display = 'none';
    if (modernBonusOpening) modernBonusOpening.style.display = 'none';
    
    // Also hide the info panel which contains the classic bonus list
    const infoPanel = document.querySelector('.info-panel');
    const bonusStatsPanel = document.getElementById('bonus-stats-panel');
    if (infoPanel) {
      infoPanel.classList.remove('info-panel--visible');
      console.log('🚫 Hid info panel');
    }
    if (bonusStatsPanel) {
      bonusStatsPanel.style.display = 'none';
      console.log('🚫 Hid bonus stats panel');
    }
    
    // Show the selected layout
    if (layout === 'modern-card') {
      if (modernCard) {
        modernCard.style.display = 'block';
        console.log('✅ Showed modern card');
      }
      // Modern card uses classic panels (hidden until BH button clicked)
    } else if (layout === 'modern-sidebar') {
      // Modern sidebar starts hidden - only shows when BH button is clicked
      if (modernSidebar) {
        modernSidebar.style.display = 'none';
        console.log('🚫 Modern sidebar ready but hidden until BH button clicked');
      }
      if (modernBHPanel) {
        modernBHPanel.style.display = 'none';
        console.log('🚫 Modern BH panel ready but hidden until BH button clicked');
      }
      // Keep info panel hidden for modern sidebar
      const infoPanel = document.querySelector('.info-panel');
      if (infoPanel) {
        infoPanel.classList.remove('info-panel--visible');
        console.log('🚫 Keeping info panel hidden for modern sidebar');
      }
    } else {
      // Classic layout
      if (classicCard) {
        classicCard.style.display = 'block';
        console.log('✅ Showed classic card');
      }
      // Classic layout uses classic panels (hidden until BH button clicked)
    }
    
    // Update select dropdown if exists
    if (layoutSelect) {
      layoutSelect.value = layout;
      console.log('✅ Updated dropdown to:', layout);
    }
    
    // Sync input values between classic and modern panels
    this.syncPanelInputs();
    
    // Re-render to ensure all layouts are updated
    this.renderBonusList();
    this.updateModernSidebarStats();
    this.updateStatsBar(); // Force update of all statistics
    
    const layoutName = layout === 'modern-sidebar' ? 'Modern Sidebar' : 
                      layout === 'modern-card' ? 'Modern Card' : 'Classic';
    this.showFeedback(`Switched to ${layoutName} layout`, 'info');
    
    // Reset BH button state when layout changes
    const bhBtn = document.getElementById('bh-btn');
    if (bhBtn) {
      bhBtn.classList.remove('active');
      console.log('🔄 Reset BH button state for layout change');
    }
    
    // Update info panel visibility based on new layout
    if (window.bonusHuntUI && window.bonusHuntUI.updateInfoPanelVisibility) {
      setTimeout(() => {
        window.bonusHuntUI.updateInfoPanelVisibility();
      }, 100);
    }
    
    console.log('🏁 Layout switch complete');
  }

  hideAllPanelsOnInit() {
    // Ensure all panels are hidden when page loads
    const classicBHPanel = document.getElementById('middle-panel');
    const modernBHPanel = document.getElementById('modern-bh-panel');
    const modernSidebar = document.getElementById('modern-bonus-sidebar');
    const classicBonusOpening = document.getElementById('bonus-opening-panel');
    const modernBonusOpening = document.getElementById('modern-bonus-opening-panel');
    const infoPanel = document.querySelector('.info-panel');
    const bonusStatsPanel = document.getElementById('bonus-stats-panel');
    
    if (classicBHPanel) classicBHPanel.style.display = 'none';
    if (modernBHPanel) modernBHPanel.style.display = 'none';
    if (modernSidebar) modernSidebar.style.display = 'none';
    if (classicBonusOpening) classicBonusOpening.style.display = 'none';
    if (modernBonusOpening) modernBonusOpening.style.display = 'none';
    if (infoPanel) infoPanel.classList.remove('info-panel--visible');
    if (bonusStatsPanel) bonusStatsPanel.style.display = 'none';
    
    // Reset BH button state
    const bhBtn = document.getElementById('bh-btn');
    if (bhBtn) bhBtn.classList.remove('active');
    
    console.log('🚫 All panels hidden on initialization');
  }

  toggleBHPanel() {
    const classicBHPanel = document.getElementById('middle-panel');
    const modernBHPanel = document.getElementById('modern-bh-panel');
    const modernSidebar = document.getElementById('modern-bonus-sidebar');
    const classicBonusOpening = document.getElementById('bonus-opening-panel');
    const modernBonusOpening = document.getElementById('modern-bonus-opening-panel');
    
    // Hide bonus opening panels if they're open
    if (classicBonusOpening) classicBonusOpening.style.display = 'none';
    if (modernBonusOpening) modernBonusOpening.style.display = 'none';
    
    // Show appropriate BH panel based on current layout
    if (this.currentLayout === 'modern-sidebar') {
      // Modern sidebar: toggle entire modern style (sidebar + BH panel together)
      if (classicBHPanel) classicBHPanel.style.display = 'none';
      
      const isSidebarVisible = modernSidebar && modernSidebar.style.display === 'flex';
      
      if (isSidebarVisible) {
        // Hide both sidebar and BH panel (turn off modern style)
        if (modernSidebar) modernSidebar.style.display = 'none';
        if (modernBHPanel) modernBHPanel.style.display = 'none';
        console.log('✅ Hid modern style (sidebar + BH panel)');
      } else {
        // Show both sidebar and BH panel (turn on modern style)
        if (modernSidebar) modernSidebar.style.display = 'flex';
        if (modernBHPanel) {
          modernBHPanel.style.display = 'flex';
          this.syncPanelInputs();
        }
        console.log('✅ Showed modern style (sidebar + BH panel)');
      }
    } else {
      // Classic and modern card layouts use classic BH panel only
      if (modernBHPanel) modernBHPanel.style.display = 'none';
      if (modernSidebar) modernSidebar.style.display = 'none';
      
      if (classicBHPanel) {
        if (classicBHPanel.style.display === 'none' || classicBHPanel.style.display === '') {
          classicBHPanel.style.display = 'flex';
          console.log('✅ Showed classic BH panel');
        } else {
          classicBHPanel.style.display = 'none';
          console.log('✅ Hid classic BH panel');
        }
      }
    }
  }

  setupModernPanelEventListeners() {
    // Modern add slot button
    const modernAddSlotBtn = document.getElementById('modern-add-slot-btn');
    if (modernAddSlotBtn) {
      modernAddSlotBtn.addEventListener('click', () => this.addBonusFromModernPanel());
    }

    // Modern slot name input
    const modernSlotNameInput = document.getElementById('modern-slot-name-input');
    if (modernSlotNameInput) {
      modernSlotNameInput.addEventListener('input', () => this.handleModernSlotNameInput());
      modernSlotNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBonusFromModernPanel();
        }
      });
    }

    // Hide modern suggestions when clicking outside
    document.addEventListener('click', (e) => {
      const modernSuggestionBox = document.querySelector('.modern-grid-container .slot-suggestion-box');
      const modernSlotInput = document.getElementById('modern-slot-name-input');
      if (modernSuggestionBox && modernSlotInput && 
          !modernSlotInput.contains(e.target) && 
          !modernSuggestionBox.contains(e.target)) {
        modernSuggestionBox.style.display = 'none';
      }
    });

    // Modern bet size input
    const modernBetSizeInput = document.getElementById('modern-bet-size-input');
    if (modernBetSizeInput) {
      modernBetSizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBonusFromModernPanel();
        }
      });
    }

    // Modern balance inputs for stats updates
    const modernBalanceInputs = [
      'modern-start-money-input', 
      'modern-stop-money-input', 
      'modern-actual-balance-input', 
      'modern-total-spent-input'
    ];
    
    modernBalanceInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        ['input', 'change', 'keyup', 'paste', 'cut', 'blur'].forEach(eventType => {
          input.addEventListener(eventType, () => {
            setTimeout(() => {
              this.updateStatsBar();
              this.updateModernSidebarStats();
              if (window.bonusHuntUI) {
                window.bonusHuntUI.onBonusDataChanged();
              }
            }, 10);
          });
        });
      }
    });

    // Modern bonus opening button
    const modernBonusOpeningBtn = document.getElementById('modern-bonus-opening-btn');
    if (modernBonusOpeningBtn) {
      modernBonusOpeningBtn.addEventListener('click', () => this.showModernBonusOpeningPanel());
    }

    // Close modern bonus opening button
    const closeModernBonusOpeningBtn = document.getElementById('close-modern-bonus-opening-btn');
    if (closeModernBonusOpeningBtn) {
      closeModernBonusOpeningBtn.addEventListener('click', () => this.hideModernBonusOpeningPanel());
    }

    // Close modern BH panel button (closes entire modern style)
    const closeModernBHPanelBtn = document.getElementById('close-modern-bh-panel');
    if (closeModernBHPanelBtn) {
      closeModernBHPanelBtn.addEventListener('click', () => {
        if (this.currentLayout === 'modern-sidebar') {
          // Hide entire modern style (sidebar + BH panel)
          const modernSidebar = document.getElementById('modern-bonus-sidebar');
          const modernBHPanel = document.getElementById('modern-bh-panel');
          if (modernSidebar) modernSidebar.style.display = 'none';
          if (modernBHPanel) modernBHPanel.style.display = 'none';
          
          // Update BH button state
          const bhBtn = document.getElementById('bh-btn');
          if (bhBtn) bhBtn.classList.remove('active');
          
          console.log('✅ Closed modern style via close button');
        }
      });
    }
  }

  addBonusFromModernPanel() {
    const slotNameInput = document.getElementById('modern-slot-name-input');
    const betSizeInput = document.getElementById('modern-bet-size-input');
    const superCheckbox = document.getElementById('modern-super-checkbox');
    
    if (!slotNameInput || !betSizeInput) return;

    const slotName = slotNameInput.value.trim();
    const betSize = parseFloat(betSizeInput.value);

    if (!slotName || !betSize || betSize <= 0) {
      this.showFeedback('Please enter valid slot name and bet size', 'error');
      return;
    }

    const bonus = {
      id: Date.now(),
      slot: slotName,
      bet: betSize,
      payout: null,
      multiplier: 0,
      isSuper: superCheckbox ? superCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };

    this.bonuses.push(bonus);
    this.updateTotals();
    this.renderBonusList();
    this.saveBonuses();

    // Clear inputs
    slotNameInput.value = '';
    betSizeInput.value = '';
    if (superCheckbox) superCheckbox.checked = false;
    this.hideSelectedSlot();

    slotNameInput.focus();
    this.showFeedback(`Added ${slotName} - €${betSize.toFixed(2)}`, 'success');
  }

  syncPanelInputs() {
    // Sync values from classic to modern panels
    const classicInputs = {
      'start-money-input': 'modern-start-money-input',
      'stop-money-input': 'modern-stop-money-input',
      'actual-balance-input': 'modern-actual-balance-input',
      'total-spent-input': 'modern-total-spent-input',
      'slot-name-input': 'modern-slot-name-input',
      'bet-size-input': 'modern-bet-size-input',
      'slot-img-url-input': 'modern-slot-img-url-input'
    };
    
    const classicCheckboxes = {
      'super-checkbox': 'modern-super-checkbox'
    };
    
    // Sync input values
    Object.keys(classicInputs).forEach(classicId => {
      const classicInput = document.getElementById(classicId);
      const modernInput = document.getElementById(classicInputs[classicId]);
      
      if (classicInput && modernInput) {
        modernInput.value = classicInput.value;
      }
    });
    
    // Sync checkbox values
    Object.keys(classicCheckboxes).forEach(classicId => {
      const classicCheckbox = document.getElementById(classicId);
      const modernCheckbox = document.getElementById(classicCheckboxes[classicId]);
      
      if (classicCheckbox && modernCheckbox) {
        modernCheckbox.checked = classicCheckbox.checked;
      }
    });
  }

  showModernBonusOpeningPanel() {
    const modernBHPanel = document.getElementById('modern-bh-panel');
    const modernBonusOpeningPanel = document.getElementById('modern-bonus-opening-panel');
    
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to open! Add bonuses first.', 'error');
      return;
    }

    // Reset to first bonus when opening panel
    this.currentBonusOpeningIndex = 0;
    this.currentBonusIndex = 0;
    this.isEnteringPayout = true;

    if (modernBHPanel) modernBHPanel.style.display = 'none';
    if (modernBonusOpeningPanel) {
      modernBonusOpeningPanel.style.display = 'flex';
      this.renderModernBonusOpeningList();
    }

    // Update active slot in modern sidebar
    this.updateActiveSlotInModernSidebar();
  }

  hideModernBonusOpeningPanel() {
    // Clear active slot tracking
    this.currentBonusIndex = null;
    this.isEnteringPayout = false;
    this.updateActiveSlotInModernSidebar();
    
    const modernBHPanel = document.getElementById('modern-bh-panel');
    const modernBonusOpeningPanel = document.getElementById('modern-bonus-opening-panel');
    
    if (modernBHPanel) modernBHPanel.style.display = 'flex';
    if (modernBonusOpeningPanel) modernBonusOpeningPanel.style.display = 'none';
  }

  renderModernBonusOpeningList() {
    const modernBonusOpeningList = document.getElementById('modern-bonus-opening-list');
    if (!modernBonusOpeningList) return;

    // Use the same logic as classic bonus opening but with modern styling
    if (this.currentBonusOpeningIndex >= this.bonuses.length) {
      this.currentBonusOpeningIndex = 0;
    }

    if (this.bonuses.length === 0) return;

    const bonus = this.bonuses[this.currentBonusOpeningIndex];
    const slotImage = this.getSlotImage(bonus.slot);
    
    modernBonusOpeningList.innerHTML = `
      <div class="modern-bonus-opening-item">
        <div class="modern-slot-display">
          <img src="${slotImage}" alt="${bonus.slot}" class="modern-bonus-slot-image">
          <div class="modern-slot-info">
            <div class="modern-slot-name">${bonus.slot}</div>
            <div class="modern-slot-bet">Bet: €${bonus.bet.toFixed(2)}</div>
          </div>
        </div>
        <div class="modern-payout-section">
          <input type="number" 
                 class="modern-payout-input" 
                 placeholder="Enter payout" 
                 value="${bonus.payout !== null ? bonus.payout : ''}"
                 min="0" 
                 step="0.01"
                 data-bonus-id="${bonus.id}">
          <span class="currency">€</span>
        </div>
        <div class="modern-navigation">
          <button class="modern-nav-btn" id="modern-prev-bonus-btn" ${this.bonuses.length <= 1 ? 'style="visibility: hidden;"' : ''}>
            ← Previous
          </button>
          <div class="modern-counter">${this.currentBonusOpeningIndex + 1} / ${this.bonuses.length}</div>
          <button class="modern-nav-btn" id="modern-next-bonus-btn" ${this.bonuses.length <= 1 ? 'style="visibility: hidden;"' : ''}>
            Next →
          </button>
        </div>
      </div>
    `;

    // Set up event listeners for modern bonus opening
    const prevBtn = document.getElementById('modern-prev-bonus-btn');
    const nextBtn = document.getElementById('modern-next-bonus-btn');
    const payoutInput = modernBonusOpeningList.querySelector('.modern-payout-input');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateToPreviousBonus());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateToNextBonus());
    }
    
    if (payoutInput) {
      ['input', 'change', 'keyup', 'paste', 'blur'].forEach(eventType => {
        payoutInput.addEventListener(eventType, (e) => {
          const newPayout = parseFloat(e.target.value) || 0;
          setTimeout(() => {
            this.updateBonusPayout(bonus.id, newPayout);
          }, eventType === 'paste' ? 50 : 10);
        });
      });
      
      payoutInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const newPayout = parseFloat(e.target.value) || 0;
          this.updateBonusPayout(bonus.id, newPayout);
          setTimeout(() => {
            this.navigateToNextBonus();
          }, 100);
        }
      });
      
      setTimeout(() => {
        payoutInput.focus();
        payoutInput.select();
      }, 100);
    }
  }

  showFeedback(message, type = 'info') {
    // Create or update feedback display
    let feedback = document.getElementById('bonus-hunt-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'bonus-hunt-feedback';
      feedback.className = 'feedback-message';
      document.body.appendChild(feedback);
    }

    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 3000);
  }
}

// Export for use in main script
window.BonusHuntManager = BonusHuntManager;

// Global method for layout switching (accessible from customization panel)
window.switchBonusLayout = function(layout) {
  if (window.bonusHuntManager && window.bonusHuntManager.switchLayout) {
    window.bonusHuntManager.switchLayout(layout);
  } else {
    console.warn('⚠️ Bonus Hunt Manager not available for layout switching');
  }
};

// Simple direct function to update modern statistics
window.updateModernStats = function() {
  const startMoney = parseFloat(document.getElementById('start-money-input')?.value) || 0;
  const stopMoney = parseFloat(document.getElementById('stop-money-input')?.value) || 0;
  const actualBalance = parseFloat(document.getElementById('actual-balance-input')?.value) || 0;
  
  const totalSpent = startMoney - actualBalance;
  const profit = actualBalance - startMoney;
  
  // Update modern statistics directly
  const elements = {
    'modern-stat-start': `€${startMoney.toFixed(2)}`,
    'modern-stat-target': `€${stopMoney.toFixed(2)}`,
    'modern-stat-current': `€${actualBalance.toFixed(2)}`,
    'modern-stat-spent': `€${totalSpent.toFixed(2)}`,
    'modern-stat-profit': `€${profit.toFixed(2)}`,
    'modern-stat-bonuses': '0',
    'modern-stat-avg-mult': '0.00x',
    'modern-stat-req-mult': '0.00x',
    'modern-stat-best': '--',
    'modern-stat-best-value': '€0.00',
    'modern-stat-worst': '--',
    'modern-stat-worst-value': '€0.00'
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
      if (id === 'modern-stat-profit') {
        el.style.color = profit >= 0 ? '#00ffb8' : '#ff5c5c';
      }
    }
  });
  
  console.log('Updated modern stats:', { startMoney, stopMoney, actualBalance, totalSpent, profit });
};