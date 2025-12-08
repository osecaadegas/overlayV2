import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStreamElements } from '../../context/StreamElementsContext';
import { supabase } from '../../config/supabaseClient';
import { 
  getUserSEConnection, 
  getSEPointsBalance, 
  deductBetPoints, 
  addWinPoints, 
  recordGameSession 
} from '../../utils/gamesUtils';
import './SlotMachine.css';

// Symbol definitions
const SYMBOLS = {
  blue_gem: { icon: '💎', tier: 1, pays: { 8: 0.5, 10: 1, 12: 2.5 } },
  green_gem: { icon: '💚', tier: 1, pays: { 8: 0.5, 10: 1, 12: 2.5 } },
  purple_gem: { icon: '🔮', tier: 1, pays: { 8: 0.5, 10: 1, 12: 2.5 } },
  red_gem: { icon: '❤️', tier: 2, pays: { 8: 0.75, 10: 1.5, 12: 3 } },
  yellow_gem: { icon: '💛', tier: 2, pays: { 8: 0.75, 10: 1.5, 12: 3 } },
  ring: { icon: '💍', tier: 3, pays: { 8: 2, 10: 5, 12: 10 } },
  chalice: { icon: '🏆', tier: 3, pays: { 8: 2, 10: 5, 12: 10 } },
  hourglass: { icon: '⏳', tier: 4, pays: { 8: 3, 10: 7.5, 12: 15 } },
  crown: { icon: '👑', tier: 5, pays: { 8: 5, 10: 12.5, 12: 50 } },
  scatter: { icon: '⚡', tier: 0, pays: { 4: 3, 5: 5, 6: 100 }, isScatter: true },
  multiplier: { icon: '🌟', tier: 0, pays: {}, isMultiplier: true }
};

const CONFIG = {
  ROWS: 5,
  COLS: 6,
  MIN_MATCH: 8,
  MIN_BET: 10,
  MAX_BET: 1000,
  BET_STEP: 10
};

