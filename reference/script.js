// Utility functions - moved here to prevent scope errors

// Simple debounce function to prevent rapid function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function adjustColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + (R * 0x10000) + (G * 0x100) + B).toString(16).slice(1)}`;
}

function applyUIColors(primary, accent, background, text) {
  // Add custom theme class to body to enable custom styling
  document.body.classList.add('custom-theme');
  
  // Get all settings first before using them
  const cardBackgroundColor = localStorage.getItem('customCardBackground') || adjustColor(background, 15);
  const streamerNameColor = localStorage.getItem('customStreamerNameColor') || accent;
  const websiteColor = localStorage.getItem('customWebsiteColor') || primary;
  const gambleAwareColor = localStorage.getItem('customGambleAwareColor') || '#ff6b6b';
  
  // Glass effect settings - declare these first
  const glassEnabled = localStorage.getItem('glassEffectEnabled') === 'true';
  const glassOpacity = localStorage.getItem('glassOpacity') || '0.3';
  const glassBlur = localStorage.getItem('glassBlur') || '10';
  
  // Sidebar styling
  const sidebar = document.querySelector('.sidebar');
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  
  if (sidebar) {
    sidebar.style.background = `linear-gradient(135deg, ${adjustColor(background, 10)} 0%, ${adjustColor(background, -10)} 100%)`;
    sidebar.style.border = `2px solid ${accent}`;
    sidebar.style.boxShadow = `0 8px 32px rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.3)`;
    sidebar.style.backdropFilter = 'none';
  }
  
  if (sidebarToggle) {
    // Hide the square background for custom themes
    sidebarToggle.style.background = 'transparent';
    sidebarToggle.style.border = 'none';
    sidebarToggle.style.boxShadow = 'none';
  }
  
  // Check if sidebar backgrounds are enabled
  const sidebarBackgroundsEnabled = localStorage.getItem('sidebarBackgroundsEnabled') !== 'false';
  
  sidebarButtons.forEach(btn => {
    if (sidebarBackgroundsEnabled) {
      btn.classList.remove('no-background');
      btn.style.background = `linear-gradient(135deg, ${adjustColor(background, 20)} 0%, ${adjustColor(background, -5)} 100%)`;
      btn.style.borderColor = `rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.3)`;
    } else {
      btn.classList.add('no-background');
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.boxShadow = 'none';
    }
    btn.style.color = text;
    
    // Active state
    if (btn.classList.contains('active')) {
      if (sidebarBackgroundsEnabled) {
        btn.style.background = `linear-gradient(135deg, ${primary} 0%, ${adjustColor(primary, -20)} 100%)`;
        btn.style.borderColor = accent;
        btn.style.boxShadow = `0 0 20px rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.5)`;
      } else {
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.boxShadow = 'none';
      }
    }
  });
  
  // Navbar styling with glass effect control
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (glassEnabled) {
      navbar.style.background = `rgba(${hexToRgb(adjustColor(background, 10)).r}, ${hexToRgb(adjustColor(background, 10)).g}, ${hexToRgb(adjustColor(background, 10)).b}, ${parseFloat(glassOpacity) + 0.2})`;
    } else {
      navbar.style.background = `rgb(${hexToRgb(adjustColor(background, 10)).r}, ${hexToRgb(adjustColor(background, 10)).g}, ${hexToRgb(adjustColor(background, 10)).b})`;
    }
    navbar.style.borderBottom = `1px solid ${accent}`;
    navbar.style.backdropFilter = 'none';
  }
  
  // Time display styling with glass effect control
  const currentTimeElement = document.getElementById('current-time');
  if (currentTimeElement) {
    if (glassEnabled) {
      currentTimeElement.style.background = `rgba(255, 255, 255, ${parseFloat(glassOpacity) + 0.1})`;
    } else {
      currentTimeElement.style.background = `transparent`;
    }
  }
  
  // Website button styling with glass effect control
  const websiteButton = document.querySelector('.navbar-website-btn');
  if (websiteButton) {
    if (glassEnabled) {
      websiteButton.style.background = `rgba(${hexToRgb(websiteColor).r}, ${hexToRgb(websiteColor).g}, ${hexToRgb(websiteColor).b}, ${parseFloat(glassOpacity) + 0.2})`;
    } else {
      websiteButton.style.background = `rgb(${hexToRgb(websiteColor).r}, ${hexToRgb(websiteColor).g}, ${hexToRgb(websiteColor).b})`;
    }
  }
  
  // Navbar text elements with custom colors
  const streamerName = document.getElementById('streamer-name');
  const websiteBtn = document.querySelector('.navbar-website-btn');
  const websiteText = document.getElementById('website-text');
  const currentTime = document.getElementById('current-time');
  const gambleAwareLink = document.querySelector('.aware-link');
  
  if (streamerName) {
    streamerName.style.color = streamerNameColor || '#ffffff';
    streamerName.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    streamerName.style.fontWeight = 'bold';
    streamerName.style.filter = 'none';
  }
  if (currentTime) {
    currentTime.style.color = text || '#ffffff';
    currentTime.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    currentTime.style.filter = 'none';
  }
  if (websiteBtn) {
    websiteBtn.style.background = `linear-gradient(135deg, ${websiteColor} 0%, ${adjustColor(websiteColor, -20)} 100%)`;
    websiteBtn.style.borderColor = accent;
    websiteBtn.style.color = text || '#ffffff';
  }
  if (websiteText) {
    websiteText.style.color = websiteColor || '#ffffff';
    websiteText.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    websiteText.style.fontWeight = 'bold';
    websiteText.style.filter = 'none';
  }
  if (gambleAwareLink) {
    gambleAwareLink.style.color = gambleAwareColor || '#ffffff';
    gambleAwareLink.style.textShadow = `0 1px 2px rgba(0, 0, 0, 0.7)`;
    gambleAwareLink.style.fontWeight = 'bold';
    gambleAwareLink.style.filter = 'none';
  }
  
  // Apply glass effect to card elements only when enabled
  const cardElements = document.querySelectorAll('.info-section, .bonus-hunt-stat, .slot-card, .slot-highlight-card, .info-panel, .bonus-stats-panel-inline, .stat-card, .tournament-left-panel, .middle-panel, .bonus-list-header, .carousel-container, .stats-panel-content, .stats-panel-header, .tournament-bracket');
  cardElements.forEach(card => {
    if (glassEnabled) {
      const adjustedOpacity = Math.min(parseFloat(glassOpacity) + 0.3, 0.95);
      card.style.background = `rgba(${hexToRgb(cardBackgroundColor).r}, ${hexToRgb(cardBackgroundColor).g}, ${hexToRgb(cardBackgroundColor).b}, ${adjustedOpacity})`;
      card.style.backdropFilter = 'none';
      card.style.border = `1px solid rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.4)`;
    } else {
      // Solid backgrounds when glass effect is disabled
      card.style.background = `rgb(${hexToRgb(cardBackgroundColor).r}, ${hexToRgb(cardBackgroundColor).g}, ${hexToRgb(cardBackgroundColor).b})`;
      card.style.backdropFilter = 'none';
      card.style.border = `1px solid rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.3)`;
    }
  });
  
  // Apply accent color to bonus list header and statistics
  const bonusListHeaders = document.querySelectorAll('.bonus-list-header h4, .stats-panel-header h3, .stat-label');
  bonusListHeaders.forEach(header => {
    header.style.color = accent;
  });
  
  const statsValues = document.querySelectorAll('.stat-value');
  statsValues.forEach(value => {
    value.style.color = accent;
  });
  
  // Apply colors to tournament bracket elements
  const tournamentHeaders = document.querySelectorAll('.bracket-title-row h4, .column-header');
  tournamentHeaders.forEach(header => {
    header.style.color = accent;
    header.style.borderColor = primary;
  });
  
  const matchVS = document.querySelectorAll('.match-vs');
  matchVS.forEach(vs => {
    vs.style.color = accent;
  });
  
  const participantNames = document.querySelectorAll('.participant-name');
  participantNames.forEach(name => {
    name.style.color = text;
  });
  
  // Apply card background to tournament bracket cards
  const bracketCards = document.querySelectorAll('.bracket-match-horizontal, .bracket-match, .bracket-participant');
  bracketCards.forEach(card => {
    const cardBg = hexToRgb(cardBackgroundColor);
    if (glassEnabled) {
      const adjustedOpacity = Math.min(parseFloat(glassOpacity) + 0.2, 0.9);
      card.style.background = `rgba(${cardBg.r}, ${cardBg.g}, ${cardBg.b}, ${adjustedOpacity})`;
    } else {
      card.style.background = `rgb(${cardBg.r}, ${cardBg.g}, ${cardBg.b})`;
    }
    card.style.borderColor = `rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.4)`;
  });
  
  console.log('Applied custom color scheme to all UI elements');
}

// Function to refresh tournament bracket styling when themes change
window.refreshTournamentBracketStyling = function refreshTournamentBracketStyling() {
  const cardBackgroundColor = localStorage.getItem('customCardBackground') || '#2a2b3d';
  const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
  const glassEnabled = localStorage.getItem('glassBackgroundsEnabled') === 'true';
  const glassOpacity = localStorage.getItem('glassOpacity') || '0.1';
  
  const bracketCards = document.querySelectorAll('.bracket-match-horizontal, .bracket-match, .bracket-participant, .tournament-complete');
  bracketCards.forEach(card => {
    const cardBg = hexToRgb(cardBackgroundColor);
    if (glassEnabled) {
      const adjustedOpacity = Math.min(parseFloat(glassOpacity) + 0.2, 0.9);
      card.style.background = `rgba(${cardBg.r}, ${cardBg.g}, ${cardBg.b}, ${adjustedOpacity})`;
    } else {
      card.style.background = `rgb(${cardBg.r}, ${cardBg.g}, ${cardBg.b})`;
    }
    card.style.borderColor = `rgba(${hexToRgb(accentColor).r}, ${hexToRgb(accentColor).g}, ${hexToRgb(accentColor).b}, 0.4)`;
  });
};

function applyColorScheme(primary, accent, background, text) {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--accent-color', accent);
  root.style.setProperty('--background-color', background);
  root.style.setProperty('--text-color', text);
  
  // Apply background only if no custom background image is set
  const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
  if (!savedBackgroundImage) {
    document.body.style.background = `linear-gradient(135deg, ${background} 0%, ${adjustColor(background, 20)} 100%)`;
  }
  
  // Apply colors to all UI elements
  applyUIColors(primary, accent, background, text);
}

// Enhanced Bonus Hunt Tracker Calculation - Fixed Mathematics
function calculateBonusHunt(startMoney, stopMoney, betSize, bonuses) {
  // Validate inputs
  const safeStartMoney = typeof startMoney === 'number' && !isNaN(startMoney) ? startMoney : 0;
  const safeStopMoney = typeof stopMoney === 'number' && !isNaN(stopMoney) ? stopMoney : 0;
  
  const totalSpent = Math.max(0, safeStartMoney - safeStopMoney);
  
  // Calculate average bet from bonuses array with proper validation
  let averageBet = 0;
  let totalBet = 0;
  let validBonuses = 0;
  
  if (bonuses && bonuses.length) {
    bonuses.forEach(b => {
      if (b && typeof b.bet === 'number' && !isNaN(b.bet) && b.bet > 0) {
        totalBet += b.bet;
        validBonuses++;
      }
    });
    averageBet = validBonuses > 0 ? totalBet / validBonuses : 0;
  }
  
  const breakEvenPerBonus = bonuses.length ? totalSpent / bonuses.length : 0;
  const totalBreakEven = totalSpent;
  
  // Calculate actual return with proper validation
  const actualReturn = bonuses.reduce((sum, b) => {
    if (b && typeof b.value === 'number' && !isNaN(b.value)) {
      return sum + b.value;
    }
    return sum;
  }, 0);
  
  const profit = actualReturn - totalSpent;
  const profitPercent = totalSpent !== 0 ? (profit / totalSpent) * 100 : 0;
  
  // Fixed BE X calculation: break even amount divided by average bet
  let beX = 0;
  if (averageBet > 0) {
    beX = breakEvenPerBonus / averageBet;
  }
  
  return {
    totalSpent: Math.round(totalSpent * 100) / 100,
    averageBet: Math.round(averageBet * 100) / 100,
    breakEvenPerBonus: Math.round(breakEvenPerBonus * 100) / 100,
    totalBreakEven: Math.round(totalBreakEven * 100) / 100,
    actualReturn: Math.round(actualReturn * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitPercent: Math.round(profitPercent * 10) / 10,
    beX: Math.round(beX * 100) / 100
  };
}

// 🧠 Fixed Bonus Hunt Stats Calculation
function calculateBonusHuntStats(startBalance, openingBalance, bonuses) {
  // Validate inputs
  const safeStart = typeof startBalance === 'number' && !isNaN(startBalance) ? startBalance : 0;
  const safeOpening = typeof openingBalance === 'number' && !isNaN(openingBalance) ? openingBalance : 0;
  const safeBonuses = Array.isArray(bonuses) ? bonuses : [];
  
  const bonusesCount = safeBonuses.length;
  const totalCost = Math.max(0, safeStart - safeOpening);
  
  // Calculate totals with proper validation
  let totalReturn = 0;
  let totalBet = 0;
  let validBonusCount = 0;
  let validMultipliers = [];
  
  safeBonuses.forEach(b => {
    if (b) {
      // Handle result/payout - check both properties
      const result = typeof b.result === 'number' && !isNaN(b.result) ? b.result : 0;
      const bet = typeof b.bet === 'number' && !isNaN(b.bet) && b.bet > 0 ? b.bet : 0;
      
      totalReturn += result;
      
      if (bet > 0) {
        totalBet += bet;
        validBonusCount++;
        
        // Calculate individual multiplier for proper average
        const multiplier = result / bet;
        if (!isNaN(multiplier) && isFinite(multiplier)) {
          validMultipliers.push(multiplier);
        }
      }
    }
  });
  
  const averageBetSize = validBonusCount > 0 ? totalBet / validBonusCount : 0;
  const averageWin = bonusesCount > 0 ? totalReturn / bonusesCount : 0;
  
  // Fixed average X calculation - proper mathematical average
  const averageX = validMultipliers.length > 0 
    ? validMultipliers.reduce((sum, x) => sum + x, 0) / validMultipliers.length 
    : 0;
  
  const breakEven = totalCost;
  const breakEvenPerBonus = bonusesCount > 0 ? breakEven / bonusesCount : 0;
  
  // Fixed break-even X calculation
  const breakEvenX = averageBetSize > 0 ? breakEvenPerBonus / averageBetSize : 0;
  
  const totalProfit = totalReturn - totalCost;
  
  return {
    bonuses: bonusesCount,
    totalCost: Math.round(totalCost * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    averageBetSize: Math.round(averageBetSize * 100) / 100,
    averageWin: Math.round(averageWin * 100) / 100,
    averageX: Math.round(averageX * 100) / 100,
    breakEven: Math.round(breakEven * 100) / 100,
    breakEvenPerBonus: Math.round(breakEvenPerBonus * 100) / 100,
    breakEvenX: Math.round(breakEvenX * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100
  };
}

function updateTime() {
  const el = document.getElementById('current-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// --- Slot Database (Global) ---

// ==================== TOURNAMENT SYSTEM ====================

// Tournament state (global)
let tournamentState = {
  isActive: false,
  participants: [],
  brackets: [],
  currentPhase: 0,
  currentMatch: 0,
  settings: {
    size: 8,
    format: 'single-elimination'
  },
  history: [],
  winner: null
};

// Tournament Class
class TournamentManager {
  constructor() {
    console.log('TournamentManager constructor called');
    this.state = tournamentState;
    console.log('Tournament state:', this.state);
    this.initializeEventListeners();
    console.log('TournamentManager initialized');
  }

  // Initialize all tournament event listeners
  initializeEventListeners() {
    console.log('Initializing tournament event listeners');
    
    // Tournament size change
    const sizeSelect = document.getElementById('tournament-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        this.state.settings.size = parseInt(e.target.value);
        console.log('Tournament size changed to:', this.state.settings.size);
        setTimeout(() => {
          this.generateParticipantInputs();
          this.updateParticipantCount();
        }, 100);
      });
    }

    // Tournament format change
    const formatSelect = document.getElementById('tournament-format');
    if (formatSelect) {
      formatSelect.addEventListener('change', (e) => {
        this.state.settings.format = e.target.value;
      });
    }

    // Quick fill buttons
    document.getElementById('fill-random-slots')?.addEventListener('click', () => {
      console.log('Random slots button clicked');
      this.generateParticipantInputs();
      setTimeout(() => this.fillRandomPlayersAndSlots(), 100);
    });
    document.getElementById('clear-all-participants')?.addEventListener('click', () => {
      this.generateParticipantInputs();
      setTimeout(() => this.clearAllParticipants(), 100);
    });
    document.getElementById('import-participants')?.addEventListener('click', () => {
      this.generateParticipantInputs();
      setTimeout(() => this.importParticipants(), 100);
    });
    
    // Debug button to manually generate inputs
    document.getElementById('debug-generate-inputs')?.addEventListener('click', () => {
      console.log('Debug generate button clicked');
      const grid = document.getElementById('participants-grid');
      console.log('Grid element:', grid);
      console.log('Tournament manager:', this);
      console.log('Tournament state size:', this.state.settings.size);
      this.generateParticipantInputs();
    });

    // Tournament actions
    document.getElementById('start-tournament-btn')?.addEventListener('click', () => this.startTournament());
    document.getElementById('validate-tournament-btn')?.addEventListener('click', () => this.validateSetup());
    document.getElementById('save-template-btn')?.addEventListener('click', () => this.saveTemplate());

    // Control panel actions
    document.getElementById('prev-match-btn')?.addEventListener('click', () => this.previousMatch());
    document.getElementById('next-match-btn')?.addEventListener('click', () => this.nextMatch());
    document.getElementById('determine-winner-btn')?.addEventListener('click', () => this.determineWinner());
    document.getElementById('reset-match-btn')?.addEventListener('click', () => this.resetCurrentMatch());
    document.getElementById('advance-phase-btn')?.addEventListener('click', () => this.advancePhase());
    document.getElementById('end-tournament-btn')?.addEventListener('click', () => this.endTournament());
  }

  // Generate participant input fields based on tournament size
  generateParticipantInputs() {
    console.log('Generating participant inputs for size:', this.state.settings.size);
    const grid = document.getElementById('participants-grid');
    if (!grid) {
      console.error('participants-grid element not found');
      return;
    }
    console.log('Found participants grid:', grid);

    grid.innerHTML = '';
    
    for (let i = 0; i < this.state.settings.size; i++) {
      const participantEntry = document.createElement('div');
      participantEntry.className = 'participant-entry';
      participantEntry.innerHTML = `
        <div class="participant-number">Player ${i + 1}</div>
        <input type="text" class="participant-input" placeholder="Enter player name" data-index="${i}">
        <div class="slot-input-container">
          <input type="text" class="slot-input" placeholder="Enter slot name" data-index="${i}">
          <div class="slot-suggestion-dropdown" style="display: none;"></div>
        </div>
      `;
      grid.appendChild(participantEntry);

      // Add event listeners for this participant
      const playerInput = participantEntry.querySelector('.participant-input');
      const slotInput = participantEntry.querySelector('.slot-input');

      playerInput.addEventListener('input', () => this.onParticipantChange());
      slotInput.addEventListener('input', (e) => this.onSlotInputChange(e, i));
      
      // Mark as filled when both fields have values
      const updateFilledState = () => {
        const isFilled = playerInput.value.trim() && slotInput.value.trim();
        participantEntry.classList.toggle('filled', isFilled);
        this.updateParticipantCount();
      };

      playerInput.addEventListener('input', updateFilledState);
      slotInput.addEventListener('input', updateFilledState);
    }

    this.updateParticipantCount();
    console.log('Generated', this.state.settings.size, 'participant inputs');
  }

  // Handle slot input changes and show suggestions
  onSlotInputChange(event, index) {
    const input = event.target;
    const query = input.value.trim().toLowerCase();
    const dropdown = input.parentElement.querySelector('.slot-suggestion-dropdown');

    if (query.length < 2) {
      dropdown.style.display = 'none';
      return;
    }

    // Get slot suggestions (assuming slotDatabase exists)
    let suggestions = [];
    if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
      suggestions = slotDatabase
        .filter(slot => slot.name.toLowerCase().includes(query))
        .slice(0, 5);
    } else {
      // Fallback suggestions
      const fallbackSlots = [
        { name: 'Book of Dead', provider: 'Play\'n GO' },
        { name: 'Starburst', provider: 'NetEnt' },
        { name: 'Sweet Bonanza', provider: 'Pragmatic Play' },
        { name: 'Gates of Olympus', provider: 'Pragmatic Play' },
        { name: 'The Dog House', provider: 'Pragmatic Play' }
      ];
      suggestions = fallbackSlots.filter(slot => slot.name.toLowerCase().includes(query));
    }

    if (suggestions.length > 0) {
      dropdown.innerHTML = suggestions.map(slot => `
        <div class="slot-suggestion-item" data-slot-name="${slot.name}">
          <span class="slot-suggestion-name">${slot.name}</span>
          <span class="slot-suggestion-provider">${slot.provider}</span>
        </div>
      `).join('');

      // Add click handlers for suggestions
      dropdown.querySelectorAll('.slot-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          input.value = item.dataset.slotName;
          dropdown.style.display = 'none';
          this.onParticipantChange();
        });
      });

      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none';
    }
  }

  // Update participant count display
  updateParticipantCount() {
    const participants = this.getValidParticipants();
    const countDisplay = document.getElementById('participant-count');
    if (countDisplay) {
      countDisplay.textContent = `(${participants.length}/${this.state.settings.size})`;
    }

    // Enable/disable start button based on participant count
    const startBtn = document.getElementById('start-tournament-btn');
    if (startBtn) {
      const canStart = participants.length >= 2;
      startBtn.disabled = !canStart;
      startBtn.title = canStart ? '' : 'Need at least 2 participants to start';
    }
  }

  // Handle participant input changes
  onParticipantChange() {
    this.updateParticipantCount();
    // Hide dropdowns when typing in player names
    document.querySelectorAll('.slot-suggestion-dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
    });
  }

  // Get all valid participants
  getValidParticipants() {
    const participants = [];
    const playerInputs = document.querySelectorAll('.participant-input');
    const slotInputs = document.querySelectorAll('.slot-input');

    for (let i = 0; i < playerInputs.length; i++) {
      const player = playerInputs[i].value.trim();
      const slot = slotInputs[i].value.trim();

      if (player && slot) {
        participants.push({
          id: i + 1,
          player: player,
          slot: slot,
          eliminated: false
        });
      }
    }

    return participants;
  }

  // Fill random players and slots
  fillRandomPlayersAndSlots() {
    const playerInputs = document.querySelectorAll('.participant-input');
    const slotInputs = document.querySelectorAll('.slot-input');
    
    // Random player names
    const randomNames = [
      'ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 
      'BonusHunter', 'RollMaster', 'WildCard', 'MegaSpin', 'JackpotJoe', 'LuckyLuke',
      'SpinDoctor', 'SlotBeast', 'CasinoAce', 'MegaWin', 'BonusKing', 'SpinMaster',
      'LuckyCharm', 'SlotHero', 'WinWizard', 'CasinoLord', 'SpinLegend', 'BonusBoss'
    ];
    
    // Use slot database if available, otherwise fallback
    let availableSlots = [];
    if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
      availableSlots = slotDatabase.map(slot => slot.name);
    } else {
      availableSlots = [
        'Book of Dead', 'Starburst', 'Gonzo\'s Quest', 'Reactoonz', 'Sweet Bonanza',
        'The Dog House', 'Gates of Olympus', 'Dead or Wild', 'Money Train 2', 'Razor Shark',
        'Jammin\' Jars', 'Buffalo King', 'Rise of Olympus', 'Moon Princess', 'Viking Runecraft'
      ];
    }

    // Shuffle both arrays
    const shuffledNames = [...randomNames].sort(() => 0.5 - Math.random());
    const shuffledSlots = [...availableSlots].sort(() => 0.5 - Math.random());
    
    // Fill player names
    playerInputs.forEach((input, index) => {
      if (index < shuffledNames.length) {
        input.value = shuffledNames[index];
        input.dispatchEvent(new Event('input'));
      }
    });

    // Fill slot names
    slotInputs.forEach((input, index) => {
      if (index < shuffledSlots.length) {
        input.value = shuffledSlots[index];
        input.dispatchEvent(new Event('input'));
      }
    });

    this.showFeedback('fill-random-slots', 'Random players and slots filled!', 'success');
  }

  // Clear all participants
  clearAllParticipants() {
    const playerInputs = document.querySelectorAll('.participant-input');
    const slotInputs = document.querySelectorAll('.slot-input');

    playerInputs.forEach(input => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });

    slotInputs.forEach(input => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });

    this.showFeedback('clear-all-participants', 'All participants cleared!', 'success');
  }

  // Import participants (placeholder)
  importParticipants() {
    // For now, fill with demo data
    const demoPlayers = ['ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 'BonusHunter', 'RollMaster'];
    const demoSlots = ['Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus', 'The Dog House', 'Money Train 2', 'Razor Shark', 'Jammin\' Jars'];

    const playerInputs = document.querySelectorAll('.participant-input');
    const slotInputs = document.querySelectorAll('.slot-input');

    playerInputs.forEach((input, index) => {
      if (index < demoPlayers.length) {
        input.value = demoPlayers[index];
        input.dispatchEvent(new Event('input'));
      }
    });

    slotInputs.forEach((input, index) => {
      if (index < demoSlots.length) {
        input.value = demoSlots[index];
        input.dispatchEvent(new Event('input'));
      }
    });

    this.showFeedback('import-participants', 'Demo data imported!', 'success');
  }

  // Validate tournament setup
  validateSetup() {
    const participants = this.getValidParticipants();
    const issues = [];

    if (participants.length < 2) {
      issues.push('Need at least 2 participants');
    }

    // Check for duplicate names
    const playerNames = participants.map(p => p.player.toLowerCase());
    const duplicatePlayers = playerNames.filter((name, index) => playerNames.indexOf(name) !== index);
    if (duplicatePlayers.length > 0) {
      issues.push('Duplicate player names detected');
    }

    // Check for duplicate slots
    const slotNames = participants.map(p => p.slot.toLowerCase());
    const duplicateSlots = slotNames.filter((slot, index) => slotNames.indexOf(slot) !== index);
    if (duplicateSlots.length > 0) {
      issues.push('Duplicate slot names detected');
    }

    if (issues.length === 0) {
      this.showFeedback('validate-tournament-btn', 'Setup validated successfully!', 'success');
      document.getElementById('start-tournament-btn').disabled = false;
    } else {
      this.showFeedback('validate-tournament-btn', `Issues found: ${issues.join(', ')}`, 'error');
    }
  }

  // Save tournament template (placeholder)
  saveTemplate() {
    const participants = this.getValidParticipants();
    const template = {
      settings: this.state.settings,
      participants: participants
    };

    // Save to localStorage
    localStorage.setItem('tournament-template', JSON.stringify(template));
    this.showFeedback('save-template-btn', 'Template saved!', 'success');
  }

  // Show feedback on buttons
  showFeedback(buttonId, message, type = 'info') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const originalContent = button.innerHTML;
    const originalStyle = button.style.background;

    // Update button appearance
    button.innerHTML = message;
    
    switch (type) {
      case 'success':
        button.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
        break;
      case 'error':
        button.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
        break;
      default:
        button.style.background = 'linear-gradient(135deg, #00e1ff 0%, #9147ff 100%)';
    }

    // Reset after delay
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.style.background = originalStyle;
    }, 2000);
  }

  // Placeholder methods for other tournament functionality
  startTournament() { console.log('Start tournament called'); }
  previousMatch() { console.log('Previous match called'); }
  nextMatch() { console.log('Next match called'); }
  determineWinner() { console.log('Determine winner called'); }
  resetCurrentMatch() { console.log('Reset match called'); }
  advancePhase() { console.log('Advance phase called'); }
  endTournament() { console.log('End tournament called'); }
}

