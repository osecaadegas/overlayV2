/**
 * Bonus Hunt Tracker - Complete Calculation Module
 * Provides all calculations needed for slot bonus hunt tracking
 */

class BonusHuntCalculator {
  constructor() {
    this.bonuses = [];
    this.startMoney = 0;
    this.targetMoney = 0;
    this.currentBalance = 0;
  }

  /**
   * Initialize or update the calculator with new data
   * @param {Array} bonuses - Array of bonus objects
   * @param {number} startMoney - Starting balance
   * @param {number} targetMoney - Target balance
   * @param {number} currentBalance - Current balance
   */
  updateData(bonuses = [], startMoney = 0, targetMoney = 0, currentBalance = 0) {
    this.bonuses = bonuses;
    this.startMoney = startMoney;
    this.targetMoney = targetMoney;
    this.currentBalance = currentBalance;
  }

  /**
   * Calculate multiplier for a single bonus
   * @param {Object} bonus - Bonus object with bet and win properties
   * @returns {number} Multiplier (win / bet)
   */
  calculateSlotMultiplier(bonus) {
    if (!bonus || typeof bonus.bet !== 'number' || bonus.bet <= 0) {
      return 0;
    }
    
    const win = typeof bonus.win === 'number' ? bonus.win : 0;
    return win / bonus.bet;
  }

  /**
   * Get total amount spent on bonuses
   * @returns {number} Total bet amount
   */
  getTotalBet() {
    return this.bonuses.reduce((total, bonus) => {
      return total + (typeof bonus.bet === 'number' ? bonus.bet : 0);
    }, 0);
  }

  /**
   * Get total winnings from all bonuses
   * @returns {number} Total win amount
   */
  getTotalWins() {
    return this.bonuses.reduce((total, bonus) => {
      const win = typeof bonus.win === 'number' ? bonus.win : 0;
      return total + win;
    }, 0);
  }

  /**
   * Calculate total spent (difference between start and current balance)
   * @returns {number} Total spent amount
   */
  calculateTotalSpent() {
    return this.startMoney - this.currentBalance;
  }

  /**
   * Calculate profit/loss (current balance - start balance)
   * @returns {number} Profit (positive) or loss (negative)
   */
  calculateProfitLoss() {
    return this.currentBalance - this.startMoney;
  }

  /**
   * Find the best performing slot (highest multiplier)
   * @returns {Object|null} Best slot object with calculated multiplier
   */
  getBestSlot() {
    console.log('Getting best slot from bonuses:', this.bonuses);
    const bonusesWithWins = this.bonuses.filter(bonus => 
      bonus && typeof bonus.win === 'number' && bonus.win !== null && bonus.win > 0
    );
    
    console.log('Bonuses with wins:', bonusesWithWins);

    if (bonusesWithWins.length === 0) {
      console.log('No bonuses with wins found');
      return null;
    }

    let bestSlot = null;
    let highestMultiplier = 0;

    bonusesWithWins.forEach(bonus => {
      const multiplier = this.calculateSlotMultiplier(bonus);
      console.log(`Slot: ${bonus.name}, Multiplier: ${multiplier}`);
      if (multiplier > highestMultiplier) {
        highestMultiplier = multiplier;
        bestSlot = {
          ...bonus,
          multiplier: multiplier
        };
      }
    });

    console.log('Best slot found:', bestSlot);
    return bestSlot;
  }

  /**
   * Find the worst performing slot (lowest multiplier among opened bonuses)
   * @returns {Object|null} Worst slot object with calculated multiplier
   */
  getWorstSlot() {
    console.log('Getting worst slot from bonuses:', this.bonuses);
    const bonusesWithWins = this.bonuses.filter(bonus => 
      bonus && typeof bonus.win === 'number' && bonus.win !== null && bonus.win > 0
    );

    console.log('Bonuses with wins for worst:', bonusesWithWins);

    if (bonusesWithWins.length === 0) {
      console.log('No bonuses with wins found for worst slot');
      return null;
    }

    let worstSlot = null;
    let lowestMultiplier = Infinity;

    bonusesWithWins.forEach(bonus => {
      const multiplier = this.calculateSlotMultiplier(bonus);
      console.log(`Slot: ${bonus.name}, Multiplier: ${multiplier}`);
      if (multiplier < lowestMultiplier) {
        lowestMultiplier = multiplier;
        worstSlot = {
          ...bonus,
          multiplier: multiplier
        };
      }
    });

    console.log('Worst slot found:', worstSlot);
    return worstSlot;
  }

  /**
   * Calculate average multiplier across all opened bonuses
   * Only count bonuses that already have a win value
   * @returns {number} Average multiplier
   */
  getAverageMultiplier() {
    return calculateAverageMultiplier(this.bonuses);
  }

  /**
   * Calculate required multiplier to break even
   * @returns {number|null} Required multiplier for remaining bonuses
   */
  getRequiredMultiplier() {
    return calculateRequiredMultiplier(this.bonuses, this.startMoney, this.currentBalance);
  }

