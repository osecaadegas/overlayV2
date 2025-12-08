import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStreamElements } from '../../context/StreamElementsContext';
import { 
  getUserSEConnection, 
  deductBetPoints, 
  addWinPoints, 
  recordGameSession 
} from '../../utils/gamesUtils';
import './SlotMachine.css';

// ==========================================
// SYMBOL DEFINITIONS
// ==========================================
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

// ==========================================
// GAME CONFIGURATION
// ==========================================
const CONFIG = {
  ROWS: 5,
  COLS: 6,
  MIN_MATCH: 8,
  BASE_FREE_SPINS: 15,
  RETRIGGER_SPINS: 5,
  BONUS_BUY_MULTIPLIER: 100,
  MIN_BET: 10,
  MAX_BET: 100,
  BET_STEP: 10,
  targetRTP: 0.94,
  volatility: 'medium',
  
  multiplierWeights: {
    low: { 2: 50, 3: 25, 4: 15, 5: 8, 10: 2 },
    medium: { 2: 40, 3: 20, 5: 15, 10: 10, 25: 8, 50: 5, 100: 2 },
    high: { 2: 35, 3: 18, 5: 15, 10: 12, 25: 10, 50: 6, 100: 3, 500: 1 },
    extreme: { 5: 30, 10: 25, 25: 20, 50: 12, 100: 8, 250: 3, 500: 2 }
  }
};

// ==========================================
// SEEDED RANDOM NUMBER GENERATOR
// ==========================================
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function getSymbolWeights(volatility, rtp) {
  const baseWeights = {
    low: {
      blue_gem: 18, green_gem: 18, purple_gem: 18, red_gem: 14, yellow_gem: 14,
      ring: 6, chalice: 6, hourglass: 3, crown: 1.5, scatter: 1.2, multiplier: 0.3
    },
    medium: {
      blue_gem: 17, green_gem: 17, purple_gem: 17, red_gem: 13, yellow_gem: 13,
      ring: 7, chalice: 7, hourglass: 4, crown: 2.5, scatter: 1.8, multiplier: 0.7
    },
    high: {
      blue_gem: 16, green_gem: 16, purple_gem: 16, red_gem: 12, yellow_gem: 12,
      ring: 8, chalice: 8, hourglass: 5, crown: 3.5, scatter: 2.5, multiplier: 1
    },
    extreme: {
      blue_gem: 15, green_gem: 15, purple_gem: 15, red_gem: 11, yellow_gem: 11,
      ring: 9, chalice: 9, hourglass: 6, crown: 4.5, scatter: 3, multiplier: 1.5
    }
  };
  
  const weights = { ...baseWeights[volatility] };
  const rtpMultiplier = rtp / 0.96;
  weights.crown *= rtpMultiplier;
  weights.hourglass *= rtpMultiplier;
  weights.scatter *= rtpMultiplier;
  
  return weights;
}

function getRandomSymbol(weights, rng) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = rng() * totalWeight;
  
  for (const [symbol, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return symbol;
  }
  return Object.keys(weights)[0];
}