// Tournament-related functions
function initializeTournamentSlotSuggestions() {
  const tournamentSlotInputs = document.querySelectorAll('.slot-input');
  
  tournamentSlotInputs.forEach((input, index) => {
    const container = input.closest('.slot-input-container');
    if (!container) return;
    
    // Create suggestion box for this input
    let suggestionBox = document.createElement('div');
    suggestionBox.className = 'slot-suggestion-dropdown';
    suggestionBox.style.display = 'none';
    
    container.appendChild(suggestionBox);
    
    input.addEventListener('input', function () {
      const value = input.value.trim();
      if (value.length < 3) {
        suggestionBox.style.display = 'none';
        return;
      }
      
      // Make sure slotDatabase is available
      if (typeof slotDatabase === 'undefined') return;
      
      const matches = slotDatabase.filter(slot =>
        slot.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6); // Limit to 6 for better UX in smaller boxes
      
      if (matches.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      
      suggestionBox.innerHTML = '';
      matches.forEach(slot => {
        const item = document.createElement('div');
        item.className = 'slot-suggestion-item';
        item.innerHTML = `
          <span class="slot-suggestion-name">${slot.name}</span>
          <span class="slot-suggestion-provider">${slot.provider}</span>
        `;
        
        const selectSlot = function(e) {
          e.preventDefault();
          e.stopPropagation();
          input.value = slot.name;
          suggestionBox.style.display = 'none';
          input.dispatchEvent(new Event('input'));
        };
        
        item.addEventListener('click', selectSlot);
        item.addEventListener('mousedown', selectSlot);
        
        suggestionBox.appendChild(item);
      });
      
      suggestionBox.style.display = 'block';
    });
    
    input.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 200);
    });
    
    // Hide other suggestion boxes when this one gets focus
    input.addEventListener('focus', function () {
      tournamentSlotInputs.forEach((otherInput, otherIndex) => {
        if (otherIndex !== index) {
          const otherContainer = otherInput.closest('.slot-input-container');
          const otherSuggestionBox = otherContainer ? otherContainer.querySelector('.slot-suggestion-dropdown') : null;
          if (otherSuggestionBox) {
            otherSuggestionBox.style.display = 'none';
          }
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar backgrounds as disabled by default
  if (localStorage.getItem('sidebarBackgroundsEnabled') === null) {
    localStorage.setItem('sidebarBackgroundsEnabled', 'false');
  }
  
  // Apply no-background class immediately if backgrounds are disabled
  if (localStorage.getItem('sidebarBackgroundsEnabled') === 'false') {
    requestAnimationFrame(() => {
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.add('no-background');
      });
    });
  }
  
  const bhBtn = document.getElementById('bh-btn');
  const boBtn = document.getElementById('bo-btn');
  const randomSlotBtn = document.getElementById('random-slot-btn');
  const tournamentBtn = document.getElementById('tournament-btn'); // Trophy button
  const infoPanel = document.querySelector('.info-panel');
  const middlePanel = document.getElementById('middle-panel');
  const randomSlotPanel = document.getElementById('random-slot-panel');
  const tournamentPanel = document.getElementById('tournament-panel');
  let panelVisible = false;
  let randomSlotPanelVisible = false;
  let tournamentPanelVisible = false;
  let tournamentInitialized = false;
  
  // Tournament manager will be initialized after class definition
  let tournamentManager;

  // Helper to update info panel visibility with slide
  function updateInfoPanelVisibility() {
    const bhActive = bhBtn && bhBtn.classList.contains('active');
    const boActive = boBtn && boBtn.classList.contains('active');
    const randomSlotActive = randomSlotBtn && randomSlotBtn.classList.contains('active');
    const tournamentActive = tournamentBtn && tournamentBtn.classList.contains('active');
    
    if (infoPanel) {
      // Hide info panel when tournament panel is active, keep visible for others
      if (tournamentActive) {
        infoPanel.classList.remove('info-panel--visible');
      } else if (bhActive || boActive || randomSlotActive) {
        infoPanel.classList.add('info-panel--visible');
      } else {
        infoPanel.classList.remove('info-panel--visible');
      }
    }
  }
  // Patch BH button logic
  bhBtn.addEventListener('click', () => {
    panelVisible = !panelVisible;
    middlePanel.style.display = panelVisible ? 'flex' : 'none';
    bhBtn.classList.toggle('active', panelVisible);
    
    // Hide selected slot display when BH panel is closed
    if (!panelVisible) {
      hideSelectedSlot();
    }
    
    // Hide random slot panel when BH is shown
    const randomSlotPanel = document.getElementById('random-slot-panel');
    if (randomSlotPanel && panelVisible) {
      randomSlotPanel.style.display = 'none';
    }
    // Remove 'active' from all sidebar buttons except BH
    if (panelVisible) {
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        if (btn !== bhBtn) btn.classList.remove('active');
      });
    }
    updateInfoPanelVisibility();
  });

  // Random Slot Button Logic
  if (randomSlotBtn && randomSlotPanel) {
    randomSlotBtn.addEventListener('click', () => {
      randomSlotPanelVisible = !randomSlotPanelVisible;
      randomSlotPanel.style.display = randomSlotPanelVisible ? 'flex' : 'none';
      randomSlotBtn.classList.toggle('active', randomSlotPanelVisible);
      
      // Hide BH panel when random slot is shown
      if (randomSlotPanelVisible) {
        middlePanel.style.display = 'none';
        panelVisible = false;
        hideSelectedSlot(); // Hide selected slot display when random slot panel opens
      }
      
      // Remove 'active' from all sidebar buttons except random slot
      if (randomSlotPanelVisible) {
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
          if (btn !== randomSlotBtn) btn.classList.remove('active');
        });
      }
      updateInfoPanelVisibility();
    });
  }

  // Tournament Button Logic
  if (tournamentBtn && tournamentPanel) {
    console.log('Tournament button and panel found:', !!tournamentBtn, !!tournamentPanel);
    tournamentBtn.addEventListener('click', () => {
      console.log('Tournament button clicked');
      console.log('tournamentManager exists:', !!tournamentManager);
      
      // Check if tournament is active - if so, show control panel and bracket
      if (tournamentManager && tournamentManager.state.isActive) {
        console.log('Tournament is active, showing control panel and bracket');
        tournamentManager.showControlPanel();
        tournamentManager.showTournamentBracket();
        return;
      }
      
      // Show/hide tournament setup panel
      tournamentPanelVisible = !tournamentPanelVisible;
      tournamentPanel.style.display = tournamentPanelVisible ? 'flex' : 'none';
      tournamentBtn.classList.toggle('active', tournamentPanelVisible);
      console.log('Tournament panel visibility:', tournamentPanelVisible);
      
      // Hide control panel if showing tournament setup
      const controlPanel = document.getElementById('tournament-control-panel');
      if (controlPanel) {
        controlPanel.style.display = 'none';
        console.log('Control panel hidden');
      }
      
      // Initialize tournament slot suggestions on first open
      if (tournamentPanelVisible && !tournamentInitialized) {
        console.log('Tournament panel opened for first time');
        
        // Force create tournament manager if it doesn't exist
        if (!window.tournamentManager) {
          console.log('Creating tournament manager');
          try {
            window.tournamentManager = {
              generateParticipantInputs: function() {
                console.log('Generating participant inputs (simple version)');
                const grid = document.getElementById('participants-grid');
                if (!grid) {
                  console.error('participants-grid not found');
                  return;
                }
                
                grid.innerHTML = '';
                const size = parseInt(document.getElementById('tournament-size').value) || 8;
                
                for (let i = 0; i < size; i++) {
                  const participantEntry = document.createElement('div');
                  participantEntry.className = 'participant-entry';
                  participantEntry.innerHTML = `
                    <div class="participant-number">Player ${i + 1}</div>
                    <input type="text" class="participant-input" placeholder="Enter player name" data-index="${i}">
                    <div class="slot-input-container">
                      <input type="text" class="slot-input" placeholder="Enter slot name" data-index="${i}">
                    </div>
                  `;
                  grid.appendChild(participantEntry);
                }
                console.log('Generated', size, 'participant inputs');
              }
            };
          } catch (error) {
            console.error('Error creating tournament manager:', error);
          }
        }
        
        setTimeout(() => {
          if (window.tournamentManager) {
            window.tournamentManager.generateParticipantInputs();
          }
        }, 100);
        
        tournamentInitialized = true;
      }
      
      // Hide other panels when tournament is shown
      if (tournamentPanelVisible) {
        middlePanel.style.display = 'none';
        randomSlotPanel.style.display = 'none';
        panelVisible = false;
        randomSlotPanelVisible = false;
        hideSelectedSlot(); // Hide selected slot display when tournament panel opens
      }
      
      // Remove 'active' from all sidebar buttons except tournament
      if (tournamentPanelVisible) {
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
          if (btn !== tournamentBtn) btn.classList.remove('active');
        });
      }
      updateInfoPanelVisibility();
    });
  }

  // Giveaway Button Logic
  const giveawayBtn = document.getElementById('giveaway-btn');
  console.log('Giveaway button found:', !!giveawayBtn);
  if (giveawayBtn) {
    giveawayBtn.addEventListener('click', () => {
      console.log('Giveaway button clicked');
      console.log('window.giveawayWheel exists:', !!window.giveawayWheel);
      
      // Toggle giveaway panel visibility
      if (window.giveawayWheel) {
        const panel = document.getElementById('giveaway-panel');
        if (panel.style.display === 'none' || !panel.style.display) {
          window.giveawayWheel.showGiveawayPanel();
          giveawayBtn.classList.add('active');
          
          // Remove 'active' from all other sidebar buttons
          document.querySelectorAll('.sidebar-btn').forEach(btn => {
            if (btn !== giveawayBtn) btn.classList.remove('active');
          });
          
          // Hide other panels
          if (infoPanel) infoPanel.classList.remove('info-panel--visible');
          if (middlePanel) middlePanel.style.display = 'none';
          if (randomSlotPanel) randomSlotPanel.style.display = 'none';
          if (tournamentPanel) tournamentPanel.style.display = 'none';
          
          panelVisible = false;
          randomSlotPanelVisible = false;
          tournamentPanelVisible = false;
        } else {
          window.giveawayWheel.hideGiveawayPanel();
          giveawayBtn.classList.remove('active');
        }
      } else {
        console.error('Giveaway wheel not initialized, trying to initialize...');
        // Try to initialize if not already done
        if (typeof GiveawayWheel !== 'undefined') {
          try {
            window.giveawayWheel = new GiveawayWheel();
            // Retry showing panel after a brief delay
            setTimeout(() => {
              if (window.giveawayWheel) {
                window.giveawayWheel.showGiveawayPanel();
                giveawayBtn.classList.add('active');
                
                // Remove 'active' from all other sidebar buttons
                document.querySelectorAll('.sidebar-btn').forEach(btn => {
                  if (btn !== giveawayBtn) btn.classList.remove('active');
                });
                
                // Hide other panels
                if (infoPanel) infoPanel.classList.remove('info-panel--visible');
                if (middlePanel) middlePanel.style.display = 'none';
                if (randomSlotPanel) randomSlotPanel.style.display = 'none';
                if (tournamentPanel) tournamentPanel.style.display = 'none';
                
                panelVisible = false;
                randomSlotPanelVisible = false;
                tournamentPanelVisible = false;
              }
            }, 200);
          } catch (error) {
            console.error('Error initializing GiveawayWheel:', error);
          }
        } else {
          console.error('GiveawayWheel class not found - script may not have loaded');
        }
      }
    });
  }

  const adInput = document.getElementById('ad-image-input');
  const logoUploadInput = document.getElementById('logo-upload-input');
  const navbarLogo = document.getElementById('navbar-logo');

  // Image upload functionality with draggable and resizable display
  adInput.addEventListener('change', () => {
    const file = adInput.files[0];
    if (!file) return;
    const fileKind = file.type.split('/')[0]; // 'image' or 'video'
    const reader = new FileReader();
    reader.onload = (evt) => {
      // Use unified media creator (supports image & video); fallback to image creator
      if (typeof createDraggableMedia === 'function') {
        createDraggableMedia(evt.target.result, fileKind === 'video' ? 'video' : 'image');
      } else {
        createDraggableImage(evt.target.result);
      }
      adInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  // Logo upload functionality
  if (navbarLogo && logoUploadInput) {
    // Load saved logo from localStorage on page load
    const savedLogo = localStorage.getItem('customNavbarLogo');
    if (savedLogo) {
      navbarLogo.src = savedLogo;
    }

    // Click handler for logo to trigger file input
    navbarLogo.addEventListener('click', () => {
      if (window.isDragLocked) {
        console.log('Logo editing disabled - interface is locked');
        return;
      }
      logoUploadInput.click();
    });

    // File input change handler
    logoUploadInput.addEventListener('change', (e) => {
      const file = logoUploadInput.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file.');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Please select an image smaller than 5MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
          const newLogoSrc = evt.target.result;
          // Update the logo image
          navbarLogo.src = newLogoSrc;
          // Save to localStorage
          localStorage.setItem('customNavbarLogo', newLogoSrc);
        };
        reader.readAsDataURL(file);
      }
    });

    // Right-click context menu for logo reset
    navbarLogo.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.isDragLocked) {
        console.log('Logo editing disabled - interface is locked');
        return;
      }
      if (confirm('Reset logo to default Twitch logo?')) {
        const defaultLogo = 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png';
        navbarLogo.src = defaultLogo;
        localStorage.removeItem('customNavbarLogo');
      }
    });
  }

  // Streamer name editing functionality
  const streamerNameSpan = document.getElementById('streamer-name');
  const streamerNameInput = document.getElementById('streamer-name-input');
  
  if (streamerNameSpan && streamerNameInput) {
    // Load saved streamer name from localStorage
    const savedStreamerName = localStorage.getItem('customStreamerName');
    if (savedStreamerName) {
      streamerNameSpan.textContent = savedStreamerName;
    }

    // Click to edit streamer name
    streamerNameSpan.addEventListener('click', () => {
      if (window.isDragLocked) {
        console.log('Streamer name editing disabled - interface is locked');
        return;
      }
      streamerNameInput.value = streamerNameSpan.textContent;
      streamerNameSpan.style.display = 'none';
      streamerNameInput.style.display = 'inline-block';
      streamerNameInput.focus();
      streamerNameInput.select();
    });

    // Save on Enter or blur
    function saveStreamerName() {
      const newName = streamerNameInput.value.trim();
      if (newName) {
        streamerNameSpan.textContent = newName;
        localStorage.setItem('customStreamerName', newName);
      }
      streamerNameInput.style.display = 'none';
      streamerNameSpan.style.display = 'inline-block';
    }

    streamerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveStreamerName();
      }
    });

    streamerNameInput.addEventListener('blur', saveStreamerName);

    // Right-click to reset streamer name
    streamerNameSpan.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.isDragLocked) {
        console.log('Streamer name editing disabled - interface is locked');
        return;
      }
      if (confirm('Reset streamer name to default?')) {
        streamerNameSpan.textContent = 'Streamer';
        localStorage.removeItem('customStreamerName');
      }
    });
  }

  // Website URL editing functionality
  const websiteLink = document.getElementById('website-link');
  const websiteText = document.getElementById('website-text');
  const websiteInput = document.getElementById('website-input');
  
  if (websiteLink && websiteText && websiteInput) {
    // Load saved website URL from localStorage
    const savedWebsiteUrl = localStorage.getItem('customWebsiteUrl');
    const savedWebsiteText = localStorage.getItem('customWebsiteText');
    
    if (savedWebsiteUrl) {
      websiteLink.href = savedWebsiteUrl;
    }
    if (savedWebsiteText) {
      websiteText.textContent = savedWebsiteText;
    }

    // Click to edit website
    websiteText.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.isDragLocked) {
        console.log('Website editing disabled - interface is locked');
        return;
      }
      websiteInput.value = websiteLink.href;
      websiteText.style.display = 'none';
      websiteInput.style.display = 'inline-block';
      websiteInput.focus();
      websiteInput.select();
    });

    // Save on Enter or blur
    function saveWebsiteUrl() {
      const newUrl = websiteInput.value.trim();
      if (newUrl) {
        // Add https:// if no protocol specified
        const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
        websiteLink.href = fullUrl;
        
        // Display text without protocol for cleaner look
        const displayText = newUrl.replace(/^https?:\/\//, '');
        websiteText.textContent = displayText;
        
        localStorage.setItem('customWebsiteUrl', fullUrl);
        localStorage.setItem('customWebsiteText', displayText);
      }
      websiteInput.style.display = 'none';
      websiteText.style.display = 'inline-block';
    }

    websiteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveWebsiteUrl();
      }
    });

    websiteInput.addEventListener('blur', saveWebsiteUrl);

    // Escape key to cancel editing for both inputs
    if (streamerNameInput) {
      streamerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          streamerNameInput.style.display = 'none';
          streamerNameSpan.style.display = 'inline-block';
        }
      });
    }

    websiteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        websiteInput.style.display = 'none';
        websiteText.style.display = 'inline-block';
      }
    });

    // Right-click to reset website URL
    websiteText.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.isDragLocked) {
        console.log('Website editing disabled - interface is locked');
        return;
      }
      if (confirm('Reset website URL to default?')) {
        websiteLink.href = '#';
        websiteText.textContent = 'Your Website';
        localStorage.removeItem('customWebsiteUrl');
        localStorage.removeItem('customWebsiteText');
      }
    });
  }

  // Function to create draggable and resizable image
  function createDraggableImage(imageSrc) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'draggable-image-container';
    imageContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 150px;
      border: 2px solid rgba(147, 70, 255, 0.5);
      border-radius: 8px;
      overflow: visible;
      cursor: move;
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      background: rgba(0, 0, 0, 0.05);
      
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 69, 58, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;

    // Resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.cssText = `
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 15px;
      height: 15px;
      background: rgba(147, 70, 255, 0.8);
      cursor: se-resize;
      border-radius: 3px;
      z-index: 1001;
      transition: all 0.2s ease;
    `;

    imageContainer.appendChild(image);
    imageContainer.appendChild(closeBtn);
    imageContainer.appendChild(resizeHandle);
    document.body.appendChild(imageContainer);

    // Close functionality
    closeBtn.addEventListener('click', (e) => {
      if (window.isDragLocked) return;
      e.stopPropagation();
      imageContainer.remove();
    });

    // Make the image container draggable
    window.dragHandler.makeDraggable(imageContainer);
    
    // Update cursor and visibility based on lock state
    function updateCursor() {
      if (window.isDragLocked) {
        imageContainer.style.cursor = 'default';
        imageContainer.style.border = 'none';
        imageContainer.style.background = 'transparent';
        imageContainer.style.backdropFilter = 'none';
        imageContainer.style.boxShadow = 'none';
        closeBtn.style.display = 'none';
        resizeHandle.style.display = 'none';
      } else {
        imageContainer.style.cursor = 'move';
        imageContainer.style.border = '2px solid rgba(147, 70, 255, 0.5)';
        imageContainer.style.background = 'rgba(0, 0, 0, 0.05)';
        imageContainer.style.backdropFilter = 'blur(5px)';
        imageContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        closeBtn.style.display = 'flex';
        resizeHandle.style.display = 'block';
      }
    }
    
    // Check lock state periodically
    const lockCheckInterval = setInterval(() => {
      updateCursor();
    }, 100);
    
    // Cleanup interval when image is removed
    const originalRemove = imageContainer.remove;
    imageContainer.remove = function() {
      clearInterval(lockCheckInterval);
      originalRemove.call(this);
    };
    
    updateCursor();

    // Resize functionality
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
      if (window.isDragLocked) return;
      
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(imageContainer).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(imageContainer).height, 10);
      
      imageContainer.style.cursor = 'se-resize';
      
      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    });

    function doResize(e) {
      if (!isResizing) return;
      
      const newWidth = startWidth + e.clientX - startX;
      const newHeight = startHeight + e.clientY - startY;
      
      // Minimum size constraints
      if (newWidth > 50 && newHeight > 50) {
        imageContainer.style.width = newWidth + 'px';
        imageContainer.style.height = newHeight + 'px';
        
        // Check if Shift is held for cropping mode
        if (e.shiftKey) {
          // Crop mode: change image object-fit to cover and allow overflow
          image.style.objectFit = 'cover';
          imageContainer.style.overflow = 'hidden';
          
          // Add visual indicator for crop mode
          imageContainer.style.borderColor = 'rgba(255, 165, 0, 0.8)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(255, 165, 0, 0.4)';
        } else {
          // Normal resize mode: show full image
          image.style.objectFit = 'contain';
          imageContainer.style.overflow = 'visible';
          
          // Normal border color
          imageContainer.style.borderColor = 'rgba(147, 70, 255, 0.5)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        }
      }
    }

    function stopResize() {
      isResizing = false;
      imageContainer.style.cursor = 'move';
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    }

    // Touch support for resize
    resizeHandle.addEventListener('touchstart', (e) => {
      if (window.isDragLocked) return;
      
      e.stopPropagation();
      const touch = e.touches[0];
      isResizing = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(imageContainer).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(imageContainer).height, 10);
      
      document.addEventListener('touchmove', doResizeTouch, { passive: false });
      document.addEventListener('touchend', stopResizeTouch);
    });

    function doResizeTouch(e) {
      if (!isResizing) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const newWidth = startWidth + touch.clientX - startX;
      const newHeight = startHeight + touch.clientY - startY;
      
      if (newWidth > 50 && newHeight > 50) {
        imageContainer.style.width = newWidth + 'px';
        imageContainer.style.height = newHeight + 'px';
        
        // For touch, we can detect multi-touch as "shift" equivalent
        if (e.touches.length > 1) {
          // Crop mode: change image object-fit to cover and allow overflow
          image.style.objectFit = 'cover';
          imageContainer.style.overflow = 'hidden';
          
          // Add visual indicator for crop mode
          imageContainer.style.borderColor = 'rgba(255, 165, 0, 0.8)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(255, 165, 0, 0.4)';
        } else {
          // Normal resize mode: show full image
          image.style.objectFit = 'contain';
          imageContainer.style.overflow = 'visible';
          
          // Normal border color
          imageContainer.style.borderColor = 'rgba(147, 70, 255, 0.5)';
          imageContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        }
      }
    }

    function stopResizeTouch() {
      isResizing = false;
      document.removeEventListener('touchmove', doResizeTouch);
      document.removeEventListener('touchend', stopResizeTouch);
    }

    console.log('Created draggable and resizable image');
  }

  // Unified draggable media (image/video) with layer controls & lock awareness
  function createDraggableMedia(src, type = 'image') {
    if (!src) return;
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'draggable-image-container';
    mediaContainer.style.position = 'absolute';
    mediaContainer.style.left = '100px';
    mediaContainer.style.top = '100px';
    mediaContainer.style.zIndex = '1000';
    mediaContainer.style.display = 'inline-block';
    mediaContainer.style.cursor = window.isDragLocked ? 'default' : 'move';

    let mediaEl;
    if (type === 'video') {
      mediaEl = document.createElement('video');
      mediaEl.src = src;
      mediaEl.autoplay = true;
      mediaEl.loop = true;
      mediaEl.muted = true;
      mediaEl.playsInline = true;
      mediaEl.controls = !window.isDragLocked;
      mediaEl.style.maxWidth = '600px';
      mediaEl.style.maxHeight = '400px';
      mediaEl.style.display = 'block';
    } else {
      mediaEl = document.createElement('img');
      mediaEl.src = src;
      mediaEl.alt = 'Uploaded Media';
      mediaEl.style.maxWidth = '400px';
      mediaEl.style.display = 'block';
    }
    mediaEl.className = 'draggable-image';

    const controls = document.createElement('div');
    controls.className = 'image-controls';
    controls.style.display = window.isDragLocked ? 'none' : 'flex';
    controls.innerHTML = `
      <button class="layer-btn layer-up" title="Move Forward">↑</button>
      <button class="layer-btn layer-down" title="Move Back">↓</button>
      ${type === 'video' ? '<button class="layer-btn loop-btn active" title="Loop On/Off">🔁</button>' : ''}
      <span class="layer-display">Layer: 1000</span>
      <button class="close-btn" title="Remove">×</button>
    `;

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.display = window.isDragLocked ? 'none' : 'block';

    mediaContainer.appendChild(mediaEl);
    mediaContainer.appendChild(controls);
    mediaContainer.appendChild(resizeHandle);
    document.body.appendChild(mediaContainer);

    // Draggable / Resizable logic
    let isDragging = false, isResizing = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0, startW = 0, startH = 0;

    mediaContainer.addEventListener('mousedown', (e) => {
      if (window.isDragLocked) return;
      if (e.target.closest('.close-btn') || e.target.closest('.layer-btn')) return;
      if (e.target === resizeHandle) {
        isResizing = true;
        startX = e.clientX; startY = e.clientY;
        startW = mediaContainer.offsetWidth; startH = mediaContainer.offsetHeight;
        e.preventDefault();
        return;
      }
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      startLeft = mediaContainer.offsetLeft; startTop = mediaContainer.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (window.isDragLocked) return;
      if (isResizing) {
        const dw = e.clientX - startX; const dh = e.clientY - startY;
        const newW = Math.max(100, startW + dw);
        const newH = Math.max(100, startH + dh);
        mediaContainer.style.width = newW + 'px';
        mediaContainer.style.height = newH + 'px';
        mediaEl.style.width = '100%';
        mediaEl.style.height = '100%';
        mediaEl.style.objectFit = 'contain';
        return;
      }
      if (!isDragging) return;
      mediaContainer.style.left = startLeft + (e.clientX - startX) + 'px';
      mediaContainer.style.top = startTop + (e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; isResizing = false; });

    // Layer controls
    const layerDisplay = controls.querySelector('.layer-display');
    controls.querySelector('.layer-up').addEventListener('click', (e) => {
      e.stopPropagation();
      let z = parseInt(mediaContainer.style.zIndex) || 1000;
      z += 10; mediaContainer.style.zIndex = z; layerDisplay.textContent = 'Layer: ' + z;
    });
    controls.querySelector('.layer-down').addEventListener('click', (e) => {
      e.stopPropagation();
      let z = parseInt(mediaContainer.style.zIndex) || 1000;
      z = Math.max(1, z - 10); mediaContainer.style.zIndex = z; layerDisplay.textContent = 'Layer: ' + z;
    });
    if (type === 'video') {
      const loopBtn = controls.querySelector('.loop-btn');
      loopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mediaEl.loop = !mediaEl.loop;
        loopBtn.classList.toggle('active', mediaEl.loop);
        loopBtn.style.opacity = mediaEl.loop ? '1' : '0.5';
      });
    }
    controls.querySelector('.close-btn').addEventListener('click', () => mediaContainer.remove());

    // React to lock state periodically
    const lockInterval = setInterval(() => {
      const locked = window.isDragLocked;
      mediaContainer.style.cursor = locked ? 'default' : 'move';
      controls.style.display = locked ? 'none' : 'flex';
      resizeHandle.style.display = locked ? 'none' : 'block';
      if (type === 'video') mediaEl.controls = !locked;
    }, 300);
    const origRemove = mediaContainer.remove;
    mediaContainer.remove = function() { clearInterval(lockInterval); origRemove.call(this); };
  }

  // Focus bet size after pressing Enter in slot name
  const slotNameInput = document.getElementById('slot-name-input');
  const betSizeInput = document.getElementById('bet-size-input');
  if (slotNameInput && betSizeInput) {
    slotNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        betSizeInput.focus();
      }
    });
  }

  // Slot image URL button/input toggle
  const slotImgUrlBtn = document.getElementById('slot-img-url-btn');
  const slotImgUrlInput = document.getElementById('slot-img-url-input');
  if (slotImgUrlBtn && slotImgUrlInput) {
    slotImgUrlBtn.addEventListener('click', () => {
      slotImgUrlBtn.style.display = 'none';
      slotImgUrlInput.style.display = 'inline-block';
      slotImgUrlInput.focus();
    });
    slotImgUrlInput.addEventListener('blur', () => {
      slotImgUrlInput.style.display = 'none';
      slotImgUrlBtn.style.display = 'inline-flex';
    });
    slotImgUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        slotImgUrlInput.blur();
      }
    });
  }

  // --- Bonus Opening / BO Button Logic ---
  const bonusOpenBtn = document.getElementById('bonus-opening-btn'); // "Bonus opening" button in BH panel
  const bhPanel = document.getElementById('middle-panel'); // BH panel element

  // Slot image URL (replace with your logic to get the actual image)
  let slotImageUrl = '';
  const slotImgInput = document.getElementById('slot-img-url-input');
  if (slotImgInput) {
    slotImgInput.addEventListener('input', (e) => {
      slotImageUrl = e.target.value;
    });
  }

  // Patch Bonus Opening button in BH panel
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
      // Set BO button as active, BH as inactive
      if (boBtn) boBtn.classList.add('active');
      if (bhBtn) bhBtn.classList.remove('active');
      updateInfoPanelVisibility();
      // --- Ensure slot highlight card updates immediately ---
      setTimeout(updateSlotHighlightCard, 50);
    });
  }

  // Hide info panel by default on load
  if (infoPanel) infoPanel.classList.remove('info-panel--visible');

  // --- Twitch Login/Logout Mockup ---
  // REMOVE Twitch login logic, username span, and related code
  // const twitchLoginBtn = document.getElementById('twitch-login-btn');
  // const twitchUsernameSpan = document.getElementById('twitch-username');
  // function mockTwitchLogin() { ... }
  // if (twitchLoginBtn) { ... }

  // Update Start/Stop Money display in right sidebar
  const startMoneyInput = document.getElementById('start-money-input');
  const stopMoneyInput = document.getElementById('stop-money-input');
  const actualBalanceInput = document.getElementById('actual-balance-input');
  const startMoneyDisplay = document.getElementById('start-money-display');
  const stopMoneyDisplay = document.getElementById('stop-money-display');
  const startMoneyDisplayMain = document.getElementById('start-money-display-main');
  const stopMoneyDisplayMain = document.getElementById('stop-money-display-main');

  // Add immediate event listeners for real-time modern stats updates
  const balanceInputs = [startMoneyInput, stopMoneyInput, actualBalanceInput];
  balanceInputs.forEach(input => {
    if (input) {
      const updateStats = () => {
        if (window.updateModernStats) {
          window.updateModernStats();
        }
      };
      
      // Add immediate event listeners
      input.addEventListener('input', updateStats);
      input.addEventListener('keyup', updateStats);
      input.addEventListener('change', updateStats);
      
      console.log(`Added real-time listeners to ${input.id}`);
    }
  });
  
  // Force initial update
  setTimeout(() => {
    if (window.updateModernStats) {
      window.updateModernStats();
      console.log('Initial modern stats update completed');
    }
  }, 500);
  


  function updateStartMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (startMoneyDisplay) startMoneyDisplay.textContent = formatted;
    if (startMoneyDisplayMain) startMoneyDisplayMain.textContent = formatted;
  }
  function updateStopMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (stopMoneyDisplay) stopMoneyDisplay.textContent = formatted;
    if (stopMoneyDisplayMain) stopMoneyDisplayMain.textContent = formatted;
  }

  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', () => {
      updateStartMoneyDisplays(startMoneyInput.value);
    });
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', () => {
      updateStopMoneyDisplays(stopMoneyInput.value);
    });
  }

  // --- Slot Name Suggestion Dropdown ---
  if (slotNameInput) {
    let suggestionBox = document.createElement('div');
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = 'linear-gradient(135deg, #23243a 0%, #2d2e4a 100%)';
    suggestionBox.style.color = '#fff';
    suggestionBox.style.borderRadius = '12px';
    suggestionBox.style.boxShadow = '0 4px 16px rgba(0,225,255,0.2)';
    suggestionBox.style.border = '1px solid #00e1ff';
    suggestionBox.style.zIndex = '1010';
    suggestionBox.style.display = 'none';
    suggestionBox.style.maxHeight = '200px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.fontSize = '0.95rem';
    suggestionBox.style.padding = '0.3rem 0';
    suggestionBox.style.backdropFilter = 'blur(8px)';
    suggestionBox.style.left = '0';
    suggestionBox.style.top = '100%';
    suggestionBox.style.width = '100%';
    suggestionBox.style.marginTop = '0.3rem';
    suggestionBox.className = 'slot-suggestion-box';
    
    // Append to the slot name input's parent container for proper positioning
    const slotNameContainer = slotNameInput.closest('.middle-input-label');
    if (slotNameContainer) {
      slotNameContainer.style.position = 'relative';
      slotNameContainer.appendChild(suggestionBox);
    } else {
      document.body.appendChild(suggestionBox);
    }

    slotNameInput.addEventListener('input', function () {
      const value = slotNameInput.value.trim();
      if (value.length < 3) {
        suggestionBox.style.display = 'none';
        return;
      }
      const matches = slotDatabase.filter(slot =>
        slot.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      if (matches.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      suggestionBox.innerHTML = '';
      matches.forEach(slot => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = '0.5rem 0.8rem';
        item.style.cursor = 'pointer';
        item.style.borderRadius = '8px';
        item.style.margin = '0.1rem 0.3rem';
        item.style.transition = 'all 0.2s ease';
        item.innerHTML = `
          <img src="${slot.image}" alt="${slot.name}" style="width:28px;height:28px;object-fit:cover;border-radius:6px;margin-right:0.6rem;border:1px solid #00e1ff;">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">${slot.name}</div>
            <div style="font-size:0.8rem;color:#b0b3b8;">${slot.provider}</div>
          </div>
        `;
        // Handle both click and mousedown to ensure selection works
        const selectSlot = function(e) {
          e.preventDefault();
          e.stopPropagation();
          slotNameInput.value = slot.name;
          suggestionBox.style.display = 'none';
          slotNameInput.dispatchEvent(new Event('input'));
          // Show selected slot in right-side display
          showSelectedSlot(slot);
          // Focus bet size input after selecting a suggestion
          if (betSizeInput) {
            requestAnimationFrame(() => betSizeInput.focus());
          }
        };
        
        item.addEventListener('click', selectSlot);
        item.addEventListener('mousedown', selectSlot);
        item.addEventListener('mouseover', function () {
          item.style.background = 'linear-gradient(90deg, #9147ff 0%, #00e1ff 100%)';
          item.style.transform = 'scale(1.02)';
        });
        item.addEventListener('mouseout', function () {
          item.style.background = 'transparent';
          item.style.transform = 'scale(1)';
        });
        suggestionBox.appendChild(item);
      });
      suggestionBox.style.display = 'block';
    });

    // Hide suggestions on blur with faster timing
    slotNameInput.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 150);
    });
  }

  // Add slot to Bonus List on Enter in Bet Size input
  // Ensure there is a <ul> inside .bonus-list, create if missing
  let bonusListUl = document.querySelector('.bonus-list ul');
  if (!bonusListUl) {
    const bonusListDiv = document.querySelector('.bonus-list');
    if (bonusListDiv) {
      bonusListUl = document.createElement('ul');
      bonusListDiv.appendChild(bonusListUl);
    }
  }
  // --- Super checkbox logic ---
  const superCheckbox = document.getElementById('super-checkbox');
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const slotName = slotNameInput.value.trim();
        const betSize = betSizeInput.value.trim();
        if (slotName && betSize) {
          // Try to find slot in database for image
          let slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
          let imgSrc = slot ? slot.image : DEFAULT_SLOT_IMAGE;
          // Create new list item with image and highlight classes
          const li = document.createElement('li');
          li.innerHTML = `
            <div class="slot-card-modern">
              <div class="slot-image-container">
                <img src="${imgSrc}" alt="${slotName}" class="slot-img-full">
              </div>
              <div class="slot-content">
                <div class="slot-title">${slotName}</div>
                <div class="slot-metrics">
                  <div class="metric-item bet-metric">
                    <div class="metric-value">€${parseFloat(betSize).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="metric-label">BET</div>
                  </div>
                  <div class="metric-divider"></div>
                  <div class="metric-item payout-metric">
                    <div class="metric-value payout-value pending">--</div>
                    <div class="metric-label">WIN</div>
                  </div>
                </div>
              </div>
            </div>
          `;
          // Highlight if super checkbox is checked
          if (superCheckbox && superCheckbox.checked) {
            li.classList.add('super-slot');
            superCheckbox.checked = false; // Optionally uncheck after use
          }
          bonusListUl.appendChild(li);

          // Optionally clear inputs
          slotNameInput.value = '';
          betSizeInput.value = '';
          slotNameInput.focus();

          renderBonusHuntResults();
          updateBonusListCarousel();
        }
      }
    });
  }

  // --- Bonus Opening Payout Panel Logic (Vanilla JS, styled to match your app) ---

  function getBonusListData() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return [];
    // Only use non-clone lis for calculations and payout
    return Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null
        };
      });
  }

  let payoutPanel = null;
  let payoutBonuses = [];
  let payoutIndex = 0;

  function showPayoutPanel() {
    if (payoutPanel) return;
    payoutBonuses = getBonusListData();
    if (!payoutBonuses.length) return;

    payoutIndex = 0;
    payoutPanel = document.createElement('div');
    payoutPanel.className = 'middle-panel';
    payoutPanel.style.display = 'flex';
    payoutPanel.style.flexDirection = 'column';
    payoutPanel.style.alignItems = 'center';
    payoutPanel.style.position = 'fixed';
    payoutPanel.style.top = '50%';
    payoutPanel.style.left = '50%';
    payoutPanel.style.transform = 'translate(-50%, -50%)';
    payoutPanel.style.zIndex = '1001';
    payoutPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    payoutPanel.style.borderRadius = '24px';
    payoutPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    payoutPanel.style.padding = '2rem 1.5rem';
    payoutPanel.style.width = '400px';
    payoutPanel.style.height = '420px';

    document.body.appendChild(payoutPanel);
    
    // Make the payout panel draggable
    if (window.dragHandler) {
      window.dragHandler.makeDraggable(payoutPanel);
    }
    
    renderPayoutStep();
  }

  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  function getSlotImage(slotName) {
    // Use the slotDatabase defined in this script
    const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
    const imageUrl = slot ? slot.image : DEFAULT_SLOT_IMAGE;
    console.log(`Getting image for slot: ${slotName}, found: ${!!slot}, image: ${imageUrl}`);
    return imageUrl;
  }

  // --- Hook up Bonus Opening button ---
  // Remove duplicate event listener for bonusOpenBtn
  // Only keep the payout panel logic, not the slot card logic, for the "Bonus Opening" button
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
    });
  }

  // Hide selected slot by default
  hideSelectedSlot();

  function renderBonusHuntResults() {
    const startBalance = parseFloat(document.getElementById('start-money-input')?.value) || 0;
    const openingBalance = parseFloat(document.getElementById('stop-money-input')?.value) || 0;
    // Only use non-clone lis for calculations
    const bonusListUl = document.querySelector('.bonus-list ul');
    const bonuses = bonusListUl
      ? Array.from(bonusListUl.children)
          .filter(li => !li.classList.contains('carousel-clone'))
          .map(li => {
            const spans = li.querySelectorAll('span');
            let slot = spans[0] ? spans[0].textContent.trim() : '';
            
            // Extract bet amount more reliably
            let bet = 0;
            const betSpan = li.querySelector('.slot-bet');
            if (betSpan) {
              const betText = betSpan.textContent.replace(/[^\d.]/g, '');
              bet = parseFloat(betText) || 0;
            } else if (spans[1]) {
              const betText = spans[1].textContent.replace(/[^\d.]/g, '');
              bet = parseFloat(betText) || 0;
            }
            
            // Extract result/payout more reliably
            let result = 0;
            if (li.dataset && li.dataset.payout) {
              result = parseFloat(li.dataset.payout) || 0;
            } else {
              const payoutValue = li.querySelector('.payout-value');
              if (payoutValue && payoutValue.textContent !== '--') {
                const payoutText = payoutValue.textContent.replace(/[^\d.]/g, '');
                result = parseFloat(payoutText) || 0;
              }
            }
            
            return { slot, bet, result };
          })
      : [];

    const stats = calculateBonusHuntStats(startBalance, openingBalance, bonuses);

    const resultsDiv = document.getElementById('bonus-hunt-results');
    if (!resultsDiv) return;
    resultsDiv.innerHTML = `
      <div class="bhr-compact" style="
        display:grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 0.07rem 0.2rem;
        font-size: 0.89rem;
        line-height: 1.08;
        ">
        <div><span class="bhr-label">Bon:</span> <span class="bhr-value">${stats.bonuses}</span></div>
        <div><span class="bhr-label">Pft:</span> <span class="bhr-value ${stats.totalProfit >= 0 ? 'bhr-profit' : 'bhr-loss'}">€${stats.totalProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Bet:</span> <span class="bhr-value">€${stats.averageBetSize.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Win:</span> <span class="bhr-value">€${stats.averageWin.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">X:</span> <span class="bhr-value">${stats.averageX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BE X:</span> <span class="bhr-value">${stats.breakEvenX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BEB:</span> <span class="bhr-value">€${stats.breakEvenPerBonus.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">BE:</span> <span class="bhr-value">€${stats.breakEven.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">Cost:</span> <span class="bhr-value">€${stats.totalCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Ret:</span> <span class="bhr-value">€${stats.totalReturn.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
      </div>
    `;
  }

  // --- Call renderBonusHuntResults on relevant changes ---

  // After start/stop money input
  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  // After bet size input
  if (betSizeInput) {
    betSizeInput.addEventListener('input', renderBonusHuntResults);
  }

  // After adding a bonus to the list, update the results
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        // ...existing code...
        // After adding the li:
        renderBonusHuntResults();
      }
    });
  }

  // When a payout is entered in the payout panel, store it as a data attribute and update results
  function setBonusPayout(slotName, payout) {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Validate payout
    const safePayout = typeof payout === 'number' && !isNaN(payout) ? payout : 0;
    
    Array.from(bonusListUl.children)
      // Update both original and carousel-clone items for visual consistency
      .forEach(li => {
        const spans = li.querySelectorAll('span');
        const slotNameSpan = li.querySelector('.slot-name') || spans[0];
        
        if (slotNameSpan && slotNameSpan.textContent.trim() === slotName.trim()) {
          // Store payout data
          li.dataset.payout = safePayout.toString();
          
          // Update payout display with new structure
          const payoutValue = li.querySelector('.payout-value');
          if (payoutValue) {
            // Remove pending class since we're setting a value
            payoutValue.classList.remove('pending');
            
            if (safePayout > 0) {
              payoutValue.textContent = `€${safePayout.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
              payoutValue.style.color = '#00ffb8';
              payoutValue.style.background = 'linear-gradient(135deg, rgba(0, 255, 184, 0.25) 0%, rgba(0, 255, 184, 0.15) 100%)';
              payoutValue.style.borderColor = 'rgba(0, 255, 184, 0.4)';
            } else {
              payoutValue.textContent = '€0.00';
              payoutValue.style.color = '#ff5c5c';
              payoutValue.style.background = 'linear-gradient(135deg, rgba(255, 92, 92, 0.25) 0%, rgba(255, 92, 92, 0.15) 100%)';
              payoutValue.style.borderColor = 'rgba(255, 92, 92, 0.4)';
            }
          }
        }
      });
    
    // Update calculations
    renderBonusHuntResults();
  }

  // In renderPayoutStep, after payout is entered, call setBonusPayout
  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  // Initial render on page load
  document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    renderBonusHuntResults();
  });

  // --- Professional Carousel Animation for Bonus List ---
  
  function createDynamicCarouselAnimation(animationName, itemCount) {
    // Remove existing animation if it exists
    const existingStyle = document.getElementById(animationName);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // For seamless infinite scroll with duplicated content:
    // Move exactly 50% to transition from originals to duplicates
    let keyframes = `@keyframes ${animationName} {
      0% { 
        transform: translateY(0%); 
      }
      100% { 
        transform: translateY(-50%); 
      }
    }`;
    
    // Inject the animation into the page
    const styleElement = document.createElement('style');
    styleElement.id = animationName;
    styleElement.textContent = keyframes;
    document.head.appendChild(styleElement);
  }
  
  function setupBonusListCarousel() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Remove previous clones if any
    Array.from(bonusListUl.querySelectorAll('.carousel-clone')).forEach(clone => clone.remove());

    // Only clone the original items (not clones)
    const items = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone'));
    if (items.length === 0) return;

    // Simply append clones directly to the ul for seamless loop  
    items.forEach(li => {
      const clone = li.cloneNode(true);
      clone.classList.add('carousel-clone');
      bonusListUl.appendChild(clone);
    });
    
    // Ensure all items have consistent styling
    const allItems = Array.from(bonusListUl.children);
    allItems.forEach(item => {
      item.style.flexShrink = '0';
      item.style.minHeight = 'auto';
    });
  }

  function updateBonusListCarousel() {
    setupBonusListCarousel();
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Only count original items (not clones)
    const itemCount = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone')).length;
    
    if (itemCount === 0) {
      bonusListUl.style.animation = 'none';
      return;
    }
    
    // Create dynamic keyframes based on actual item count
    const animationName = `bonus-carousel-${itemCount}-items`;
    createDynamicCarouselAnimation(animationName, itemCount);
    
    // Consistent timing for smooth rhythm
    const duration = 20; // Fixed duration for consistent rhythm
    
    bonusListUl.style.animationName = animationName;
    bonusListUl.style.animationDuration = duration + 's';
    bonusListUl.style.animationTimingFunction = 'linear';
    bonusListUl.style.animationIterationCount = 'infinite';
    bonusListUl.style.animationPlayState = 'running';
    
    // Add intersection observer for performance optimization
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bonusListUl.style.animationPlayState = 'running';
          } else {
            bonusListUl.style.animationPlayState = 'paused';
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(bonusListUl.closest('.bonus-list'));
    }
  }

  // Enhanced add-to-list logic with smooth transitions
  function addItemToCarousel(listItem) {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    
    // Add item with entrance animation
    listItem.style.opacity = '0';
    listItem.style.transform = 'translateY(20px)';
    listItem.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    
    bonusListUl.appendChild(listItem);
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
      listItem.style.opacity = '1';
      listItem.style.transform = 'translateY(0)';
    });
    
    // Update carousel after animation using requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateBonusListCarousel();
      });
    });
  }

  // Enhanced Carousel Controls
  let carouselState = {
    isPaused: false,
    speed: 'normal', // normal, fast, slow
    speedMultipliers: {
      slow: 1.5,
      normal: 1,
      fast: 0.6
    }
  };

  function initCarouselControls() {
    const pauseBtn = document.getElementById('carousel-pause');
    const speedBtn = document.getElementById('carousel-speed');
    const progressBar = document.getElementById('carousel-progress');

    if (pauseBtn) {
      pauseBtn.addEventListener('click', toggleCarouselPlayState);
    }

    if (speedBtn) {
      speedBtn.addEventListener('click', cycleCarouselSpeed);
    }

    // Update progress bar
    if (progressBar) {
      updateProgressBar();
    }
  }

  function toggleCarouselPlayState() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    const pauseBtn = document.getElementById('carousel-pause');
    
    if (!bonusListUl || !pauseBtn) return;

    carouselState.isPaused = !carouselState.isPaused;
    
    if (carouselState.isPaused) {
      bonusListUl.style.animationPlayState = 'paused';
      pauseBtn.textContent = '▶️';
      pauseBtn.title = 'Play';
      pauseBtn.classList.add('active');
    } else {
      bonusListUl.style.animationPlayState = 'running';
      pauseBtn.textContent = '⏸️';
      pauseBtn.title = 'Pause';
      pauseBtn.classList.remove('active');
    }
  }

  function cycleCarouselSpeed() {
    const speeds = ['slow', 'normal', 'fast'];
    const currentIndex = speeds.indexOf(carouselState.speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    carouselState.speed = speeds[nextIndex];

    const speedBtn = document.getElementById('carousel-speed');
    const bonusListUl = document.querySelector('.bonus-list ul');
    
    if (!speedBtn || !bonusListUl) return;

    // Update button display
    const speedIcons = {
      slow: '🐌',
      normal: '🏃',
      fast: '🚀'
    };
    
    const speedNames = {
      slow: 'Slow',
      normal: 'Normal', 
      fast: 'Fast'
    };

    speedBtn.textContent = speedIcons[carouselState.speed];
    speedBtn.title = `Speed: ${speedNames[carouselState.speed]}`;

    // Apply speed multiplier to animation
    const currentDuration = parseFloat(bonusListUl.style.animationDuration || '25s');
    const baseDuration = currentDuration / (carouselState.speedMultipliers[speeds[currentIndex]] || 1);
    const newDuration = baseDuration * carouselState.speedMultipliers[carouselState.speed];
    
    bonusListUl.style.animationDuration = newDuration + 's';
    
    // Update progress bar animation
    updateProgressBar();
  }

  function updateProgressBar() {
    const progressFill = document.getElementById('carousel-progress');
    const bonusListUl = document.querySelector('.bonus-list ul');
    
    if (!progressFill || !bonusListUl) return;

    const duration = parseFloat(bonusListUl.style.animationDuration || '25s');
    progressFill.style.animationDuration = duration + 's';
    
    if (carouselState.isPaused) {
      progressFill.style.animationPlayState = 'paused';
    } else {
      progressFill.style.animationPlayState = 'running';
    }
  }

  // Enhanced updateBonusListCarousel to work with new controls
  const originalUpdateCarousel = updateBonusListCarousel;
  const debouncedUpdateCarousel = debounce(originalUpdateCarousel, 100);
  
  updateBonusListCarousel = function() {
    debouncedUpdateCarousel();
    
    // Apply current speed setting immediately
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (bonusListUl && carouselState.speed !== 'normal') {
      const currentDuration = parseFloat(bonusListUl.style.animationDuration || '25s');
      const newDuration = currentDuration * carouselState.speedMultipliers[carouselState.speed];
      bonusListUl.style.animationDuration = newDuration + 's';
    }
    
    // Apply pause state
    if (carouselState.isPaused && bonusListUl) {
      bonusListUl.style.animationPlayState = 'paused';
    }
    
    updateProgressBar();
    updateEmptyState();
  };

  // Enhanced UI interactions and micro-animations
  function initSidebarInteractions() {
    // Mouse tracking for particle effects
    const infoSections = document.querySelectorAll('.info-section');
    
    infoSections.forEach(section => {
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        section.style.setProperty('--mouse-x', x + '%');
        section.style.setProperty('--mouse-y', y + '%');
      });
    });

    // Stagger animation for bonus list items
    const bonusList = document.querySelector('.bonus-list ul');
    if (bonusList) {
      const updateItemIndices = () => {
        const items = bonusList.querySelectorAll('li:not(.carousel-clone)');
        items.forEach((item, index) => {
          item.style.setProperty('--item-index', index);
        });
      };
      
      // Update indices when items are added
      const observer = new MutationObserver(updateItemIndices);
      observer.observe(bonusList, { childList: true });
      updateItemIndices();
    }

    // Interactive empty chat card click effect
    const chatCard = document.querySelector('.empty-chat-card');
    if (chatCard) {
      chatCard.addEventListener('click', () => {
        chatCard.style.transform = 'translateY(0px) scale(0.95)';
        setTimeout(() => {
          chatCard.style.transform = '';
        }, 100);
      });
    }

    // Money display click animation
    const moneyDisplays = document.querySelectorAll('.money-display');
    moneyDisplays.forEach(display => {
      display.addEventListener('click', () => {
        const value = display.querySelector('.money-value');
        if (value) {
          value.style.animation = 'none';
          requestAnimationFrame(() => {
            value.style.animation = 'pulse-highlight 0.4s ease';
          });
        }
      });
    });
  }

  // Add pulse highlight animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-highlight {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); text-shadow: 0 0 20px currentColor; }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Handle empty state for bonus list
  function updateEmptyState() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    const emptyState = document.getElementById('bonus-list-empty');
    
    if (!bonusListUl || !emptyState) return;
    
    const items = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone'));
    
    if (items.length === 0) {
      emptyState.style.display = 'block';
      bonusListUl.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      bonusListUl.style.display = 'block';
    }
  }

  // On page load, setup carousel if there are items
  function initializeApp() {
    updateBonusListCarousel();
    initCarouselControls();
    initSidebarInteractions();
    
    // Load saved Twitch chat on page load
    setTimeout(loadSavedTwitchChat, 500);
    
    // Initialize navbar image switcher with a small delay
    setTimeout(() => {
      initNavbarImageSwitcher();
    }, 100);
  }

  // --- Navbar Image Switcher ---
  function initNavbarImageSwitcher() {
    console.log('Initializing navbar image switcher...');
    
    // Define the three images to switch between
    const navbarModes = [
      { src: "./assets/content.png", alt: "Content", description: "Content Display" },
      { src: "./assets/raw.png", alt: "Raw", description: "Raw Display" },
      { src: "./assets/wager.png", alt: "Wager", description: "Wager Display" }
    ];
    let navbarModeIndex = 0;
    
    const navbarSwitcher = document.getElementById('navbar-image-switcher');
    const switcherImage = document.getElementById('switcher-image');
    
    console.log('Found elements:', {
      navbarSwitcher: !!navbarSwitcher,
      switcherImage: !!switcherImage
    });

    function updateNavbarSwitcher() {
      if (!navbarSwitcher || !switcherImage) {
        console.error('updateNavbarSwitcher: Elements not found!');
        return;
      }
      
      const currentMode = navbarModes[navbarModeIndex];
      console.log('Updating navbar switcher to:', currentMode);
      
      // Set error handler
      switcherImage.onerror = function() {
        console.warn('Failed to load image:', currentMode.src);
        this.src = './assets/content.png'; // Fallback to content.png
      };
      
      // Set load handler with smooth transition effect
      switcherImage.onload = function() {
        console.log('Image loaded successfully:', currentMode.src);
        // Add smooth scale animation
        this.style.transition = 'transform 0.2s ease';
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 200);
      };
      
      // Update image source and properties
      switcherImage.src = currentMode.src;
      switcherImage.alt = currentMode.alt;
      navbarSwitcher.title = `Click to switch - Current: ${currentMode.description}`;
      
      // Ensure visibility
      navbarSwitcher.style.display = 'inline-block';
      navbarSwitcher.style.visibility = 'visible';
      navbarSwitcher.style.opacity = '1';
      switcherImage.style.display = 'block';
      
      console.log('Image src updated to:', switcherImage.src);
    }

    if (navbarSwitcher && switcherImage) {
      console.log('Navbar switcher initialized successfully');
      
      // Handle clicks on the switcher container
      navbarSwitcher.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Navbar switcher clicked! Current index:', navbarModeIndex);
        
        // Cycle to next image
        navbarModeIndex = (navbarModeIndex + 1) % navbarModes.length;
        const newMode = navbarModes[navbarModeIndex];
        console.log('New index:', navbarModeIndex, 'New mode:', newMode);
        
        // Show notification
        showNotification(`Switched to: ${newMode.description}`, 1500);
        
        updateNavbarSwitcher();
      });
      
      // Also handle clicks directly on the image
      switcherImage.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Switcher image clicked! Current index:', navbarModeIndex);
        
        // Cycle to next image
        navbarModeIndex = (navbarModeIndex + 1) % navbarModes.length;
        const newMode = navbarModes[navbarModeIndex];
        console.log('New index:', navbarModeIndex, 'New mode:', newMode);
        
        // Show notification
        showNotification(`Switched to: ${newMode.description}`, 1500);
        
        updateNavbarSwitcher();
      });
      
      // Initialize with first image
      updateNavbarSwitcher();
      
    } else {
      console.error('Navbar switcher elements not found!', {
        navbarSwitcher: !!navbarSwitcher,
        switcherImage: !!switcherImage
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM is already loaded
    initializeApp();
  }

  // Helper function to show notifications
  function showNotification(message, duration = 2000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.switcher-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'switcher-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // --- Slot Highlight Card (Bottom Left) ---
  let slotHighlightCard = null;
  function updateSlotHighlightCard() {
    // Only show if BO is active
    const boBtn = document.getElementById('bo-btn');
    if (!boBtn || !boBtn.classList.contains('active')) {
      if (slotHighlightCard) {
        slotHighlightCard.remove();
        slotHighlightCard = null;
      }
      return;
    }

    // Remove old card if present
    if (slotHighlightCard) {
      slotHighlightCard.remove();
      slotHighlightCard = null;
    }

    // Get bonus list data (with payouts)
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null,
          img: li.querySelector('img') ? li.querySelector('img').src : DEFAULT_SLOT_IMAGE
        };
      });

    if (!bonuses.length) return;

    // Find best (highest payout), worst (lowest payout), and current (first with payout==null)
    let best = null, worst = null, current = null;
    const bonusesWithPayout = bonuses.filter(b => typeof b.payout === 'number' && !isNaN(b.payout));
    if (bonusesWithPayout.length) {
      best = bonusesWithPayout.reduce((a, b) => (b.payout > a.payout ? b : a), bonusesWithPayout[0]);
      worst = bonusesWithPayout.reduce((a, b) => (b.payout < a.payout ? b : a), bonusesWithPayout[0]);
    }
    current = bonuses.find(b => b.payout === null || isNaN(b.payout));

    // Always show 3 slots: left=best, middle=current, right=worst (even if some are the same)
    const slotsToShow = [
      best ? { ...best, type: 'best' } : null,
      current ? { ...current, type: 'current' } : null,
      worst ? { ...worst, type: 'worst' } : null
    ];

    // If all are null, don't show
    if (!slotsToShow[0] && !slotsToShow[1] && !slotsToShow[2]) return;

    // Card container (bigger, with gradient background)
    slotHighlightCard = document.createElement('div');
    slotHighlightCard.style.position = 'fixed';
    slotHighlightCard.style.left = '24px';
    slotHighlightCard.style.bottom = '8px';
    slotHighlightCard.style.width = '540px';
    slotHighlightCard.style.height = '210px';
    slotHighlightCard.style.background = 'linear-gradient(120deg, #23243a 0%, #3a2d4a 60%, #1a1c2e 100%)';
    slotHighlightCard.style.borderRadius = '32px';
    slotHighlightCard.style.boxShadow = '0 12px 48px 0 rgba(0,0,0,0.28), 0 2px 0 0 #00e1ff inset';
    slotHighlightCard.style.display = 'flex';
    slotHighlightCard.style.alignItems = 'center';
    slotHighlightCard.style.justifyContent = 'space-between';
    slotHighlightCard.style.zIndex = '1000';
    slotHighlightCard.style.padding = '0 38px';
    slotHighlightCard.style.gap = '0px';
    slotHighlightCard.style.border = '2.5px solid #23243a';
    slotHighlightCard.style.backdropFilter = 'blur(12px)';
    slotHighlightCard.style.transition = 'box-shadow 0.3s, background 0.3s, border-radius 0.3s';

    // Pill colors
    const pillColors = {
      best: '#00ff7a',
      current: '#ffe600',
      worst: '#ff3b7a'
    };
    const pillLabels = {
      best: 'Best',
      current: 'Current',
      worst: 'Worst'
    };

    // Helper to render a slot card (empty if slot is null)
    function renderSlot(slot, type) {
      // Outer container (bigger)
      const card = document.createElement('div');
      card.style.position = 'relative';
      card.style.width = '160px';
      card.style.height = '190px';
      card.style.borderRadius = '28px';
      card.style.overflow = 'hidden';
      card.style.background = '#23242a';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.18)';
      card.style.margin = '0 8px';

      if (!slot) {
        // Empty placeholder
        card.style.opacity = '0.25';
        card.style.background = '#444';
        return card;
      }

      // Slot image fills card
      const img = document.createElement('img');
      img.src = slot.img;
      img.alt = slot.name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.borderRadius = '28px';
      card.appendChild(img);

      // Top pill (type) - move higher (closer to top)
      const topPill = document.createElement('div');
      topPill.textContent = pillLabels[type];
      topPill.style.position = 'absolute';
      topPill.style.top = '3px'; // was 14px, now much closer to top
      topPill.style.left = '50%';
      topPill.style.transform = 'translateX(-50%)';
      topPill.style.background = pillColors[type];
      topPill.style.color = '#23242a';
      topPill.style.fontWeight = 'bold';
      topPill.style.fontSize = '1.0rem';
      topPill.style.padding = '6px 26px';
      topPill.style.borderRadius = '999px';
      topPill.style.boxShadow = '0 1px 8px 0 rgba(0,0,0,0.13)';
      topPill.style.letterSpacing = '0.5px';
      card.appendChild(topPill);

      // Bottom pill (payout)
      const payoutPill = document.createElement('div');
      payoutPill.textContent = typeof slot.payout === 'number' && !isNaN(slot.payout)
        ? `€${slot.payout.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`
        : '--';
      payoutPill.style.position = 'absolute';
      payoutPill.style.bottom = '3px';
      payoutPill.style.left = '50%';
      payoutPill.style.transform = 'translateX(-50%)';
      payoutPill.style.background = '#f3f4f6';
      payoutPill.style.color = '#23242a';
      payoutPill.style.fontWeight = 'bold';
      payoutPill.style.fontSize = '1.0rem';
      payoutPill.style.padding = '7px 22px';
      payoutPill.style.borderRadius = '999px';
      payoutPill.style.boxShadow = '0 1px 8px 0 rgba(0,0,0,0.13)';
      payoutPill.style.letterSpacing = '0.5px';
      card.appendChild(payoutPill);

      return card;
    }

    // Render left (best), middle (current), right (worst)
    slotHighlightCard.appendChild(renderSlot(slotsToShow[0], 'best'));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[1], 'current'));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[2], 'worst'));

    document.body.appendChild(slotHighlightCard);
    
    // Make the slot highlight card draggable
    if (window.dragHandler) {
      window.dragHandler.makeDraggable(slotHighlightCard);
    }
  }

  // Call updateSlotHighlightCard whenever the bonus list or payouts change
  function patchSlotHighlightCardUpdates() {
    // After adding a bonus
    if (betSizeInput && slotNameInput && bonusListUl) {
      betSizeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateSlotHighlightCard, 50);
        }
      });
    }
    // After payout is set
    const origSetBonusPayout = setBonusPayout;
    setBonusPayout = function(slotName, payout) {
      origSetBonusPayout(slotName, payout);
      setTimeout(updateSlotHighlightCard, 50);
    };
    // On page load
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(updateSlotHighlightCard, 100);
    });
    // Also update when BO button is toggled
    const boBtn = document.getElementById('bo-btn');
    if (boBtn) {
      boBtn.addEventListener('click', () => {
        setTimeout(updateSlotHighlightCard, 50);
      });
    }
  }
  patchSlotHighlightCardUpdates();

  // --- Edit Slots Panel Logic ---
  const editSlotsBtn = document.getElementById('edit-slots-btn');
  let editSlotsPanel = null;

  function getBonusListUl() {
    return document.querySelector('.bonus-list ul');
  }

  function showEditSlotsPanel() {
    if (editSlotsPanel) return;
    const bonusListUl = getBonusListUl();
    if (!bonusListUl) return;
    // Only original items (not clones)
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          li,
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          img: li.querySelector('img') ? li.querySelector('img').src : ''
        };
      });

    // Create panel
    editSlotsPanel = document.createElement('div');
    editSlotsPanel.className = 'middle-panel';
    editSlotsPanel.style.display = 'flex';
    editSlotsPanel.style.flexDirection = 'column';
    editSlotsPanel.style.alignItems = 'center';
    editSlotsPanel.style.position = 'fixed';
    editSlotsPanel.style.top = '50%';
    editSlotsPanel.style.left = '50%';
    editSlotsPanel.style.transform = 'translate(-50%, -50%)';
    editSlotsPanel.style.zIndex = '1002';
    editSlotsPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    editSlotsPanel.style.borderRadius = '24px';
    editSlotsPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    editSlotsPanel.style.padding = '2rem 1.5rem';
    editSlotsPanel.style.width = '440px';
    editSlotsPanel.style.maxHeight = '480px';
    editSlotsPanel.style.overflowY = 'auto';

    // Build slot list with bin icon
    let html = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">Edit Slots</div>
      <form id="edit-slots-form" style="width:100%;">
        <div id="edit-slots-list" style="display:flex;flex-direction:column;gap:1.1rem;">
    `;
    bonuses.forEach((bonus, idx) => {
      html += `
        <div class="edit-slot-row" style="display:flex;align-items:center;gap:0.7rem;" data-idx="${idx}">
          <img src="${bonus.img}" alt="" style="width:38px;height:38px;object-fit:cover;border-radius:8px;box-shadow:0 1px 4px 0 rgba(0,0,0,0.13);">
          <input type="text" class="middle-input" style="width:120px;" value="${bonus.name.replace(/"/g, '&quot;')}" data-idx="${idx}" data-type="name" />
          <input type="number" class="middle-input" style="width:90px;" value="${bonus.bet}" min="0" step="any" data-idx="${idx}" data-type="bet" />
          <button type="button" class="delete-slot-btn" title="Delete slot" style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
            <span style="font-size:1.5rem;color:#ff5c5c;">🗑️</span>
          </button>
        </div>
      `;
    });
    html += `
        </div>
        <div style="display:flex;gap:1rem;justify-content:center;margin-top:2.2rem;">
          <button type="submit" class="middle-btn small-btn" style="width:120px;">Save</button>
          <button type="button" id="close-edit-slots-btn" class="middle-btn small-btn" style="width:120px;background:#ff5c5c;color:#fff;">Close</button>
        </div>
      </form>
    `;
    editSlotsPanel.innerHTML = html;
    document.body.appendChild(editSlotsPanel);
    
    // Make the edit slots panel draggable
    if (window.dragHandler) {
      window.dragHandler.makeDraggable(editSlotsPanel);
    }

    // Delete slot logic
    editSlotsPanel.querySelectorAll('.delete-slot-btn').forEach((btn, i) => {
      btn.addEventListener('click', function() {
        // Remove from DOM
        const row = btn.closest('.edit-slot-row');
        if (row) row.remove();
        // Remove from bonus list UI
        if (bonuses[i] && bonuses[i].li && bonuses[i].li.parentNode) {
          bonuses[i].li.parentNode.removeChild(bonuses[i].li);
        }
        renderBonusHuntResults();
        updateBonusListCarousel();
        setTimeout(updateSlotHighlightCard, 50);
      });
    });

    // Save handler
    editSlotsPanel.querySelector('#edit-slots-form').onsubmit = function(e) {
      e.preventDefault();
      // Get all input values
      const nameInputs = editSlotsPanel.querySelectorAll('input[data-type="name"]');
      const betInputs = editSlotsPanel.querySelectorAll('input[data-type="bet"]');
      nameInputs.forEach((input, i) => {
        const idx = parseInt(input.dataset.idx, 10);
        // Only update if the row still exists (not deleted)
        const li = bonuses[idx] && bonuses[idx].li && document.body.contains(bonuses[idx].li) ? bonuses[idx].li : null;
        if (li) {
          const spans = li.querySelectorAll('span');
          if (spans[0]) spans[0].textContent = input.value;
        }
      });
      betInputs.forEach((input, i) => {
        const idx = parseInt(input.dataset.idx, 10);
        const li = bonuses[idx] && bonuses[idx].li && document.body.contains(bonuses[idx].li) ? bonuses[idx].li : null;
        if (li) {
          const spans = li.querySelectorAll('span');
          if (spans[1]) spans[1].textContent = '€' + (parseFloat(input.value) || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
        }
      });
      renderBonusHuntResults();
      updateBonusListCarousel();
      setTimeout(updateSlotHighlightCard, 50);
      document.body.removeChild(editSlotsPanel);
      editSlotsPanel = null;
    };

    // Close handler
    editSlotsPanel.querySelector('#close-edit-slots-btn').onclick = function() {
      document.body.removeChild(editSlotsPanel);
      editSlotsPanel = null;
    };
  }

  if (editSlotsBtn) {
    editSlotsBtn.addEventListener('click', () => {
      showEditSlotsPanel();
    });
  }

  // --- Random Slot Picker Functionality ---
  let currentRandomSlot = null;
  let isShuffling = false;

  function getFilteredSlots() {
    const checkedProviders = Array.from(document.querySelectorAll('.provider-checkbox input:checked'))
      .map(cb => cb.value);
    
    return slotDatabase.filter(slot => checkedProviders.includes(slot.provider));
  }

  function getRandomSlot() {
    const filteredSlots = getFilteredSlots();
    if (filteredSlots.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredSlots.length);
    return filteredSlots[randomIndex];
  }

  function updateRandomSlotDisplay(slot) {
    const slotCard = document.getElementById('random-slot-card');
    const slotImage = slotCard.querySelector('.slot-image');
    const slotName = slotCard.querySelector('.slot-name');
    const slotProvider = slotCard.querySelector('.slot-provider');

    if (slot) {
      slotImage.src = slot.image;
      slotImage.alt = slot.name;
      slotName.textContent = slot.name;
      slotProvider.textContent = slot.provider;
      currentRandomSlot = slot;
    } else {
      slotImage.src = 'https://i.imgur.com/8E3ucNx.png';
      slotName.textContent = 'No slots available';
      slotProvider.textContent = 'Check filter settings';
      currentRandomSlot = null;
    }
  }

  function shuffleSlot() {
    if (isShuffling) return;
    
    isShuffling = true;
    const slotCard = document.getElementById('random-slot-card');
    const shuffleBtn = document.getElementById('shuffle-slot-btn');
    
    slotCard.classList.add('shuffling');
    shuffleBtn.textContent = '🎲 Shuffling...';
    shuffleBtn.disabled = true;

    // Shuffle multiple times for effect
    let shuffleCount = 0;
    const maxShuffles = 8;
    
    const shuffleInterval = setInterval(() => {
      const randomSlot = getRandomSlot();
      if (randomSlot) {
        updateRandomSlotDisplay(randomSlot);
      }
      
      shuffleCount++;
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        
        setTimeout(() => {
          slotCard.classList.remove('shuffling');
          shuffleBtn.innerHTML = '<span class="middle-icon">🎲</span><span>Shuffle Slot</span>';
          shuffleBtn.disabled = false;
          isShuffling = false;
        }, 300);
      }
    }, 100);
  }

  function useRandomSlot() {
    if (!currentRandomSlot) return;
    
    // Fill the slot name input in the BH panel
    const slotNameInput = document.getElementById('slot-name-input');
    if (slotNameInput) {
      slotNameInput.value = currentRandomSlot.name;
      slotNameInput.dispatchEvent(new Event('input'));
    }
    
    // Switch to BH panel
    const bhBtn = document.getElementById('bh-btn');
    const randomSlotBtn = document.getElementById('random-slot-btn');
    const middlePanel = document.getElementById('middle-panel');
    const randomSlotPanel = document.getElementById('random-slot-panel');
    
    if (bhBtn && middlePanel) {
      // Hide random slot panel
      randomSlotPanel.style.display = 'none';
      randomSlotPanelVisible = false;
      randomSlotBtn.classList.remove('active');
      
      // Show BH panel
      middlePanel.style.display = 'flex';
      panelVisible = true;
      bhBtn.classList.add('active');
      
      // Focus bet size input
      const betSizeInput = document.getElementById('bet-size-input');
      if (betSizeInput) {
        requestAnimationFrame(() => betSizeInput.focus());
      }
      
      updateInfoPanelVisibility();
    }
  }

  // Initialize random slot functionality
  const shuffleBtn = document.getElementById('shuffle-slot-btn');
  const useSlotBtn = document.getElementById('use-random-slot-btn');

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', shuffleSlot);
  }

  if (useSlotBtn) {
    useSlotBtn.addEventListener('click', useRandomSlot);
  }

  // Provider filter change handler
  document.addEventListener('change', (e) => {
    if (e.target.matches('.provider-checkbox input')) {
      // Update available slots count or show message if no slots available
      const filteredSlots = getFilteredSlots();
      if (filteredSlots.length === 0 && currentRandomSlot) {
        updateRandomSlotDisplay(null);
      }
    }
  });

  // Initialize with a random slot
  document.addEventListener('DOMContentLoaded', () => {
    const initialSlot = getRandomSlot();
    updateRandomSlotDisplay(initialSlot);
  });

  // Function to show selected slot in right-side display
  function showSelectedSlot(slot) {
    const selectedSlotDisplay = document.getElementById('selected-slot-display');
    const selectedSlotImage = document.getElementById('selected-slot-image');
    
    if (selectedSlotDisplay && selectedSlotImage && slot) {
      selectedSlotImage.src = slot.image || DEFAULT_SLOT_IMAGE;
      selectedSlotImage.alt = slot.name;
      
      selectedSlotDisplay.style.display = 'flex';
      selectedSlotDisplay.classList.add('visible');
    }
  }

  // Function to hide selected slot display
  function hideSelectedSlot() {
    const selectedSlotDisplay = document.getElementById('selected-slot-display');
    if (selectedSlotDisplay) {
      selectedSlotDisplay.style.display = 'none';
      selectedSlotDisplay.classList.remove('visible');
    }
  }

  // Show selected slot when slot name input changes
  if (slotNameInput) {
    slotNameInput.addEventListener('input', function() {
      const slotName = slotNameInput.value.trim();
      if (slotName) {
        const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
        if (slot) {
          showSelectedSlot(slot);
        } else {
          hideSelectedSlot();
        }
      } else {
        hideSelectedSlot();
      }
    });
    
    slotNameInput.addEventListener('blur', function() {
      // Keep the selected slot display visible even when input loses focus
      // Only hide when the input is actually empty
      const slotName = slotNameInput.value.trim();
      if (!slotName) {
        hideSelectedSlot();
      }
    });
  }

  // ==================== TOURNAMENT SYSTEM ====================
  
  // Tournament State Management
  let tournamentState = {
    isActive: false,
    participants: [],
    brackets: [],
    currentPhase: 0,
    currentMatch: 0,
    settings: {
      size: 8,
      format: 'single-elimination'
    },
    history: [],
    winner: null
  };

  // Tournament Class for better organization
  class TournamentManager {
    constructor() {
      console.log('TournamentManager constructor called');
      this.state = tournamentState;
      console.log('Tournament state:', this.state);
      this.initializeEventListeners();
      // Don't generate inputs immediately - wait for panel to be visible
      console.log('TournamentManager initialized');
    }

    // Initialize all tournament event listeners
    initializeEventListeners() {
      // Tournament size change
      const sizeSelect = document.getElementById('tournament-size');
      if (sizeSelect) {
        sizeSelect.addEventListener('change', (e) => {
          this.state.settings.size = parseInt(e.target.value);
          console.log('Tournament size changed to:', this.state.settings.size);
          setTimeout(() => {
            this.generateParticipantInputs();
            this.updateParticipantCount();
          }, 100);
        });
      }

      // Tournament format change
      const formatSelect = document.getElementById('tournament-format');
      if (formatSelect) {
        formatSelect.addEventListener('change', (e) => {
          this.state.settings.format = e.target.value;
        });
      }

      // Quick fill buttons
      document.getElementById('fill-random-slots')?.addEventListener('click', () => {
        console.log('Random slots button clicked');
        // Ensure inputs exist before trying to fill them
        this.generateParticipantInputs();
        setTimeout(() => this.fillRandomPlayersAndSlots(), 100);
      });
      document.getElementById('clear-all-participants')?.addEventListener('click', () => {
        this.generateParticipantInputs();
        setTimeout(() => this.clearAllParticipants(), 100);
      });
      document.getElementById('import-participants')?.addEventListener('click', () => {
        this.generateParticipantInputs();
        setTimeout(() => this.importParticipants(), 100);
      });
      
      // Debug button to manually generate inputs
      document.getElementById('debug-generate-inputs')?.addEventListener('click', () => {
        console.log('Debug generate button clicked');
        const grid = document.getElementById('participants-grid');
        console.log('Grid element:', grid);
        console.log('Tournament manager:', this);
        console.log('Tournament state size:', this.state.settings.size);
        this.generateParticipantInputs();
      });

      // Tournament actions
      document.getElementById('start-tournament-btn')?.addEventListener('click', () => this.startTournament());
      document.getElementById('validate-tournament-btn')?.addEventListener('click', () => this.validateSetup());
      document.getElementById('save-template-btn')?.addEventListener('click', () => this.saveTemplate());

      // Control panel actions
      document.getElementById('prev-match-btn')?.addEventListener('click', () => this.previousMatch());
      document.getElementById('next-match-btn')?.addEventListener('click', () => this.nextMatch());
      document.getElementById('determine-winner-btn')?.addEventListener('click', () => this.determineWinner());
      document.getElementById('reset-match-btn')?.addEventListener('click', () => this.resetCurrentMatch());
      document.getElementById('advance-phase-btn')?.addEventListener('click', () => this.advancePhase());
      document.getElementById('end-tournament-btn')?.addEventListener('click', () => this.endTournament());
    }

    // Generate participant input fields based on tournament size
    generateParticipantInputs() {
      console.log('Generating participant inputs');
      const grid = document.getElementById('participants-grid');
      if (!grid) {
        console.error('participants-grid element not found');
        return;
      }
      console.log('Found participants grid:', grid);

      grid.innerHTML = '';
      
      for (let i = 0; i < this.state.settings.size; i++) {
        const participantEntry = document.createElement('div');
        participantEntry.className = 'participant-entry';
        participantEntry.innerHTML = `
          <div class="participant-number">Player ${i + 1}</div>
          <input type="text" class="participant-input" placeholder="Enter player name" data-index="${i}">
          <div class="slot-input-container">
            <input type="text" class="slot-input" placeholder="Enter slot name" data-index="${i}">
            <div class="slot-suggestion-dropdown" style="display: none;"></div>
          </div>
        `;
        grid.appendChild(participantEntry);

        // Add event listeners for this participant
        const playerInput = participantEntry.querySelector('.participant-input');
        const slotInput = participantEntry.querySelector('.slot-input');

        playerInput.addEventListener('input', () => this.onParticipantChange());
        slotInput.addEventListener('input', (e) => this.onSlotInputChange(e, i));
        
        // Mark as filled when both fields have values
        const updateFilledState = () => {
          const isFilled = playerInput.value.trim() && slotInput.value.trim();
          participantEntry.classList.toggle('filled', isFilled);
          this.updateParticipantCount();
        };

        playerInput.addEventListener('input', updateFilledState);
        slotInput.addEventListener('input', updateFilledState);
      }

      this.updateParticipantCount();
    }

    // Handle slot input changes and show suggestions
    onSlotInputChange(event, index) {
      const input = event.target;
      const query = input.value.trim().toLowerCase();
      const dropdown = input.parentElement.querySelector('.slot-suggestion-dropdown');

      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      // Get slot suggestions (assuming slotDatabase exists)
      let suggestions = [];
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        suggestions = slotDatabase
          .filter(slot => slot.name.toLowerCase().includes(query))
          .slice(0, 5);
      } else {
        // Fallback suggestions
        const fallbackSlots = [
          { name: 'Book of Dead', provider: 'Play\'n GO' },
          { name: 'Starburst', provider: 'NetEnt' },
          { name: 'Sweet Bonanza', provider: 'Pragmatic Play' },
          { name: 'Gates of Olympus', provider: 'Pragmatic Play' },
          { name: 'The Dog House', provider: 'Pragmatic Play' }
        ];
        suggestions = fallbackSlots.filter(slot => slot.name.toLowerCase().includes(query));
      }

      if (suggestions.length > 0) {
        dropdown.innerHTML = suggestions.map(slot => `
          <div class="slot-suggestion-item" data-slot-name="${slot.name}">
            <span class="slot-suggestion-name">${slot.name}</span>
            <span class="slot-suggestion-provider">${slot.provider}</span>
          </div>
        `).join('');

        // Add click handlers for suggestions
        dropdown.querySelectorAll('.slot-suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            input.value = item.dataset.slotName;
            dropdown.style.display = 'none';
            this.onParticipantChange();
          });
        });

        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    }

    // Update participant count display
    updateParticipantCount() {
      const participants = this.getValidParticipants();
      const countDisplay = document.getElementById('participant-count');
      if (countDisplay) {
        countDisplay.textContent = `(${participants.length}/${this.state.settings.size})`;
      }

      // Enable/disable start button based on participant count
      const startBtn = document.getElementById('start-tournament-btn');
      if (startBtn) {
        const canStart = participants.length >= 2;
        startBtn.disabled = !canStart;
        startBtn.title = canStart ? '' : 'Need at least 2 participants to start';
      }
    }

    // Handle participant input changes
    onParticipantChange() {
      this.updateParticipantCount();
      // Hide dropdowns when typing in player names
      document.querySelectorAll('.slot-suggestion-dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }

    // Get all valid participants
    getValidParticipants() {
      const participants = [];
      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');

      for (let i = 0; i < playerInputs.length; i++) {
        const player = playerInputs[i].value.trim();
        const slot = slotInputs[i].value.trim();

        if (player && slot) {
          participants.push({
            id: i + 1,
            player: player,
            slot: slot,
            eliminated: false
          });
        }
      }

      return participants;
    }

    // Fill random slots
    fillRandomSlots() {
      const slotInputs = document.querySelectorAll('.slot-input');
      
      // Use slot database if available, otherwise fallback
      let availableSlots = [];
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        availableSlots = slotDatabase.map(slot => slot.name);
      } else {
        availableSlots = [
          'Book of Dead', 'Starburst', 'Gonzo\'s Quest', 'Reactoonz', 'Sweet Bonanza',
          'The Dog House', 'Gates of Olympus', 'Dead or Wild', 'Money Train 2', 'Razor Shark',
          'Jammin\' Jars', 'Buffalo King', 'Rise of Olympus', 'Moon Princess', 'Viking Runecraft'
        ];
      }

      // Shuffle and assign
      const shuffled = [...availableSlots].sort(() => 0.5 - Math.random());
      
      slotInputs.forEach((input, index) => {
        if (index < shuffled.length) {
          input.value = shuffled[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      this.showFeedback('fill-random-slots', 'Random slots filled!', 'success');
    }

    // Fill random players and slots
    fillRandomPlayersAndSlots() {
      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');
      
      // Random player names
      const randomNames = [
        'ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 
        'BonusHunter', 'RollMaster', 'WildCard', 'MegaSpin', 'JackpotJoe', 'LuckyLuke',
        'SpinDoctor', 'SlotBeast', 'CasinoAce', 'MegaWin', 'BonusKing', 'SpinMaster',
        'LuckyCharm', 'SlotHero', 'WinWizard', 'CasinoLord', 'SpinLegend', 'BonusBoss'
      ];
      
      // Use slot database if available, otherwise fallback
      let availableSlots = [];
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        availableSlots = slotDatabase.map(slot => slot.name);
      } else {
        availableSlots = [
          'Book of Dead', 'Starburst', 'Gonzo\'s Quest', 'Reactoonz', 'Sweet Bonanza',
          'The Dog House', 'Gates of Olympus', 'Dead or Wild', 'Money Train 2', 'Razor Shark',
          'Jammin\' Jars', 'Buffalo King', 'Rise of Olympus', 'Moon Princess', 'Viking Runecraft'
        ];
      }

      // Shuffle both arrays
      const shuffledNames = [...randomNames].sort(() => 0.5 - Math.random());
      const shuffledSlots = [...availableSlots].sort(() => 0.5 - Math.random());
      
      // Fill player names
      playerInputs.forEach((input, index) => {
        if (index < shuffledNames.length) {
          input.value = shuffledNames[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      // Fill slot names
      slotInputs.forEach((input, index) => {
        if (index < shuffledSlots.length) {
          input.value = shuffledSlots[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      this.showFeedback('fill-random-slots', 'Random players and slots filled!', 'success');
    }

    // Clear all participants
    clearAllParticipants() {
      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');

      playerInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      });

      slotInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      });

      this.showFeedback('clear-all-participants', 'All participants cleared!', 'success');
    }

    // Import participants (placeholder)
    importParticipants() {
      // For now, fill with demo data
      const demoPlayers = ['ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 'BonusHunter', 'RollMaster'];
      const demoSlots = ['Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus', 'The Dog House', 'Money Train 2', 'Razor Shark', 'Jammin\' Jars'];

      const playerInputs = document.querySelectorAll('.participant-input');
      const slotInputs = document.querySelectorAll('.slot-input');

      playerInputs.forEach((input, index) => {
        if (index < demoPlayers.length) {
          input.value = demoPlayers[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      slotInputs.forEach((input, index) => {
        if (index < demoSlots.length) {
          input.value = demoSlots[index];
          input.dispatchEvent(new Event('input'));
        }
      });

      this.showFeedback('import-participants', 'Demo data imported!', 'success');
    }

    // Validate tournament setup
    validateSetup() {
      const participants = this.getValidParticipants();
      const issues = [];

      if (participants.length < 2) {
        issues.push('Need at least 2 participants');
      }

      // Check for duplicate names
      const playerNames = participants.map(p => p.player.toLowerCase());
      const duplicatePlayers = playerNames.filter((name, index) => playerNames.indexOf(name) !== index);
      if (duplicatePlayers.length > 0) {
        issues.push('Duplicate player names detected');
      }

      // Check for duplicate slots
      const slotNames = participants.map(p => p.slot.toLowerCase());
      const duplicateSlots = slotNames.filter((slot, index) => slotNames.indexOf(slot) !== index);
      if (duplicateSlots.length > 0) {
        issues.push('Duplicate slot names detected');
      }

      if (issues.length === 0) {
        this.showFeedback('validate-tournament-btn', 'Setup validated successfully!', 'success');
        document.getElementById('start-tournament-btn').disabled = false;
      } else {
        this.showFeedback('validate-tournament-btn', `Issues found: ${issues.join(', ')}`, 'error');
      }
    }

    // Save tournament template (placeholder)
    saveTemplate() {
      const participants = this.getValidParticipants();
      const template = {
        settings: this.state.settings,
        participants: participants
      };

      // Save to localStorage
      localStorage.setItem('tournament-template', JSON.stringify(template));
      this.showFeedback('save-template-btn', 'Template saved!', 'success');
    }

    // Start tournament
    startTournament() {
      const participants = this.getValidParticipants();
      
      if (participants.length < 2) {
        this.showFeedback('start-tournament-btn', 'Need at least 2 participants!', 'error');
        return;
      }

      // Initialize tournament state
      this.state.isActive = true;
      this.state.participants = [...participants];
      this.state.currentPhase = 0;
      this.state.currentMatch = 0;
      this.state.history = [];
      this.state.winner = null;

      // Generate tournament brackets
      this.generateBrackets();

      // Switch to control panel
      this.showControlPanel();
      
      // Delay bracket display to ensure DOM is ready
      setTimeout(() => {
        this.showTournamentBracket();
        this.updateControlPanel();
      }, 100);

      this.showFeedback('start-tournament-btn', 'Tournament started!', 'success');
    }

    // Generate tournament brackets
    generateBrackets() {
      const participants = [...this.state.participants];
      
      // Shuffle participants for randomness
      for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
      }

      this.state.brackets = [];
      let currentRound = participants;

      // Generate all rounds
      while (currentRound.length > 1) {
        const matches = [];
        const nextRound = [];

        // Create matches for current round
        for (let i = 0; i < currentRound.length; i += 2) {
          if (i + 1 < currentRound.length) {
            matches.push({
              id: matches.length,
              participant1: currentRound[i],
              participant2: currentRound[i + 1],
              winner: null,
              loser: null,
              completed: false,
              bet1: 0,
              payout1: 0,
              bet2: 0,
              payout2: 0
            });
            nextRound.push(null); // Placeholder for winner
          } else {
            // Bye - participant advances automatically
            matches.push({
              id: matches.length,
              participant1: currentRound[i],
              participant2: null,
              winner: currentRound[i],
              loser: null,
              completed: true,
              bet1: 0,
              payout1: 0,
              bet2: 0,
              payout2: 0
            });
            nextRound.push(currentRound[i]);
          }
        }

        // Determine phase name
        let phaseName = '';
        if (matches.length === 1) phaseName = 'Final';
        else if (matches.length === 2) phaseName = 'Semi-Finals';
        else if (matches.length === 4) phaseName = 'Quarter-Finals';
        else phaseName = `Round of ${matches.length * 2}`;

        this.state.brackets.push({
          phase: this.state.brackets.length,
          name: phaseName,
          matches: matches,
          completed: false
        });

        currentRound = nextRound;
      }
    }

    // Show control panel
    showControlPanel() {
      const setupPanel = document.getElementById('tournament-panel');
      const controlPanel = document.getElementById('tournament-control-panel');
      const infoPanel = document.querySelector('.info-panel');

      if (setupPanel) setupPanel.style.display = 'none';
      if (controlPanel) controlPanel.style.display = 'flex';
      
      // Ensure info panel (right sidebar) is visible for bracket display
      if (infoPanel) {
        infoPanel.classList.add('info-panel--visible');
      }
    }

    // Show tournament bracket in right panel
    showTournamentBracket() {
      // Make sure info panel is visible
      const infoPanel = document.querySelector('.info-panel');
      if (infoPanel) {
        infoPanel.classList.add('info-panel--visible');
      }

      const bracket = document.getElementById('tournament-bracket');
      if (bracket) {
        bracket.style.display = 'block';
      }

      // Hide other info sections during tournament
      const bonusHuntResults = document.getElementById('bonus-hunt-results');
      const bonusList = document.querySelector('.info-section.bonus-list');
      const discordSection = document.querySelector('.info-section.discord');
      const moneyRowMain = document.querySelector('.money-row-main');
      
      if (bonusHuntResults) bonusHuntResults.style.display = 'none';
      if (bonusList) bonusList.style.display = 'none';
      if (discordSection) discordSection.style.display = 'none';
      if (moneyRowMain) moneyRowMain.style.display = 'none';

      this.updateBracketDisplay();
    }

    // Update control panel display
    updateControlPanel() {
      if (!this.state.isActive || !this.state.brackets.length) return;

      const currentBracket = this.state.brackets[this.state.currentPhase];
      const currentMatch = currentBracket.matches[this.state.currentMatch];

      // Update status
      const statusPhase = document.getElementById('status-phase');
      const statusProgress = document.getElementById('status-progress');
      
      if (statusPhase) statusPhase.textContent = currentBracket.name;
      if (statusProgress) {
        statusProgress.textContent = `Match ${this.state.currentMatch + 1} of ${currentBracket.matches.length}`;
      }

      // Update match title
      const matchTitle = document.getElementById('match-title');
      if (matchTitle) {
        matchTitle.textContent = `${currentBracket.name} - Match ${this.state.currentMatch + 1}`;
      }

      // Update contestants
      this.updateContestantDisplay(currentMatch);

      // Update button states
      this.updateControlButtons();
    }

    // Update contestant display
    updateContestantDisplay(match) {
      if (!match) return;

      // Contestant 1
      const contestant1Name = document.getElementById('contestant-1-name');
      const contestant1Slot = document.getElementById('contestant-1-slot');
      const contestant1Img = document.getElementById('contestant-1-img');
      const contestant1Bet = document.getElementById('contestant-1-bet');
      const contestant1Payout = document.getElementById('contestant-1-payout');
      const contestant1Multiplier = document.getElementById('contestant-1-multiplier');
      const contestant1Card = document.getElementById('contestant-1-card');

      if (match.participant1) {
        if (contestant1Name) contestant1Name.textContent = match.participant1.player;
        if (contestant1Slot) contestant1Slot.textContent = match.participant1.slot;
        if (contestant1Img) {
          contestant1Img.src = this.getSlotImage(match.participant1.slot);
          contestant1Img.alt = match.participant1.slot;
        }
        if (contestant1Bet) {
          contestant1Bet.value = match.bet1 || '';
          contestant1Bet.addEventListener('input', () => this.updateMultiplier(1, match));
        }
        if (contestant1Payout) {
          contestant1Payout.value = match.payout1 || '';
          contestant1Payout.addEventListener('input', () => this.updateMultiplier(1, match));
        }
        this.updateMultiplier(1, match);
      }

      // Contestant 2
      const contestant2Name = document.getElementById('contestant-2-name');
      const contestant2Slot = document.getElementById('contestant-2-slot');
      const contestant2Img = document.getElementById('contestant-2-img');
      const contestant2Bet = document.getElementById('contestant-2-bet');
      const contestant2Payout = document.getElementById('contestant-2-payout');
      const contestant2Multiplier = document.getElementById('contestant-2-multiplier');
      const contestant2Card = document.getElementById('contestant-2-card');

      if (match.participant2) {
        if (contestant2Name) contestant2Name.textContent = match.participant2.player;
        if (contestant2Slot) contestant2Slot.textContent = match.participant2.slot;
        if (contestant2Img) {
          contestant2Img.src = this.getSlotImage(match.participant2.slot);
          contestant2Img.alt = match.participant2.slot;
        }
        if (contestant2Bet) {
          contestant2Bet.value = match.bet2 || '';
          contestant2Bet.addEventListener('input', () => this.updateMultiplier(2, match));
        }
        if (contestant2Payout) {
          contestant2Payout.value = match.payout2 || '';
          contestant2Payout.addEventListener('input', () => this.updateMultiplier(2, match));
        }
        this.updateMultiplier(2, match);
      }

      // Update winner indicators
      this.updateWinnerIndicators(match);
    }

    // Update multiplier display
    updateMultiplier(contestantNumber, match) {
      const betInput = document.getElementById(`contestant-${contestantNumber}-bet`);
      const payoutInput = document.getElementById(`contestant-${contestantNumber}-payout`);
      const multiplierDisplay = document.getElementById(`contestant-${contestantNumber}-multiplier`);

      if (betInput && payoutInput && multiplierDisplay) {
        const bet = parseFloat(betInput.value) || 0;
        const payout = parseFloat(payoutInput.value) || 0;
        const multiplier = bet > 0 ? (payout / bet) : 0;

        multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

        // Store values in match
        if (contestantNumber === 1) {
          match.bet1 = bet;
          match.payout1 = payout;
        } else {
          match.bet2 = bet;
          match.payout2 = payout;
        }
      }
    }

    // Update winner indicators
    updateWinnerIndicators(match) {
      const indicator1 = document.getElementById('winner-indicator-1');
      const indicator2 = document.getElementById('winner-indicator-2');
      const card1 = document.getElementById('contestant-1-card');
      const card2 = document.getElementById('contestant-2-card');

      // Reset
      if (indicator1) indicator1.classList.remove('visible');
      if (indicator2) indicator2.classList.remove('visible');
      if (card1) card1.classList.remove('winner');
      if (card2) card2.classList.remove('winner');

      // Show winner
      if (match.winner) {
        if (match.winner === match.participant1) {
          if (indicator1) indicator1.classList.add('visible');
          if (card1) card1.classList.add('winner');
        } else if (match.winner === match.participant2) {
          if (indicator2) indicator2.classList.add('visible');
          if (card2) card2.classList.add('winner');
        }
      }
    }

    // Update control buttons
    updateControlButtons() {
      const prevBtn = document.getElementById('prev-match-btn');
      const nextBtn = document.getElementById('next-match-btn');
      const advanceBtn = document.getElementById('advance-phase-btn');

      const currentBracket = this.state.brackets[this.state.currentPhase];
      
      if (prevBtn) {
        prevBtn.disabled = this.state.currentMatch === 0;
      }

      if (nextBtn) {
        nextBtn.disabled = this.state.currentMatch >= currentBracket.matches.length - 1;
      }

      if (advanceBtn) {
        const allMatchesComplete = currentBracket.matches.every(match => match.completed);
        const isLastPhase = this.state.currentPhase >= this.state.brackets.length - 1;
        
        advanceBtn.disabled = !allMatchesComplete;
        
        if (isLastPhase && allMatchesComplete) {
          advanceBtn.innerHTML = '<span>🏆</span> Tournament Complete';
        } else if (allMatchesComplete) {
          advanceBtn.innerHTML = '<span>⚡</span> Advance to Next Phase';
        } else {
          advanceBtn.innerHTML = '<span>⚡</span> Complete All Matches First';
        }
      }
    }

    // Navigate to previous match
    previousMatch() {
      if (this.state.currentMatch > 0) {
        this.state.currentMatch--;
        this.updateControlPanel();
      }
    }

    // Navigate to next match
    nextMatch() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      if (this.state.currentMatch < currentBracket.matches.length - 1) {
        this.state.currentMatch++;
        this.updateControlPanel();
      }
    }

    // Determine match winner
    determineWinner() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      const currentMatch = currentBracket.matches[this.state.currentMatch];

      if (!currentMatch || currentMatch.completed) return;

      // Auto bye
      if (!currentMatch.participant2) {
        currentMatch.winner = currentMatch.participant1;
        currentMatch.completed = true;
        this.updateControlPanel();
        this.addToHistory(currentMatch, 'BYE');
        return;
      }

      const bet1 = currentMatch.bet1 || 0;
      const payout1 = currentMatch.payout1 || 0;
      const bet2 = currentMatch.bet2 || 0;
      const payout2 = currentMatch.payout2 || 0;

      if (bet1 <= 0 || bet2 <= 0) {
        this.showFeedback('determine-winner-btn', 'Enter valid bet amounts!', 'error');
        return;
      }

      const multiplier1 = payout1 / bet1;
      const multiplier2 = payout2 / bet2;

      if (multiplier1 > multiplier2) {
        currentMatch.winner = currentMatch.participant1;
        currentMatch.loser = currentMatch.participant2;
      } else if (multiplier2 > multiplier1) {
        currentMatch.winner = currentMatch.participant2;
        currentMatch.loser = currentMatch.participant1;
      } else {
        this.showFeedback('determine-winner-btn', 'Cannot have a tie! Adjust payouts.', 'error');
        return;
      }

      currentMatch.completed = true;
      this.updateControlPanel();
      this.updateBracketDisplay();
      this.addToHistory(currentMatch, 'COMPLETED');
      
      this.showFeedback('determine-winner-btn', `Winner: ${currentMatch.winner.player}!`, 'success');
    }

    // Reset current match
    resetCurrentMatch() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      const currentMatch = currentBracket.matches[this.state.currentMatch];

      if (!currentMatch) return;

      currentMatch.winner = null;
      currentMatch.loser = null;
      currentMatch.completed = false;
      currentMatch.bet1 = 0;
      currentMatch.payout1 = 0;
      currentMatch.bet2 = 0;
      currentMatch.payout2 = 0;

      this.updateControlPanel();
      this.updateBracketDisplay();
      this.showFeedback('reset-match-btn', 'Match reset!', 'success');
    }

    // Advance to next phase
    advancePhase() {
      const currentBracket = this.state.brackets[this.state.currentPhase];
      
      // Check if all matches are complete
      const allComplete = currentBracket.matches.every(match => match.completed);
      if (!allComplete) {
        this.showFeedback('advance-phase-btn', 'Complete all matches first!', 'error');
        return;
      }

      // Mark current phase as completed
      currentBracket.completed = true;

      // Check if tournament is complete
      if (this.state.currentPhase >= this.state.brackets.length - 1) {
        this.completeTournament();
        return;
      }

      // Advance winners to next phase
      const winners = currentBracket.matches.map(match => match.winner).filter(w => w !== null);
      const nextBracket = this.state.brackets[this.state.currentPhase + 1];

      // Update next phase matches with winners
      let winnerIndex = 0;
      nextBracket.matches.forEach(match => {
        if (winners[winnerIndex]) match.participant1 = winners[winnerIndex++];
        if (winners[winnerIndex]) match.participant2 = winners[winnerIndex++];
      });

      // Move to next phase
      this.state.currentPhase++;
      this.state.currentMatch = 0;

      this.updateControlPanel();
      this.updateBracketDisplay();
      this.showFeedback('advance-phase-btn', `Advancing to ${nextBracket.name}!`, 'success');
    }

    // Complete tournament
    completeTournament() {
      const finalBracket = this.state.brackets[this.state.brackets.length - 1];
      const finalMatch = finalBracket.matches[0];
      
      if (finalMatch && finalMatch.winner) {
        this.state.winner = finalMatch.winner;
        this.showFeedback('advance-phase-btn', `🏆 ${this.state.winner.player} wins the tournament!`, 'success');
        
        // Update bracket to show champion
        this.updateBracketDisplay();
      }
    }

    // End tournament
    endTournament() {
      if (!confirm('Are you sure you want to end the tournament?')) return;

      // Reset state
      this.state.isActive = false;
      this.state.participants = [];
      this.state.brackets = [];
      this.state.currentPhase = 0;
      this.state.currentMatch = 0;
      this.state.history = [];
      this.state.winner = null;

      // Hide control panel and bracket
      const controlPanel = document.getElementById('tournament-control-panel');
      const setupPanel = document.getElementById('tournament-panel');
      const bracket = document.getElementById('tournament-bracket');

      if (controlPanel) controlPanel.style.display = 'none';
      if (setupPanel) setupPanel.style.display = 'flex';
      if (bracket) bracket.style.display = 'none';

      // Show other info sections again
      const bonusHuntResults = document.getElementById('bonus-hunt-results');
      const bonusList = document.querySelector('.info-section.bonus-list');
      const moneyRowMain = document.querySelector('.money-row-main');
      if (bonusHuntResults) bonusHuntResults.style.display = 'block';
      if (bonusList) bonusList.style.display = 'block';
      if (moneyRowMain) moneyRowMain.style.display = 'flex';

      this.showFeedback('end-tournament-btn', 'Tournament ended!', 'success');
    }

    // Update bracket display in right panel - Traditional Tournament Tree
    updateBracketDisplay() {
      const bracketContent = document.getElementById('tournament-bracket-content');
      const formatDisplay = document.getElementById('tournament-format-display');
      const playersCount = document.getElementById('tournament-players-count');
      const currentPhase = document.getElementById('tournament-current-phase');

      if (!bracketContent || !this.state.isActive) {
        return;
      }

      // Hide overview section - we don't need it
      const overviewSection = document.querySelector('.tournament-overview');
      if (overviewSection) overviewSection.style.display = 'none';

      // Show winner if tournament is complete
      if (this.state.winner) {
        bracketContent.innerHTML = `
          <div class="tournament-champion">
            <div class="champion-crown">👑</div>
            <img src="${this.getSlotImage(this.state.winner.slot)}" alt="${this.state.winner.slot}" class="champion-slot-icon">
            <div class="champion-name">${this.state.winner.player}</div>
            <div class="champion-slot">${this.state.winner.slot}</div>
          </div>
        `;
        return;
      }

      // Show only current phase - no scrolling needed
      const currentBracket = this.state.brackets[this.state.currentPhase];
      
      let html = '<div class="tournament-tree">';
      html += `<div class="tree-column">`;
      html += `<div class="column-header">${currentBracket.name}</div>`;
        
      currentBracket.matches.forEach((match, matchIndex) => {
        const isCurrentMatch = matchIndex === this.state.currentMatch;
        
        html += `
          <div class="tree-match ${match.completed ? 'completed' : ''} ${isCurrentMatch ? 'active' : ''}">
        `;
        
        html += `<div class="tree-match-horizontal">`;
        
        // Player 1
        if (match.participant1) {
          html += `
            <div class="tree-player ${match.winner === match.participant1 ? 'winner' : ''}">
              <div class="tree-player-name">${match.participant1.player}</div>
              <img src="${this.getSlotImage(match.participant1.slot)}" class="tree-slot-icon">
              <div class="tree-slot-name">${match.participant1.slot}</div>
            </div>
          `;
        }
        
        // VS or BYE
        if (match.participant2) {
          html += `<div class="tree-vs">VS</div>`;
        } else if (match.participant1) {
          html += `<div class="tree-vs">BYE</div>`;
        }
        
        // Player 2
        if (match.participant2) {
          html += `
            <div class="tree-player ${match.winner === match.participant2 ? 'winner' : ''}">
              <div class="tree-player-name">${match.participant2.player}</div>
              <img src="${this.getSlotImage(match.participant2.slot)}" class="tree-slot-icon">
              <div class="tree-slot-name">${match.participant2.slot}</div>
            </div>
          `;
        }
        
        html += `</div>`;
        html += `</div>`;
      });
      
      html += `</div>`;
      html += '</div>';
      bracketContent.innerHTML = html;
      
      // Add click handlers for matches
      this.addBracketInteractivity();
    }

    // Add bracket view toggle functionality
    addBracketViewToggle() {
      const bracketHeader = document.querySelector('.tournament-bracket-header');
      if (!bracketHeader || document.getElementById('bracket-view-toggle')) return;
      
      const toggleButton = document.createElement('button');
      toggleButton.id = 'bracket-view-toggle';
      toggleButton.className = 'bracket-control-btn';
      toggleButton.innerHTML = '🌳';
      toggleButton.title = 'Toggle Tree View';
      
      const controls = bracketHeader.querySelector('.bracket-controls');
      if (controls) {
        controls.appendChild(toggleButton);
        
        toggleButton.addEventListener('click', () => {
          this.toggleBracketView();
        });
      }
    }

    // Toggle between list and tree bracket views
    toggleBracketView() {
      const bracketContent = document.getElementById('tournament-bracket-content');
      const toggleButton = document.getElementById('bracket-view-toggle');
      
      if (!bracketContent || !toggleButton) return;
      
      const isTreeView = bracketContent.classList.contains('tree-view');
      
      if (isTreeView) {
        // Switch to list view
        bracketContent.classList.remove('tree-view');
        toggleButton.innerHTML = '🌳';
        toggleButton.title = 'Toggle Tree View';
        this.updateBracketDisplay(); // Refresh with list view
      } else {
        // Switch to tree view
        bracketContent.classList.add('tree-view');
        toggleButton.innerHTML = '📋';
        toggleButton.title = 'Toggle List View';
        this.createTreeBracketView();
      }
    }

    // Create tree-style bracket visualization
    createTreeBracketView() {
      const bracketContent = document.getElementById('tournament-bracket-content');
      if (!bracketContent || !this.state.isActive) return;
      
      // Calculate tournament rounds
      const totalParticipants = this.state.participants.length;
      const rounds = Math.ceil(Math.log2(totalParticipants));
      
      let html = '<div class=\"tournament-tree\">';
      
      // Build tree from final backwards
      for (let round = rounds - 1; round >= 0; round--) {
        const roundName = this.state.brackets[round]?.name || `Round ${round + 1}`;
        const matches = this.state.brackets[round]?.matches || [];
        
        html += `<div class=\"tree-round\" data-round=\"${round}\">`;
        html += `<div class=\"tree-round-title\">${roundName}</div>`;
        html += `<div class=\"tree-matches\">`;
        
        matches.forEach((match, matchIndex) => {
          const isActive = round === this.state.currentPhase && matchIndex === this.state.currentMatch;
          
          html += `<div class=\"tree-match ${match.completed ? 'completed' : ''} ${isActive ? 'active' : ''}\">`;
          
          if (match.participant1) {
            html += `
              <div class=\"tree-participant ${match.winner === match.participant1 ? 'winner' : ''}\">
                <img src=\"${this.getSlotImage(match.participant1.slot)}\" class=\"tree-slot-icon\">
                <div class=\"tree-participant-info\">
                  <div class=\"tree-participant-name\">${match.participant1.player}</div>
                  <div class=\"tree-participant-slot\">${match.participant1.slot}</div>
                </div>
              </div>
            `;
          }
          
          if (match.participant2) {
            html += `
              <div class=\"tree-participant ${match.winner === match.participant2 ? 'winner' : ''}\">
                <img src=\"${this.getSlotImage(match.participant2.slot)}\" class=\"tree-slot-icon\">
                <div class=\"tree-participant-info\">
                  <div class=\"tree-participant-name\">${match.participant2.player}</div>
                  <div class=\"tree-participant-slot\">${match.participant2.slot}</div>
                </div>
              </div>
            `;
          } else if (match.participant1) {
            html += `<div class=\"tree-bye\">BYE</div>`;
          }
          
          html += `</div>`; // tree-match
        });
        
        html += `</div></div>`; // tree-matches, tree-round
      }
      
      html += '</div>'; // tournament-tree
      
      bracketContent.innerHTML = html;
    }

    // Add interactivity to bracket matches
    addBracketInteractivity() {
      const matches = document.querySelectorAll('.bracket-match');
      matches.forEach((matchElement, globalIndex) => {
        matchElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.jumpToMatch(globalIndex);
        });
        
        // Add hover effects
        matchElement.addEventListener('mouseenter', () => {
          if (!matchElement.classList.contains('completed')) {
            matchElement.style.transform = 'translateY(-2px)';
            matchElement.style.boxShadow = '0 8px 24px rgba(0, 225, 255, 0.2)';
          }
        });
        
        matchElement.addEventListener('mouseleave', () => {
          if (!matchElement.classList.contains('active')) {
            matchElement.style.transform = '';
            matchElement.style.boxShadow = '';
          }
        });
      });
    }

    // Jump to specific match in control panel
    jumpToMatch(globalMatchIndex) {
      let currentIndex = 0;
      
      for (let phaseIndex = 0; phaseIndex < this.state.brackets.length; phaseIndex++) {
        const phase = this.state.brackets[phaseIndex];
        
        if (currentIndex + phase.matches.length > globalMatchIndex) {
          // Found the phase
          this.state.currentPhase = phaseIndex;
          this.state.currentMatch = globalMatchIndex - currentIndex;
          
          // Show control panel and update display
          this.showControlPanel();
          this.updateControlPanel();
          this.updateBracketDisplay();
          
          // Visual feedback
          const jumpFeedback = document.createElement('div');
          jumpFeedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 225, 255, 0.9);
            color: white;
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out forwards;
          `;
          jumpFeedback.textContent = `Jumped to ${phase.name} - Match ${this.state.currentMatch + 1}`;
          document.body.appendChild(jumpFeedback);
          
          // Add CSS animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
              20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
          `;
          document.head.appendChild(style);
          
          setTimeout(() => {
            document.body.removeChild(jumpFeedback);
            document.head.removeChild(style);
          }, 2000);
          
          return;
        }
        
        currentIndex += phase.matches.length;
      }
    }

    // Add match to history
    addToHistory(match, type) {
      this.state.history.push({
        timestamp: new Date(),
        phase: this.state.brackets[this.state.currentPhase].name,
        match: match,
        type: type
      });
    }

    // Get slot image URL
    getSlotImage(slotName) {
      // Try to find in slot database
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
        if (slot && slot.image) return slot.image;
      }
      
      // Fallback image
      return 'https://i.imgur.com/8E3ucNx.png';
    }

    // Show feedback on buttons
    showFeedback(buttonId, message, type = 'info') {
      const button = document.getElementById(buttonId);
      if (!button) return;

      const originalContent = button.innerHTML;
      const originalStyle = button.style.background;

      // Update button appearance
      button.innerHTML = message;
      
      switch (type) {
        case 'success':
          button.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
          break;
        case 'error':
          button.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
          break;
        default:
          button.style.background = 'linear-gradient(135deg, #00e1ff 0%, #9147ff 100%)';
      }

      // Reset after delay
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = originalStyle;
      }, 2000);
    }
  }

  // Tournament manager will be initialized in main DOMContentLoaded handler







  // ==================== END TOURNAMENT SYSTEM ====================
});

