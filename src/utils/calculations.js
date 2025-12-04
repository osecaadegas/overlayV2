// Calculation utilities for bonus hunt tracking

/**
 * Calculate the average multiplier from opened bonuses only
 * @param {Array} bonuses - Array of bonus objects
 * @returns {number} Average multiplier
 */
export const calculateAverageMultiplier = (bonuses) => {
  if (!Array.isArray(bonuses)) return 0;
  
  // Only count bonuses that have been opened (have multiplier)
  const openedBonuses = bonuses.filter(bonus => 
    bonus.multiplier !== null && bonus.multiplier !== undefined && bonus.multiplier > 0
  );
  
  if (openedBonuses.length === 0) return 0;
  
  // Average of all multipliers
  const totalMultiplier = openedBonuses.reduce((sum, bonus) => sum + bonus.multiplier, 0);
  return totalMultiplier / openedBonuses.length;
};

/**
 * Calculate the required multiplier to break even from remaining bonuses
 * @param {Array} bonuses - Array of bonus objects
 * @param {number} totalCost - Total amount spent
 * @returns {number} Required multiplier for break-even
 */
export const calculateRequiredMultiplier = (bonuses, totalCost) => {
  if (!Array.isArray(bonuses)) return 0;
  
  // Total return from opened bonuses
  const totalReturn = calculateTotalReturn(bonuses);
  
  // Remaining bets (unopened bonuses)
  const remainingBets = bonuses
    .filter(b => b.multiplier === null || b.multiplier === undefined)
    .reduce((sum, b) => sum + b.betSize, 0);
  
  if (remainingBets === 0) return 0;
  
  // Amount needed to break even
  const needed = totalCost - totalReturn;
  
  return needed > 0 ? needed / remainingBets : 0;
};

/**
 * Calculate total cost from bonuses
 * @param {Array} bonuses - Array of bonus objects
 * @returns {number} Total cost
 */
export const calculateTotalCost = (bonuses) => {
  return bonuses.reduce((sum, bonus) => sum + (bonus.betSize || 0), 0);
};

/**
 * Calculate total return from opened bonuses
 * @param {Array} bonuses - Array of bonus objects
 * @returns {number} Total return
 */
export const calculateTotalReturn = (bonuses) => {
  return bonuses.reduce((sum, bonus) => {
    if (bonus.multiplier !== null && bonus.multiplier !== undefined) {
      return sum + (bonus.betSize * bonus.multiplier);
    }
    return sum;
  }, 0);
};

/**
 * Calculate profit/loss
 * @param {number} totalReturn - Total return from bonuses
 * @param {number} totalCost - Total cost of bonuses
 * @returns {number} Profit or loss
 */
export const calculateProfitLoss = (totalReturn, totalCost) => {
  return totalReturn - totalCost;
};

/**
 * Count opened bonuses
 * @param {Array} bonuses - Array of bonus objects
 * @returns {number} Number of opened bonuses
 */
export const countOpenedBonuses = (bonuses) => {
  return bonuses.filter(bonus => 
    bonus.multiplier !== null && bonus.multiplier !== undefined
  ).length;
};

/**
 * Find best performing slot
 * @param {Array} bonuses - Array of bonus objects
 * @returns {Object|null} Best slot object
 */
export const findBestSlot = (bonuses) => {
  const openedBonuses = bonuses.filter(b => b.multiplier !== null && b.multiplier !== undefined && b.multiplier > 0);
  if (openedBonuses.length === 0) return null;
  
  return openedBonuses.reduce((best, current) => {
    return current.multiplier > (best?.multiplier || 0) ? current : best;
  }, null);
};

/**
 * Find worst performing slot
 * @param {Array} bonuses - Array of bonus objects
 * @returns {Object|null} Worst slot object
 */
export const findWorstSlot = (bonuses) => {
  const openedBonuses = bonuses.filter(b => b.multiplier !== null && b.multiplier !== undefined && b.multiplier > 0);
  if (openedBonuses.length === 0) return null;
  
  return openedBonuses.reduce((worst, current) => {
    return current.multiplier < (worst?.multiplier || Infinity) ? current : worst;
  }, null);
};

/**
 * Calculate all stats at once
 * @param {Array} bonuses - Array of bonus objects
 * @returns {Object} Object containing all calculated stats
 */
export const calculateStats = (bonuses) => {
  const totalBonuses = bonuses.length;
  const totalCost = calculateTotalCost(bonuses);
  const totalReturn = calculateTotalReturn(bonuses);
  const profitLoss = calculateProfitLoss(totalReturn, totalCost);
  const averageMultiplier = calculateAverageMultiplier(bonuses);
  const requiredMultiplier = calculateRequiredMultiplier(bonuses, totalCost);
  const openedBonuses = countOpenedBonuses(bonuses);
  const bestSlot = findBestSlot(bonuses);
  const worstSlot = findWorstSlot(bonuses);

  return {
    totalBonuses,
    totalCost,
    totalReturn,
    profitLoss,
    averageMultiplier,
    requiredMultiplier,
    openedBonuses,
    bestSlot,
    worstSlot
  };
};
