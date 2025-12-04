import { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';
import useDraggable from '../../hooks/useDraggable';
import { slotImages, prizes, symbols } from './slotImages';

const SlotMachine = ({ onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['cherry', 'lemon', 'grape']);
  const [resultMessage, setResultMessage] = useState('');
  const [spinningReels, setSpinningReels] = useState([false, false, false]);
  
  const reelRefs = [useRef(null), useRef(null), useRef(null)];
  const draggableRef = useDraggable(true, 'slotmachine');

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const generateWinningCombination = () => {
    const winChance = Math.random();
    
    // 75% chance of winning - all 3 symbols match
    if (winChance < 0.75) {
      const winningSymbol = getRandomSymbol();
      console.log('WIN GENERATED:', winningSymbol, winningSymbol, winningSymbol);
      return [winningSymbol, winningSymbol, winningSymbol];
    }
    
    // 25% chance of losing - ensure symbols DON'T all match
    const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // If by random chance all 3 match, force a different symbol on the last reel
    if (result[0] === result[1] && result[1] === result[2]) {
      const availableSymbols = symbols.filter(s => s !== result[0]);
      result[2] = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
    }
    
    console.log('LOSE GENERATED:', result);
    return result;
  };

  const createReelStrip = (reelIndex) => {
    // Create a strip of random symbols
    const strip = [];
    for (let i = 0; i < 30; i++) {
      strip.push(getRandomSymbol());
    }
    return strip;
  };

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResultMessage('');
    
    const finalSymbols = generateWinningCombination();
    
    // Start all reels spinning
    setSpinningReels([true, true, true]);
    
    // Create random symbol strips for animation
    const strips = [
      createReelStrip(0),
      createReelStrip(1),
      createReelStrip(2)
    ];
    
    // Animate each reel with cycling symbols
    let currentIndex = [0, 0, 0];
    const cycleInterval = setInterval(() => {
      setReels([
        strips[0][currentIndex[0] % strips[0].length],
        strips[1][currentIndex[1] % strips[1].length],
        strips[2][currentIndex[2] % strips[2].length]
      ]);
      currentIndex = currentIndex.map(i => i + 1);
    }, 50);
    
    // Stop reels one by one with easing
    const stopTimes = [2000, 2700, 3400];
    const stoppedReels = [false, false, false];
    
    stopTimes.forEach((time, i) => {
      setTimeout(() => {
        // Stop this reel from spinning animation
        setSpinningReels(prev => {
          const newSpinning = [...prev];
          newSpinning[i] = false;
          return newSpinning;
        });
        
        stoppedReels[i] = true;
        
        // Wait a moment before showing final symbol for smooth transition
        setTimeout(() => {
          setReels(prev => {
            const newReels = [...prev];
            newReels[i] = finalSymbols[i];
            console.log(`Reel ${i} stopped at:`, finalSymbols[i]);
            return newReels;
          });
        }, 200);
        
        // Clear interval after last reel
        if (i === 2) {
          clearInterval(cycleInterval);
          
          // Wait for all reels to fully stop and display
          setTimeout(() => {
            console.log('Final symbols should be:', finalSymbols);
            
            // Force set all reels to final symbols to be absolutely sure
            setReels([...finalSymbols]);
            
            // Check for win after ensuring reels are set
            setTimeout(() => {
              const allMatch = finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2];
              
              setIsSpinning(false);
              
              if (allMatch) {
                const symbol = finalSymbols[0];
                const prize = prizes[symbol];
                setResultMessage(`🎉 CONGRATULATIONS! You won ${prize.label}! 🎉`);
                console.log('WIN!', symbol);
              } else {
                setResultMessage('😢 Try again!');
                console.log('LOSE:', finalSymbols);
              }
            }, 100);
          }, 400);
        }
      }, time);
    });
  };

  return (
    <div className="slotmachine-overlay">
      <div className="slotmachine-panel" ref={draggableRef}>
        <div className="slotmachine-header drag-handle">
          <h2>🎰 SLOT MACHINE</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="slotmachine-content">
          <div className="slot-machine-container">
            <div className="reels-container">
              {reels.map((symbol, index) => (
                <div 
                  key={index}
                  ref={reelRefs[index]}
                  className={`reel ${spinningReels[index] ? 'spinning' : ''}`}
                >
                  <img 
                    src={slotImages[symbol]} 
                    alt={symbol}
                    className="symbol-image"
                  />
                </div>
              ))}
            </div>

            {resultMessage && (
              <div className={`result-message ${resultMessage.includes('CONGRATULATIONS') ? 'win' : 'lose'}`}>
                {resultMessage}
              </div>
            )}
          </div>

          {/* Lever Control */}
          <div className="lever-container">
            <button 
              className={`lever ${isSpinning ? 'pulled' : ''}`}
              onClick={spin}
              disabled={isSpinning}
              title="Pull the lever to spin!"
            >
              <div className="lever-handle"></div>
              <div className="lever-ball"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