// Set your fallback slot image here:
const DEFAULT_SLOT_IMAGE = 'https://i.imgur.com/8E3ucNx.png';



// Drag functionality for all panels
class DragHandler {
  constructor() {
    this.isDragging = false;
    this.currentElement = null;
    this.offset = { x: 0, y: 0 };
    this.originalPositions = new Map();
    this.init();
  }

  init() {
    // Make all panels draggable
    const draggableSelectors = [
      '.navbar',
      '.info-panel', 
      '.middle-panel',
      '.bottom-panel',
      '.tournament-panel',
      '.tournament-control-panel',
      '.tournament-left-panel',
      '.tournament-bracket',
      '.draggable-image-container'
    ];

    draggableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.makeDraggable(element);
      });
    });
  }

  makeDraggable(element) {
    // Don't make sidebar or navbar draggable
    if (element.classList.contains('sidebar') || element.closest('.sidebar') || 
        element.classList.contains('navbar') || element.closest('.navbar')) {
      return;
    }
    
    // Add draggable cursor style
    element.style.cursor = 'move';
    
    // Store original position but don't change position yet
    if (!this.originalPositions.has(element)) {
      const rect = element.getBoundingClientRect();
      this.originalPositions.set(element, {
        left: rect.left,
        top: rect.top,
        position: getComputedStyle(element).position
      });
    }
    
    // Only make position absolute when dragging starts
    element.addEventListener('mousedown', (e) => this.startDrag(e, element));
    element.addEventListener('touchstart', (e) => this.startDrag(e, element), { passive: false });
  }

  startDrag(e, element) {
    // Check if dragging is locked
    if (window.isDragLocked) {
      return;
    }
    
    // For info-panel, tournament-left-panel, and tournament-bracket, be more permissive - only block clicks directly on buttons/inputs/links
    if (element.classList.contains('info-panel') || element.classList.contains('tournament-left-panel') || element.classList.contains('tournament-bracket')) {
      const interactiveElements = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A', 'IFRAME'];
      if (interactiveElements.includes(e.target.tagName)) {
        return;
      }
      // Also check if we're clicking inside the list items themselves
      if (e.target.closest('li, button, input, select, textarea, a, iframe')) {
        return;
      }
    } else {
      // For other panels, use stricter rules
      const interactiveElements = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A', 'LABEL'];
      if (interactiveElements.includes(e.target.tagName) || 
          e.target.closest('input, button, select, textarea, a, label') ||
          e.target.closest('.sidebar-btn')) {
        return;
      }
    }
    
    e.preventDefault();
    
    this.isDragging = true;
    this.currentElement = element;
    
    // Only now convert to absolute positioning for dragging
    const rect = element.getBoundingClientRect();
    element.style.position = 'absolute';
    element.style.left = rect.left + 'px';
    element.style.top = rect.top + 'px';
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'none';
    
    // Get touch or mouse position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate offset from element's top-left corner
    this.offset.x = clientX - rect.left;
    this.offset.y = clientY - rect.top;
    
    // Add visual feedback
    element.style.opacity = '0.8';
    element.style.zIndex = '10000';
    element.style.transition = 'none';
    
    // Add event listeners
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
    document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    document.addEventListener('touchend', this.stopDrag.bind(this));
  }

  drag(e) {
    if (!this.isDragging || !this.currentElement) return;
    
    e.preventDefault();
    
    // Get touch or mouse position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate new position
    let newX = clientX - this.offset.x;
    let newY = clientY - this.offset.y;
    
    // Apply new position (no bounds checking - allow free movement)
    this.currentElement.style.left = newX + 'px';
    this.currentElement.style.top = newY + 'px';
  }

  stopDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    if (this.currentElement) {
      // Remove visual feedback
      this.currentElement.style.opacity = '';
      this.currentElement.style.zIndex = '';
      this.currentElement.style.transition = '';
    }
    
    this.currentElement = null;
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.drag.bind(this));
    document.removeEventListener('mouseup', this.stopDrag.bind(this));
    document.removeEventListener('touchmove', this.drag.bind(this));
    document.removeEventListener('touchend', this.stopDrag.bind(this));
  }
}

