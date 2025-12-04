import { useState, useEffect, useRef } from 'react';
import { useBonusHunt } from '../../context/BonusHuntContext';
import { slotDatabase } from '../../data/slotDatabase';
import './BonusOpening.css';
import useDraggable from '../../hooks/useDraggable';

const BonusOpening = ({ bonusId, onClose }) => {
  const { bonuses, updateBonusResult, getSlotImage } = useBonusHunt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [payout, setPayout] = useState('');
  const inputRef = useRef(null);
  const draggableRef = useDraggable(true, 'bonusopening');

  const unopenedBonuses = bonuses.filter(b => !b.opened);
  
  // If bonusId is provided, start from that bonus
  useEffect(() => {
    if (bonusId) {
      const index = unopenedBonuses.findIndex(b => b.id === bonusId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [bonusId]);

  const currentBonus = unopenedBonuses[currentIndex];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentIndex < unopenedBonuses.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      } else if (e.key === 'Enter' && payout) {
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, payout, unopenedBonuses.length]);

  const handleSave = () => {
    if (payout && currentBonus) {
      const payoutValue = parseFloat(payout);
      updateBonusResult(currentBonus.id, payoutValue);
      setPayout('');
      
      if (currentIndex < unopenedBonuses.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < unopenedBonuses.length - 1) {
      setPayout('');
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setPayout('');
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentBonus) {
    return (
      <div className="bonus-opening-panel">
        <div className="bonus-opening-header">
          <h3>🎁 Bonus Opening</h3>
          <button className="compact-close-btn" onClick={onClose} title="Close">✕</button>
        </div>
        <div className="no-bonuses-compact">
          <div className="no-bonuses-icon">🎯</div>
          <p>No unopened bonuses</p>
        </div>
      </div>
    );
  }

  const multiplier = payout ? (parseFloat(payout) / currentBonus.betSize).toFixed(2) : '0.00';
  const image = getSlotImage(currentBonus.slotName);
  const slot = slotDatabase.find(s => s.name.toLowerCase() === currentBonus.slotName.toLowerCase());
  const provider = slot?.provider || 'N/A';

  return (
    <div className="bonus-opening-panel" ref={draggableRef}>
      <div className="bonus-opening-header drag-handle">
        <h3>🎁 Opening {currentIndex + 1}/{unopenedBonuses.length}</h3>
        <button className="compact-close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      <div className="bonus-opening-content">
        <div className="compact-slot-image">
          <img src={image} alt={currentBonus.slotName} />
        </div>
        
        <div className="compact-slot-info">
          <div className="slot-name-row">
            <span className="slot-name">{currentBonus.slotName}</span>
            {currentBonus.isSuper && <span className="super-badge">⭐</span>}
          </div>
          <div className="slot-meta">
            <span>Bet: €{currentBonus.betSize.toFixed(2)}</span>
            <span>•</span>
            <span>{provider}</span>
          </div>
        </div>

        <div className="compact-input-group">
          <label>Payout Amount</label>
          <div className="input-wrapper">
            <span className="currency">€</span>
            <input
              ref={inputRef}
              type="number"
              value={payout}
              onChange={(e) => setPayout(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          {payout && (
            <div className="multiplier-info">
              <span>Multiplier: </span>
              <span className={`multiplier ${parseFloat(multiplier) > 0 ? 'positive' : ''}`}>
                {multiplier}x
              </span>
            </div>
          )}
        </div>

        <div className="compact-actions">
          <button 
            className="compact-btn compact-btn-nav" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ←
          </button>
          <button 
            className="compact-btn compact-btn-save"
            onClick={handleSave}
            disabled={!payout}
          >
            Save ✓
          </button>
          <button 
            className="compact-btn compact-btn-nav"
            onClick={handleNext}
            disabled={currentIndex === unopenedBonuses.length - 1}
          >
            →
          </button>
        </div>

        <div className="compact-hints">
          <span>← → Nav</span>
          <span>•</span>
          <span>Enter Save</span>
          <span>•</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default BonusOpening;