function getRandomMultiplier(volatility, rng) {
  const weights = CONFIG.multiplierWeights[volatility];
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = rng() * totalWeight;
  
  for (const [mult, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return parseInt(mult);
  }
  return 2;
}

function generateBoard(volatility, targetRTP, rng) {
  const weights = getSymbolWeights(volatility, targetRTP);
  const board = [];
  
  for (let row = 0; row < CONFIG.ROWS; row++) {
    const rowData = [];
    for (let col = 0; col < CONFIG.COLS; col++) {
      const symbol = getRandomSymbol(weights, rng);
      rowData.push({
        symbol,
        multiplier: symbol === 'multiplier' ? getRandomMultiplier(volatility, rng) : null
      });
    }
    board.push(rowData);
  }
  
  return board;
}

function countSymbols(board) {
  const counts = {};
  const positions = {};
  
  for (let row = 0; row < CONFIG.ROWS; row++) {
    for (let col = 0; col < CONFIG.COLS; col++) {
      const cell = board[row][col];
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
}

function evaluateWins(board, bet) {
  const { counts, positions } = countSymbols(board);
  const wins = [];
  const multipliers = [];
  let scatterCount = 0;
  
  // Collect multipliers
  for (let row = 0; row < CONFIG.ROWS; row++) {
    for (let col = 0; col < CONFIG.COLS; col++) {
      const cell = board[row][col];
      if (cell && cell.symbol === 'multiplier' && cell.multiplier) {
        multipliers.push({
          value: cell.multiplier,
          position: { row, col }
        });
      }
    }
  }
  
  // Check each symbol for wins
  for (const [symbol, count] of Object.entries(counts)) {
    const symbolData = SYMBOLS[symbol];
    if (!symbolData) continue;
    
    if (symbol === 'scatter') {
      scatterCount = count;
      if (count >= 4 && symbolData.pays[Math.min(count, 6)]) {
        const payout = symbolData.pays[Math.min(count, 6)] * bet;
        wins.push({
          symbol,
          count,
          payout,
          positions: positions[symbol]
        });
      }
      continue;
    }
    
    if (symbol === 'multiplier') continue;
    
    if (count >= CONFIG.MIN_MATCH) {
      const payTier = count >= 12 ? 12 : (count >= 10 ? 10 : 8);
      if (symbolData.pays[payTier]) {
        const payout = symbolData.pays[payTier] * bet;
        wins.push({
          symbol,
          count,
          payout,
          positions: positions[symbol]
        });
      }
    }
  }
  
  return { wins, multipliers, scatterCount };
}

function removeWinningSymbols(board, wins) {
  const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
  
  for (const win of wins) {
    for (const pos of win.positions) {
      newBoard[pos.row][pos.col] = null;
    }
  }
  
  // Remove multiplier symbols after they're counted
  for (let row = 0; row < CONFIG.ROWS; row++) {
    for (let col = 0; col < CONFIG.COLS; col++) {
      if (newBoard[row][col]?.symbol === 'multiplier') {
        newBoard[row][col] = null;
      }
    }
  }
  
  return newBoard;
}

function applyGravity(board) {
  const newBoard = board.map(row => [...row]);
  const falls = [];
  
  for (let col = 0; col < CONFIG.COLS; col++) {
    const symbols = [];
    for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col]) {
        symbols.push(newBoard[row][col]);
      }
    }
    
    for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
      const symbolIndex = CONFIG.ROWS - 1 - row;
      if (symbolIndex < symbols.length) {
        newBoard[row][col] = symbols[symbolIndex];
      } else {
        newBoard[row][col] = null;
        falls.push({ row, col });
      }
    }
  }
  
  return { board: newBoard, falls };
}

function fillBoard(board, volatility, targetRTP, rng) {
  const weights = getSymbolWeights(volatility, targetRTP);
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < CONFIG.ROWS; row++) {
    for (let col = 0; col < CONFIG.COLS; col++) {
      if (!newBoard[row][col]) {
        const symbol = getRandomSymbol(weights, rng);
        newBoard[row][col] = {
          symbol,
          multiplier: symbol === 'multiplier' ? getRandomMultiplier(volatility, rng) : null
        };
      }
    }
  }
  
  return newBoard;
}