// Initialize drag functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize drag lock state
  window.isDragLocked = false;
  
  window.dragHandler = new DragHandler();
  
  // Function to update editing element states based on lock
  function updateEditingElementsState() {
    const navbarLogo = document.getElementById('navbar-logo');
    const streamerNameSpan = document.getElementById('streamer-name');
    const websiteText = document.getElementById('website-text');
    
    const isLocked = window.isDragLocked;
    const cursor = isLocked ? 'default' : 'pointer';
    const opacity = isLocked ? '0.7' : '1';
    
    if (navbarLogo) {
      navbarLogo.style.cursor = cursor;
      navbarLogo.style.opacity = opacity;
      navbarLogo.title = isLocked ? 'Unlock to edit logo' : 'Click to change logo';
    }
    
    if (streamerNameSpan) {
      streamerNameSpan.style.cursor = cursor;
      streamerNameSpan.style.opacity = opacity;
      streamerNameSpan.title = isLocked ? 'Unlock to edit streamer name' : 'Click to edit streamer name';
    }
    
    if (websiteText) {
      websiteText.style.cursor = cursor;
      websiteText.style.opacity = opacity;
      websiteText.title = isLocked ? 'Unlock to edit website URL' : 'Click to edit website URL';
    }
  }
  
  // Lock button functionality
  const lockBtn = document.getElementById('lock-btn');
  const lockIcon = document.getElementById('lock-icon');
  
  if (lockBtn && lockIcon) {
    lockBtn.addEventListener('click', () => {
      window.isDragLocked = !window.isDragLocked;
      lockIcon.src = window.isDragLocked ? './assets/lock.png' : './assets/unlock.png';
      
      // Visual feedback
      lockBtn.classList.toggle('active', window.isDragLocked);
      
      // Update editing elements visual state
      updateEditingElementsState();
      
      console.log('Drag lock state:', window.isDragLocked ? 'LOCKED' : 'UNLOCKED');
    });
    
    // Initialize editing elements state on page load
    setTimeout(updateEditingElementsState, 100);
  }
  
  // Performance utility functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  // --- Customization Panel ---
  const customizationBtn = document.getElementById('customization-btn');
  const customizationPanel = document.getElementById('customization-panel');
  const customizationClose = document.getElementById('customization-close');
  
  if (customizationBtn && customizationPanel) {
    customizationBtn.addEventListener('click', () => {
      customizationPanel.style.display = 'flex';
      loadCurrentSettings();
    });
  }
  
  if (customizationClose) {
    customizationClose.addEventListener('click', () => {
      customizationPanel.style.display = 'none';
    });
  }
  
  // Tab functionality with immediate visual feedback
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Immediate visual feedback
      btn.style.transform = 'scale(0.95)';
      requestAnimationFrame(() => {
        btn.style.transform = '';
      });
      
      const tabId = btn.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      const targetContent = document.getElementById(tabId + '-tab');
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
    
    // Add immediate hover feedback for better responsiveness
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
  
  // Close panel when clicking outside
  if (customizationPanel) {
    customizationPanel.addEventListener('click', (e) => {
      if (e.target === customizationPanel) {
        customizationPanel.style.display = 'none';
      }
    });
  }
  
  // Load current settings into the panel
  function loadCurrentSettings() {
    const streamerNameInput = document.getElementById('custom-streamer-name');
    const websiteUrlInput = document.getElementById('custom-website-url');
    const primaryColorInput = document.getElementById('primary-color');
    const accentColorInput = document.getElementById('accent-color');
    const backgroundColorInput = document.getElementById('background-color');
    const textColorInput = document.getElementById('text-color');
    const cardBackgroundInput = document.getElementById('card-background-color');
    const streamerNameColorInput = document.getElementById('streamer-name-color');
    const websiteColorInput = document.getElementById('website-color');
    const gambleAwareColorInput = document.getElementById('gamble-aware-color');
    const glassEffectToggle = document.getElementById('glass-effect-toggle');
    const glassOpacity = document.getElementById('glass-opacity');
    const glassBlur = document.getElementById('glass-blur');
    
    // Load saved values or defaults
    if (streamerNameInput) {
      streamerNameInput.value = localStorage.getItem('customStreamerName') || 'Osecaadegas95';
    }
    if (websiteUrlInput) {
      websiteUrlInput.value = localStorage.getItem('customWebsiteUrl') || 'https://osecaadegas.github.io/95/';
    }
    if (primaryColorInput) {
      primaryColorInput.value = localStorage.getItem('customPrimaryColor') || '#9346ff';
    }
    if (accentColorInput) {
      accentColorInput.value = localStorage.getItem('customAccentColor') || '#00e1ff';
    }
    if (backgroundColorInput) {
      backgroundColorInput.value = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
    }
    if (textColorInput) {
      textColorInput.value = localStorage.getItem('customTextColor') || '#ffffff';
    }
    if (streamerNameColorInput) {
      streamerNameColorInput.value = localStorage.getItem('customStreamerNameColor') || '#ffffff';
    }
    if (websiteColorInput) {
      websiteColorInput.value = localStorage.getItem('customWebsiteColor') || '#ffffff';
    }
    if (cardBackgroundInput) {
      cardBackgroundInput.value = localStorage.getItem('customCardBackground') || '#2a2b3d';
    }
    if (gambleAwareColorInput) {
      gambleAwareColorInput.value = localStorage.getItem('customGambleAwareColor') || '#ffffff';
    }
    if (glassEffectToggle) {
      glassEffectToggle.checked = localStorage.getItem('glassEffectEnabled') === 'true';
    }
    
    // Initialize sidebar backgrounds toggle
    const sidebarBackgroundsToggle = document.getElementById('sidebar-backgrounds-toggle');
    if (sidebarBackgroundsToggle) {
      sidebarBackgroundsToggle.checked = localStorage.getItem('sidebarBackgroundsEnabled') !== 'false';
      sidebarBackgroundsToggle.addEventListener('change', () => {
        localStorage.setItem('sidebarBackgroundsEnabled', sidebarBackgroundsToggle.checked);
        // Reapply UI colors to update sidebar buttons
        const primaryColor = document.getElementById('primary-color')?.value || '#9346ff';
        const accentColor = document.getElementById('accent-color')?.value || '#00e1ff';
        const backgroundColor = document.getElementById('background-color')?.value || '#1a1b2e';
        const textColor = document.getElementById('text-color')?.value || '#ffffff';
        applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
        // Apply advanced customization with better performance
        if (typeof applyAdvancedCustomization === 'function') {
          if (window.requestIdleCallback) {
            requestIdleCallback(() => applyAdvancedCustomization());
          } else {
            setTimeout(applyAdvancedCustomization, 0);
          }
        }
      });
    }
    
    // Load Twitch chat settings
    const twitchChannelInput = document.getElementById('twitch-channel-input');
    const twitchChatTheme = document.getElementById('twitch-chat-theme');
    
    if (twitchChannelInput) {
      twitchChannelInput.value = localStorage.getItem('twitchChannelName') || '';
    }
    if (twitchChatTheme) {
      twitchChatTheme.value = localStorage.getItem('twitchChatTheme') || 'dark';
    }
    
    // Load advanced font colors
    const slotTitleColorInput = document.getElementById('slot-title-color');
    const slotBetColorInput = document.getElementById('slot-bet-color');
    const slotWinColorInput = document.getElementById('slot-win-color');
    const bonusHeaderColorInput = document.getElementById('bonus-header-color');
    const moneyDisplayColorInput = document.getElementById('money-display-color');
    
    if (slotTitleColorInput) slotTitleColorInput.value = localStorage.getItem('slotTitleColor') || '#ffffff';
    if (slotBetColorInput) slotBetColorInput.value = localStorage.getItem('slotBetColor') || '#00e1ff';
    if (slotWinColorInput) slotWinColorInput.value = localStorage.getItem('slotWinColor') || '#4ade80';
    if (bonusHeaderColorInput) bonusHeaderColorInput.value = localStorage.getItem('bonusHeaderColor') || '#ffffff';
    if (moneyDisplayColorInput) moneyDisplayColorInput.value = localStorage.getItem('moneyDisplayColor') || '#00e1ff';
    
    // Load gradient settings
    const slotGradientStartInput = document.getElementById('slot-gradient-start');
    const slotGradientEndInput = document.getElementById('slot-gradient-end');
    const buttonGradientStartInput = document.getElementById('button-gradient-start');
    const buttonGradientEndInput = document.getElementById('button-gradient-end');
    const sidebarGradientStartInput = document.getElementById('sidebar-gradient-start');
    const sidebarGradientEndInput = document.getElementById('sidebar-gradient-end');
    const gradientDirectionInput = document.getElementById('gradient-direction');
    
    if (slotGradientStartInput) slotGradientStartInput.value = localStorage.getItem('slotGradientStart') || '#9346ff';
    if (slotGradientEndInput) slotGradientEndInput.value = localStorage.getItem('slotGradientEnd') || '#00e1ff';
    if (buttonGradientStartInput) buttonGradientStartInput.value = localStorage.getItem('buttonGradientStart') || '#9346ff';
    if (buttonGradientEndInput) buttonGradientEndInput.value = localStorage.getItem('buttonGradientEnd') || '#7c3aed';
    if (sidebarGradientStartInput) sidebarGradientStartInput.value = localStorage.getItem('sidebarGradientStart') || '#1a1b2e';
    if (sidebarGradientEndInput) sidebarGradientEndInput.value = localStorage.getItem('sidebarGradientEnd') || '#16213e';
    if (gradientDirectionInput) gradientDirectionInput.value = localStorage.getItem('gradientDirection') || '135deg';
    
    // Load effect settings
    const animatedGradientsToggle = document.getElementById('animated-gradients-toggle');
    const glowEffectsToggle = document.getElementById('glow-effects-toggle');
    
    if (animatedGradientsToggle) animatedGradientsToggle.checked = localStorage.getItem('animatedGradientsEnabled') === 'true';
    if (glowEffectsToggle) glowEffectsToggle.checked = localStorage.getItem('glowEffectsEnabled') === 'true';
  }
  
  // Background type switcher
  const backgroundTypeSelect = document.getElementById('background-type');
  const gradientControls = document.getElementById('gradient-controls');
  const imageControls = document.getElementById('image-controls');
  
  if (backgroundTypeSelect) {
    backgroundTypeSelect.addEventListener('change', () => {
      const type = backgroundTypeSelect.value;
      if (gradientControls) gradientControls.style.display = type === 'gradient' ? 'flex' : 'none';
      if (imageControls) imageControls.style.display = type === 'image' ? 'flex' : 'none';
    });
  }
  
  // Helper function to convert hex to RGB
  // Functions moved to top of file to prevent scope errors
  
  // Glass effect controls
  const glassEffectToggle = document.getElementById('glass-effect-toggle');
  const glassOpacity = document.getElementById('glass-opacity');
  const glassBlur = document.getElementById('glass-blur');
  
  function toggleGlassControls() {
    const glassOpacityRow = document.getElementById('glass-opacity-row');
    const glassBlurRow = document.getElementById('glass-blur-row');
    const isEnabled = glassEffectToggle && glassEffectToggle.checked;
    
    if (glassOpacityRow) glassOpacityRow.style.display = isEnabled ? 'flex' : 'none';
    if (glassBlurRow) glassBlurRow.style.display = isEnabled ? 'flex' : 'none';
  }
  
  if (glassEffectToggle) {
    glassEffectToggle.addEventListener('change', () => {
      toggleGlassControls();
      localStorage.setItem('glassEffectEnabled', glassEffectToggle.checked);
      
      // Apply glass effect immediately
      const primaryColor = localStorage.getItem('customPrimaryColor') || '#9346ff';
      const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
      const backgroundColor = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
      const textColor = localStorage.getItem('customTextColor') || '#ffffff';
      applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
    });
  }
  
  if (glassOpacity) {
    glassOpacity.addEventListener('input', () => {
      const value = glassOpacity.value;
      document.getElementById('glass-opacity-value').textContent = Math.round(value * 100) + '%';
      localStorage.setItem('glassOpacity', value);
      
      // Apply changes immediately
      const primaryColor = localStorage.getItem('customPrimaryColor') || '#9346ff';
      const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
      const backgroundColor = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
      const textColor = localStorage.getItem('customTextColor') || '#ffffff';
      applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
    });
  }
  
  if (glassBlur) {
    glassBlur.addEventListener('input', () => {
      const value = glassBlur.value;
      document.getElementById('glass-blur-value').textContent = value + 'px';
      localStorage.setItem('glassBlur', value);
      
      // Apply changes immediately
      const primaryColor = localStorage.getItem('customPrimaryColor') || '#9346ff';
      const accentColor = localStorage.getItem('customAccentColor') || '#00e1ff';
      const backgroundColor = localStorage.getItem('customBackgroundColor') || '#1a1b2e';
      const textColor = localStorage.getItem('customTextColor') || '#ffffff';
      applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
    });
  }
  
  // Twitch Chat Functionality
  const twitchChannelInput = document.getElementById('twitch-channel-input');
  const twitchChatTheme = document.getElementById('twitch-chat-theme');
  const loadChatBtn = document.getElementById('load-twitch-chat');
  const clearChatBtn = document.getElementById('clear-twitch-chat');
  
  function loadTwitchChat() {
    const channelName = twitchChannelInput?.value?.trim();
    const theme = twitchChatTheme?.value || 'dark';
    
    if (!channelName) {
      showNotification('Please enter a Twitch channel name', 'warning');
      return;
    }
    
    // Validate channel name (basic validation)
    if (!/^[a-zA-Z0-9_]{3,25}$/.test(channelName)) {
      showNotification('Invalid channel name. Use only letters, numbers, and underscores (3-25 characters)', 'error');
      return;
    }
    
    const chatIframe = document.getElementById('twitch-chat-iframe');
    const emptyChatCard = document.getElementById('empty-chat-card');
    const loadButton = document.getElementById('load-twitch-chat');
    
    if (chatIframe && emptyChatCard) {
      // Show loading state
      emptyChatCard.innerHTML = '<div class="chat-loading">Connecting to Twitch...</div>';
      emptyChatCard.style.display = 'flex';
      
      if (loadButton) {
        loadButton.textContent = 'Loading...';
        loadButton.disabled = true;
      }
      
      // Build Twitch chat embed URL with proper domain handling
      let hostname = window.location.hostname || 'localhost';
      
      // Handle localhost and development environments
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
      
      let chatUrl;
      if (isLocalhost) {
        // For localhost, use a direct popout link that opens in a new window
        // or try with common localhost alternatives
        chatUrl = `https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=localhost&parent=127.0.0.1`;
      } else {
        chatUrl = `https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=${hostname}`;
      }
      
      setTimeout(() => {
        if (isLocalhost) {
          // For localhost, provide alternative options
          emptyChatCard.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.8);">
              <div style="font-size: 2rem; margin-bottom: 1rem;">💬</div>
              <div style="font-size: 1.1rem; margin-bottom: 1rem; font-weight: 600;">Twitch Chat (Localhost)</div>
              <div style="font-size: 0.9rem; margin-bottom: 1.5rem; color: rgba(255, 255, 255, 0.6);">
                Twitch embeds don't work on localhost.<br>Use one of these options:
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                <button onclick="window.open('https://www.twitch.tv/popout/${channelName}/chat', '_blank', 'width=400,height=600')" 
                        style="padding: 0.8rem 1rem; background: linear-gradient(135deg, #9146ff, #772ce8); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                  Open Chat in Popup
                </button>
                <button onclick="window.open('https://www.twitch.tv/${channelName}/chat', '_blank')" 
                        style="padding: 0.8rem 1rem; background: linear-gradient(135deg, #00e1ff, #0099cc); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                  Open Chat in New Tab
                </button>
              </div>
              <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); margin-top: 1rem;">
                💡 Deploy to a web server for embedded chat
              </div>
            </div>
          `;
          emptyChatCard.style.display = 'flex';
          chatIframe.style.display = 'none';
          
          showNotification(`Localhost detected. Use popup options for ${channelName} chat`, 'info');
        } else {
          // Try to load the iframe for non-localhost
          chatIframe.src = chatUrl;
          
          // Add error handling for iframe loading
          chatIframe.onload = () => {
            chatIframe.style.display = 'block';
            emptyChatCard.style.display = 'none';
            showNotification(`Twitch chat loaded for ${channelName}`, 'success');
          };
          
          chatIframe.onerror = () => {
            emptyChatCard.innerHTML = `
              <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.8);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                <div style="font-size: 1rem; margin-bottom: 1rem;">Failed to load chat</div>
                <button onclick="window.open('https://www.twitch.tv/popout/${channelName}/chat', '_blank')" 
                        style="padding: 0.8rem 1rem; background: #9146ff; color: white; border: none; border-radius: 8px; cursor: pointer;">
                  Open in Popup Instead
                </button>
              </div>
            `;
            emptyChatCard.style.display = 'flex';
            chatIframe.style.display = 'none';
            showNotification('Chat embed failed. Try popup option', 'error');
          };
        }
        
        // Save settings
        localStorage.setItem('twitchChannelName', channelName);
        localStorage.setItem('twitchChatTheme', theme);
        
        if (loadButton) {
          loadButton.textContent = 'Load Chat';
          loadButton.disabled = false;
        }
        
        console.log('Twitch chat setup for channel:', channelName);
        
        // Optional: Close customization panel after loading
        const customizationPanel = document.getElementById('customization-panel');
        if (customizationPanel) {
          setTimeout(() => {
            customizationPanel.style.display = 'none';
          }, 1000);
        }
      }, 800);
    }
  }
  
  function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('chat-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'chat-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
        word-wrap: break-word;
      `;
      document.body.appendChild(notification);
    }
    
    // Set colors based on type
    const colors = {
      success: 'linear-gradient(135deg, #22c55e, #16a34a)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
      info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    // Show notification immediately
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    });
    
    // Hide notification after 2.5 seconds for faster UI
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
    }, 2500);
  }
  
  function clearTwitchChat() {
    const chatIframe = document.getElementById('twitch-chat-iframe');
    const emptyChatCard = document.getElementById('empty-chat-card');
    
    if (chatIframe && emptyChatCard) {
      chatIframe.style.display = 'none';
      chatIframe.src = '';
      emptyChatCard.style.display = 'flex';
      emptyChatCard.innerHTML = '';
      
      // Clear saved settings
      localStorage.removeItem('twitchChannelName');
      localStorage.removeItem('twitchChatTheme');
      
      console.log('Twitch chat cleared');
    }
  }
  
  function loadSavedTwitchChat() {
    const savedChannel = localStorage.getItem('twitchChannelName');
    const savedTheme = localStorage.getItem('twitchChatTheme') || 'dark';
    
    if (twitchChannelInput) twitchChannelInput.value = savedChannel || '';
    if (twitchChatTheme) twitchChatTheme.value = savedTheme;
    
    if (savedChannel) {
      const chatIframe = document.getElementById('twitch-chat-iframe');
      const emptyChatCard = document.getElementById('empty-chat-card');
      
      if (chatIframe && emptyChatCard) {
        const hostname = window.location.hostname || 'localhost';
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
        
        if (isLocalhost) {
          // Show localhost-friendly interface
          emptyChatCard.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.8);">
              <div style="font-size: 2rem; margin-bottom: 1rem;">💬</div>
              <div style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight: 600;">${savedChannel} Chat</div>
              <div style="font-size: 0.8rem; margin-bottom: 1.5rem; color: rgba(255, 255, 255, 0.5);">
                Localhost detected
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                <button onclick="window.open('https://www.twitch.tv/popout/${savedChannel}/chat', '_blank', 'width=400,height=600')" 
                        style="padding: 0.8rem 1rem; background: linear-gradient(135deg, #9146ff, #772ce8); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                  Open Chat Popup
                </button>
                <button onclick="window.open('https://www.twitch.tv/${savedChannel}/chat', '_blank')" 
                        style="padding: 0.8rem 1rem; background: linear-gradient(135deg, #00e1ff, #0099cc); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                  Open in New Tab
                </button>
              </div>
            </div>
          `;
          emptyChatCard.style.display = 'flex';
          chatIframe.style.display = 'none';
        } else {
          // Try to load normally for non-localhost
          const chatUrl = `https://www.twitch.tv/embed/${savedChannel}/chat?darkpopout&parent=${hostname}`;
          chatIframe.src = chatUrl;
          chatIframe.style.display = 'block';
          emptyChatCard.style.display = 'none';
        }
      }
    }
  }
  
  if (loadChatBtn) {
    loadChatBtn.addEventListener('click', loadTwitchChat);
  }
  
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', clearTwitchChat);
  }
  
  // File upload handlers will be initialized in the delayed customization setup
  
  // Apply customization
  const applyBtn = document.getElementById('apply-customization');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyCustomization);
  }
  
  // Reset functions
  const resetLogoBtn = document.getElementById('reset-logo-btn');
  const resetBgBtn = document.getElementById('reset-bg-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');
  
  if (resetLogoBtn) {
    resetLogoBtn.addEventListener('click', () => {
      localStorage.removeItem('customNavbarLogo');
      const navbarLogo = document.getElementById('navbar-logo');
      if (navbarLogo) navbarLogo.src = 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png';
    });
  }
  
  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', () => {
      localStorage.removeItem('customBackgroundImage');
      // Remove custom background class to restore star animations
      document.body.classList.remove('custom-background');
      // Clear custom background styles
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('background-image');
      document.body.style.removeProperty('background-size');
      document.body.style.removeProperty('background-position');
      document.body.style.removeProperty('background-repeat');
      document.body.style.removeProperty('background-attachment');
      console.log('Background reset to default');
    });
  }
  
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Reset all customizations to default? This will reload the page.')) {
        // Use CustomizationManager resetAll if available, otherwise fallback
        if (window.CustomizationManager && window.CustomizationManager.resetAll) {
          window.CustomizationManager.resetAll();
        } else {
          // Fallback reset
          console.log('🔄 Using fallback reset...');
          const customKeys = [
            'customStreamerName', 'customWebsiteUrl', 'customWebsiteText',
            'customNavbarLogo', 'customPrimaryColor', 'customAccentColor',
            'customBackgroundColor', 'customTextColor', 'customBackgroundImage',
            'customCardBackground', 'customStreamerNameColor', 'customWebsiteColor',
            'customGambleAwareColor', 'glassEffectEnabled', 'glassOpacity', 'glassBlur',
            'selectedTheme', 'customization'
          ];
          customKeys.forEach(key => localStorage.removeItem(key));
          document.body.classList.remove('custom-theme', 'christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
          location.reload();
        }
      }
    });
  }
  
  // Theme presets
  const themePresets = document.querySelectorAll('.theme-preset');
  themePresets.forEach(preset => {
    preset.addEventListener('click', () => {
      const theme = preset.dataset.theme;
      console.log('🎨 Theme preset clicked:', theme);
      
      applyThemePreset(theme);
      
      // Update active state
      themePresets.forEach(p => p.classList.remove('active'));
      preset.classList.add('active');
    });
  });
  
  function applyCustomization() {
    const streamerName = document.getElementById('custom-streamer-name')?.value;
    const websiteUrl = document.getElementById('custom-website-url')?.value;
    const primaryColor = document.getElementById('primary-color')?.value;
    const accentColor = document.getElementById('accent-color')?.value;
    const backgroundColor = document.getElementById('background-color')?.value;
    const textColor = document.getElementById('text-color')?.value;
    const cardBackgroundColor = document.getElementById('card-background-color')?.value;
    const streamerNameColor = document.getElementById('streamer-name-color')?.value;
    const websiteColor = document.getElementById('website-color')?.value;
    const gambleAwareColor = document.getElementById('gamble-aware-color')?.value;
    const glassEffectToggle = document.getElementById('glass-effect-toggle')?.checked;
    
    // New advanced color options
    const slotTitleColor = document.getElementById('slot-title-color')?.value;
    const slotBetColor = document.getElementById('slot-bet-color')?.value;
    const slotWinColor = document.getElementById('slot-win-color')?.value;
    const bonusHeaderColor = document.getElementById('bonus-header-color')?.value;
    const moneyDisplayColor = document.getElementById('money-display-color')?.value;
    
    // New gradient options
    const slotGradientStart = document.getElementById('slot-gradient-start')?.value;
    const slotGradientEnd = document.getElementById('slot-gradient-end')?.value;
    const buttonGradientStart = document.getElementById('button-gradient-start')?.value;
    const buttonGradientEnd = document.getElementById('button-gradient-end')?.value;
    const sidebarGradientStart = document.getElementById('sidebar-gradient-start')?.value;
    const sidebarGradientEnd = document.getElementById('sidebar-gradient-end')?.value;
    const gradientDirection = document.getElementById('gradient-direction')?.value || '135deg';
    
    // New effect toggles
    const animatedGradientsToggle = document.getElementById('animated-gradients-toggle')?.checked;
    const glowEffectsToggle = document.getElementById('glow-effects-toggle')?.checked;
    
    // Apply streamer name
    if (streamerName) {
      const streamerNameSpan = document.getElementById('streamer-name');
      if (streamerNameSpan) streamerNameSpan.textContent = streamerName;
      localStorage.setItem('customStreamerName', streamerName);
    }
    
    // Apply website URL
    if (websiteUrl) {
      const websiteLink = document.getElementById('website-link');
      const websiteText = document.getElementById('website-text');
      if (websiteLink) websiteLink.href = websiteUrl;
      if (websiteText) {
        const displayText = websiteUrl.replace(/^https?:\/\//, '');
        websiteText.textContent = displayText;
        localStorage.setItem('customWebsiteText', displayText);
      }
      localStorage.setItem('customWebsiteUrl', websiteUrl);
    }
    
    // Apply colors
    applyColorScheme(primaryColor, accentColor, backgroundColor, textColor);
    
    // Save all colors and glass effect
    localStorage.setItem('customPrimaryColor', primaryColor);
    localStorage.setItem('customAccentColor', accentColor);
    localStorage.setItem('customBackgroundColor', backgroundColor);
    localStorage.setItem('customTextColor', textColor);
    localStorage.setItem('customCardBackground', cardBackgroundColor);
    localStorage.setItem('customStreamerNameColor', streamerNameColor);
    localStorage.setItem('customWebsiteColor', websiteColor);
    localStorage.setItem('customGambleAwareColor', gambleAwareColor);
    localStorage.setItem('glassEffectEnabled', glassEffectToggle);
    
    // Save advanced colors
    localStorage.setItem('slotTitleColor', slotTitleColor);
    localStorage.setItem('slotBetColor', slotBetColor);
    localStorage.setItem('slotWinColor', slotWinColor);
    localStorage.setItem('bonusHeaderColor', bonusHeaderColor);
    localStorage.setItem('moneyDisplayColor', moneyDisplayColor);
    
    // Save gradient settings
    localStorage.setItem('slotGradientStart', slotGradientStart);
    localStorage.setItem('slotGradientEnd', slotGradientEnd);
    localStorage.setItem('buttonGradientStart', buttonGradientStart);
    localStorage.setItem('buttonGradientEnd', buttonGradientEnd);
    localStorage.setItem('sidebarGradientStart', sidebarGradientStart);
    localStorage.setItem('sidebarGradientEnd', sidebarGradientEnd);
    localStorage.setItem('gradientDirection', gradientDirection);
    
    // Save effect settings
    localStorage.setItem('animatedGradientsEnabled', animatedGradientsToggle);
    localStorage.setItem('glowEffectsEnabled', glowEffectsToggle);
    
    // Apply advanced customizations
    applyAdvancedCustomization();
    
    
    // Re-apply background image if it exists (after color scheme application)
    const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
    if (savedBackgroundImage) {
      setTimeout(() => {
        applyBackgroundImage(savedBackgroundImage);
        console.log('Background image re-applied after customization');
      }, 100);
    }
    
    customizationPanel.style.display = 'none';
  }
  
  function applyAdvancedCustomization() {
    // Get saved values
    const slotTitleColor = localStorage.getItem('slotTitleColor') || '#ffffff';
    const slotBetColor = localStorage.getItem('slotBetColor') || '#00e1ff';
    const slotWinColor = localStorage.getItem('slotWinColor') || '#4ade80';
    const bonusHeaderColor = localStorage.getItem('bonusHeaderColor') || '#ffffff';
    const moneyDisplayColor = localStorage.getItem('moneyDisplayColor') || '#00e1ff';
    
    const slotGradientStart = localStorage.getItem('slotGradientStart') || '#9346ff';
    const slotGradientEnd = localStorage.getItem('slotGradientEnd') || '#00e1ff';
    const buttonGradientStart = localStorage.getItem('buttonGradientStart') || '#9346ff';
    const buttonGradientEnd = localStorage.getItem('buttonGradientEnd') || '#7c3aed';
    const sidebarGradientStart = localStorage.getItem('sidebarGradientStart') || '#1a1b2e';
    const sidebarGradientEnd = localStorage.getItem('sidebarGradientEnd') || '#16213e';
    const gradientDirection = localStorage.getItem('gradientDirection') || '135deg';
    
    const animatedGradients = localStorage.getItem('animatedGradientsEnabled') === 'true';
    const glowEffects = localStorage.getItem('glowEffectsEnabled') === 'true';
    
    // Create or update advanced styles
    let advancedStyle = document.getElementById('advanced-customization-styles');
    if (!advancedStyle) {
      advancedStyle = document.createElement('style');
      advancedStyle.id = 'advanced-customization-styles';
      document.head.appendChild(advancedStyle);
    }
    
    advancedStyle.textContent = `
      /* Advanced Font Colors */
      .slot-title, .slot-card-modern .slot-title {
        color: ${slotTitleColor} !important;
      }
      
      .metric-value.bet-metric, .slot-card-modern .metric-value.bet-metric {
        background: linear-gradient(${gradientDirection}, ${slotBetColor}, ${adjustColor(slotBetColor, -20)}) !important;
        color: #ffffff !important;
      }
      
      .metric-value.win-metric, .slot-card-modern .metric-value.win-metric {
        background: linear-gradient(${gradientDirection}, ${slotWinColor}, ${adjustColor(slotWinColor, -20)}) !important;
        color: #ffffff !important;
      }
      
      .bonus-list h4, .bonus-list-header {
        color: ${bonusHeaderColor} !important;
      }
      
      .money-display, .current-money, .start-money, .stop-money {
        color: ${moneyDisplayColor} !important;
      }
      
      /* Custom Gradients */
      .slot-card-modern, .bonus-list li {
        background: linear-gradient(${gradientDirection}, 
          rgba(${hexToRgb(slotGradientStart).r}, ${hexToRgb(slotGradientStart).g}, ${hexToRgb(slotGradientStart).b}, 0.08) 0%, 
          rgba(${hexToRgb(slotGradientEnd).r}, ${hexToRgb(slotGradientEnd).g}, ${hexToRgb(slotGradientEnd).b}, 0.05) 100%) !important;
      }
      
      .middle-btn, .custom-apply-btn {
        background: linear-gradient(${gradientDirection}, ${buttonGradientStart}, ${buttonGradientEnd}) !important;
      }
      
      ${localStorage.getItem('sidebarBackgroundsEnabled') !== 'false' ? `
      .sidebar-btn {
        background: linear-gradient(${gradientDirection}, ${buttonGradientStart}, ${buttonGradientEnd}) !important;
      }
      ` : `
      .sidebar-btn {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      `}
      
      .sidebar {
        background: linear-gradient(${gradientDirection}, ${sidebarGradientStart}, ${sidebarGradientEnd}) !important;
      }
      
      ${animatedGradients ? `
      .slot-card-modern, .bonus-list li {
        background-size: 200% 200% !important;
        animation: gradientAnimation 4s ease infinite !important;
      }
      
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      ` : ''}
      
      ${glowEffects ? `
      .slot-card-modern:hover, .bonus-list li:hover {
        box-shadow: 0 0 20px rgba(${hexToRgb(slotGradientStart).r}, ${hexToRgb(slotGradientStart).g}, ${hexToRgb(slotGradientStart).b}, 0.5) !important;
      }
      
      .middle-btn:hover, .sidebar-btn:hover {
        box-shadow: 0 0 15px rgba(${hexToRgb(buttonGradientStart).r}, ${hexToRgb(buttonGradientStart).g}, ${hexToRgb(buttonGradientStart).b}, 0.4) !important;
      }
      ` : ''}
    `;
  }
  
  function applyBackgroundImage(imageSrc) {
    console.log('Applying background image:', imageSrc ? 'Image data found' : 'No image data');
    
    if (!imageSrc) {
      console.warn('No image source provided to applyBackgroundImage');
      return;
    }
    
    // Add a class to body to hide star animations
    document.body.classList.add('custom-background');
    
    // Clear any existing background first and use setProperty with important
    document.body.style.setProperty('background', '', 'important');
    document.body.style.setProperty('background-color', '', 'important');
    
    // Apply the background image with !important to override CSS
    document.body.style.setProperty('background-image', `url("${imageSrc}")`, 'important');
    document.body.style.setProperty('background-size', 'cover', 'important');
    document.body.style.setProperty('background-position', 'center', 'important');
    document.body.style.setProperty('background-repeat', 'no-repeat', 'important');
    document.body.style.setProperty('background-attachment', 'fixed', 'important');
    
    // Force a repaint to ensure the background shows immediately
    document.body.offsetHeight;
    
    console.log('Background image applied successfully with !important');
    
    // Provide visual feedback that the background was applied
    const customizationPanel = document.getElementById('customization-panel');
    if (customizationPanel && customizationPanel.style.display === 'flex') {
      // Show a brief success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Background applied successfully!';
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 225, 255, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 10000;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => successMsg.remove(), 200);
      }, 1500);
    }
  }
  
  function applyThemePreset(theme) {
    // Theme functionality now handled by ThemeManager
    if (window.ThemeManager) {
      window.ThemeManager.applyTheme(theme);
      return;
    }
    
    // Fallback for legacy themes if ThemeManager is not available
    console.warn('ThemeManager not available, using fallback theme application');
    const themes = {
      default: { 
        primary: '#9346ff', accent: '#00e1ff', background: '#1a1b2e', text: '#ffffff',
        cardBg: '#2a2b3d', streamerName: '#00e1ff', website: '#9346ff', gambleAware: '#ff6b6b'
      },
      purple: { 
        primary: '#8b5cf6', accent: '#a78bfa', background: '#1e1b4b', text: '#ffffff',
        cardBg: '#2d1b69', streamerName: '#a78bfa', website: '#8b5cf6', gambleAware: '#f87171'
      },
      blue: { 
        primary: '#3b82f6', accent: '#60a5fa', background: '#1e3a8a', text: '#ffffff',
        cardBg: '#1e40af', streamerName: '#60a5fa', website: '#3b82f6', gambleAware: '#ef4444'
      },
      green: { 
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#ffffff',
        cardBg: '#065f46', streamerName: '#34d399', website: '#10b981', gambleAware: '#f59e0b'
      },
      red: { 
        primary: '#ef4444', accent: '#f87171', background: '#7f1d1d', text: '#ffffff',
        cardBg: '#991b1b', streamerName: '#f87171', website: '#ef4444', gambleAware: '#fbbf24'
      },
      dark: { 
        primary: '#6b7280', accent: '#9ca3af', background: '#111827', text: '#f9fafb',
        cardBg: '#1f2937', streamerName: '#9ca3af', website: '#6b7280', gambleAware: '#f59e0b'
      }
    };
    
    const selectedTheme = themes[theme];
    if (selectedTheme) {
      console.log('🎨 Applying fallback theme:', theme);
          }
        }
      }
      
      // Clear any existing seasonal classes for regular themes
      document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
      if (typeof removeChristmasTheme === 'function') {
        removeChristmasTheme();
      }
      
      // Update all color inputs safely
      const primaryColorInput = document.getElementById('primary-color');
      const accentColorInput = document.getElementById('accent-color');
      const backgroundColorInput = document.getElementById('background-color');
      const textColorInput = document.getElementById('text-color');
      const cardBackgroundInput = document.getElementById('card-background-color');
      const streamerNameColorInput = document.getElementById('streamer-name-color');
      const websiteColorInput = document.getElementById('website-color');
      const gambleAwareColorInput = document.getElementById('gamble-aware-color');
      
      if (primaryColorInput) primaryColorInput.value = selectedTheme.primary;
      if (accentColorInput) accentColorInput.value = selectedTheme.accent;
      if (backgroundColorInput) backgroundColorInput.value = selectedTheme.background;
      if (textColorInput) textColorInput.value = selectedTheme.text;
      if (cardBackgroundInput) cardBackgroundInput.value = selectedTheme.cardBg;
      if (streamerNameColorInput) streamerNameColorInput.value = selectedTheme.streamerName;
      if (websiteColorInput) websiteColorInput.value = selectedTheme.website;
      if (gambleAwareColorInput) gambleAwareColorInput.value = selectedTheme.gambleAware;
      
      // Store the cardBg value in localStorage so it gets used
      localStorage.setItem('customCardBackground', selectedTheme.cardBg);
      localStorage.setItem('selectedTheme', theme);
      console.log('🎄 Theme saved to localStorage:', theme);
      
      // Apply the theme immediately
      applyColorScheme(selectedTheme.primary, selectedTheme.accent, selectedTheme.background, selectedTheme.text);
      
      console.log('🎄 Theme application complete. Final body classes:', document.body.className);
      
      // Refresh tournament bracket styling after theme change
      setTimeout(refreshTournamentBracketStyling, 100);
    }
  }
  
  // Load saved customizations on page load
  function loadSavedCustomizations() {
    console.log('Loading saved customizations...');
    const primaryColor = localStorage.getItem('customPrimaryColor');
    const accentColor = localStorage.getItem('customAccentColor');
    const backgroundColor = localStorage.getItem('customBackgroundColor');
    const textColor = localStorage.getItem('customTextColor');
    const backgroundImage = localStorage.getItem('customBackgroundImage');
    
    console.log('Saved background image found:', !!backgroundImage);
    
    if (primaryColor && accentColor && backgroundColor && textColor) {
      console.log('Applying saved color scheme...');
      applyColorScheme(primaryColor, accentColor, backgroundColor, textColor);
    }
    
    if (backgroundImage) {
      console.log('Applying saved background image...');
      applyBackgroundImage(backgroundImage);
    }
    
    // Apply colors and customizations immediately for better performance
    requestAnimationFrame(() => {
      if (primaryColor && accentColor && backgroundColor && textColor) {
        applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
      }
      // Apply advanced customizations
      applyAdvancedCustomization();
      // Re-apply background image after UI colors to ensure it's not overridden
      if (backgroundImage) {
        console.log('Re-applying background image after UI color update...');
        applyBackgroundImage(backgroundImage);
      }
      // Refresh tournament bracket styling
      refreshTournamentBracketStyling();
    });
  }
  
  // Initialize customizations
  setTimeout(loadSavedCustomizations, 100);
  
  // Re-initialize drag for dynamically created panels
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const draggableSelectors = [
            '.tournament-panel',
            '.tournament-control-panel'
          ];
          
          draggableSelectors.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              window.dragHandler.makeDraggable(node);
              console.log('Made dynamically created panel draggable:', selector);
            }
            
            const elements = node.querySelectorAll && node.querySelectorAll(selector);
            if (elements) {
              elements.forEach(element => {
                window.dragHandler.makeDraggable(element);
                console.log('Made nested panel draggable:', selector);
              });
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

// Modern Circular Sidebar with Fan Effect
// SIMPLE WORKING SEASONAL THEMES
function activateChristmasTheme() {
  console.log('🎄 ACTIVATING CHRISTMAS THEME');
  
  // Clear existing seasonal classes
  document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
  
  // Add Christmas class
  document.body.classList.add('christmas-theme');
  
  // Remove existing Christmas styles
  const existingStyle = document.getElementById('christmas-effects');
  if (existingStyle) existingStyle.remove();
  
  // Add Christmas effects immediately
  const christmasCSS = `
    <style id="christmas-effects">
      /* Christmas Background Override */
      body.christmas-theme {
        background: linear-gradient(135deg, #0a1a2e 0%, #16213e 25%, #1a2650 50%, #0f1b3c 75%, #001122 100%) !important;
      }
      
      /* Snowflakes */
      body.christmas-theme::before {
        content: '❄ ❄ ❄ ❄ ❄ ❄ ❄ ❄ ❄ ❄' !important;
        position: fixed !important;
        top: -50px !important;
        left: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        color: white !important;
        font-size: 20px !important;
        letter-spacing: 80px !important;
        animation: snow-fall 8s linear infinite !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      @keyframes snow-fall {
        0% { transform: translateY(-50px) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }
      
      /* Candy Cane Borders */
      body.christmas-theme .navbar,
      body.christmas-theme .info-section,
      body.christmas-theme .sidebar {
        border: 3px solid transparent !important;
        background-clip: padding-box !important;
        position: relative !important;
      }
      
      body.christmas-theme .navbar::after,
      body.christmas-theme .info-section::after,
      body.christmas-theme .sidebar::after {
        content: '' !important;
        position: absolute !important;
        top: -3px !important;
        left: -3px !important;
        right: -3px !important;
        bottom: -3px !important;
        background: repeating-linear-gradient(
          45deg,
          #dc2626 0px, #dc2626 8px,
          #ffffff 8px, #ffffff 16px
        ) !important;
        z-index: -1 !important;
        border-radius: inherit !important;
        animation: candy-rotate 3s linear infinite !important;
      }
      
      @keyframes candy-rotate {
        0% { background-position: 0 0; }
        100% { background-position: 32px 32px; }
      }
      
      /* Christmas Colors */
      body.christmas-theme .navbar { background: rgba(15, 27, 47, 0.95) !important; }
      body.christmas-theme .info-section { background: rgba(15, 27, 47, 0.95) !important; }
      body.christmas-theme .sidebar { background: rgba(15, 27, 47, 0.95) !important; }
      
      /* Candy Stripe Buttons */
      body.christmas-theme button {
        background: repeating-linear-gradient(
          45deg,
          #dc2626 0px, #dc2626 4px,
          #ffffff 4px, #ffffff 8px
        ) !important;
        color: #000000 !important;
        font-weight: bold !important;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', christmasCSS);
  
  // Apply Christmas colors
  applyUIColors('#dc2626', '#ffffff', '#0f1b2f', '#ffffff');
  
  // Save theme
  localStorage.setItem('selectedTheme', 'christmas-candy-cane');
  
  // Show success message
  setTimeout(() => {
    if (typeof showThemeChangeMessage === 'function') {
      showThemeChangeMessage('🎄 Christmas theme activated! 🍭❄️');
    }
  }, 100);
  
  console.log('🎄 CHRISTMAS THEME ACTIVATED SUCCESSFULLY!');
}

function removeChristmasTheme() {
  document.body.classList.remove('christmas-theme');
  const christmasStyle = document.getElementById('christmas-effects');
  if (christmasStyle) christmasStyle.remove();
  console.log('🎄 Christmas theme removed');
}

// Show theme change message
function showThemeChangeMessage(message) {
  // Remove existing message if any
  const existingMessage = document.querySelector('.theme-change-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'theme-change-message';
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    z-index: 10001;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 2px solid #00e1ff;
    animation: theme-message-fade 3s ease-in-out forwards;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  let isOpen = false;

  // Initialize seasonal themes with delay to ensure DOM is ready
  setTimeout(() => {
    if (typeof initSeasonalThemes === 'function') {
      initSeasonalThemes();
    }
  }, 100);

  // Debug: Check if elements exist
  console.log('Sidebar found:', !!sidebar);
  console.log('SidebarToggle found:', !!sidebarToggle);

  // Force sidebar to closed state on load
  if (sidebar) {
    sidebar.classList.remove('open');
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => {
      btn.style.opacity = '0';
      btn.style.scale = '0';
      btn.style.pointerEvents = 'none';
    });
  }
  
  if (sidebarToggle) {
    sidebarToggle.classList.remove('active');
    
    // Force main button visibility with no background
    sidebarToggle.style.cssText = `
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      z-index: 10000 !important;
      width: 50px !important;
      height: 50px !important;
      background: none !important;
      border: none !important;
      box-shadow: none !important;
      position: relative !important;
      cursor: pointer !important;
      animation: spin 3s linear infinite !important;
    `;
    
    // Add the main circle image
    if (!sidebarToggle.innerHTML.trim()) {
      sidebarToggle.innerHTML = '<img src="./assets/maincircle.png" alt="Main" class="sidebar-toggle-image">';
    }
    
    console.log('Main button styled and ready');
  }

  if (sidebarToggle && sidebar) {

    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !sidebar.contains(e.target)) {
        closeSidebar();
      }
    });

    // Prevent sidebar from closing when clicking on fan buttons
    sidebar.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function toggleSidebar() {
    isOpen = !isOpen;
    if (isOpen) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }

  function openSidebar() {
    isOpen = true;
    sidebar.classList.add('open');
    sidebarToggle.classList.add('active');
    
    // Apply no-background class if backgrounds are disabled
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    const sidebarBackgroundsEnabled = localStorage.getItem('sidebarBackgroundsEnabled') !== 'false';
    
    buttons.forEach((btn, index) => {
      btn.style.animationDelay = `${index * 0.1}s`;
      
      if (!sidebarBackgroundsEnabled) {
        btn.classList.add('no-background');
      } else {
        btn.classList.remove('no-background');
      }
    });
    
    // Apply custom colors immediately for faster response
    requestAnimationFrame(() => {
      const primaryColor = localStorage.getItem('customPrimaryColor');
      const accentColor = localStorage.getItem('customAccentColor');
      const backgroundColor = localStorage.getItem('customBackgroundColor');
      const textColor = localStorage.getItem('customTextColor');
      
      if (primaryColor && accentColor && backgroundColor && textColor) {
        applyUIColors(primaryColor, accentColor, backgroundColor, textColor);
      }
    });
  }

  function closeSidebar() {
    isOpen = false;
    sidebar.classList.remove('open');
    sidebarToggle.classList.remove('active');
    
    // Reset animation delays
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    buttons.forEach((btn) => {
      btn.style.animationDelay = '';
    });
  }

  // Add click handlers for individual buttons to close sidebar after action
  const sidebarButtons = sidebar.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Small delay to allow the button action to complete
      setTimeout(() => {
        closeSidebar();
      }, 300);
    });
  });
  
  // Initialize customization panel
  setTimeout(() => {
    const customizationBtn = document.getElementById('customization-btn');
    const customizationPanel = document.getElementById('customization-panel');
    
    console.log('Checking customization elements...');
    console.log('Button found:', !!customizationBtn);
    console.log('Panel found:', !!customizationPanel);
    
    if (customizationBtn && customizationPanel) {
      customizationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Customization button clicked!');
        customizationPanel.style.display = 'flex';
        
        // Load current settings
        const streamerNameInput = document.getElementById('custom-streamer-name');
        const websiteUrlInput = document.getElementById('custom-website-url');
        
        if (streamerNameInput) {
          streamerNameInput.value = localStorage.getItem('customStreamerName') || 'Osecaadegas95';
        }
        if (websiteUrlInput) {
          websiteUrlInput.value = localStorage.getItem('customWebsiteUrl') || 'https://osecaadegas.github.io/95/';
        }
      });
      
      // Close button
      const customizationClose = document.getElementById('customization-close');
      if (customizationClose) {
        customizationClose.addEventListener('click', () => {
          customizationPanel.style.display = 'none';
        });
      }
      
      // Close when clicking outside
      customizationPanel.addEventListener('click', (e) => {
        if (e.target === customizationPanel) {
          customizationPanel.style.display = 'none';
        }
      });
      
      // Apply saved color scheme on page load only if customizations exist
      const savedPrimary = localStorage.getItem('customPrimaryColor');
      const savedAccent = localStorage.getItem('customAccentColor');
      const savedBackground = localStorage.getItem('customBackgroundColor');
      const savedText = localStorage.getItem('customTextColor');
      
      // Only apply custom scheme if at least one custom color exists
      if (savedPrimary || savedAccent || savedBackground || savedText) {
        applyColorScheme(
          savedPrimary || '#9346ff',
          savedAccent || '#00e1ff', 
          savedBackground || '#1a1b2e',
          savedText || '#ffffff'
        );
      }
      
      // Restore background image if it exists (after color scheme application)
      const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
      if (savedBackgroundImage) {
        applyBackgroundImage(savedBackgroundImage);
      }
      
      // Initialize file upload handlers with proper timing
      const customLogoBtn = document.getElementById('custom-logo-btn');
      const customLogoFile = document.getElementById('custom-logo-file');
      const customBgBtn = document.getElementById('custom-bg-btn');
      const customBgFile = document.getElementById('custom-bg-file');
      
      console.log('File upload elements found:', {
        customLogoBtn: !!customLogoBtn,
        customLogoFile: !!customLogoFile,
        customBgBtn: !!customBgBtn,
        customBgFile: !!customBgFile
      });
      
      if (customLogoBtn && customLogoFile) {
        customLogoBtn.addEventListener('click', () => customLogoFile.click());
        customLogoFile.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              localStorage.setItem('customNavbarLogo', evt.target.result);
              const navbarLogo = document.getElementById('navbar-logo');
              if (navbarLogo) navbarLogo.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
      
      if (customBgBtn && customBgFile) {
        customBgBtn.addEventListener('click', () => customBgFile.click());
        customBgFile.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) {
            console.log('Background image file selected:', file.name);
            const reader = new FileReader();
            reader.onload = (evt) => {
              console.log('Background image loaded, saving to localStorage');
              const imageData = evt.target.result;
              localStorage.setItem('customBackgroundImage', imageData);
              
              // Apply immediately with a small delay to ensure DOM is ready
              setTimeout(() => {
                applyBackgroundImage(imageData);
                console.log('Background applied immediately after upload');
              }, 100);
            };
            reader.onerror = (err) => {
              console.error('Error reading background image file:', err);
            };
            reader.readAsDataURL(file);
          } else {
            console.log('Invalid file type selected for background image');
            alert('Please select a valid image file (PNG, JPG, GIF, etc.)');
          }
        });
      }
      
      console.log('Customization panel initialized successfully!');
    } else {
      console.error('Could not find customization elements');
    }
  }, 1000);

  // ==================== SPOTIFY INTEGRATION ====================
  
  // Spotify configuration - REPLACE WITH YOUR OWN CREDENTIALS
  const SPOTIFY_CONFIG = {
    CLIENT_ID: '0781de806d9b44eab64983415502bfe8', // Replace with your Spotify app client ID
    REDIRECT_URI: window.location.origin + window.location.pathname, // Current page URL
    SCOPES: 'user-read-currently-playing user-read-playback-state'
  };

  let spotifyAccessToken = localStorage.getItem('spotify_access_token');
  let spotifyRefreshToken = localStorage.getItem('spotify_refresh_token');
  let spotifyUpdateInterval;

  // Spotify widget elements
  const spotifyWidget = document.getElementById('spotify-widget');
  const spotifyBtn = document.getElementById('spotify-btn');
  const spotifyAuthBtn = document.getElementById('spotify-auth-btn');
  const spotifyToggleBtn = document.getElementById('spotify-toggle');
  const spotifyTrack = document.getElementById('spotify-track');
  const spotifyArtist = document.getElementById('spotify-artist');
  const spotifyAlbumArt = document.getElementById('spotify-album-art');

  // Show/hide Spotify widget
  if (spotifyBtn) {
    spotifyBtn.addEventListener('click', () => {
      const isVisible = spotifyWidget.style.display !== 'none';
      spotifyWidget.style.display = isVisible ? 'none' : 'block';
      
      if (!isVisible) {
        // If showing widget and not authenticated, start auth process
        if (!spotifyAccessToken) {
          spotifyAuthBtn.style.display = 'block';
          spotifyToggleBtn.style.display = 'none';
        } else {
          spotifyAuthBtn.style.display = 'none';
          spotifyToggleBtn.style.display = 'block';
          startSpotifyUpdates();
        }
      } else {
        stopSpotifyUpdates();
      }
    });
  }

  // Spotify authentication
  if (spotifyAuthBtn) {
    spotifyAuthBtn.addEventListener('click', authenticateSpotify);
  }

  // Toggle widget visibility
  if (spotifyToggleBtn) {
    spotifyToggleBtn.addEventListener('click', () => {
      spotifyWidget.style.display = 'none';
      stopSpotifyUpdates();
    });
  }

  function authenticateSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CONFIG.CLIENT_ID}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SPOTIFY_CONFIG.SCOPES)}&` +
      `show_dialog=true`;
    
    window.open(authUrl, 'spotify-auth', 'width=500,height=600');
  }

  // Handle Spotify authentication callback
  function handleSpotifyCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Exchange code for access token
      exchangeCodeForToken(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  async function exchangeCodeForToken(code) {
    try {
      spotifyAuthBtn.textContent = 'Connecting...';
      
      // Note: This requires a backend server to securely handle the token exchange
      // For demo purposes, we'll show how it would work
      console.log('Code received:', code);
      console.log('You need to implement a backend endpoint to exchange this code for tokens');
      console.log('See implementation notes in the code');
      
      // Mock successful authentication for demo
      setTimeout(() => {
        spotifyAuthBtn.style.display = 'none';
        spotifyToggleBtn.style.display = 'block';
        spotifyTrack.textContent = 'Demo Mode';
        spotifyArtist.textContent = 'Implement backend for full functionality';
        console.log('Spotify demo mode activated');
      }, 1000);
      
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      spotifyAuthBtn.textContent = 'Connection Failed - Retry';
    }
  }

  async function getCurrentlyPlaying() {
    if (!spotifyAccessToken) return null;

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`
        }
      });

      if (response.status === 204) {
        return null; // No track currently playing
      }

      if (response.status === 401) {
        // Token expired, try to refresh
        await refreshSpotifyToken();
        return getCurrentlyPlaying(); // Retry with new token
      }

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching currently playing:', error);
      return null;
    }
  }

  async function refreshSpotifyToken() {
    if (!spotifyRefreshToken) {
      console.log('No refresh token available');
      return false;
    }

    try {
      // This also requires a backend endpoint
      console.log('Token refresh needed - implement backend endpoint');
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  function updateSpotifyDisplay(trackData) {
    if (!trackData || !trackData.item) {
      spotifyTrack.textContent = 'No track playing';
      spotifyArtist.textContent = 'Nothing currently playing';
      spotifyAlbumArt.src = '';
      return;
    }

    const track = trackData.item;
    spotifyTrack.textContent = track.name;
    spotifyArtist.textContent = track.artists.map(artist => artist.name).join(', ');
    
    if (track.album && track.album.images && track.album.images.length > 0) {
      spotifyAlbumArt.src = track.album.images[0].url;
    }
  }

  function startSpotifyUpdates() {
    if (spotifyUpdateInterval) return;

    // Update every 5 seconds
    spotifyUpdateInterval = setInterval(async () => {
      const trackData = await getCurrentlyPlaying();
      updateSpotifyDisplay(trackData);
    }, 5000);

    // Initial update
    getCurrentlyPlaying().then(updateSpotifyDisplay);
  }

  function stopSpotifyUpdates() {
    if (spotifyUpdateInterval) {
      clearInterval(spotifyUpdateInterval);
      spotifyUpdateInterval = null;
    }
  }

  // Check for authentication callback on page load
  handleSpotifyCallback();

  // ==================== END SPOTIFY INTEGRATION ====================
  
  // ==================== SIMPLE TOURNAMENT HANDLERS ====================
  
  // Add simple tournament button handlers
  setTimeout(() => {
    console.log('Setting up simple tournament handlers');
    
    // Random Slots button
    const randomBtn = document.getElementById('fill-random-slots');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        console.log('Random slots clicked');
        const playerInputs = document.querySelectorAll('.participant-input');
        const slotInputs = document.querySelectorAll('.slot-input');
        
        const names = ['ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 'BonusHunter', 'RollMaster'];
        const slots = ['Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus', 'The Dog House', 'Money Train 2', 'Razor Shark', 'Jammin Jars'];
        
        playerInputs.forEach((input, i) => {
          if (i < names.length) input.value = names[i];
        });
        
        slotInputs.forEach((input, i) => {
          if (i < slots.length) input.value = slots[i];
        });
        
        console.log('Filled', playerInputs.length, 'player inputs and', slotInputs.length, 'slot inputs');
      });
    }
    
    // Debug Generate button
    const debugBtn = document.getElementById('debug-generate-inputs');
    if (debugBtn) {
      debugBtn.addEventListener('click', () => {
        console.log('Debug generate clicked');
        if (window.tournamentManager) {
          window.tournamentManager.generateParticipantInputs();
        } else {
          console.log('No tournament manager found, generating manually');
          const grid = document.getElementById('participants-grid');
          if (grid) {
            grid.innerHTML = '';
            const size = 8;
            for (let i = 0; i < size; i++) {
              const participantEntry = document.createElement('div');
              participantEntry.className = 'participant-entry';
              participantEntry.innerHTML = `
                <div class="participant-number">Player ${i + 1}</div>
                <input type="text" class="participant-input" placeholder="Enter player name" data-index="${i}">
                <div class="slot-input-container">
                  <input type="text" class="slot-input" placeholder="Enter slot name" data-index="${i}">
                </div>
              `;
              grid.appendChild(participantEntry);
            }
            console.log('Manually generated', size, 'participant inputs');
          }
        }
      });
      console.log('Debug button handler added');
    } else {
      console.log('Debug button not found');
    }
    
    // Clear All button
    const clearBtn = document.getElementById('clear-all-participants');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        console.log('Clear all clicked');
        document.querySelectorAll('.participant-input, .slot-input').forEach(input => {
          input.value = '';
        });
      });
    }
    
    // Validate Setup button
    const validateBtn = document.getElementById('validate-tournament-btn');
    if (validateBtn) {
      validateBtn.addEventListener('click', () => {
        console.log('Validate setup clicked');
        
        const playerInputs = document.querySelectorAll('.participant-input');
        const slotInputs = document.querySelectorAll('.slot-input');
        
        let validParticipants = 0;
        const players = [];
        const slots = [];
        const issues = [];
        
        // Check each participant entry
        for (let i = 0; i < playerInputs.length; i++) {
          const playerName = playerInputs[i].value.trim();
          const slotName = slotInputs[i].value.trim();
          
          if (playerName && slotName) {
            validParticipants++;
            players.push(playerName.toLowerCase());
            slots.push(slotName.toLowerCase());
          }
        }
        
        // Validation checks
        if (validParticipants < 2) {
          issues.push('Need at least 2 participants');
        }
        
        // Check for duplicate player names
        const duplicatePlayers = players.filter((name, index) => players.indexOf(name) !== index);
        if (duplicatePlayers.length > 0) {
          issues.push('Duplicate player names detected');
        }
        
        // Check for duplicate slots
        const duplicateSlots = slots.filter((slot, index) => slots.indexOf(slot) !== index);
        if (duplicateSlots.length > 0) {
          issues.push('Duplicate slot names detected');
        }
        
        // Show validation result
        const originalContent = validateBtn.innerHTML;
        const originalStyle = validateBtn.style.background;
        
        if (issues.length === 0) {
          validateBtn.innerHTML = `✅ Setup Valid! (${validParticipants} participants)`;
          validateBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
          
          // Enable start button
          const startBtn = document.getElementById('start-tournament-btn');
          if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
          }
        } else {
          validateBtn.innerHTML = `❌ Issues: ${issues.join(', ')}`;
          validateBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
          validateBtn.innerHTML = originalContent;
          validateBtn.style.background = originalStyle;
        }, 3000);
      });
      console.log('Validate button handler added');
    }
    
    // Start Tournament button
    const startBtn = document.getElementById('start-tournament-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('Start tournament clicked');
        
        const playerInputs = document.querySelectorAll('.participant-input');
        const slotInputs = document.querySelectorAll('.slot-input');
        
        let validParticipants = 0;
        const participants = [];
        
        // Collect valid participants
        for (let i = 0; i < playerInputs.length; i++) {
          const playerName = playerInputs[i].value.trim();
          const slotName = slotInputs[i].value.trim();
          
          if (playerName && slotName) {
            validParticipants++;
            participants.push({
              player: playerName,
              slot: slotName,
              id: i + 1
            });
          }
        }
        
        if (validParticipants < 2) {
          const originalContent = startBtn.innerHTML;
          const originalStyle = startBtn.style.background;
          
          startBtn.innerHTML = '❌ Need at least 2 participants!';
          startBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
          
          setTimeout(() => {
            startBtn.innerHTML = originalContent;
            startBtn.style.background = originalStyle;
          }, 3000);
          return;
        }
        
        // Show success and tournament bracket info
        const originalContent = startBtn.innerHTML;
        const originalStyle = startBtn.style.background;
        
        startBtn.innerHTML = `🏆 Tournament Started! (${validParticipants} players)`;
        startBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
        
        console.log('Tournament started with participants:', participants);
        
        // Update participant count
        const countDisplay = document.getElementById('participant-count');
        if (countDisplay) {
          countDisplay.textContent = `(${validParticipants}/${playerInputs.length})`;
        }
        
        // Show tournament bracket in right sidebar
        showTournamentBracket(participants);
        
        // Show tournament control panel in center
        showTournamentControlPanel(participants);
        
        // Reset after 3 seconds
        setTimeout(() => {
          startBtn.innerHTML = originalContent;
          startBtn.style.background = originalStyle;
        }, 3000);
      });
      console.log('Start tournament button handler added');
    }
    
    console.log('Tournament handlers setup complete');
    
  }, 1000);
  
  // Function to show tournament bracket in right sidebar
  function showTournamentBracket(participants) {
    console.log('Showing tournament bracket for', participants.length, 'participants');
    
    // Make sure info panel is visible
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
      infoPanel.classList.add('info-panel--visible');
    }
    
    // Show tournament bracket section
    const bracket = document.getElementById('tournament-bracket');
    if (bracket) {
      bracket.style.display = 'block';
      
      // Hide other info sections during tournament
      const bonusHuntResults = document.getElementById('bonus-hunt-results');
      const bonusList = document.querySelector('.info-section.bonus-list');
      const discordSection = document.querySelector('.info-section.discord');
      const moneyRowMain = document.querySelector('.money-row-main');
      
      if (bonusHuntResults) bonusHuntResults.style.display = 'none';
      if (bonusList) bonusList.style.display = 'none';
      if (discordSection) discordSection.style.display = 'none';
      if (moneyRowMain) moneyRowMain.style.display = 'none';
      
      // Generate bracket content
      generateBracketDisplay(participants);
    } else {
      console.error('Tournament bracket element not found');
    }
  }
  
  // Function to generate bracket display
  function generateBracketDisplay(participants) {
    const bracketContent = document.getElementById('tournament-bracket-content');
    if (!bracketContent) {
      console.error('Tournament bracket content element not found');
      return;
    }
    
    // Shuffle participants for randomness
    const shuffledParticipants = [...participants].sort(() => 0.5 - Math.random());
    
    // Generate first round matches
    const matches = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
      if (i + 1 < shuffledParticipants.length) {
        matches.push({
          id: matches.length + 1,
          player1: shuffledParticipants[i],
          player2: shuffledParticipants[i + 1],
          winner: null,
          completed: false
        });
      } else {
        // Bye - participant advances automatically
        matches.push({
          id: matches.length + 1,
          player1: shuffledParticipants[i],
          player2: null,
          winner: shuffledParticipants[i],
          completed: true,
          bye: true
        });
      }
    }
    
    // Determine round name
    let roundName = 'First Round';
    if (matches.length === 1) roundName = 'Final';
    else if (matches.length === 2) roundName = 'Semi-Finals';
    else if (matches.length === 4) roundName = 'Quarter-Finals';
    else if (matches.length === 8) roundName = 'Round of 16';
    
    // Function to get slot image from database
    function getSlotImage(slotName) {
      if (typeof slotDatabase !== 'undefined' && slotDatabase.length > 0) {
        const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
        return slot ? slot.image : 'https://i.imgur.com/8E3ucNx.png';
      }
      return 'https://i.imgur.com/8E3ucNx.png';
    }

    // Generate HTML for bracket - horizontal layout with images
    let bracketHTML = `
      <div class="bracket-round">
        <h3 class="bracket-round-title">${roundName}</h3>
        <div class="bracket-matches-horizontal">
    `;
    
    matches.forEach(match => {
      if (match.bye) {
        bracketHTML += `
          <div class="bracket-match-horizontal bye-match">
            <div class="match-participant">
              <img src="${getSlotImage(match.player1.slot)}" alt="${match.player1.slot}" class="slot-image">
              <div class="participant-info">
                <span class="participant-name">${match.player1.player}</span>
                <span class="participant-slot">${match.player1.slot}</span>
              </div>
            </div>
            <div class="bye-indicator">BYE</div>
          </div>
        `;
      } else {
        bracketHTML += `
          <div class="bracket-match-horizontal" data-match-id="${match.id}">
            <div class="match-participant">
              <img src="${getSlotImage(match.player1.slot)}" alt="${match.player1.slot}" class="slot-image">
              <div class="participant-info">
                <span class="participant-name">${match.player1.player}</span>
                <span class="participant-slot">${match.player1.slot}</span>
              </div>
            </div>
            <div class="vs-divider">
              <span class="vs-text">VS</span>
            </div>
            <div class="match-participant">
              <img src="${getSlotImage(match.player2.slot)}" alt="${match.player2.slot}" class="slot-image">
              <div class="participant-info">
                <span class="participant-name">${match.player2.player}</span>
                <span class="participant-slot">${match.player2.slot}</span>
              </div>
            </div>
            <div class="match-status-horizontal">
              <span class="status-text">Pending</span>
            </div>
          </div>
        `;
      }
    });
    
    bracketHTML += `
        </div>
      </div>
      <div class="tournament-info">
        <div class="tournament-stat">
          <span class="stat-label">Participants:</span>
          <span class="stat-value">${participants.length}</span>
        </div>
        <div class="tournament-stat">
          <span class="stat-label">Format:</span>
          <span class="stat-value">Single Elimination</span>
        </div>
        <div class="tournament-stat">
          <span class="stat-label">Status:</span>
          <span class="stat-value">In Progress</span>
        </div>
      </div>
    `;
    
    bracketContent.innerHTML = bracketHTML;
    console.log('Tournament bracket displayed with', matches.length, 'matches');
  }
  
  // Function to show tournament control panel
  function showTournamentControlPanel(participants) {
    console.log('Showing tournament control panel');
    
    // Hide tournament setup panel
    const tournamentPanel = document.getElementById('tournament-panel');
    if (tournamentPanel) {
      tournamentPanel.style.display = 'none';
    }
    
    // Show tournament control panel
    const controlPanel = document.getElementById('tournament-control-panel');
    if (controlPanel) {
      controlPanel.style.display = 'flex';
      
      // Set up the first match
      setupFirstMatch(participants);
    } else {
      console.error('Tournament control panel not found');
    }
  }
  
  // Function to set up the first match display
  function setupFirstMatch(participants) {
    // Shuffle participants for first match
    const shuffledParticipants = [...participants].sort(() => 0.5 - Math.random());
    const firstMatch = {
      participant1: shuffledParticipants[0],
      participant2: shuffledParticipants[1]
    };
    
    // Update match title
    const matchTitle = document.getElementById('match-title');
    if (matchTitle) {
      matchTitle.textContent = 'Quarter-Final Match 1';
    }
    
    // Update status
    const statusPhase = document.getElementById('status-phase');
    const statusProgress = document.getElementById('status-progress');
    if (statusPhase) statusPhase.textContent = 'Quarter-Finals';
    if (statusProgress) statusProgress.textContent = 'Match 1 of 4';
    
    // Update contestant 1
    const contestant1Name = document.getElementById('contestant-1-name');
    const contestant1Slot = document.getElementById('contestant-1-slot');
    const contestant1Img = document.getElementById('contestant-1-img');
    
    if (contestant1Name) contestant1Name.textContent = firstMatch.participant1.player;
    if (contestant1Slot) contestant1Slot.textContent = firstMatch.participant1.slot;
    if (contestant1Img) {
      // Set a default slot image
      contestant1Img.src = 'https://i.imgur.com/8E3ucNx.png';
      contestant1Img.alt = firstMatch.participant1.slot;
    }
    
    // Update contestant 2
    const contestant2Name = document.getElementById('contestant-2-name');
    const contestant2Slot = document.getElementById('contestant-2-slot');
    const contestant2Img = document.getElementById('contestant-2-img');
    
    if (contestant2Name) contestant2Name.textContent = firstMatch.participant2.player;
    if (contestant2Slot) contestant2Slot.textContent = firstMatch.participant2.slot;
    if (contestant2Img) {
      // Set a default slot image
      contestant2Img.src = 'https://i.imgur.com/8E3ucNx.png';
      contestant2Img.alt = firstMatch.participant2.slot;
    }
    
    // Reset bet and payout inputs
    const contestant1Bet = document.getElementById('contestant-1-bet');
    const contestant1Payout = document.getElementById('contestant-1-payout');
    const contestant2Bet = document.getElementById('contestant-2-bet');
    const contestant2Payout = document.getElementById('contestant-2-payout');
    
    if (contestant1Bet) contestant1Bet.value = '';
    if (contestant1Payout) contestant1Payout.value = '';
    if (contestant2Bet) contestant2Bet.value = '';
    if (contestant2Payout) contestant2Payout.value = '';
    
    // Reset multipliers
    const contestant1Multiplier = document.getElementById('contestant-1-multiplier');
    const contestant2Multiplier = document.getElementById('contestant-2-multiplier');
    
    if (contestant1Multiplier) contestant1Multiplier.textContent = '0.00x';
    if (contestant2Multiplier) contestant2Multiplier.textContent = '0.00x';
    
    console.log('First match set up:', firstMatch.participant1.player, 'vs', firstMatch.participant2.player);
  }
  
  // ==================== END SIMPLE TOURNAMENT HANDLERS ====================



});

// SIMPLE SEASONAL THEME INTEGRATION
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎄 Setting up Christmas theme button...');
  
  // Add Christmas theme button listener
  setTimeout(() => {
    const christmasBtn = document.querySelector('[data-theme="christmas-candy-cane"]');
    if (christmasBtn) {
      christmasBtn.addEventListener('click', () => {
        console.log('🎄 Christmas button clicked!');
        activateChristmasTheme();
        
        // Update button state
        document.querySelectorAll('.theme-preset').forEach(btn => btn.classList.remove('active'));
        christmasBtn.classList.add('active');
      });
      console.log('🎄 Christmas button listener added!');
    } else {
      console.log('❌ Christmas button not found');
    }
  }, 1000);
});

// Auto-restore Christmas theme on load
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme === 'christmas-candy-cane') {
    console.log('🎄 Auto-restoring Christmas theme');
    setTimeout(() => activateChristmasTheme(), 500);
  }
});

// Make functions global
window.activateChristmasTheme = activateChristmasTheme;
window.removeChristmasTheme = removeChristmasTheme;

console.log('🎄 SIMPLE Christmas Theme System Loaded!');

// Add working test button
setTimeout(() => {
  const testBtn = document.createElement('button');
  testBtn.textContent = '🎄 CHRISTMAS NOW!';
  testBtn.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 99999 !important;
    background: #dc2626 !important;
    color: white !important;
    padding: 12px 20px !important;
    border: 2px solid white !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    font-weight: bold !important;
    font-size: 14px !important;
  `;
  testBtn.onclick = () => {
    console.log('🎄 TEST BUTTON CLICKED!');
    activateChristmasTheme();
    testBtn.textContent = '🎄 ACTIVATED!';
    setTimeout(() => testBtn.textContent = '🎄 CHRISTMAS NOW!', 2000);
  };
  document.body.appendChild(testBtn);
  console.log('🎄 Test button added successfully!');
}, 500);
