import { useState, useEffect } from 'react';
import './GiveawayPanel.css';
import useDraggable from '../../hooks/useDraggable';

// Giveaway Panel with Wheel of Names
const GiveawayPanel = ({ onClose }) => {
  // Load initial state from localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  const [entries, setEntries] = useState(() => loadFromStorage('giveaway_entries', []));
  const [newEntry, setNewEntry] = useState('');
  const [winner, setWinner] = useState(() => loadFromStorage('giveaway_winner', null));
  const [isSpinning, setIsSpinning] = useState(false);
  const [giveawayTitle, setGiveawayTitle] = useState(() => loadFromStorage('giveaway_title', ''));
  const [showWheel, setShowWheel] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('giveaway_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('giveaway_winner', JSON.stringify(winner));
  }, [winner]);

  useEffect(() => {
    localStorage.setItem('giveaway_title', JSON.stringify(giveawayTitle));
  }, [giveawayTitle]);

  const addEntry = () => {
    if (newEntry.trim()) {
      const newEntryData = { id: Date.now(), name: newEntry.trim() };
      setEntries(prev => [...prev, newEntryData]);
      setNewEntry('');
    }
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const clearEntries = () => {
    setEntries([]);
    setWinner(null);
  };

  const pickWinner = () => {
    if (entries.length === 0) {
      console.warn('Add entries first!');
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);

    // Select final winner
    const finalWinner = entries[Math.floor(Math.random() * entries.length)];
    const winnerIndex = entries.findIndex(e => e.id === finalWinner.id);
    
    // Calculate rotation to land on winner (multiple full spins + final position)
    const segmentAngle = 360 / entries.length;
    // Calculate the center angle of the winner segment
    // Segments start at 0° and go clockwise, pointer is at top (12 o'clock)
    const segmentCenterAngle = (winnerIndex * segmentAngle) + (segmentAngle / 2);
    
    // Minimum 3 full spins + random extra rotations (3-5) to ensure visual variety
    const minSpins = 3;
    const extraSpins = Math.floor(Math.random() * 3); // 0-2 extra spins
    const fullSpins = minSpins + extraSpins;
    
    // Calculate rotation needed: full spins + rotation to align segment center with pointer
    // We need to rotate so the segment center is at the top (0°/360°)
    const additionalRotation = (fullSpins * 360) + (360 - segmentCenterAngle);
    
    // Spin the wheel by adding to current rotation (ensures visible spin every time)
    setWheelRotation(prev => prev + additionalRotation);
    
    // After spin completes (3 seconds), show winner and confetti
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(finalWinner);
      setShowConfetti(true);
      
      // Hide confetti after 4 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
    }, 3000);
    
    return;
    
    const spinOnce = () => {
      if (false) { // Disabled old code
        setIsSpinning(false);
        const finalWinner = entries[Math.floor(Math.random() * entries.length)];
        setWinner(finalWinner);
        return;
      }
      
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setWinner(randomEntry);
      spins++;
      
      // Gradually slow down
      delay = delay + (spins * 10);
      setTimeout(spinOnce, delay);
    };
    
    spinOnce();
  };

  const importFromText = () => {
    const text = prompt('Paste entries (one per line):');
    if (text) {
      const names = text.split('\n').filter(n => n.trim());
      const newEntries = names.map(name => ({ id: Date.now() + Math.random(), name: name.trim() }));
      setEntries([...entries, ...newEntries]);
    }
  };

  const draggableRef = useDraggable(true, 'giveaway');

  return (
    <>
      <div className="giveaway-overlay">
        <div className="giveaway-panel" ref={draggableRef}>
          <div className="giveaway-header drag-handle">
            <h2>🎁 Giveaway</h2>
            <button 
              className="toggle-wheel-btn" 
              onClick={() => setShowWheel(!showWheel)}
              title={showWheel ? "Hide Wheel" : "Show Wheel"}
            >
              {showWheel ? '🎡 Hide Wheel' : '🎡 Show Wheel'}
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

        <div className="giveaway-content">
          <div className="giveaway-setup">
            <div className="section">
              <h3>Giveaway Title</h3>
              <input
                type="text"
                className="title-input"
                value={giveawayTitle}
                onChange={(e) => setGiveawayTitle(e.target.value)}
                placeholder="e.g., $100 Casino Bonus"
              />
            </div>

            <div className="section">
              <h3>Add Entries ({entries.length})</h3>
              <div className="entry-input-group">
                <input
                  type="text"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEntry()}
                  placeholder="Enter participant name"
                />
                <button className="add-btn" onClick={addEntry}>
                  ➕ Add
                </button>
              </div>

              <div className="entry-actions">
                <button className="action-btn import" onClick={importFromText}>
                  📋 Import List
                </button>
                <button className="action-btn clear" onClick={clearEntries}>
                  🗑️ Clear All
                </button>
              </div>

              <div className="entries-list">
                {entries.map((entry, index) => (
                  <div key={entry.id} className="entry-item">
                    <span className="entry-number">{index + 1}</span>
                    <span className="entry-name">{entry.name}</span>
                    <button className="remove-btn" onClick={() => removeEntry(entry.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="giveaway-draw">
            <div className="section">
              <h3>Winner Selection</h3>
              
              {winner && (
                <div className={`winner-display ${isSpinning ? 'spinning' : 'final'}`}>
                  <div className="winner-icon">🎉</div>
                  <div className="winner-text">
                    {isSpinning ? 'Drawing...' : 'Winner!'}
                  </div>
                  <div className="winner-name">{winner.name}</div>
                </div>
              )}

              {!winner && (
                <div className="no-winner">
                  <div className="no-winner-icon">🎲</div>
                  <div className="no-winner-text">Ready to draw!</div>
                </div>
              )}

              <button 
                className={`draw-btn ${isSpinning ? 'spinning' : ''}`}
                onClick={pickWinner}
                disabled={isSpinning || entries.length === 0}
              >
                {isSpinning ? '🎰 Drawing...' : '🎲 Pick Winner'}
              </button>

              {winner && !isSpinning && (
                <div className="winner-actions">
                  <button className="winner-action-btn" onClick={pickWinner}>
                    🔄 Draw Again
                  </button>
                  <button 
                    className="winner-action-btn" 
                    onClick={() => {
                      setEntries(entries.filter(e => e.id !== winner.id));
                      setWinner(null);
                    }}
                  >
                    ✅ Remove Winner
                  </button>
                </div>
              )}
            </div>

            <div className="section">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{entries.length}</div>
                  <div className="stat-label">Total Entries</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {entries.length > 0 ? ((1 / entries.length) * 100).toFixed(2) : 0}%
                  </div>
                  <div className="stat-label">Win Chance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Wheel of Names Sidebar */}
      <div className={`wheel-sidebar ${showWheel ? 'visible' : ''}`}>
        <div className="wheel-header">
          <h3>🎡 Wheel of Names</h3>
        </div>
        <div className="wheel-container">
          <svg 
            viewBox="0 0 400 400" 
            className={`wheel-svg ${isSpinning ? 'spinning' : ''}`}
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'transform 0.5s ease'
            }}
          >
            {entries.length > 0 ? (
              entries.map((entry, index) => {
                const totalEntries = entries.length;
                const angle = (360 / totalEntries);
                const startAngle = index * angle - 90;
                const endAngle = startAngle + angle;
                
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 200 + 200 * Math.cos(startRad);
                const y1 = 200 + 200 * Math.sin(startRad);
                const x2 = 200 + 200 * Math.cos(endRad);
                const y2 = 200 + 200 * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                const colors = [
                  '#9147ff', '#00e1ff', '#ff6b6b', '#10b981', 
                  '#fbbf24', '#a855f7', '#06b6d4', '#f59e0b'
                ];
                const color = colors[index % colors.length];
                
                const midAngle = startAngle + angle / 2;
                const textRad = (midAngle * Math.PI) / 180;
                const textX = 200 + 140 * Math.cos(textRad);
                const textY = 200 + 140 * Math.sin(textRad);
                
                return (
                  <g key={entry.id}>
                    <path
                      d={`M ${x1} ${y1} A 200 200 0 ${largeArc} 1 ${x2} ${y2} L 200 200 Z`}
                      fill={color}
                      stroke="#1a1b2e"
                      strokeWidth="2"
                      className="wheel-segment"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      className="wheel-text"
                    >
                      {entry.name.length > 12 ? entry.name.substring(0, 12) + '...' : entry.name}
                    </text>
                  </g>
                );
              })
            ) : (
              <text x="200" y="200" fill="#9ca3af" fontSize="16" textAnchor="middle">
                Add entries to spin!
              </text>
            )}
          </svg>
          
          {/* Pointer */}
          <div className="wheel-pointer">▶</div>
          
          {/* Winner Trophy Display */}
          {winner && !isSpinning && (
            <div className="wheel-winner-display">
              <div className="winner-trophy">🏆</div>
              <div className="winner-name-overlay">{winner.name}</div>
            </div>
          )}
          
          {/* Confetti */}
          {showConfetti && (
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    backgroundColor: ['#9147ff', '#00e1ff', '#ff6b6b', '#10b981', '#fbbf24'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="wheel-stats">
          <div className="wheel-stat">
            <span className="wheel-stat-label">Entries:</span>
            <span className="wheel-stat-value">{entries.length}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GiveawayPanel;
