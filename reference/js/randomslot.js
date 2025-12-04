// ==================== RANDOM SLOT GENERATOR MODULE ====================

class RandomSlotManager {
  constructor() {
    this.currentSlot = null;
    this.history = [];
    this.favorites = [];
    this.selectedProviders = new Set();
    this.init();
  }

  init() {
    console.log('Random Slot Manager initialized');
    this.setupEventListeners();
    this.loadFavorites();
    this.loadHistory();
  }

  setupEventListeners() {
    console.log('Setting up RandomSlot event listeners...');
    
    // Wait for DOM to be ready
    setTimeout(() => {
      this.attachEventListeners();
    }, 100);
  }

  attachEventListeners() {
    // Shuffle button - the main button to generate random slot
    const shuffleBtn = document.querySelector('.shuffle-btn, #shuffle-slot-btn, [onclick*="shuffle"], .slot-shuffle-btn');
    console.log('Shuffle button found:', !!shuffleBtn);
    
    if (shuffleBtn) {
      // Remove any existing onclick handlers
      shuffleBtn.removeAttribute('onclick');
      shuffleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Shuffle button clicked!');
        this.generateRandomSlot();
      });
    }

    // Use This Slot button
    const useSlotBtn = document.querySelector('.use-slot-btn, #use-this-slot-btn, [onclick*="use"]');
    console.log('Use slot button found:', !!useSlotBtn);
    
    if (useSlotBtn) {
      useSlotBtn.removeAttribute('onclick');
      useSlotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Use slot button clicked!');
        this.useCurrentSlot();
      });
    }

    // Provider checkboxes
    const providerCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    console.log('Provider checkboxes found:', providerCheckboxes.length);
    
    providerCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const providerName = this.getProviderNameFromCheckbox(e.target);
        console.log('Provider checkbox changed:', providerName, e.target.checked);
        
        if (e.target.checked) {
          this.selectedProviders.add(providerName);
        } else {
          this.selectedProviders.delete(providerName);
        }
        
        console.log('Selected providers:', Array.from(this.selectedProviders));
      });
    });

    // Auto-generate a slot on first load if none is showing
    setTimeout(() => {
      if (!this.currentSlot) {
        console.log('Auto-generating initial slot...');
        this.generateRandomSlot();
      }
    }, 500);
  }

  getProviderNameFromCheckbox(checkbox) {
    // Try to get provider name from various sources
    const label = checkbox.parentElement;
    const labelText = label ? label.textContent.trim() : '';
    
    // Map of display names to actual provider names
    const providerMap = {
      'Pragmatic Play': 'Pragmatic Play',
      'No Limit': 'No Limit City',
      '3Oaks': '3 Oaks',
      'Play\'n GO': 'Play\'n GO',
      'Big Time Gaming': 'Big Time Gaming',
      'Hacksaw': 'Hacksaw Gaming',
      'Bgaming': 'BGaming',
      'Belatra': 'Belatra',
      'Play\'n GO': 'Play\'n GO'
    };
    
    return providerMap[labelText] || labelText;
  }

  generateRandomSlot() {
    console.log('Generating random slot...');
    console.log('Slot database available:', typeof window.slotDatabase, window.slotDatabase?.length);
    console.log('Selected providers:', Array.from(this.selectedProviders));
    
    if (!window.slotDatabase || window.slotDatabase.length === 0) {
      this.showFeedback('Slot database not available', 'error');
      console.error('Slot database not available');
      return;
    }

    let availableSlots = [...window.slotDatabase];

    // Filter by selected providers if any are selected
    if (this.selectedProviders.size > 0) {
      availableSlots = availableSlots.filter(slot => {
        return Array.from(this.selectedProviders).some(provider => 
          slot.provider && slot.provider.toLowerCase().includes(provider.toLowerCase()) ||
          provider.toLowerCase().includes(slot.provider.toLowerCase())
        );
      });
      
      console.log('Filtered slots by provider:', availableSlots.length);
    }

    if (availableSlots.length === 0) {
      this.showFeedback('No slots found with selected filters', 'error');
      return;
    }

    // Get random slot
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    const slot = availableSlots[randomIndex];
    
    console.log('Generated slot:', slot);
    
    this.currentSlot = slot;
    this.addToHistory(slot);
    this.displaySlot(slot);
    this.showFeedback(`Generated: ${slot.name}`, 'success');
  }

  useCurrentSlot() {
    if (!this.currentSlot) {
      this.showFeedback('No slot selected to use', 'error');
      return;
    }
    
    console.log('Using current slot:', this.currentSlot);
    
    // Add to bonus hunt if BonusHuntManager is available
    if (window.bonusHuntManager && typeof window.bonusHuntManager.addBonus === 'function') {
      // Fill the slot name input in the bonus hunt
      const slotNameInput = document.getElementById('slot-name-input');
      if (slotNameInput) {
        slotNameInput.value = this.currentSlot.name;
        slotNameInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Set slot name in bonus hunt input');
      }
      
      // Focus on bet size input for convenience
      const betSizeInput = document.getElementById('bet-size-input');
      if (betSizeInput) {
        setTimeout(() => betSizeInput.focus(), 100);
      }
      
      this.showFeedback(`Added "${this.currentSlot.name}" to bonus hunt!`, 'success');
      
      // Close the random slot panel
      this.closeRandomSlotPanel();
    } else {
      this.showFeedback('Bonus hunt not available', 'error');
    }
  }
  
  closeRandomSlotPanel() {
    const randomSlotPanel = document.getElementById('random-slot-panel');
    if (randomSlotPanel) {
      randomSlotPanel.style.display = 'none';
    }
    
    // Show main panel
    const middlePanel = document.getElementById('middle-panel');
    if (middlePanel) {
      middlePanel.style.display = 'flex';
    }
  }

  generateSlotByProvider(providerName) {
    // This method is now handled in generateRandomSlot() with provider filtering
    console.log('Provider-specific generation handled by main method');
  }

  displaySlot(slot) {
    console.log('Displaying slot:', slot);
    
    // Clear any existing displays first to prevent stacking
    this.clearExistingDisplays();
    
    // Find or create the main slot display container
    let slotDisplay = document.querySelector('#random-slot-display, .random-slot-result, .slot-display-container');
    
    if (!slotDisplay) {
      // Create a new display container
      slotDisplay = this.createSlotDisplayContainer();
    }
    
    // Update the display with clean, modern slot card
    slotDisplay.innerHTML = `
      <div class="modern-slot-card">
        <div class="slot-image-container">
          <img src="${slot.image || 'https://i.imgur.com/8E3ucNx.png'}" 
               alt="${slot.name}" 
               class="slot-image"
               onerror="this.src='https://i.imgur.com/8E3ucNx.png';">
        </div>
        <div class="slot-info">
          <div class="slot-name">${slot.name}</div>
          <div class="slot-provider">${slot.provider}</div>
          <div class="slot-stats">
            ${slot.rtp ? `<span class="stat-item">RTP: ${slot.rtp}%</span>` : ''}
            ${slot.volatility ? `<span class="stat-item">Vol: ${slot.volatility}</span>` : ''}
            ${slot.maxWin ? `<span class="stat-item">Max: ${slot.maxWin}x</span>` : ''}
          </div>
        </div>
      </div>
    `;
    
    // Add the CSS styles for the modern slot card
    this.addSlotCardStyles();
    
    slotDisplay.style.display = 'block';
    console.log('Updated slot display with clean modern card');
  }
  
  clearExistingDisplays() {
    // Remove any duplicate or old displays
    const existingDisplays = document.querySelectorAll(
      '.slot-card, .random-slot-result, .slot-display-card, .current-slot-display, .slot-result-display'
    );
    
    existingDisplays.forEach(display => {
      if (display.parentElement && display !== this.mainDisplayContainer) {
        display.remove();
      }
    });
  }
  
  createSlotDisplayContainer() {
    // Find the random slot panel
    const randomSlotPanel = document.querySelector('#random-slot-panel, .random-slot-panel');
    
    if (randomSlotPanel) {
      // Create a dedicated display container
      const container = document.createElement('div');
      container.id = 'random-slot-display';
      container.className = 'slot-display-container';
      
      // Find the best place to insert it (between filters and buttons)
      const buttonsContainer = randomSlotPanel.querySelector('.random-slot-actions, .slot-actions, .action-buttons');
      
      if (buttonsContainer) {
        randomSlotPanel.insertBefore(container, buttonsContainer);
      } else {
        randomSlotPanel.appendChild(container);
      }
      
      this.mainDisplayContainer = container;
      return container;
    }
    
    // Fallback: create floating container
    const container = document.createElement('div');
    container.id = 'random-slot-display';
    container.className = 'slot-display-container floating';
    document.body.appendChild(container);
    
    this.mainDisplayContainer = container;
    return container;
  }
  
  addSlotCardStyles() {
    // Check if styles are already added
    if (document.getElementById('random-slot-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'random-slot-styles';
    styles.textContent = `
      .slot-display-container {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        min-height: 120px;
      }
      
      .slot-display-container.floating {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        background: rgba(0,0,0,0.9);
        padding: 20px;
        border-radius: 15px;
        border: 2px solid #00e1ff;
      }
      
      .modern-slot-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: linear-gradient(135deg, rgba(0, 225, 255, 0.1), rgba(147, 70, 255, 0.1));
        border: 2px solid #00e1ff;
        border-radius: 12px;
        min-width: 300px;
        transition: all 0.3s ease;
      }
      
      .modern-slot-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 225, 255, 0.3);
      }
      
      .slot-image-container {
        flex-shrink: 0;
      }
      
      .slot-image {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        object-fit: cover;
        border: 2px solid #ffd700;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
      }
      
      .slot-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .slot-name {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.2;
        margin-bottom: 2px;
      }
      
      .slot-provider {
        font-size: 13px;
        color: #00e1ff;
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .slot-stats {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .stat-item {
        font-size: 11px;
        color: #9ca3af;
        background: rgba(255,255,255,0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
      }
    `;
    
    document.head.appendChild(styles);
  }

  updateSlotDetails(slot) {
    // Update any additional slot details like features, themes, etc.
    const featuresContainer = document.getElementById('slot-features');
    if (featuresContainer && slot.features) {
      featuresContainer.innerHTML = slot.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
      ).join('');
    }

    const themesContainer = document.getElementById('slot-themes');
    if (themesContainer && slot.themes) {
      themesContainer.innerHTML = slot.themes.map(theme => 
        `<span class="theme-tag">${theme}</span>`
      ).join('');
    }
  }

  addToHistory(slot) {
    // Add to beginning of history, limit to 50 entries
    this.history.unshift({
      ...slot,
      timestamp: new Date().toISOString()
    });
    
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }
    
    this.saveHistory();
  }

  addToFavorites() {
    if (!this.currentSlot) {
      this.showFeedback('No slot selected to add to favorites', 'error');
      return;
    }

    // Check if already in favorites
    const exists = this.favorites.some(fav => fav.name === this.currentSlot.name);
    if (exists) {
      this.showFeedback('Slot already in favorites', 'info');
      return;
    }

    this.favorites.push({
      ...this.currentSlot,
      addedAt: new Date().toISOString()
    });
    
    this.saveFavorites();
    this.showFeedback(`Added ${this.currentSlot.name} to favorites`, 'success');
  }

  showHistory() {
    if (this.history.length === 0) {
      this.showFeedback('No history available', 'info');
      return;
    }

    // Create history modal or display
    const historyDisplay = document.getElementById('slot-history-display');
    if (historyDisplay) {
      let historyHTML = '<h3>Recent Slots</h3><div class="history-list">';
      
      this.history.slice(0, 10).forEach((slot, index) => {
        historyHTML += `
          <div class="history-item" onclick="randomSlotManager.displaySlot(${JSON.stringify(slot).replace(/"/g, '&quot;')})">
            <img src="${slot.image}" alt="${slot.name}" class="history-slot-image">
            <div class="history-info">
              <div class="history-name">${slot.name}</div>
              <div class="history-provider">${slot.provider}</div>
              <div class="history-time">${new Date(slot.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        `;
      });
      
      historyHTML += '</div>';
      historyDisplay.innerHTML = historyHTML;
      historyDisplay.style.display = 'block';
    }
  }

  clearHistory() {
    if (this.history.length === 0) {
      this.showFeedback('No history to clear', 'info');
      return;
    }

    if (confirm('Are you sure you want to clear the slot history?')) {
      this.history = [];
      this.saveHistory();
      this.showFeedback('History cleared', 'success');
      
      const historyDisplay = document.getElementById('slot-history-display');
      if (historyDisplay) {
        historyDisplay.style.display = 'none';
      }
    }
  }

  saveHistory() {
    localStorage.setItem('randomSlotHistory', JSON.stringify(this.history));
  }

  loadHistory() {
    const saved = localStorage.getItem('randomSlotHistory');
    if (saved) {
      try {
        this.history = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading slot history:', error);
      }
    }
  }

  saveFavorites() {
    localStorage.setItem('randomSlotFavorites', JSON.stringify(this.favorites));
  }

  loadFavorites() {
    const saved = localStorage.getItem('randomSlotFavorites');
    if (saved) {
      try {
        this.favorites = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading slot favorites:', error);
      }
    }
  }

  showFeedback(message, type = 'info') {
    console.log('Feedback:', message, type);
    
    // Create or update feedback display
    let feedback = document.getElementById('random-slot-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'random-slot-feedback';
      feedback.className = 'feedback-message';
      feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(feedback);
    }

    feedback.textContent = message;
    
    // Set color based on type
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6',
      warning: '#f59e0b'
    };
    
    feedback.style.backgroundColor = colors[type] || colors.info;
    feedback.style.display = 'block';
    feedback.style.opacity = '1';
    feedback.style.transform = 'translateY(0)';

    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 300);
    }, 3000);
  }

  // Get random slot by criteria
  getRandomSlotByCriteria(criteria = {}) {
    if (!window.slotDatabase || window.slotDatabase.length === 0) return null;
    
    let filteredSlots = [...window.slotDatabase];
    
    if (criteria.provider) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.provider.toLowerCase() === criteria.provider.toLowerCase()
      );
    }

    if (criteria.volatility) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.volatility && slot.volatility.toLowerCase() === criteria.volatility.toLowerCase()
      );
    }

    if (criteria.minRTP) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.rtp && parseFloat(slot.rtp) >= criteria.minRTP
      );
    }

    if (criteria.maxRTP) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.rtp && parseFloat(slot.rtp) <= criteria.maxRTP
      );
    }

    if (filteredSlots.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredSlots.length);
    return filteredSlots[randomIndex];
  }
}

// Export for use in main script
window.RandomSlotManager = RandomSlotManager;

// Add debugging function
window.testRandomSlot = function() {
  console.log('Testing random slot picker...');
  console.log('randomSlotManager available:', !!window.randomSlotManager);
  console.log('slotDatabase available:', !!window.slotDatabase, window.slotDatabase?.length);
  
  if (window.randomSlotManager) {
    window.randomSlotManager.generateRandomSlot();
  } else {
    console.error('randomSlotManager not available');
  }
};

// Force re-initialization function
window.reinitRandomSlot = function() {
  console.log('Reinitializing random slot picker...');
  if (window.RandomSlotManager) {
    window.randomSlotManager = new window.RandomSlotManager();
    console.log('Random slot picker reinitialized');
  }
};