  /**
   * Get count of total bonuses
   * @returns {number} Total number of bonuses
   */
  getTotalBonuses() {
    return this.bonuses.length;
  }

  /**
   * Get count of opened bonuses (bonuses with wins)
   * @returns {number} Number of opened bonuses
   */
  getOpenedBonuses() {
    return this.bonuses.filter(bonus => 
      typeof bonus.win === 'number' && bonus.win > 0
    ).length;
  }

  /**
   * Get count of unopened bonuses
   * @returns {number} Number of unopened bonuses
   */
  getUnopenedBonuses() {
    return this.bonuses.filter(bonus => 
      !bonus.win || bonus.win === 0
    ).length;
  }

  /**
   * Calculate all statistics and return complete object
   * @returns {Object} Complete statistics object
   */
  calculateTotals() {
    const bestSlot = this.getBestSlot();
    const worstSlot = this.getWorstSlot();

    return {
      // Input values
      startMoney: this.startMoney,
      targetMoney: this.targetMoney,
      currentBalance: this.currentBalance,
      
      // Calculated values
      totalSpent: this.calculateTotalSpent(),
      profitLoss: this.calculateProfitLoss(),
      totalBet: this.getTotalBet(),
      totalWins: this.getTotalWins(),
      
      // Slot statistics
      bestSlot: bestSlot,
      worstSlot: worstSlot,
      totalBonuses: this.getTotalBonuses(),
      openedBonuses: this.getOpenedBonuses(),
      unopenedBonuses: this.getUnopenedBonuses(),
      averageMultiplier: this.getAverageMultiplier(),
      requiredMultiplier: this.getRequiredMultiplier(),
      
      // Additional useful calculations
      huntProgress: this.getTotalBonuses() > 0 ? (this.getOpenedBonuses() / this.getTotalBonuses()) * 100 : 0,
      isBreakingEven: this.calculateProfitLoss() >= 0,
      remainingToTarget: Math.max(0, this.targetMoney - this.currentBalance)
    };
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency symbol (default: €)
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = '€') {
    if (typeof amount !== 'number') return `${currency}0.00`;
    return `${currency}${Math.abs(amount).toFixed(2)}`;
  }

  /**
   * Format multiplier for display
   * @param {number} multiplier - Multiplier to format
   * @returns {string} Formatted multiplier string
   */
  formatMultiplier(multiplier) {
    if (typeof multiplier !== 'number') return '0.00x';
    return `${multiplier.toFixed(2)}x`;
  }

  /**
   * Format percentage for display
   * @param {number} percentage - Percentage to format
   * @returns {string} Formatted percentage string
   */
  formatPercentage(percentage) {
    if (typeof percentage !== 'number') return '0.0%';
    return `${percentage.toFixed(1)}%`;
  }

  /**
   * Export data for saving/backup
   * @returns {Object} Exportable data object
   */
  exportData() {
    return {
      bonuses: this.bonuses,
      startMoney: this.startMoney,
      targetMoney: this.targetMoney,
      currentBalance: this.currentBalance,
      timestamp: new Date().toISOString(),
      statistics: this.calculateTotals()
    };
  }

  /**
   * Import data from backup
   * @param {Object} data - Data object to import
   */
  importData(data) {
    if (data && typeof data === 'object') {
      this.bonuses = Array.isArray(data.bonuses) ? data.bonuses : [];
      this.startMoney = typeof data.startMoney === 'number' ? data.startMoney : 0;
      this.targetMoney = typeof data.targetMoney === 'number' ? data.targetMoney : 0;
      this.currentBalance = typeof data.currentBalance === 'number' ? data.currentBalance : 0;
    }
  }

  /**
   * Validate bonus object structure
   * @param {Object} bonus - Bonus object to validate
   * @returns {boolean} True if valid
   */
  validateBonus(bonus) {
    return (
      bonus &&
      typeof bonus === 'object' &&
      typeof bonus.name === 'string' &&
      bonus.name.trim().length > 0 &&
      typeof bonus.bet === 'number' &&
      bonus.bet > 0 &&
      (bonus.win === undefined || typeof bonus.win === 'number') &&
      typeof bonus.isSuper === 'boolean'
    );
  }