function executeSpin(betAmount, volatility, targetRTP, rng) {
  const result = {
    initialBoard: null,
    tumbles: [],
    allWins: [],
    allMultipliers: [],
    totalWin: 0,
    scatterCount: 0,
    freeSpinsTriggered: false,
    freeSpinsAwarded: 0
  };
  
  let board = generateBoard(volatility, targetRTP, rng);
  result.initialBoard = JSON.parse(JSON.stringify(board));
  
  let tumbleCount = 0;
  let hasWins = true;
  
  while (hasWins) {
    const evaluation = evaluateWins(board, betAmount);
    
    if (evaluation.wins.length === 0) {
      hasWins = false;
      break;
    }
    
    const tumble = {
      board: JSON.parse(JSON.stringify(board)),
      wins: evaluation.wins,
      multipliers: evaluation.multipliers,
      winAmount: evaluation.wins.reduce((sum, w) => sum + w.payout, 0)
    };
    result.tumbles.push(tumble);
    result.allWins.push(...evaluation.wins);
    result.allMultipliers.push(...evaluation.multipliers);
    
    if (tumbleCount === 0) {
      result.scatterCount = evaluation.scatterCount;
      if (evaluation.scatterCount >= 4) {
        result.freeSpinsTriggered = true;
        result.freeSpinsAwarded = CONFIG.BASE_FREE_SPINS;
      }
    }
    
    board = removeWinningSymbols(board, evaluation.wins);
    const gravityResult = applyGravity(board);
    board = fillBoard(gravityResult.board, volatility, targetRTP, rng);
    
    tumbleCount++;
  }
  
  const baseWin = result.allWins.reduce((sum, w) => sum + w.payout, 0);
  const totalMultiplier = result.allMultipliers.reduce((sum, m) => sum + m.value, 0);
  
  if (totalMultiplier > 0) {
    result.totalWin = baseWin * totalMultiplier;
  } else {
    result.totalWin = baseWin;
  }
  
  result.finalBoard = board;
  result.tumbleCount = tumbleCount;
  result.totalMultiplier = totalMultiplier;
  
  return result;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function SlotMachine({ onClose }) {
  const { user } = useAuth();
  const { isConnected, points, refreshPoints } = useStreamElements();
  
  const [bet, setBet] = useState(CONFIG.MIN_BET);
  const [board, setBoard] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [tumbleLog, setTumbleLog] = useState([]);
  const [winningPositions, setWinningPositions] = useState([]);
  const [seConnection, setSeConnection] = useState(null);
  
  const [inFreeSpins, setInFreeSpins] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);
  const [showFSOverlay, setShowFSOverlay] = useState(false);
  const [pendingFreeSpins, setPendingFreeSpins] = useState(0);
  
  const [showBigWin, setShowBigWin] = useState(false);
  const [bigWinAmount, setBigWinAmount] = useState(0);
  const [bigWinTitle, setBigWinTitle] = useState('BIG WIN!');
  
  const [rtp] = useState(0.94);
  const [volatility] = useState('medium');
  const rngRef = useRef(Math.random);
  
  const [stats, setStats] = useState({
    totalSpins: 0,
    totalBet: 0,
    totalWon: 0,
    biggestWin: 0,
    freeSpinsWon: 0,
    maxMultiplier: 0,
    maxTumbles: 0
  });

  useEffect(() => {
    loadConnection();
    const initialBoard = generateBoard(volatility, rtp, rngRef.current);
    setBoard(initialBoard);
  }, [user]);

  const loadConnection = async () => {
    if (!user) return;
    const { connection } = await getUserSEConnection(user.id);
    setSeConnection(connection);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const adjustBet = (delta) => {
    const newBet = Math.max(CONFIG.MIN_BET, Math.min(CONFIG.MAX_BET, bet + delta));
    setBet(newBet);
  };

  const resetStats = () => {
    setStats({
      totalSpins: 0,
      totalBet: 0,
      totalWon: 0,
      biggestWin: 0,
      freeSpinsWon: 0,
      maxMultiplier: 0,
      maxTumbles: 0
    });
  };

  const animateBoard = async (newBoard, winPositions = []) => {
    setWinningPositions(winPositions);
    setBoard(newBoard);
    if (winPositions.length > 0) {
      await sleep(600);
    }
  };

  const handleSpin = async () => {
    if (isSpinning || !isConnected || !seConnection) return;
    
    if (points < bet) {
      alert('Insufficient points! Please add more points to continue.');
      return;
    }
    
    setIsSpinning(true);
    setShowWin(false);
    setTumbleLog([]);
    setWinningPositions([]);
    
    try {
      // Deduct bet
      const { error: deductError } = await deductBetPoints(
        seConnection.se_channel_id,
        seConnection.se_jwt_token,
        seConnection.se_username,
        bet
      );
      if (deductError) {
        alert('Failed to deduct bet. Please try again.');
        setIsSpinning(false);
        return;
      }
      await refreshPoints();
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalSpins: prev.totalSpins + 1,
        totalBet: prev.totalBet + bet
      }));
      
      // Execute spin
      const result = executeSpin(bet, volatility, rtp, rngRef.current);
      
      // Animate initial board
      await animateBoard(result.initialBoard);
      await sleep(500);
      
      // Process tumbles
      const tumbleHistory = [];
      for (let i = 0; i < result.tumbles.length; i++) {
        const tumble = result.tumbles[i];
        const allWinPositions = tumble.wins.flatMap(w => w.positions);
        
        await animateBoard(tumble.board, allWinPositions);
        
        tumbleHistory.push({
          tumbleNum: i + 1,
          wins: tumble.wins,
          multipliers: tumble.multipliers,
          winAmount: tumble.winAmount
        });
        setTumbleLog(tumbleHistory);
        
        await sleep(800);
        
        if (i < result.tumbles.length - 1) {
          const nextBoard = result.tumbles[i + 1].board;
          await animateBoard(nextBoard);
          await sleep(400);
        }
      }
      
      // Show final board
      await animateBoard(result.finalBoard);
      
      // Apply win
      if (result.totalWin > 0) {
        setWinAmount(result.totalWin);
        setLastWin(result.totalWin);
        setShowWin(true);
        
        // Add win points
        await addWinPoints(
          seConnection.se_channel_id,
          seConnection.se_jwt_token,
          seConnection.se_username,
          result.totalWin
        );
        await refreshPoints();
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalWon: prev.totalWon + result.totalWin,
          biggestWin: Math.max(prev.biggestWin, result.totalWin),
          maxMultiplier: Math.max(prev.maxMultiplier, result.totalMultiplier),
          maxTumbles: Math.max(prev.maxTumbles, result.tumbleCount)
        }));
        
        // Show big win overlay if qualified
        if (result.totalWin >= bet * 20) {
          const multiplier = result.totalWin / bet;
          let title = 'NICE WIN!';
          if (multiplier >= 50) title = 'MEGA WIN!';
          if (multiplier >= 100) title = 'EPIC WIN!';
          if (multiplier >= 250) title = 'LEGENDARY WIN!';
          
          setBigWinTitle(title);
          setBigWinAmount(result.totalWin);
          await sleep(500);
          setShowBigWin(true);
        }
      }
      
      // Record game session
      await recordGameSession(user.id, seConnection.se_channel_id, {
        gameType: 'slots',
        betAmount: bet,
        result: result.totalWin,
        payout: result.totalWin,
        multiplier: result.totalWin / bet,
        pointsBefore: points,
        pointsAfter: points - bet + result.totalWin,
        sessionData: { tumbles: result.tumbleCount }
      });
      
      // Check for free spins trigger
      if (result.freeSpinsTriggered) {
        setStats(prev => ({ ...prev, freeSpinsWon: prev.freeSpinsWon + 1 }));
        setPendingFreeSpins(result.freeSpinsAwarded);
        await sleep(1000);
        setShowFSOverlay(true);
      } else {
        setIsSpinning(false);
      }
    } catch (error) {
      console.error('Spin error:', error);
      alert('An error occurred. Please try again.');
      setIsSpinning(false);
    }
  };

  const handleBonusBuy = async () => {
    const cost = bet * CONFIG.BONUS_BUY_MULTIPLIER;
    
    if (!isConnected || !seConnection) {
      alert('Please connect your StreamElements account first!');
      return;
    }
    
    if (points < cost) {
      alert(`Insufficient points! Bonus buy costs ${cost} points.`);
      return;
    }
    
    if (!window.confirm(`Buy Free Spins for ${cost} points?`)) return;
    
    try {
      const { error: deductError } = await deductBetPoints(
        seConnection.se_channel_id,
        seConnection.se_jwt_token,
        seConnection.se_username,
        cost
      );
      if (deductError) {
        alert('Failed to deduct points. Please try again.');
        return;
      }
      
      await refreshPoints();
      setStats(prev => ({ 
        ...prev, 
        totalBet: prev.totalBet + cost,
        freeSpinsWon: prev.freeSpinsWon + 1
      }));
      
      setPendingFreeSpins(CONFIG.BASE_FREE_SPINS);
      setShowFSOverlay(true);
    } catch (error) {
      console.error('Bonus buy error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const startFreeSpinsMode = () => {
    setShowFSOverlay(false);
    setInFreeSpins(true);
    setFreeSpinsRemaining(pendingFreeSpins);
    setGlobalMultiplier(1);
  };

  const handleFreeSpin = async () => {
    if (!inFreeSpins || isSpinning) return;
    
    setIsSpinning(true);
    setShowWin(false);
    setTumbleLog([]);
    setWinningPositions([]);
    
    setFreeSpinsRemaining(prev => prev - 1);
    
    const result = executeSpin(bet, volatility, rtp, rngRef.current);
    
    // Calculate multiplier additions
    const multAddition = result.allMultipliers.reduce((sum, m) => sum + m.value, 0);
    const newGlobalMult = globalMultiplier + multAddition;
    setGlobalMultiplier(newGlobalMult);
    
    // Recalculate win with global multiplier
    const baseWin = result.allWins.reduce((sum, w) => sum + w.payout, 0);
    const totalWinWithMult = baseWin * newGlobalMult;
    
    // Animate
    await animateBoard(result.initialBoard);
    await sleep(500);
    
    const tumbleHistory = [];
    for (let i = 0; i < result.tumbles.length; i++) {
      const tumble = result.tumbles[i];
      const allWinPositions = tumble.wins.flatMap(w => w.positions);
      
      await animateBoard(tumble.board, allWinPositions);
      
      tumbleHistory.push({
        tumbleNum: i + 1,
        wins: tumble.wins,
        multipliers: tumble.multipliers,
        winAmount: tumble.winAmount
      });
      setTumbleLog(tumbleHistory);
      
      await sleep(800);
      
      if (i < result.tumbles.length - 1) {
        await animateBoard(result.tumbles[i + 1].board);
        await sleep(400);
      }
    }
    
    await animateBoard(result.finalBoard);
    
    if (totalWinWithMult > 0) {
      setWinAmount(totalWinWithMult);
      setShowWin(true);
      
      setStats(prev => ({
        ...prev,
        totalWon: prev.totalWon + totalWinWithMult,
        biggestWin: Math.max(prev.biggestWin, totalWinWithMult),
        maxMultiplier: Math.max(prev.maxMultiplier, newGlobalMult),
        maxTumbles: Math.max(prev.maxTumbles, result.tumbleCount)
      }));
    }
    
    // Check for retrigger
    if (result.scatterCount >= 4) {
      setFreeSpinsRemaining(prev => prev + CONFIG.RETRIGGER_SPINS);
      await sleep(500);
      alert(`+${CONFIG.RETRIGGER_SPINS} SPINS!`);
    }
    
    // Check if free spins ended
    if (freeSpinsRemaining - 1 <= 0) {
      await sleep(1000);
      
      // Calculate total free spins win
      const totalFSWin = stats.totalWon; // This would need proper tracking
      
      if (totalFSWin > 0) {
        await addWinPoints(
          seConnection.se_channel_id,
          seConnection.se_jwt_token,
          seConnection.se_username,
          totalFSWin
        );
        await refreshPoints();
        await recordGameSession(user.id, seConnection.se_channel_id, {
          gameType: 'slots',
          betAmount: bet,
          result: totalFSWin,
          payout: totalFSWin,
          multiplier: totalFSWin / bet,
          pointsBefore: points,
          pointsAfter: points + totalFSWin,
          sessionData: { freeSpins: true }
        });
        
        if (totalFSWin >= bet * 20) {
          const multiplier = totalFSWin / bet;
          let title = 'NICE WIN!';
          if (multiplier >= 50) title = 'MEGA WIN!';
          if (multiplier >= 100) title = 'EPIC WIN!';
          if (multiplier >= 250) title = 'LEGENDARY WIN!';
          
          setBigWinTitle(title);
          setBigWinAmount(totalFSWin);
          setShowBigWin(true);
        }
      }
      
      setInFreeSpins(false);
      setGlobalMultiplier(1);
    }
    
    setIsSpinning(false);
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
    <div className={`slot-machine-page ${onClose ? 'slot-overlay-mode' : ''}`}>
      <div className="slot-machine-wrapper">
        <div className="slot-machine-header">
          <h1>⚡ Divine Fortune ⚡</h1>
          <p className="slot-subtitle">Scatter Pay • Tumble Feature • Multipliers</p>
          {onClose && (
            <button className="slot-close-btn" onClick={onClose}>✕</button>
          )}
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
              {/* Free Spins Indicator */}
              {inFreeSpins && (
                <div className="fs-indicator">
                  FREE SPINS: <span>{freeSpinsRemaining}</span>
                </div>
              )}
              
              {/* Global Multiplier */}
              {inFreeSpins && globalMultiplier > 1 && (
                <div className="global-multiplier">
                  Total Mult: <span>{globalMultiplier}x</span>
                </div>
              )}

              {/* Game Grid */}
              <div className="slot-grid">
                {board.map((row, rowIdx) => (
                  <div key={rowIdx} className="slot-row">
                    {row.map((cell, colIdx) => {
                      const isWinning = winningPositions.some(
                        pos => pos.row === rowIdx && pos.col === colIdx
                      );
                      return (
                        <div key={`${rowIdx}-${colIdx}`} className={`slot-cell ${isWinning ? 'winning' : ''}`}>
                          {cell && SYMBOLS[cell.symbol] && (
                            <>
                              <span className="slot-symbol">{SYMBOLS[cell.symbol].icon}</span>
                              {cell.multiplier && (
                                <div className="slot-multiplier-badge">{cell.multiplier}x</div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Win Display */}
              {showWin && (
                <div className="slot-win-display">
                  WIN: {winAmount.toFixed(0)} pts
                </div>
              )}

              {/* Tumble Log */}
              {tumbleLog.length > 0 && (
                <div className="slot-tumble-log">
                  <div className="tumble-log-title">Tumble History:</div>
                  {tumbleLog.map((t, idx) => {
                    const symbols = t.wins.map(w => `${SYMBOLS[w.symbol].icon} x${w.count}`).join(', ');
                    const mults = t.multipliers.length > 0 
                      ? ` [Mult: ${t.multipliers.map(m => m.value + 'x').join('+')}]` 
                      : '';
                    return (
                      <div key={idx} className="tumble-log-item">
                        Tumble {t.tumbleNum}: {symbols} = {t.winAmount.toFixed(0)} pts{mults}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="slot-controls">
              <div className="slot-control-item">
                <div className="control-label">POINTS</div>
                <div className="control-value">{points?.toFixed(0) || 0}</div>
              </div>

              <div className="slot-bet-controls">
                <button onClick={() => adjustBet(-CONFIG.BET_STEP)} disabled={isSpinning} className="bet-btn">-</button>
                <div className="slot-control-item">
                  <div className="control-label">BET</div>
                  <div className="control-value">{bet}</div>
                </div>
                <button onClick={() => adjustBet(CONFIG.BET_STEP)} disabled={isSpinning} className="bet-btn">+</button>
              </div>

              {!inFreeSpins ? (
                <button onClick={handleSpin} disabled={isSpinning || points < bet} className="spin-button">
                  {isSpinning ? 'SPINNING...' : '✦ SPIN ✦'}
                </button>
              ) : (
                <button onClick={handleFreeSpin} disabled={isSpinning} className="spin-button">
                  FREE SPIN
                </button>
              )}
              
              {!inFreeSpins && (
                <button onClick={handleBonusBuy} disabled={isSpinning} className="bonus-buy-btn">
                  🎰 BUY BONUS<br/><span className="bonus-cost">{bet * 100} pts</span>
                </button>
              )}

              <div className="slot-control-item">
                <div className="control-label">LAST WIN</div>
                <div className="control-value win-value">{lastWin.toFixed(0)}</div>
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
                <span className="stat-value">{stats.totalBet.toFixed(0)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Won:</span>
                <span className="stat-value win-value">{stats.totalWon.toFixed(0)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Actual RTP:</span>
                <span className="stat-value">
                  {stats.totalBet > 0 ? ((stats.totalWon / stats.totalBet) * 100).toFixed(2) : '0.00'}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Biggest Win:</span>
                <span className="stat-value highlight-value">{stats.biggestWin.toFixed(0)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Free Spins Won:</span>
                <span className="stat-value">{stats.freeSpinsWon}</span>
              </div>
            </div>

            <div className="session-stats">
              <h4 className="session-title">🎯 Current Session</h4>
              <div className="stat-item">
                <span className="stat-label">Max Multiplier:</span>
                <span className="stat-value">{stats.maxMultiplier}x</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Max Tumbles:</span>
                <span className="stat-value">{stats.maxTumbles}</span>
              </div>
            </div>

            <button onClick={resetStats} className="btn-reset">Reset Statistics</button>
          </div>
        </div>
      </div>

      {/* Free Spins Overlay */}
      {showFSOverlay && (
        <div className="fs-overlay">
          <div className="fs-overlay-content">
            <div className="fs-icon">⚡</div>
            <h2 className="fs-title">FREE SPINS!</h2>
            <p className="fs-message">You won {pendingFreeSpins} Free Spins!</p>
            <button onClick={startFreeSpinsMode} className="btn-start-fs">START</button>
          </div>
        </div>
      )}

      {/* Big Win Overlay */}
      {showBigWin && (
        <div className="big-win-overlay">
          <div className="big-win-content">
            <div className="big-win-icon">🏆</div>
            <h2 className="big-win-title">{bigWinTitle}</h2>
            <p className="big-win-amount">{bigWinAmount.toFixed(0)} pts</p>
            <button onClick={() => setShowBigWin(false)} className="btn-collect">COLLECT</button>
          </div>
        </div>
      )}
    </div>
  );
}
