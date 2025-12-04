import { useBonusHunt } from '../../context/BonusHuntContext';
import { slotDatabase } from '../../data/slotDatabase';
import './ModernCardLayout.css';

const ModernCardLayout = () => {
  const { bonuses, getSlotImage } = useBonusHunt();

  if (bonuses.length === 0) {
    return (
      <div className="modern-card-layout">
        <div className="no-bonuses-card">
          <div className="no-bonuses-icon">🎰</div>
          <p>No bonuses added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-card-layout">
      <div className="card-carousel">
        {bonuses.map((bonus) => {
          const payout = bonus.multiplier ? bonus.multiplier * bonus.betSize : 0;
          const profitLoss = payout - bonus.betSize;
          const slot = slotDatabase.find(s => s.name.toLowerCase() === bonus.slotName.toLowerCase());
          const image = getSlotImage(bonus.slotName);
          const provider = slot?.provider || 'Unknown Provider';
          
          return (
            <div key={bonus.id} className={`bonus-card ${bonus.opened ? 'opened' : 'unopened'}`}>
              <div className="card-image-section">
                <img 
                  src={image} 
                  alt={bonus.slotName}
                  className="card-slot-image"
                />
                {bonus.isSuper && <div className="card-super-badge">⭐ SUPER</div>}
                <div className="card-status-badge">
                  {bonus.opened ? '✓ Opened' : '○ Unopened'}
                </div>
              </div>
              
              <div className="card-details-section">
                <h3 className="card-slot-name">{bonus.slotName}</h3>
                <div className="card-provider">{provider}</div>
                
                <div className="card-stats">
                  <div className="card-stat">
                    <span className="stat-label">Bet</span>
                    <span className="stat-value">€{bonus.betSize.toFixed(2)}</span>
                  </div>
                  
                  {bonus.opened && (
                    <>
                      <div className="card-stat">
                        <span className="stat-label">Payout</span>
                        <span className="stat-value">€{payout.toFixed(2)}</span>
                      </div>
                      <div className="card-stat">
                        <span className="stat-label">Multiplier</span>
                        <span className={`stat-value ${bonus.multiplier >= 1 ? 'positive' : 'negative'}`}>
                          {bonus.multiplier.toFixed(2)}x
                        </span>
                      </div>
                      <div className="card-stat">
                        <span className="stat-label">Profit/Loss</span>
                        <span className={`stat-value ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
                          {profitLoss >= 0 ? '+' : ''}€{profitLoss.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModernCardLayout;