  /**
   * Add a new bonus (with validation)
   * @param {Object} bonus - Bonus object to add
   * @returns {boolean} True if successfully added
   */
  addBonus(bonus) {
    if (!this.validateBonus(bonus)) {
      console.error('Invalid bonus object:', bonus);
      return false;
    }

    this.bonuses.push({
      ...bonus,
      id: Date.now() + Math.random(), // Simple ID generation
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Update an existing bonus
   * @param {number|string} bonusId - ID of bonus to update
   * @param {Object} updates - Properties to update
   * @returns {boolean} True if successfully updated
   */
  updateBonus(bonusId, updates) {
    const bonusIndex = this.bonuses.findIndex(bonus => bonus.id === bonusId);
    
    if (bonusIndex === -1) {
      console.error('Bonus not found:', bonusId);
      return false;
    }

    const updatedBonus = { ...this.bonuses[bonusIndex], ...updates };
    
    if (!this.validateBonus(updatedBonus)) {
      console.error('Invalid bonus update:', updates);
      return false;
    }

    this.bonuses[bonusIndex] = updatedBonus;
    return true;
  }

  /**
   * Remove a bonus
   * @param {number|string} bonusId - ID of bonus to remove
   * @returns {boolean} True if successfully removed
   */
  removeBonus(bonusId) {
    const initialLength = this.bonuses.length;
    this.bonuses = this.bonuses.filter(bonus => bonus.id !== bonusId);
    return this.bonuses.length < initialLength;
  }
}

// Factory function for creating calculator instances
function createBonusHuntCalculator() {
  return new BonusHuntCalculator();
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // Node.js/CommonJS
  module.exports = { BonusHuntCalculator, createBonusHuntCalculator };
} else if (typeof window !== 'undefined') {
  // Browser global
  window.BonusHuntCalculator = BonusHuntCalculator;
  window.createBonusHuntCalculator = createBonusHuntCalculator;
}

/**
 * Calculate average multiplier for bonuses that have wins
 * @param {Array} bonuses - Array of bonus objects
 * @returns {number} Average multiplier or 0 if no bonuses have wins
 */
function calculateAverageMultiplier(bonuses) {
  if (!Array.isArray(bonuses)) return 0;
  
  // Only count bonuses that already have a win value
  const bonusesWithWins = bonuses.filter(bonus => 
    bonus && 
    typeof bonus.win === 'number' && 
    bonus.win !== null &&
    typeof bonus.bet === 'number' && 
    bonus.bet > 0
  );
  
  if (bonusesWithWins.length === 0) {
    return 0;
  }
  
  // Calculate multiplier for each opened bonus: multiplier = win / bet
  const totalMultiplier = bonusesWithWins.reduce((sum, bonus) => {
    return sum + (bonus.win / bonus.bet);
  }, 0);
  
  // Average multiplier = (sum of all multipliers) / (number of bonuses with a win)
  return totalMultiplier / bonusesWithWins.length;
}

/**
 * Calculate required multiplier needed from remaining bonuses to break even
 * @param {Array} bonuses - Array of bonus objects
 * @param {number} startMoney - Starting balance
 * @param {number} currentBalance - Current balance
 * @returns {number|null} Required multiplier or null if impossible to recover
 */
function calculateRequiredMultiplier(bonuses, startMoney, currentBalance) {
  if (!Array.isArray(bonuses) || typeof startMoney !== 'number' || typeof currentBalance !== 'number') {
    return 0;
  }
  
  // Total spent = startMoney - currentBalance
  const totalSpent = startMoney - currentBalance;
  
  // Total win so far = sum(win of bonuses where win != null)
  const totalWinsSoFar = bonuses.reduce((sum, bonus) => {
    if (bonus && typeof bonus.win === 'number' && bonus.win !== null) {
      return sum + bonus.win;
    }
    return sum;
  }, 0);
  
  // Total remaining bets = sum(bet of bonuses where win == null)
  const remainingBets = bonuses.reduce((sum, bonus) => {
    if (bonus && 
        typeof bonus.bet === 'number' && 
        bonus.bet > 0 && 
        (bonus.win === null || bonus.win === undefined)) {
      return sum + bonus.bet;
    }
    return sum;
  }, 0);
  
  // Amount still needed to break even
  const requiredReturn = totalSpent - totalWinsSoFar;
  
  // If already break-even or profit, return 0
  if (requiredReturn <= 0) {
    return 0;
  }
  
  // If no remaining bets and still need money, return null (impossible to recover)
  if (remainingBets === 0 && requiredReturn > 0) {
    return null;
  }
  
  // Required multiplier = requiredReturn / remainingBets
  return requiredReturn / remainingBets;
}

// Export the calculation functions globally
if (typeof window !== 'undefined') {
  window.calculateAverageMultiplier = calculateAverageMultiplier;
  window.calculateRequiredMultiplier = calculateRequiredMultiplier;
}

// Example usage:
/*
const bonuses = [
  { bet: 1.00, win: null },     // Not opened yet
  { bet: 2.00, win: 15.50 },    // Opened: 15.50 / 2.00 = 7.75x
  { bet: 1.50, win: 3.00 }      // Opened: 3.00 / 1.50 = 2.00x
];

const avgMult = calculateAverageMultiplier(bonuses);
// Result: (7.75 + 2.00) / 2 = 4.875

const reqMult = calculateRequiredMultiplier(bonuses, 1000, 850);
// totalSpent = 1000 - 850 = 150
// totalWinsSoFar = 15.50 + 3.00 = 18.50
// remainingBets = 1.00 (only first bonus)
// requiredReturn = 150 - 18.50 = 131.50
// requiredMultiplier = 131.50 / 1.00 = 131.50
*/