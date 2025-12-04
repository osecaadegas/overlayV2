import { useEffect, useRef, useState } from 'react';
import { useBonusHunt } from '../../context/BonusHuntContext';
import { slotDatabase } from '../../data/slotDatabase';
import { getProviderLogo } from '../../utils/providerLogos';
import './ModernSidebarLayout.css';

const ModernSidebarLayout = ({ showBonusOpening, selectedBonusId }) => {
  const { bonuses, getSlotImage, stats, startMoney, stopMoney, actualBalance, totalSpent } = useBonusHunt();
  const [currentBonusIndex, setCurrentBonusIndex] = useState(0);
  const [nextBonusIndex, setNextBonusIndex] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // Find currently opening bonus - if selectedBonusId is provided, use it; otherwise use first unopened
  const openingBonus = showBonusOpening 
    ? (selectedBonusId 
        ? bonuses.find(b => b.id === selectedBonusId) 
        : bonuses.find(b => !b.opened))
    : null;

  // Auto-rotate through bonuses - preload next bonus
  useEffect(() => {
    if (bonuses.length === 0) return;

    const rotateInterval = setInterval(() => {
      const upcomingIndex = (currentBonusIndex + 1) % bonuses.length;
      
      // Preload next slot image and provider logo while front is visible
      if (!bonuses[upcomingIndex] || !bonuses[upcomingIndex].slotName) return;
      
      const img = new Image();
      img.src = getSlotImage(bonuses[upcomingIndex].slotName);
      
      // Preload provider logo
      const slot = slotDatabase.find(s => s.name.toLowerCase() === bonuses[upcomingIndex].slotName.toLowerCase());
      if (slot) {
        const logoUrl = getProviderLogo(slot.provider);
        if (logoUrl) {
          const logoImg = new Image();
          logoImg.src = logoUrl;
        }
      }
      
      // Start flip after preloading
      const startFlip = () => {
        setIsFlipped(true);
        
        // Wait for flip to show back, then update to next slot data
        setTimeout(() => {
          setNextBonusIndex(upcomingIndex);
          
          // After back is shown with new provider, flip to front with new slot image
          setTimeout(() => {
            setCurrentBonusIndex(upcomingIndex);
            setImageKey(prev => prev + 1);
            setIsFlipped(false);
          }, 100);
        }, 1000); // Wait for flip animation to complete
      };
      
      img.onload = startFlip;
      img.onerror = startFlip;
      
      // Fallback timeout
      setTimeout(startFlip, 200);
    }, 5000); // Change bonus every 5 seconds

    return () => clearInterval(rotateInterval);
  }, [bonuses.length, currentBonusIndex, getSlotImage, bonuses]);

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="modern-sidebar-container">
        {/* Statistics Card */}
        <div className="modern-stats-card">
        <div className="modern-stats-header">
          <div className="stats-icon">📊</div>
          <h3>BONUS HUNT STATISTICS</h3>
        </div>
        <div className="modern-stats-grid">
          <div className="modern-stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">START MONEY</div>
              <div className="stat-value">€{startMoney.toFixed(2)}</div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">TARGET MONEY</div>
              <div className="stat-value">€{stopMoney.toFixed(2)}</div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <div className="stat-label">CURRENT BALANCE</div>
              <div className="stat-value">€{actualBalance.toFixed(2)}</div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <div className="stat-label">TOTAL SPENT</div>
              <div className="stat-value">€{totalSpent.toFixed(2)}</div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">TOTAL PROFIT/LOSS</div>
              <div className={`stat-value ${stats.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                €{stats.profitLoss.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">🎲</div>
            <div className="stat-content">
              <div className="stat-label">TOTAL BONUSES</div>
              <div className="stat-value">{stats.totalBonuses} <span className="stat-subtext">(opened)</span></div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">📉</div>
            <div className="stat-content">
              <div className="stat-label">AVG MULTIPLIER</div>
              <div className="stat-value">{stats.averageMultiplier.toFixed(2)}x</div>
            </div>
          </div>
          <div className="modern-stat-item">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-label">REQUIRED MULT.</div>
              <div className="stat-value">{stats.requiredMultiplier.toFixed(2)}x</div>
              <div className="stat-subtext">(break-even)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Spinning Bonus Card */}
      {bonuses.length > 0 && bonuses[currentBonusIndex] && bonuses[currentBonusIndex].slotName ? (
        <div className="spinning-card-wrapper">
            <div className={`spinning-card ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
              {/* Front - Slot Image */}
              <div className="card-face card-front">
                <img 
                  key={`front-${imageKey}-${currentBonusIndex}`}
                  src={getSlotImage(bonuses[currentBonusIndex].slotName)} 
                  alt={bonuses[currentBonusIndex].slotName}
                  className="card-slot-image"
                />
                <div className="card-overlay">
                  <div className="card-slot-name">{bonuses[currentBonusIndex].slotName}</div>
                  <div className="card-bet-info">
                    <span className="card-bet">€{bonuses[currentBonusIndex].betSize.toFixed(2)}</span>
                    {bonuses[currentBonusIndex].isSuper && <span className="card-super-badge">⭐ SUPER</span>}
                  </div>
                  {bonuses[currentBonusIndex].opened && (
                    <div className="card-result">
                      <div className="card-payout">€{(bonuses[currentBonusIndex].multiplier * bonuses[currentBonusIndex].betSize).toFixed(2)}</div>
                      <div className={`card-multiplier ${bonuses[currentBonusIndex].multiplier >= 1 ? 'positive' : 'negative'}`}>
                        {bonuses[currentBonusIndex].multiplier.toFixed(2)}x
                      </div>
                    </div>
                  )}
                  {!bonuses[currentBonusIndex].opened && (
                    <div className="card-unopened">
                      <div className="unopened-icon">🔒</div>
                      <div className="unopened-text">NOT OPENED</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Back - Provider Logo */}
              <div className="card-face card-back">
                <div className="card-provider-section">
                  <div className="provider-logo-wrapper">
                    {(() => {
                      const slot = bonuses[nextBonusIndex]?.slotName ? slotDatabase.find(s => s.name.toLowerCase() === bonuses[nextBonusIndex].slotName.toLowerCase()) : null;
                      const logoUrl = slot ? getProviderLogo(slot.provider) : null;
                      return slot && logoUrl ? (
                        <img src={logoUrl} alt={slot.provider} className="provider-logo-img" />
                      ) : slot ? (
                        <div className="provider-logo-text">{slot.provider.toUpperCase()}</div>
                      ) : (
                        <div className="provider-logo-text">SLOT PROVIDER</div>
                      );
                    })()}
                  </div>
                  <div className="card-back-stats">
                    <div className="back-stat">
                      <span className="back-stat-label">BET SIZE</span>
                      <span className="back-stat-value">€{bonuses[nextBonusIndex].betSize.toFixed(2)}</span>
                    </div>
                    <div className="back-stat">
                      <span className="back-stat-label">STATUS</span>
                      <span className={`back-stat-value ${bonuses[nextBonusIndex].opened ? 'opened' : 'unopened'}`}>
                        {bonuses[nextBonusIndex].opened ? '✓ OPENED' : '○ WAITING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      ) : null}
    </div>
  );
};

export default ModernSidebarLayout;
