import { useState, useEffect, useRef } from 'react';
import './SlotMachineOverlay.css';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];

const SlotMachineOverlay = ({ onClose }) => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult('');

    // Animate the reels
    let spinCount = 0;
    const maxSpins = 20;
    
    const spinInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length)
      ]);
      
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        
        // Final result
        const finalReels = [
          Math.floor(Math.random() * SYMBOLS.length),
          Math.floor(Math.random() * SYMBOLS.length),
          Math.floor(Math.random() * SYMBOLS.length)
        ];
        
        setReels(finalReels);
        setIsSpinning(false);
        
        // Check for win
        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          setResult('🎉 WINNER! 🎉');
        } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
          setResult('✨ Two Match! ✨');
        } else {
          setResult('Try Again!');
        }
      }
    }, 100);
  };

  return (
    <div className="slot-machine-overlay">
      <div className="slot-machine-display">
        <div className="slot-reels">
          {reels.map((reelIndex, i) => (
            <div key={i} className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
              <div className="slot-symbol">{SYMBOLS[reelIndex]}</div>
            </div>
          ))}
        </div>
        
        {result && (
          <div className="slot-result">{result}</div>
        )}
        
        <button 
          className="slot-spin-btn" 
          onClick={spin} 
          disabled={isSpinning}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </div>
    </div>
  );
};

export default SlotMachineOverlay;
