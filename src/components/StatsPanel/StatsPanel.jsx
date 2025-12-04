import './StatsPanel.css';
import { useBonusHunt } from '../../context/BonusHuntContext';
import useDraggable from '../../hooks/useDraggable';

const StatsPanel = () => {
  const { bonuses, startMoney, stopMoney, actualBalance, totalSpent } = useBonusHunt();
  const draggableRef = useDraggable(true, 'stats');

  const totalBonuses = bonuses.length;
  const completedBonuses = bonuses.filter(b => b.opened && b.multiplier !== null).length;

  const totalWinnings = bonuses.reduce((sum, b) => {
    if (b.opened && b.multiplier !== null) {
      return sum + (b.betSize * b.multiplier);
    }
    return sum;
  }, 0);
  
  const openedBonuses = bonuses.filter(b => b.opened && b.multiplier !== null);
  const averageMultiplier = openedBonuses.length > 0
    ? openedBonuses.reduce((sum, b) => sum + b.multiplier, 0) / openedBonuses.length
    : 0;
  
  const profitLoss = totalWinnings - totalSpent;
  
  const unopenedBets = bonuses
    .filter(b => !b.opened || b.multiplier === null)
    .reduce((sum, b) => sum + b.betSize, 0);
  
  const requiredMultiplier = unopenedBets > 0
    ? (totalSpent - totalWinnings) / unopenedBets
    : 0;

  const bestSlot = openedBonuses.length > 0
    ? openedBonuses.reduce((best, b) => {
        if (!best || b.multiplier > best.multiplier) {
          return { slotName: b.slotName, multiplier: b.multiplier };
        }
        return best;
      }, null)
    : null;

  const worstSlot = openedBonuses.length > 0
    ? openedBonuses.reduce((worst, b) => {
        if (!worst || b.multiplier < worst.multiplier) {
          return { slotName: b.slotName, multiplier: b.multiplier };
        }
        return worst;
      }, null)
    : null;

  const formatCurrency = (value) => `�${value.toFixed(2)}`;
  const formatMultiplier = (value) => `${value.toFixed(2)}x`;

  return (
    <div className="bonus-stats-panel-inline" ref={draggableRef}>
      <div className="stats-panel-header drag-handle">
        <h3> BONUS HUNT STATISTICS</h3>
      </div>
      
      <div className="stats-panel-content">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Start Money</div>
            <div className="stat-value">{formatCurrency(startMoney)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Target Money</div>
            <div className="stat-value">{formatCurrency(stopMoney)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Current Balance</div>
            <div className="stat-value">{formatCurrency(actualBalance)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">{formatCurrency(totalSpent)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">{profitLoss >= 0 ? '' : ''}</div>
          <div className="stat-info">
            <div className="stat-label">Total Profit/Loss</div>
            <div className="stat-value" style={{ color: profitLoss >= 0 ? '#10b981' : '#ef4444' }}>
              {formatCurrency(profitLoss)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Total Bonuses</div>
            <div className="stat-value">{totalBonuses}</div>
            <div className="stat-subvalue">({completedBonuses} opened)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Avg Multiplier</div>
            <div className="stat-value" style={{ color: averageMultiplier >= requiredMultiplier ? '#10b981' : '#ef4444' }}>
              {formatMultiplier(averageMultiplier)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Required Mult.</div>
            <div className="stat-value">{formatMultiplier(requiredMultiplier)}</div>
            <div className="stat-subvalue">(break-even)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Best Slot</div>
            <div className="stat-value">{bestSlot ? bestSlot.slotName : '--'}</div>
            {bestSlot && <div className="stat-subvalue">{formatMultiplier(bestSlot.multiplier)}</div>}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-label">Worst Slot</div>
            <div className="stat-value">{worstSlot ? worstSlot.slotName : '--'}</div>
            {worstSlot && <div className="stat-subvalue">{formatMultiplier(worstSlot.multiplier)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
