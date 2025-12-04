// ==================== TOURNAMENT MODULE ====================

class TournamentManager {
  constructor() {
    this.state = {
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
    
    this.init();
  }

  init() {
    console.log('Tournament Manager initialized');
    this.setupEventListeners();
  }

  setupEventListeners() {
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
    
    // Debug button
    document.getElementById('debug-generate-inputs')?.addEventListener('click', () => {
      console.log('Debug generate button clicked');
      this.generateParticipantInputs();
    });

    // Tournament actions
    document.getElementById('validate-tournament-btn')?.addEventListener('click', () => this.validateSetup());
    document.getElementById('start-tournament-btn')?.addEventListener('click', () => this.startTournament());
    document.getElementById('save-template-btn')?.addEventListener('click', () => this.saveTemplate());
  }

  generateParticipantInputs() {
    console.log('Generating participant inputs for size:', this.state.settings.size);
    const grid = document.getElementById('participants-grid');
    if (!grid) {
      console.error('participants-grid element not found');
      return;
    }

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

      // Add event listeners
      const playerInput = participantEntry.querySelector('.participant-input');
      const slotInput = participantEntry.querySelector('.slot-input');

      playerInput.addEventListener('input', () => this.updateParticipantCount());
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

  onSlotInputChange(event, index) {
    const input = event.target;
    const query = input.value.trim().toLowerCase();
    const dropdown = input.parentElement.querySelector('.slot-suggestion-dropdown');

    if (query.length < 2) {
      dropdown.style.display = 'none';
      return;
    }

    // Get slot suggestions
    let suggestions = [];
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      suggestions = window.slotDatabase
        .filter(slot => slot.name.toLowerCase().includes(query))
        .slice(0, 5);
    } else {
      // Fallback suggestions
      const fallbackSlots = [
        { name: 'Book of Dead', provider: 'Play\'n GO' },
        { name: 'Starburst', provider: 'NetEnt' },
        { name: 'Sweet Bonanza', provider: 'Pragmatic Play' }
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

      dropdown.querySelectorAll('.slot-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          input.value = item.dataset.slotName;
          dropdown.style.display = 'none';
          this.updateParticipantCount();
        });
      });

      dropdown.classList.remove('display-none');
    } else {
      dropdown.style.display = 'none';
    }
  }

  updateParticipantCount() {
    const participants = this.getValidParticipants();
    const countDisplay = document.getElementById('participant-count');
    if (countDisplay) {
      countDisplay.textContent = `(${participants.length}/${this.state.settings.size})`;
    }

    const startBtn = document.getElementById('start-tournament-btn');
    if (startBtn) {
      const canStart = participants.length >= 2;
      startBtn.disabled = !canStart;
      if (canStart) {
        startBtn.classList.remove('opacity-50');
        startBtn.classList.add('opacity-100');
      } else {
        startBtn.classList.remove('opacity-100');
        startBtn.classList.add('opacity-50');
      }
    }
  }

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

  fillRandomPlayersAndSlots() {
    const playerInputs = document.querySelectorAll('.participant-input');
    const slotInputs = document.querySelectorAll('.slot-input');
    
    const randomNames = [
      'ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 
      'BonusHunter', 'RollMaster', 'WildCard', 'MegaSpin', 'JackpotJoe', 'LuckyLuke',
      'SpinDoctor', 'SlotBeast', 'CasinoAce', 'MegaWin', 'BonusKing', 'SpinMaster'
    ];
    
    let availableSlots = [];
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      availableSlots = window.slotDatabase.map(slot => slot.name);
    } else {
      availableSlots = [
        'Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus', 
        'The Dog House', 'Money Train 2', 'Razor Shark', 'Jammin Jars'
      ];
    }

    const shuffledNames = [...randomNames].sort(() => 0.5 - Math.random());
    const shuffledSlots = [...availableSlots].sort(() => 0.5 - Math.random());
    
    playerInputs.forEach((input, index) => {
      if (index < shuffledNames.length) {
        input.value = shuffledNames[index];
        input.dispatchEvent(new Event('input'));
      }
    });

    slotInputs.forEach((input, index) => {
      if (index < shuffledSlots.length) {
        input.value = shuffledSlots[index];
        input.dispatchEvent(new Event('input'));
      }
    });

    this.showFeedback('fill-random-slots', 'Random players and slots filled!', 'success');
  }

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

  importParticipants() {
    const demoPlayers = ['ProGamer', 'SlotMaster', 'LuckyStreamer', 'BigWinner', 'CasinoKing', 'SpinLord', 'BonusHunter', 'RollMaster'];
    const demoSlots = ['Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus', 'The Dog House', 'Money Train 2', 'Razor Shark', 'Jammin Jars'];

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
      this.showFeedback('validate-tournament-btn', `✅ Setup Valid! (${participants.length} participants)`, 'success');
      document.getElementById('start-tournament-btn').disabled = false;
    } else {
      this.showFeedback('validate-tournament-btn', `❌ Issues: ${issues.join(', ')}`, 'error');
    }
  }

  startTournament() {
    const participants = this.getValidParticipants();
    
    if (participants.length < 2) {
      this.showFeedback('start-tournament-btn', '❌ Need at least 2 participants!', 'error');
      return;
    }

    // Initialize tournament state
    this.state.isActive = true;
    this.state.participants = [...participants];

    this.showFeedback('start-tournament-btn', `🏆 Tournament Started! (${participants.length} players)`, 'success');
    
    // Create tournament matches in the exact order they'll be displayed
    this.createTournamentMatches(participants);
    
    // Display bracket and control using the same ordered data
    this.displayTournamentBracket();
    this.displayTournamentControl();
  }

  displayTournamentBracket() {
    if (!this.state.brackets?.length) {
      console.error('No tournament matches to display');
      return;
    }
    
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
      infoPanel.classList.add('info-panel--visible');
    }
    
    const bracket = document.getElementById('tournament-bracket');
    const leftPanel = document.getElementById('tournament-left-panel');
    
    if (bracket && leftPanel) {
      bracket.classList.remove('display-none');
      leftPanel.classList.add('display-flex');
      
      // Restore saved position preference
      const savedPosition = localStorage.getItem('tournamentBracketPosition') || 'center-right';
      leftPanel.classList.remove('pos-upper-right', 'pos-lower-right', 'pos-upper-left', 'pos-lower-left', 'pos-center-right');
      leftPanel.classList.add(`pos-${savedPosition}`);
      
      // Make panels draggable
      if (window.dragHandler) {
        window.dragHandler.makeDraggable(leftPanel);
        window.dragHandler.makeDraggable(bracket);
      }
      
      this.hideOtherSections();
      this.renderBracketHTML();
    }
  }

  hideOtherSections() {
    const bonusHuntResults = document.getElementById('bonus-hunt-results');
    const bonusList = document.querySelector('.info-section.bonus-list');
    const discordSection = document.querySelector('.info-section.discord');
    const moneyRowMain = document.querySelector('.money-row-main');
    const statsBar = document.querySelector('.bh-stats-bar');
    const infoPanel = document.querySelector('.info-panel');
    
    if (bonusHuntResults) bonusHuntResults.classList.add('display-none');
    if (bonusList) bonusList.classList.add('display-none');
    if (discordSection) discordSection.classList.add('display-none');
    if (moneyRowMain) moneyRowMain.classList.add('display-none');
    if (statsBar) statsBar.classList.add('display-none');
    
    // Hide info panel during tournament
    if (infoPanel) {
      infoPanel.classList.remove('info-panel--visible');
    }
  }

  renderBracketHTML() {
    const bracketContent = document.getElementById('tournament-bracket-content');
    if (!bracketContent) {
      console.error('Tournament bracket content element not found');
      return;
    }
    
    const matches = this.state.brackets;
    const participantCount = matches.length * 2;
    
    let roundName = this.state.currentPhase || 'Quarter-Finals';
    if (matches.length === 1) roundName = 'Final';
    else if (matches.length === 2) roundName = 'Semi-Finals';
    else if (matches.length === 4) roundName = 'Quarter-Finals';

    let bracketHTML = `
      <div class="bracket-round">
        <h3 class="bracket-round-title">${roundName}</h3>
        <div class="bracket-matches-horizontal">
    `;
    
    // Sort matches by displayOrder to ensure bracket shows same order as control
    const sortedMatches = [...matches].sort((a, b) => a.displayOrder - b.displayOrder);
    
    sortedMatches.forEach(match => {
      bracketHTML += `
        <div class="bracket-match-horizontal" data-match-id="${match.id}">
          <div class="slot-container">
            <img src="${this.getSlotImage(match.player1.slot)}" alt="${match.player1.slot}" class="slot-image" data-participant="1">
            <div class="player-name-pill">${match.player1.player}</div>
          </div>
          <div class="vs-divider">
            <span class="vs-text">VS</span>
          </div>
          <div class="slot-container">
            <img src="${this.getSlotImage(match.player2.slot)}" alt="${match.player2.slot}" class="slot-image" data-participant="2">
            <div class="player-name-pill">${match.player2.player}</div>
          </div>
        </div>
      `;
    });
    
    bracketHTML += `
        </div>
      </div>
      <div class="tournament-info">
        <div class="tournament-stat">
          <span class="stat-label">Participants:</span>
          <span class="stat-value">${participantCount}</span>
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
    console.log('Bracket rendered with', sortedMatches.length, 'matches');
    
    // Apply theme-based styling to newly rendered bracket cards
    setTimeout(() => {
      if (window.refreshTournamentBracketStyling) {
        window.refreshTournamentBracketStyling();
      }
    }, 50);
  }

  displayTournamentControl() {
    if (!this.state.brackets?.length) {
      console.error('No tournament matches to control');
      return;
    }
    
    const tournamentPanel = document.getElementById('tournament-panel');
    if (tournamentPanel) {
      tournamentPanel.style.display = 'none';
    }
    
    const controlPanel = document.getElementById('tournament-control-panel');
    if (controlPanel) {
      controlPanel.style.display = 'flex';
      this.state.currentMatchIndex = 0;
      this.displayCurrentMatch();
      this.setupTournamentControlListeners();
    }
  }

  getSlotImage(slotName) {
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      const slot = window.slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
      return slot ? slot.image : 'https://i.imgur.com/8E3ucNx.png';
    }
    return 'https://i.imgur.com/8E3ucNx.png';
  }

  displayCurrentMatch() {
    if (!this.state.brackets?.length) {
      console.error('No matches available');
      return;
    }

    const currentIndex = this.state.currentMatchIndex || 0;
    const sortedMatches = [...this.state.brackets].sort((a, b) => a.displayOrder - b.displayOrder);
    const currentMatch = sortedMatches[currentIndex];
    
    if (!currentMatch) {
      console.error('Current match not found');
      return;
    }

    // Highlight active match in bracket
    this.highlightActiveMatch(currentMatch.id);

    // Update match title and progress based on current phase
    const matchTitle = document.getElementById('match-title');
    const statusPhase = document.getElementById('status-phase');
    const statusProgress = document.getElementById('status-progress');
    
    const currentPhase = this.state.currentPhase || 'Quarter-Finals';
    let matchLabel = '';
    
    if (currentPhase === 'Final') {
      matchLabel = 'Final Match';
    } else if (currentPhase === 'Semi-Finals') {
      matchLabel = `Semi-Final Match ${currentIndex + 1}`;
    } else {
      matchLabel = `Quarter-Final Match ${currentIndex + 1}`;
    }
    
    if (matchTitle) matchTitle.textContent = matchLabel;
    if (statusPhase) statusPhase.textContent = currentPhase;
    if (statusProgress) statusProgress.textContent = `Match ${currentIndex + 1} of ${this.state.brackets.length}`;

    // Update contestants
    this.updateContestantDisplay(currentMatch);
    
    // Update advance button text based on phase
    this.updateAdvanceButtonText();
    
    console.log(`Displaying match ${currentIndex + 1}: ${currentMatch.player1.player} vs ${currentMatch.player2.player}`);
  }

  updateAdvanceButtonText() {
    const advanceBtn = document.getElementById('advance-phase-btn');
    if (!advanceBtn) return;

    const currentPhase = this.state.currentPhase || 'Quarter-Finals';
    const currentIndex = this.state.currentMatchIndex || 0;
    const hasMoreMatches = currentIndex < this.state.brackets.length - 1;

    if (currentPhase === 'Final') {
      advanceBtn.textContent = '🏆 Tournament Complete!';
      advanceBtn.classList.add('display-none'); // Hide for final since it auto-completes
    } else if (hasMoreMatches) {
      advanceBtn.textContent = '➡️ Next Match';
    } else if (currentPhase === 'Semi-Finals') {
      advanceBtn.textContent = '🥇 Advance to Final';
    } else {
      advanceBtn.textContent = '⬆️ Advance Phase';
    }
  }
  
  createTournamentMatches(participants) {
    // Clear existing tournament data
    this.state.brackets = [];
    this.state.currentMatchIndex = 0;
    this.state.currentPhase = 'Quarter-Finals';
    this.state.tournamentComplete = false;
    
    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      console.error('No valid participants provided');
      return;
    }
    
    // Filter valid participants
    const validParticipants = participants.filter(p => p && p.player && p.slot);
    if (validParticipants.length < 2) {
      console.error('Need at least 2 valid participants');
      return;
    }
    
    // Simple shuffle - consistent each time for same input
    const shuffled = [...validParticipants];
    shuffled.sort(() => 0.5 - Math.random());
    
    // Create matches in exact display order
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        this.state.brackets.push({
          id: i / 2 + 1,
          player1: shuffled[i],
          player2: shuffled[i + 1],
          winner: null,
          completed: false,
          displayOrder: i / 2
        });
      }
    }
    
    console.log('Created', this.state.brackets.length, 'tournament matches');
  }
  
  updateContestantDisplay(match) {
    // Update contestants
    const contestant1Name = document.getElementById('contestant-1-name');
    const contestant1Slot = document.getElementById('contestant-1-slot');
    const contestant1Img = document.getElementById('contestant-1-img');
    
    if (contestant1Name) contestant1Name.textContent = match.player1.player;
    if (contestant1Slot) contestant1Slot.textContent = match.player1.slot;
    if (contestant1Img) {
      contestant1Img.src = this.getSlotImage(match.player1.slot);
      contestant1Img.alt = match.player1.slot;
    }
    
    const contestant2Name = document.getElementById('contestant-2-name');
    const contestant2Slot = document.getElementById('contestant-2-slot');
    const contestant2Img = document.getElementById('contestant-2-img');
    
    if (contestant2Name) contestant2Name.textContent = match.player2.player;
    if (contestant2Slot) contestant2Slot.textContent = match.player2.slot;
    if (contestant2Img) {
      contestant2Img.src = this.getSlotImage(match.player2.slot);
      contestant2Img.alt = match.player2.slot;
    }
    
    // Reset inputs
    ['contestant-1-bet', 'contestant-1-payout', 'contestant-2-bet', 'contestant-2-payout'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.value = '';
    });
    
    ['contestant-1-multiplier', 'contestant-2-multiplier'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = '0.00x';
    });
  }

  saveTemplate() {
    const participants = this.getValidParticipants();
    const template = {
      settings: this.state.settings,
      participants: participants
    };

    localStorage.setItem('tournament-template', JSON.stringify(template));
    this.showFeedback('save-template-btn', 'Template saved!', 'success');
  }

  setupTournamentControlListeners() {
    // Determine Winner button
    const determineWinnerBtn = document.getElementById('determine-winner-btn');
    if (determineWinnerBtn) {
      determineWinnerBtn.addEventListener('click', () => this.determineWinner());
    }

    // Reset Match button
    const resetMatchBtn = document.getElementById('reset-match-btn');
    if (resetMatchBtn) {
      resetMatchBtn.addEventListener('click', () => this.resetCurrentMatch());
    }

    // Advance Phase button
    const advancePhaseBtn = document.getElementById('advance-phase-btn');
    if (advancePhaseBtn) {
      advancePhaseBtn.addEventListener('click', () => this.advanceToNextPhase());
    }

    // End Tournament button
    const endTournamentBtn = document.getElementById('end-tournament-btn');
    if (endTournamentBtn) {
      endTournamentBtn.addEventListener('click', () => this.endTournament());
    }

    // Previous Match button
    const prevMatchBtn = document.getElementById('prev-match-btn');
    if (prevMatchBtn) {
      prevMatchBtn.addEventListener('click', () => this.goToPreviousMatch());
    }

    // Next Match button
    const nextMatchBtn = document.getElementById('next-match-btn');
    if (nextMatchBtn) {
      nextMatchBtn.addEventListener('click', () => this.goToNextMatch());
    }

    // Multiplier calculation on bet/payout input
    ['contestant-1-bet', 'contestant-1-payout', 'contestant-2-bet', 'contestant-2-payout'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.calculateMultipliers());
      }
    });
  }

  determineWinner() {
    const currentIndex = this.state.currentMatchIndex || 0;
    if (!this.state.brackets || currentIndex >= this.state.brackets.length) {
      return;
    }
    
    const contestant1Bet = parseFloat(document.getElementById('contestant-1-bet')?.value) || 1;
    const contestant2Bet = parseFloat(document.getElementById('contestant-2-bet')?.value) || 1;
    const contestant1Payout = parseFloat(document.getElementById('contestant-1-payout')?.value) || 0;
    const contestant2Payout = parseFloat(document.getElementById('contestant-2-payout')?.value) || 0;

    if (contestant1Payout === 0 && contestant2Payout === 0) {
      alert('Please enter payout amounts to determine winner');
      return;
    }

    const sortedMatches = [...this.state.brackets].sort((a, b) => a.displayOrder - b.displayOrder);
    const currentMatch = sortedMatches[currentIndex];
    
    // Calculate multipliers
    const multiplier1 = contestant1Payout / contestant1Bet;
    const multiplier2 = contestant2Payout / contestant2Bet;
    
    // Determine winner based on multiplier (X amount), not just payout
    const winner1 = multiplier1 > multiplier2;
    const winner2 = multiplier2 > multiplier1;

    // Update match data
    if (winner1) {
      currentMatch.winner = currentMatch.player1;
    } else if (winner2) {
      currentMatch.winner = currentMatch.player2;
    } else {
      currentMatch.winner = 'tie';
    }
    currentMatch.completed = true;

    // Show winner indicators in control panel
    const indicator1 = document.getElementById('winner-indicator-1');
    const indicator2 = document.getElementById('winner-indicator-2');
    const card1 = document.getElementById('contestant-1-card');
    const card2 = document.getElementById('contestant-2-card');

    if (indicator1 && indicator2 && card1 && card2) {
      if (winner1) {
        indicator1.style.display = 'flex';
        indicator2.style.display = 'none';
        card1.classList.add('winner');
        card2.classList.remove('winner');
      } else if (winner2) {
        indicator2.style.display = 'flex';
        indicator1.style.display = 'none';
        card2.classList.add('winner');
        card1.classList.remove('winner');
      } else {
        indicator1.style.display = 'flex';
        indicator2.style.display = 'flex';
        card1.classList.add('winner');
        card2.classList.add('winner');
      }
    }

    // Store multipliers (already calculated above)
    currentMatch.multiplier1 = multiplier1.toFixed(2);
    currentMatch.multiplier2 = multiplier2.toFixed(2);

    // Highlight winner in bracket
    this.highlightWinnerInBracket(currentIndex, currentMatch.winner);
    
    // Display multipliers in bracket
    this.displayMultipliersInBracket(currentIndex, currentMatch.multiplier1, currentMatch.multiplier2);

    // Check if this is the Final Match (tournament complete)
    if (this.state.brackets.length === 1 && currentMatch.completed) {
      // This is the final match - tournament is complete!
      setTimeout(() => {
        this.completeTournament(currentMatch.winner);
      }, 1500); // Small delay to show the winner first
      return;
    }

    // Enable advance button for other phases
    const advanceBtn = document.getElementById('advance-phase-btn');
    if (advanceBtn) {
      advanceBtn.disabled = false;
    }
  }

  resetCurrentMatch() {
    // Reset all inputs
    ['contestant-1-bet', 'contestant-1-payout', 'contestant-2-bet', 'contestant-2-payout'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.value = '';
    });

    // Reset multipliers
    ['contestant-1-multiplier', 'contestant-2-multiplier'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = '0.00x';
    });

    // Hide winner indicators
    const indicator1 = document.getElementById('winner-indicator-1');
    const indicator2 = document.getElementById('winner-indicator-2');
    const card1 = document.getElementById('contestant-1-card');
    const card2 = document.getElementById('contestant-2-card');

    if (indicator1) indicator1.style.display = 'none';
    if (indicator2) indicator2.style.display = 'none';
    if (card1) card1.classList.remove('winner');
    if (card2) card2.classList.remove('winner');

    // Disable advance button
    const advanceBtn = document.getElementById('advance-phase-btn');
    if (advanceBtn) {
      advanceBtn.disabled = true;
    }
  }

  calculateMultipliers() {
    // Calculate multiplier for contestant 1
    const bet1 = parseFloat(document.getElementById('contestant-1-bet')?.value) || 0;
    const payout1 = parseFloat(document.getElementById('contestant-1-payout')?.value) || 0;
    const multiplier1 = bet1 > 0 ? (payout1 / bet1).toFixed(2) : '0.00';
    
    const multiplierElement1 = document.getElementById('contestant-1-multiplier');
    if (multiplierElement1) {
      multiplierElement1.textContent = `${multiplier1}x`;
    }

    // Calculate multiplier for contestant 2
    const bet2 = parseFloat(document.getElementById('contestant-2-bet')?.value) || 0;
    const payout2 = parseFloat(document.getElementById('contestant-2-payout')?.value) || 0;
    const multiplier2 = bet2 > 0 ? (payout2 / bet2).toFixed(2) : '0.00';
    
    const multiplierElement2 = document.getElementById('contestant-2-multiplier');
    if (multiplierElement2) {
      multiplierElement2.textContent = `${multiplier2}x`;
    }
  }

  highlightWinnerInBracket(matchIndex, winner) {
    const sortedMatches = [...this.state.brackets].sort((a, b) => a.displayOrder - b.displayOrder);
    const currentMatch = sortedMatches[matchIndex];
    
    if (!currentMatch) return;
    
    const bracketMatch = document.querySelector(`[data-match-id="${currentMatch.id}"]`);
    if (!bracketMatch) return;
    
    const slotImages = bracketMatch.querySelectorAll('.slot-image');
    if (slotImages.length !== 2) return;
    
    // Remove previous highlighting
    slotImages.forEach(img => {
      img.classList.remove('winner', 'loser');
    });
    
    if (winner && winner !== 'tie') {
      slotImages.forEach((img, index) => {
        const isWinner = (index === 0 && winner === currentMatch.player1) || 
                        (index === 1 && winner === currentMatch.player2);
        
        if (isWinner) {
          img.classList.add('winner');
        } else {
          img.classList.add('loser');
        }
      });
    } else if (winner === 'tie') {
      slotImages.forEach(img => img.classList.add('winner'));
    }
  }

  displayMultipliersInBracket(matchIndex, multiplier1, multiplier2) {
    const sortedMatches = [...this.state.brackets].sort((a, b) => a.displayOrder - b.displayOrder);
    const currentMatch = sortedMatches[matchIndex];
    
    if (!currentMatch) return;
    
    const bracketMatch = document.querySelector(`[data-match-id="${currentMatch.id}"]`);
    if (!bracketMatch) return;
    
    const slotContainers = bracketMatch.querySelectorAll('.slot-container');
    if (slotContainers.length !== 2) return;
    
    // Remove existing multiplier badges
    bracketMatch.querySelectorAll('.multiplier-badge').forEach(badge => badge.remove());
    
    // Add multiplier badges
    slotContainers.forEach((container, index) => {
      const multiplier = index === 0 ? multiplier1 : multiplier2;
      if (multiplier && parseFloat(multiplier) > 0) {
        const badge = document.createElement('div');
        badge.className = 'multiplier-badge';
        badge.textContent = `${multiplier}x`;
        container.appendChild(badge);
      }
    });
  }

  highlightActiveMatch(matchId) {
    // Remove active class from all matches
    document.querySelectorAll('.bracket-match-horizontal').forEach(match => {
      match.classList.remove('active-match');
    });
    
    // Add active class to current match
    const activeMatch = document.querySelector(`[data-match-id="${matchId}"]`);
    if (activeMatch) {
      activeMatch.classList.add('active-match');
    }
  }
  
  advanceToNextPhase() {
    const currentIndex = this.state.currentMatchIndex || 0;
    
    // Check if we can move to next match in current round
    if (currentIndex < this.state.brackets.length - 1) {
      this.state.currentMatchIndex = currentIndex + 1;
      this.displayCurrentMatch();
      this.resetCurrentMatch();
      this.showFeedback('advance-phase-btn', 'Advanced to next match!', 'success');
      return;
    }
    
    // Check if current round is complete
    const allMatchesCompleted = this.state.brackets.every(match => match.completed);
    if (!allMatchesCompleted) {
      this.showFeedback('advance-phase-btn', 'Complete all matches first!', 'error');
      return;
    }
    
    // Advance to next tournament phase
    this.createNextPhase();
  }

  createNextPhase() {
    // Get winners from current phase
    const winners = this.state.brackets
      .filter(match => match.completed && match.winner !== 'tie')
      .map(match => match.winner);
    
    // Check if this is the final - should have auto-completed already
    if (this.state.brackets.length === 1) {
      const finalWinner = winners[0];
      if (finalWinner) {
        this.completeTournament(finalWinner);
        return;
      }
    }
    
    if (winners.length < 2) {
      this.showFeedback('advance-phase-btn', 'Need at least 2 winners to continue!', 'error');
      return;
    }
    
    // Determine next phase
    const currentPhaseSize = this.state.brackets.length;
    let nextPhaseName = '';
    
    if (currentPhaseSize === 4) {
      nextPhaseName = 'Semi-Finals';
    } else if (currentPhaseSize === 2) {
      nextPhaseName = 'Final';
    } else if (currentPhaseSize === 1) {
      // Tournament complete
      this.completeTournament(winners[0]);
      return;
    }
    
    // Create next phase matches
    this.state.brackets = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        this.state.brackets.push({
          id: `${nextPhaseName.toLowerCase()}-${Math.floor(i/2) + 1}`,
          player1: winners[i],
          player2: winners[i + 1],
          displayOrder: Math.floor(i/2),
          completed: false,
          winner: null
        });
      }
    }
    
    // Reset to first match of new phase
    this.state.currentMatchIndex = 0;
    this.state.currentPhase = nextPhaseName;
    
    // Update UI for new phase
    this.renderBracketHTML();
    this.displayCurrentMatch();
    this.resetCurrentMatch();
    
    this.showFeedback('advance-phase-btn', `Advanced to ${nextPhaseName}!`, 'success');
    console.log(`Created ${nextPhaseName} with ${this.state.brackets.length} matches`);
  }

  completeTournament(champion) {
    this.state.champion = champion;
    this.state.tournamentComplete = true;
    
    // Add confetti animation
    this.createConfetti();
    
    // Update UI to show champion
    const bracketContent = document.getElementById('tournament-bracket-content');
    if (bracketContent) {
      bracketContent.innerHTML = `
        <div class="tournament-complete">
          <div class="confetti-container"></div>
          <h1 class="congratulations-title">🎉 CONGRATULATIONS! 🎉</h1>
          <h2 class="tournament-complete-subtitle">🏆 Tournament Champion! 🏆</h2>
          <div class="champion-display">
            <img src="${this.getSlotImage(champion.slot)}" alt="${champion.slot}" class="champion-image">
            <div class="champion-info">
              <h3>${champion.player}</h3>
              <p class="champion-slot">${champion.slot}</p>
            </div>
          </div>
        </div>
      `;
      
      // Apply theme-based styling to newly rendered content
      setTimeout(() => {
        if (window.refreshTournamentBracketStyling) {
          window.refreshTournamentBracketStyling();
        }
      }, 50);
    }
    
    // Hide control panel and show celebration
    const controlPanel = document.getElementById('tournament-control-panel');
    if (controlPanel) {
      controlPanel.style.display = 'none';
    }
    
    this.showFeedback('advance-phase-btn', `🎉 ${champion.player} is the champion! 🎉`, 'success');
    console.log('Tournament completed. Champion:', champion);
  }

  goToPreviousMatch() {
    const currentIndex = this.state.currentMatchIndex || 0;
    if (currentIndex > 0) {
      this.state.currentMatchIndex = currentIndex - 1;
      this.displayCurrentMatch();
    }
  }

  goToNextMatch() {
    const currentIndex = this.state.currentMatchIndex || 0;
    if (currentIndex < this.state.brackets.length - 1) {
      this.state.currentMatchIndex = currentIndex + 1;
      this.displayCurrentMatch();
    }
  }

  updateMatchUI() {
    const matchTitle = document.getElementById('match-title');
    if (matchTitle) matchTitle.textContent = `Quarter-Final Match ${this.state.currentMatch + 1}`;
    
    const statusProgress = document.getElementById('status-progress');
    if (statusProgress) statusProgress.textContent = `Match ${this.state.currentMatch + 1} of ${this.state.brackets.length}`;
    
    // Reset the UI for the new match
    this.resetCurrentMatch();
    
    // If this match was already completed, show the winner
    const currentMatch = this.state.brackets[this.state.currentMatch];
    if (currentMatch.completed && currentMatch.winner) {
      this.showCompletedMatchResult(currentMatch);
    }
  }

  showCompletedMatchResult(match) {
    const indicator1 = document.getElementById('winner-indicator-1');
    const indicator2 = document.getElementById('winner-indicator-2');
    const card1 = document.getElementById('contestant-1-card');
    const card2 = document.getElementById('contestant-2-card');

    if (match.winner === match.player1) {
      if (indicator1) indicator1.style.display = 'flex';
      if (indicator2) indicator2.style.display = 'none';
      if (card1) card1.classList.add('winner');
      if (card2) card2.classList.remove('winner');
    } else if (match.winner === match.player2) {
      if (indicator2) indicator2.style.display = 'flex';
      if (indicator1) indicator1.style.display = 'none';
      if (card2) card2.classList.add('winner');
      if (card1) card1.classList.remove('winner');
    } else if (match.winner === 'tie') {
      if (indicator1) indicator1.style.display = 'flex';
      if (indicator2) indicator2.style.display = 'flex';
      if (card1) card1.classList.add('winner');
      if (card2) card2.classList.add('winner');
    }
  }

  endTournament() {
    const controlPanel = document.getElementById('tournament-control-panel');
    const tournamentPanel = document.getElementById('tournament-panel');
    const bracket = document.getElementById('tournament-bracket');
    const leftPanel = document.getElementById('tournament-left-panel');
    const statsBar = document.querySelector('.bh-stats-bar');
    
    if (controlPanel) controlPanel.style.display = 'none';
    if (tournamentPanel) tournamentPanel.style.display = 'none';
    if (bracket) bracket.style.display = 'none';
    if (leftPanel) leftPanel.style.display = 'none';
    if (statsBar) statsBar.style.display = 'flex';
    
    this.state.isActive = false;
    this.state.participants = [];
    this.state.brackets = [];
    this.state.currentMatchIndex = 0;
    
    console.log('Tournament ended');
  }

  showFeedback(buttonId, message, type = 'info') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const originalContent = button.innerHTML;
    const originalStyle = button.style.background;

    button.innerHTML = message;
    
    button.classList.remove('tournament-feedback-success', 'tournament-feedback-error', 'tournament-feedback-info');
    
    switch (type) {
      case 'success':
        button.classList.add('tournament-feedback-success');
        break;
      case 'error':
        button.classList.add('tournament-feedback-error');
        break;
      default:
        button.classList.add('tournament-feedback-info');
    }

    setTimeout(() => {
      button.innerHTML = originalContent;
      button.classList.remove('tournament-feedback-success', 'tournament-feedback-error', 'tournament-feedback-info');
    }, 3000);
  }

  createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#d97706'];
    const confettiContainer = document.querySelector('.confetti-container') || document.body;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        z-index: 10000;
      `;
      
      confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
  }
}

// Export for use in main script
window.TournamentManager = TournamentManager;