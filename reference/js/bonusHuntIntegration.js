/**
 * Integration Guide for Bonus Hunt Calculator
 * How to integrate the calculator with your existing bonus hunt system
 */

// Import the calculator (if using modules) or it's available globally as window.BonusHuntCalculator

class BonusHuntUI {
  constructor() {
    this.calculator = new BonusHuntCalculator();
    this.setupEventListeners();
    this.initializeFromLocalStorage();
  }

  /**
   * Initialize calculator with data from localStorage (your existing system)
   */
  initializeFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('bonusHuntData');
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] Initializing from localStorage, raw data:`, savedData);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        console.log('Parsed data:', data);
        
        // Convert your existing bonus format to calculator format
        const bonuses = (data.bonuses || []).map(bonus => {
          // Ensure proper payout/win conversion
          let winValue = null;
          if (bonus.payout !== null && bonus.payout !== undefined) {
            winValue = parseFloat(bonus.payout);
            // Only consider positive values as wins
            if (winValue <= 0) {
              winValue = null;
            }
          }
          
          const convertedBonus = {
            id: bonus.id,
            name: bonus.slot || bonus.name,           // your 'slot' becomes 'name'
            bet: parseFloat(bonus.bet) || 0,
            win: winValue,     // your 'payout' becomes 'win'  
            isSuper: bonus.isSuper || false,
            timestamp: bonus.timestamp
          };
          console.log('Converting bonus:', bonus, 'to:', convertedBonus);
          return convertedBonus;
        });

        // Get balance values from inputs or saved data
        const startMoney = this.getInputValue('start-money-input');
        const targetMoney = this.getInputValue('stop-money-input');
        const currentBalance = this.getInputValue('actual-balance-input');

        console.log('Converted bonuses:', bonuses);
        console.log('Balance values - Start:', startMoney, 'Target:', targetMoney, 'Current:', currentBalance);

        this.calculator.updateData(bonuses, startMoney, targetMoney, currentBalance);
        
        // Force immediate calculation and display
        const stats = this.calculator.calculateTotals();
        console.log('Calculated stats:', stats);
        
        this.updateAllDisplays();
      }
    } catch (error) {
      console.error('Error initializing from localStorage:', error);
    }
  }

  /**
   * Setup event listeners for automatic updates
   */
  setupEventListeners() {
    // Listen for balance input changes with comprehensive event monitoring
    const balanceInputs = [
      'start-money-input',
      'stop-money-input', 
      'actual-balance-input',
      'total-spent-input'
    ];

    balanceInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        // Add multiple event types to catch all possible changes
        const eventTypes = ['input', 'change', 'keyup', 'paste', 'cut', 'blur'];
        
        eventTypes.forEach(eventType => {
          input.addEventListener(eventType, () => {
            // Add small delay for paste/cut events
            setTimeout(() => {
              console.log(`Input changed: ${inputId} (${eventType})`);
              this.updateCalculatorFromInputs();
              this.updateAllDisplays();
            }, eventType === 'paste' || eventType === 'cut' ? 50 : 10);
          });
        });
      }
    });

    // Listen for localStorage changes (when bonuses are updated)
    window.addEventListener('storage', (e) => {
      if (e.key === 'bonusHuntData') {
        this.initializeFromLocalStorage();
      }
    });

    // Poll for localStorage changes (for same-window updates)
    this.lastDataString = localStorage.getItem('bonusHuntData') || '';
    setInterval(() => {
      const currentDataString = localStorage.getItem('bonusHuntData') || '';
      if (currentDataString !== this.lastDataString) {
        this.lastDataString = currentDataString;
        this.initializeFromLocalStorage();
      }
    }, 500);
    
    // Additional monitoring for input value changes
    this.monitorInputChanges();
    
    // Set up MutationObserver to catch programmatic value changes
    this.setupMutationObserver();
  }

  /**
   * Set up MutationObserver to catch programmatic value changes
   */
  setupMutationObserver() {
    const inputIds = ['start-money-input', 'stop-money-input', 'actual-balance-input', 'total-spent-input'];
    
    inputIds.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        // Observe attribute changes (including value attribute)
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
              console.log(`Programmatic value change detected in ${inputId}`);
              setTimeout(() => {
                this.updateCalculatorFromInputs();
                this.updateAllDisplays();
              }, 10);
            }
          });
        });
        
        observer.observe(input, {
          attributes: true,
          attributeFilter: ['value']
        });
        
        // Also use a Proxy to catch direct property changes
        const originalValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        if (originalValueDescriptor) {
          Object.defineProperty(input, 'value', {
            get: originalValueDescriptor.get,
            set: function(newValue) {
              const oldValue = originalValueDescriptor.get.call(this);
              originalValueDescriptor.set.call(this, newValue);
              if (oldValue !== newValue) {
                console.log(`Direct value property change in ${inputId}: ${oldValue} -> ${newValue}`);
                setTimeout(() => {
                  if (window.bonusHuntUI) {
                    window.bonusHuntUI.updateCalculatorFromInputs();
                    window.bonusHuntUI.updateAllDisplays();
                  }
                }, 10);
              }
            },
            enumerable: originalValueDescriptor.enumerable,
            configurable: true
          });
        }
      }
    });
  }

  /**
   * Monitor input changes continuously
   */
  monitorInputChanges() {
    // Store last known values
    this.lastInputValues = {
      startMoney: this.getInputValue('start-money-input'),
      targetMoney: this.getInputValue('stop-money-input'),
      currentBalance: this.getInputValue('actual-balance-input'),
      totalSpent: this.getInputValue('total-spent-input')
    };
    
    // Check for changes every 200ms
    setInterval(() => {
      const currentValues = {
        startMoney: this.getInputValue('start-money-input'),
        targetMoney: this.getInputValue('stop-money-input'),
        currentBalance: this.getInputValue('actual-balance-input'),
        totalSpent: this.getInputValue('total-spent-input')
      };
      
      // Check if any value has changed
      let hasChanged = false;
      for (const key in currentValues) {
        if (currentValues[key] !== this.lastInputValues[key]) {
          hasChanged = true;
          console.log(`Input value changed: ${key} from ${this.lastInputValues[key]} to ${currentValues[key]}`);
          break;
        }
      }
      
      if (hasChanged) {
        this.lastInputValues = currentValues;
        this.updateCalculatorFromInputs();
        this.updateAllDisplays();
      }
    }, 200);
  }

  /**
   * Update calculator with current input values
   */
  updateCalculatorFromInputs() {
    const startMoney = this.getInputValue('start-money-input');
    const targetMoney = this.getInputValue('stop-money-input');
    const currentBalance = this.getInputValue('actual-balance-input');

    console.log('Updating calculator with values:', { startMoney, targetMoney, currentBalance });

    this.calculator.updateData(
      this.calculator.bonuses, 
      startMoney, 
      targetMoney, 
      currentBalance
    );
    
    // Immediate refresh after data update
    setTimeout(() => {
      this.updateAllDisplays();
    }, 10);
  }

  /**
   * Get numeric value from input element
   */
  getInputValue(inputId) {
    const input = document.getElementById(inputId);
    return input ? parseFloat(input.value) || 0 : 0;
  }

  /**
   * Call this whenever a bonus is added/updated/removed
   */
  onBonusDataChanged() {
    console.log('Bonus data changed - refreshing statistics...');
    this.initializeFromLocalStorage();
    
    // Force immediate update after data change
    setTimeout(() => {
      this.updateCalculatorFromInputs();
      this.updateAllDisplays();
    }, 100);
  }

  /**
   * Update all display elements with calculated values
   */
  updateAllDisplays() {
    const stats = this.calculator.calculateTotals();
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Updating displays with stats:`, stats);

    // Update your existing stat elements
    this.updateStatElement('bh-stat-start', this.calculator.formatCurrency(stats.startMoney));
    this.updateStatElement('bh-stat-target', this.calculator.formatCurrency(stats.targetMoney));
    this.updateStatElement('bh-stat-current', this.calculator.formatCurrency(stats.currentBalance));
    this.updateStatElement('bh-stat-spent', this.calculator.formatCurrency(stats.totalSpent));
    
    // Profit/Loss with color coding
    const profitElement = document.getElementById('bh-stat-profit');
    if (profitElement) {
      profitElement.textContent = this.calculator.formatCurrency(Math.abs(stats.profitLoss));
      profitElement.style.color = stats.profitLoss >= 0 ? '#00ffb8' : '#ff5c5c';
    }
    
    // Also update modern profit element
    const modernProfitElement = document.getElementById('modern-stat-profit');
    if (modernProfitElement) {
      modernProfitElement.textContent = this.calculator.formatCurrency(stats.profitLoss);
      modernProfitElement.style.color = stats.profitLoss >= 0 ? '#00ffb8' : '#ff5c5c';
      console.log(`Updated modern profit: ${this.calculator.formatCurrency(stats.profitLoss)} (${stats.profitLoss >= 0 ? 'green' : 'red'})`);
    }

    // Best and worst slots - display as images
    this.updateSlotDisplay('bh-stat-best', stats.bestSlot);
    this.updateSlotDisplay('bh-stat-worst', stats.worstSlot);

    // Counts and multipliers - with debug logging
    console.log('Total bonuses:', stats.totalBonuses);
    console.log('Average multiplier:', stats.averageMultiplier);
    console.log('Required multiplier:', stats.requiredMultiplier);
    
    // Use the correct element IDs from your HTML
    this.updateStatElement('bh-stat-total-bonuses', stats.totalBonuses.toString());
    this.updateStatElement('bh-stat-avg-multi', stats.averageMultiplier > 0 ? this.calculator.formatMultiplier(stats.averageMultiplier) : '0.00x');
    
    // Enhanced required multiplier display with detailed logging
    console.log('Required multiplier calculation:', {
      value: stats.requiredMultiplier,
      totalSpent: stats.totalSpent,
      totalWins: stats.totalWins,
      startMoney: stats.startMoney,
      currentBalance: stats.currentBalance,
      bonusesWithWins: this.calculator.bonuses.filter(b => b.win && b.win > 0).length,
      bonusesWithoutWins: this.calculator.bonuses.filter(b => !b.win || b.win <= 0).length
    });
    
    const reqMultText = this.getRequiredMultiplierText(stats.requiredMultiplier);
    this.updateStatElement('bh-stat-req-multi', reqMultText);

    // Update total spent input (auto-calculated)
    const totalSpentInput = document.getElementById('total-spent-input');
    if (totalSpentInput) {
      totalSpentInput.value = stats.totalSpent.toFixed(2);
    }

    // Additional stats you might want to display
    console.log('Hunt Progress:', this.calculator.formatPercentage(stats.huntProgress));
    console.log('Bonuses Opened:', `${stats.openedBonuses}/${stats.totalBonuses}`);
  }

  /**
   * Update a stat display element
   */
  updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Updating element ${elementId} with value:`, value);
      element.textContent = value;
    } else {
      console.warn(`Element not found: ${elementId}`);
    }
    
    // Also update modern layout equivalent if it exists
    const modernEquivalents = {
      'bh-stat-start': 'modern-stat-start',
      'bh-stat-target': 'modern-stat-target',
      'bh-stat-current': 'modern-stat-current',
      'bh-stat-spent': 'modern-stat-spent',
      'bh-stat-profit': 'modern-stat-profit',
      'bh-stat-total-bonuses': 'modern-stat-bonuses',
      'bh-stat-avg-multi': 'modern-stat-avg-mult',
      'bh-stat-req-multi': 'modern-stat-req-mult',
      'bh-stat-best': 'modern-stat-best',
      'bh-stat-worst': 'modern-stat-worst'
    };
    
    const modernElementId = modernEquivalents[elementId];
    if (modernElementId) {
      const modernElement = document.getElementById(modernElementId);
      if (modernElement) {
        console.log(`Also updating modern element ${modernElementId} with value:`, value);
        modernElement.textContent = value;
      }
    }
  }

  /**
   * Get formatted text for required multiplier display
   */
  getRequiredMultiplierText(requiredMultiplier) {
    if (requiredMultiplier === null) {
      return 'N/A'; // No remaining bonuses or impossible to recover
    } else if (requiredMultiplier <= 0) {
      return '✅ 0.00x'; // Already profitable or break-even
    } else if (requiredMultiplier > 1000) {
      return '🔥 999+x'; // Very high multiplier needed
    } else {
      return this.calculator.formatMultiplier(requiredMultiplier);
    }
  }

  /**
   * Update slot display with image
   */
  updateSlotDisplay(elementId, slotData) {
    const element = document.getElementById(elementId);
    console.log(`Updating slot display for ${elementId}:`, slotData);
    
    if (element) {
      if (slotData && slotData.name) {
        // Get slot image using the same method as your existing system
        const slotImage = this.getSlotImage(slotData.name);
        console.log(`Using image: ${slotImage} for slot: ${slotData.name}`);
        
        element.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
            <img src="${slotImage}" alt="${slotData.name}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" onerror="this.src='https://i.imgur.com/8E3ucNx.png';">
            <div style="display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 0;">
              <div style="font-size: 11px; font-weight: 600; color: #00e1ff; line-height: 1.2;">${this.calculator.formatCurrency(slotData.win)}</div>
              <div style="font-size: 9px; color: #ffffff; line-height: 1.2;">(${this.calculator.formatMultiplier(slotData.multiplier)})</div>
            </div>
          </div>
        `;
      } else {
        element.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;">?</div>
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <div style="font-size: 11px; color: #666;">€0.00</div>
              <div style="font-size: 9px; color: #666;">(0.00x)</div>
            </div>
          </div>
        `;
      }
    } else {
      console.warn(`Element not found: ${elementId}`);
    }
    
    // Also update modern layout equivalents for best/worst slots
    const modernSlotEquivalents = {
      'bh-stat-best': 'modern-stat-best',
      'bh-stat-worst': 'modern-stat-worst'
    };
    
    const modernElementId = modernSlotEquivalents[elementId];
    if (modernElementId) {
      const modernElement = document.getElementById(modernElementId);
      const modernValueElement = document.getElementById(modernElementId + '-value');
      
      if (modernElement) {
        if (slotData && slotData.name) {
          modernElement.textContent = slotData.name;
          console.log(`Updated modern slot name ${modernElementId}: ${slotData.name}`);
        } else {
          modernElement.textContent = '--';
        }
      }
      
      if (modernValueElement) {
        if (slotData && slotData.win !== undefined) {
          modernValueElement.textContent = this.calculator.formatCurrency(slotData.win);
          console.log(`Updated modern slot value ${modernElementId}-value: ${this.calculator.formatCurrency(slotData.win)}`);
        } else {
          modernValueElement.textContent = '€0.00';
        }
      }
    }
  }

  /**
   * Get slot image using the same method as BonusHuntManager
   */
  getSlotImage(slotName) {
    console.log('Getting image for slot:', slotName);
    
    // Use the existing BonusHuntManager's getSlotImage method if available
    if (window.bonusHuntManager && typeof window.bonusHuntManager.getSlotImage === 'function') {
      const image = window.bonusHuntManager.getSlotImage(slotName);
      console.log('Got image from BonusHuntManager:', image);
      return image;
    }
    
    // Fallback: First check if there's a custom image URL in localStorage
    try {
      const savedImages = localStorage.getItem('customSlotImages');
      if (savedImages) {
        const images = JSON.parse(savedImages);
        if (images[slotName.toLowerCase()]) {
          console.log('Found custom image:', images[slotName.toLowerCase()]);
          return images[slotName.toLowerCase()];
        }
      }
    } catch (e) {
      console.error('Error loading custom images:', e);
    }
    
    // Then check the slot database
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      const slot = window.slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
      if (slot && slot.image) {
        console.log('Found database image:', slot.image);
        return slot.image;
      }
    }
    
    console.log('Using default fallback image');
    return 'https://i.imgur.com/8E3ucNx.png'; // Default fallback image
  }

  /**
   * Get current statistics (for external use)
   */
  getCurrentStats() {
    return this.calculator.calculateTotals();
  }

  /**
   * Export hunt data
   */
  exportHunt() {
    const data = this.calculator.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bonus-hunt-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import hunt data
   */
  importHunt(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.calculator.importData(data);
        this.updateAllDisplays();
        console.log('Hunt data imported successfully');
      } catch (error) {
        console.error('Error importing hunt data:', error);
      }
    };
    reader.readAsText(file);
  }
}

// Integration with your existing BonusHuntManager
function integrateWithExistingSystem() {
  // Create the UI calculator
  const huntUI = new BonusHuntUI();

  // Modify your existing BonusHuntManager methods to trigger updates
  const originalUpdateTotals = window.BonusHuntManager.prototype.updateTotals;
  window.BonusHuntManager.prototype.updateTotals = function() {
    // Call original method
    originalUpdateTotals.call(this);
    
    // Trigger calculator update
    if (window.bonusHuntUI) {
      window.bonusHuntUI.onBonusDataChanged();
    }
  };

  // Make huntUI globally available
  window.bonusHuntUI = huntUI;

  return huntUI;
}

// Global function to force refresh statistics (can be called from anywhere)
window.refreshBonusHuntStats = function() {
  console.log('Globally refreshing bonus hunt statistics...');
  if (window.bonusHuntUI) {
    window.bonusHuntUI.updateCalculatorFromInputs();
    window.bonusHuntUI.updateAllDisplays();
  }
  if (window.bonusHuntManager) {
    window.bonusHuntManager.updateStatsBar();
    window.bonusHuntManager.refreshAllStatistics();
  }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof BonusHuntCalculator !== 'undefined') {
    integrateWithExistingSystem();
    console.log('Bonus Hunt Calculator integrated successfully');
    
    // Force initial update after a short delay to ensure everything is loaded
    setTimeout(() => {
      if (window.bonusHuntUI) {
        console.log('Forcing initial data load...');
        window.bonusHuntUI.initializeFromLocalStorage();
      }
      // Also call global refresh function
      window.refreshBonusHuntStats();
      
      // Add input event listeners for real-time updates
      const inputIds = ['start-money-input', 'stop-money-input', 'actual-balance-input', 'total-spent-input'];
      inputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
          console.log(`🔗 Adding bonus hunt integration listener to ${inputId}`);
          ['input', 'change'].forEach(eventType => {
            input.addEventListener(eventType, () => {
              console.log(`🔥 BonusHuntIntegration: ${eventType} on ${inputId}`);
              setTimeout(() => {
                if (window.bonusHuntUI) {
                  window.bonusHuntUI.updateCalculatorFromInputs();
                  window.bonusHuntUI.updateAllDisplays();
                }
              }, 10);
            });
          });
        }
      });
    }, 1000);
    
    // Set up periodic refresh to catch any missed updates
    setInterval(() => {
      window.refreshBonusHuntStats();
    }, 5000); // Refresh every 5 seconds as a backup
  }
});

// Also try to initialize when the script loads (fallback)
if (typeof BonusHuntCalculator !== 'undefined' && document.readyState === 'complete') {
  integrateWithExistingSystem();
  console.log('Bonus Hunt Calculator integrated (immediate)');
}

// Add a global function to manually test the integration
window.testBonusCalculator = function() {
  console.log('Testing bonus calculator...');
  
  // Test with sample data
  const testBonuses = [
    { slot: 'Gates of Olympus SuperScatter', bet: 1.00, payout: null, isSuper: false },
    { slot: 'Sweet Bonanza', bet: 2.00, payout: 15.50, isSuper: true }
  ];
  
  if (window.bonusHuntUI) {
    window.bonusHuntUI.calculator.updateData(testBonuses, 100, 150, 20);
    const stats = window.bonusHuntUI.calculator.calculateTotals();
    console.log('Test stats:', stats);
    window.bonusHuntUI.updateAllDisplays();
  } else {
    console.error('bonusHuntUI not available');
  }
};

// Force refresh function
window.refreshBonusStats = function() {
  console.log('Force refreshing bonus stats...');
  if (window.bonusHuntUI) {
    window.bonusHuntUI.initializeFromLocalStorage();
  }
};

// Debug function to test required multiplier calculation
window.debugRequiredMultiplier = function() {
  console.log('=== DEBUG REQUIRED MULTIPLIER ===');
  if (window.bonusHuntUI) {
    const stats = window.bonusHuntUI.getCurrentStats();
    const bonuses = window.bonusHuntUI.calculator.bonuses;
    
    console.log('Current stats:', stats);
    console.log('All bonuses:', bonuses);
    
    // Manual calculation
    const totalSpent = stats.startMoney - stats.currentBalance;
    const totalWinsSoFar = bonuses.reduce((sum, bonus) => {
      return sum + (bonus.win || 0);
    }, 0);
    const remainingBets = bonuses.reduce((sum, bonus) => {
      if (!bonus.win || bonus.win <= 0) {
        return sum + bonus.bet;
      }
      return sum;
    }, 0);
    const requiredReturn = totalSpent - totalWinsSoFar;
    const calculatedReqMult = remainingBets > 0 ? requiredReturn / remainingBets : null;
    
    console.log('Manual calculation:', {
      totalSpent,
      totalWinsSoFar,
      remainingBets,
      requiredReturn,
      calculatedReqMult
    });
    
    console.log('Calculator result:', stats.requiredMultiplier);
  }
  console.log('=== END DEBUG ===');
};

// Example of manual integration calls:
/*
// When you add a bonus in your existing system:
window.bonusHuntUI.onBonusDataChanged();

// When you update a payout:
window.bonusHuntUI.onBonusDataChanged();

// Get current statistics:
const stats = window.bonusHuntUI.getCurrentStats();
console.log('Current hunt stats:', stats);

// Export hunt:
window.bonusHuntUI.exportHunt();
*/