export default function SlotMachine() {
  const { user } = useAuth();
  const { isConnected, points, refreshPoints } = useStreamElements();
  
  const [bet, setBet] = useState(CONFIG.MIN_BET);
  const [board, setBoard] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [tumbleLog, setTumbleLog] = useState([]);
  const [seConnection, setSeConnection] = useState(null);
  
  const [stats, setStats] = useState({
    totalSpins: 0,
    totalBet: 0,
    totalWon: 0,
    biggestWin: 0
  });

  useEffect(() => {
    loadConnection();
    generateInitialBoard();
  }, [user]);

  const loadConnection = async () => {
    if (!user) return;
    const { connection } = await getUserSEConnection(user.id);
    setSeConnection(connection);
  };

  const getSymbolWeights = () => ({
    blue_gem: 16, green_gem: 16, purple_gem: 16,
    red_gem: 12, yellow_gem: 12,
    ring: 8, chalice: 8,
    hourglass: 5,
    crown: 3.5,
    scatter: 2.5,
    multiplier: 1
  });

  const getRandomSymbol = (weights) => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const [symbol, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return symbol;
    }
    return Object.keys(weights)[0];
  };

  const getRandomMultiplier = () => {
    const multipliers = [2, 2, 2, 3, 3, 5, 5, 10, 10, 25, 50, 100, 500];
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  };

  const generateInitialBoard = () => {
    const weights = getSymbolWeights();
    const newBoard = [];
    
    for (let row = 0; row < CONFIG.ROWS; row++) {
      const rowData = [];
      for (let col = 0; col < CONFIG.COLS; col++) {
        const symbol = getRandomSymbol(weights);
        rowData.push({
          symbol,
          multiplier: symbol === 'multiplier' ? getRandomMultiplier() : null
        });
      }
      newBoard.push(rowData);
    }
    
    setBoard(newBoard);
  };

  const countSymbols = (gameBoard) => {
    const counts = {};
    const positions = {};
    
    for (let row = 0; row < CONFIG.ROWS; row++) {
      for (let col = 0; col < CONFIG.COLS; col++) {
        const cell = gameBoard[row][col];
        if (!cell) continue;
        
        const sym = cell.symbol;
        if (!counts[sym]) {
          counts[sym] = 0;
          positions[sym] = [];
        }
        counts[sym]++;
        positions[sym].push({ row, col });
      }
    }
    
    return { counts, positions };
  };

  const evaluateWins = (gameBoard, betAmount) => {
    const { counts, positions } = countSymbols(gameBoard);
    const wins = [];
    const multipliers = [];
    let scatterCount = 0;
    
    // Collect multipliers
    for (let row = 0; row < CONFIG.ROWS; row++) {
      for (let col = 0; col < CONFIG.COLS; col++) {
        const cell = gameBoard[row][col];
        if (cell && cell.symbol === 'multiplier' && cell.multiplier) {
          multipliers.push({ value: cell.multiplier, position: { row, col } });
        }
      }
    }
    
    // Check wins
    for (const [symbol, count] of Object.entries(counts)) {
      const symbolData = SYMBOLS[symbol];
      if (!symbolData) continue;
      
      if (symbol === 'scatter') {
        scatterCount = count;
        if (count >= 4 && symbolData.pays[Math.min(count, 6)]) {
          const payout = symbolData.pays[Math.min(count, 6)] * betAmount;
          wins.push({ symbol, count, payout, positions: positions[symbol] });
        }
        continue;
      }
      
      if (symbol === 'multiplier') continue;
      
      if (count >= CONFIG.MIN_MATCH) {
        const payTier = count >= 12 ? 12 : (count >= 10 ? 10 : 8);
        if (symbolData.pays[payTier]) {
          const payout = symbolData.pays[payTier] * betAmount;
          wins.push({ symbol, count, payout, positions: positions[symbol] });
        }
      }
    }
    
    return { wins, multipliers, scatterCount };
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSpin = async () => {
    if (!isConnected || !seConnection) {
      alert('Please connect your StreamElements account first!');
      return;
    }

    if (points < bet) {
      alert('Insufficient points!');
      return;
    }

    setIsSpinning(true);
    setShowWin(false);
    setTumbleLog([]);
    
    try {
      // Deduct bet
      const { newBalance, error: deductError } = await deductBetPoints(
        seConnection.se_channel_id,
        seConnection.se_jwt_token,
        seConnection.se_username,
        bet
      );

      if (deductError) throw new Error('Failed to place bet');

      const pointsBefore = points;
      await refreshPoints();

      // Generate new board
      const weights = getSymbolWeights();
      let currentBoard = [];
      for (let row = 0; row < CONFIG.ROWS; row++) {
        const rowData = [];
        for (let col = 0; col < CONFIG.COLS; col++) {
          const symbol = getRandomSymbol(weights);
          rowData.push({
            symbol,
            multiplier: symbol === 'multiplier' ? getRandomMultiplier() : null
          });
        }
        currentBoard.push(rowData);
      }

      setBoard(currentBoard);
      await sleep(500);

      // Process tumbles
      let totalWinAmount = 0;
      let tumbles = [];
      let hasWins = true;
      let tumbleCount = 0;

      while (hasWins && tumbleCount < 20) {
        const evaluation = evaluateWins(currentBoard, bet);
        
        if (evaluation.wins.length === 0) {
          hasWins = false;
          break;
        }

        tumbleCount++;
        const baseWin = evaluation.wins.reduce((sum, w) => sum + w.payout, 0);
        const multiplierTotal = evaluation.multipliers.reduce((sum, m) => sum + m.value, 0) || 1;
        const tumbleWin = baseWin * multiplierTotal;
        totalWinAmount += tumbleWin;

        tumbles.push({
          number: tumbleCount,
          wins: evaluation.wins,
          multipliers: evaluation.multipliers,
          win: tumbleWin
        });

        await sleep(800);

        // Remove winning symbols
        const newBoard = currentBoard.map(row => row.map(cell => cell ? { ...cell } : null));
        for (const win of evaluation.wins) {
          for (const pos of win.positions) {
            newBoard[pos.row][pos.col] = null;
          }
        }
        for (const mult of evaluation.multipliers) {
          newBoard[mult.position.row][mult.position.col] = null;
        }

        // Apply gravity and fill
        for (let col = 0; col < CONFIG.COLS; col++) {
          const symbols = [];
          for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
            if (newBoard[row][col]) symbols.push(newBoard[row][col]);
          }
          for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
            const symbolIndex = CONFIG.ROWS - 1 - row;
            if (symbolIndex < symbols.length) {
              newBoard[row][col] = symbols[symbolIndex];
            } else {
              const symbol = getRandomSymbol(weights);
              newBoard[row][col] = {
                symbol,
                multiplier: symbol === 'multiplier' ? getRandomMultiplier() : null
              };
            }
          }
        }

        currentBoard = newBoard;
        setBoard(currentBoard);
        await sleep(300);
      }

      setTumbleLog(tumbles);

      if (totalWinAmount > 0) {
        // Add winnings
        await addWinPoints(
          seConnection.se_channel_id,
          seConnection.se_jwt_token,
          seConnection.se_username,
          totalWinAmount
        );

        await refreshPoints();
        
        setWinAmount(totalWinAmount);
        setLastWin(totalWinAmount);
        setShowWin(true);

        // Record game session
        await recordGameSession(user.id, seConnection.se_channel_id, {
          gameType: 'slots',
          betAmount: bet,
          result: totalWinAmount,
          payout: totalWinAmount,
          multiplier: totalWinAmount / bet,
          pointsBefore,
          pointsAfter: points + totalWinAmount - bet,
          sessionData: { tumbles: tumbles.length }
        });

        setStats(prev => ({
          ...prev,
          totalSpins: prev.totalSpins + 1,
          totalBet: prev.totalBet + bet,
          totalWon: prev.totalWon + totalWinAmount,
          biggestWin: Math.max(prev.biggestWin, totalWinAmount)
        }));
      } else {
        // Record losing session
        await recordGameSession(user.id, seConnection.se_channel_id, {
          gameType: 'slots',
          betAmount: bet,
          result: 0,
          payout: 0,
          multiplier: 0,
          pointsBefore,
          pointsAfter: points - bet,
          sessionData: { tumbles: 0 }
        });

        setStats(prev => ({
          ...prev,
          totalSpins: prev.totalSpins + 1,
          totalBet: prev.totalBet + bet
        }));
      }

    } catch (error) {
      console.error('Spin error:', error);
      alert('Error during spin: ' + error.message);
    } finally {
      setIsSpinning(false);
    }
  };

  const adjustBet = (delta) => {
    const newBet = Math.max(CONFIG.MIN_BET, Math.min(CONFIG.MAX_BET, bet + delta));
    setBet(newBet);
  };

  if (!user) {
    return (
      <div className="slot-machine-page">
        <div className="slot-machine-container">
          <h1>⚡ Divine Fortune Slots ⚡</h1>
          <div className="login-notice">
            <p>⚠️ Connect with Twitch to access the games</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected || !seConnection) {
    return (
      <div className="slot-machine-page">
        <div className="slot-machine-container">
          <h1>⚡ Divine Fortune Slots ⚡</h1>
          <div className="login-notice">
            <p>⚠️ Connect with Twitch to access the games</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-machine-page">
      <div className="slot-machine-wrapper">
        <div className="slot-machine-header">
          <h1>⚡ Divine Fortune ⚡</h1>
          <p className="slot-subtitle">Scatter Pay • Tumble Feature • Multipliers</p>
        </div>

        <div className="slot-machine-layout">
          {/* Left Panel - Paytable */}
          <div className="slot-paytable-panel">
            <h3>💎 Paytable</h3>
            <div className="paytable-items">
              {['crown', 'hourglass', 'chalice', 'ring', 'red_gem', 'blue_gem'].map(sym => {
                const s = SYMBOLS[sym];
                const pays = Object.entries(s.pays).map(([count, pay]) => `${count}+: ${pay}x`).join(' | ');
                return (
                  <div key={sym} className="paytable-item">
                    <span className="paytable-symbol">{s.icon}</span>
                    <span className="paytable-pays">{pays}</span>
                  </div>
                );
              })}
            </div>
            <div className="paytable-special">
              <h4>Special Symbols</h4>
              <div className="paytable-item">
                <span className="paytable-symbol">⚡</span>
                <span>Scatter - 4+ wins</span>
              </div>
              <div className="paytable-item">
                <span className="paytable-symbol">🌟</span>
                <span>Multiplier - 2x to 500x</span>
              </div>
            </div>
          </div>

          {/* Center - Game */}
          <div className="slot-machine-center">
            <div className="slot-machine-game">
              {/* Game Grid */}
              <div className="slot-grid">
                {board.map((row, rowIdx) => (
                  <div key={rowIdx} className="slot-row">
                    {row.map((cell, colIdx) => (
                      <div key={`${rowIdx}-${colIdx}`} className="slot-cell">
                        {cell && SYMBOLS[cell.symbol] && (
                          <>
                            <span className="slot-symbol">{SYMBOLS[cell.symbol].icon}</span>
                            {cell.multiplier && (
                              <div className="slot-multiplier-badge">{cell.multiplier}x</div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Win Display */}
              {showWin && (
                <div className="slot-win-display">
                  WIN: {winAmount.toLocaleString()} pts
                </div>
              )}

              {/* Tumble Log */}
              {tumbleLog.length > 0 && (
                <div className="slot-tumble-log">
                  <div className="tumble-log-title">Tumble History:</div>
                  {tumbleLog.map((tumble, idx) => (
                    <div key={idx} className="tumble-log-item">
                      Tumble {tumble.number}: {tumble.wins.map(w => 
                        `${SYMBOLS[w.symbol].icon} x${w.count}`
                      ).join(', ')} = {tumble.win.toLocaleString()} pts
                      {tumble.multipliers.length > 0 && ` [${tumble.multipliers.map(m => m.value + 'x').join('+')}]`}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="slot-controls">
              <div className="slot-control-item">
                <div className="control-label">POINTS</div>
                <div className="control-value">{points.toLocaleString()}</div>
              </div>

              <div className="slot-bet-controls">
                <button onClick={() => adjustBet(-CONFIG.BET_STEP)} disabled={isSpinning} className="bet-btn">-</button>
                <div className="slot-control-item">
                  <div className="control-label">BET</div>
                  <div className="control-value">{bet.toLocaleString()}</div>
                </div>
                <button onClick={() => adjustBet(CONFIG.BET_STEP)} disabled={isSpinning} className="bet-btn">+</button>
              </div>

              <button onClick={handleSpin} disabled={isSpinning || points < bet} className="spin-button">
                {isSpinning ? 'SPINNING...' : 'SPIN'}
              </button>

              <div className="slot-control-item">
                <div className="control-label">LAST WIN</div>
                <div className="control-value win-value">{lastWin.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Stats */}
          <div className="slot-stats-panel">
            <h3>📊 Statistics</h3>
            <div className="stats-items">
              <div className="stat-item">
                <span className="stat-label">Total Spins:</span>
                <span className="stat-value">{stats.totalSpins}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Bet:</span>
                <span className="stat-value">{stats.totalBet.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Won:</span>
                <span className="stat-value win-value">{stats.totalWon.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Biggest Win:</span>
                <span className="stat-value highlight-value">{stats.biggestWin.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Win Rate:</span>
                <span className="stat-value">
                  {stats.totalSpins > 0 ? ((stats.totalWon / stats.totalBet * 100).toFixed(1)) : '0.0'}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
