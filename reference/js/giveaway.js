// Giveaway Wheel System
class GiveawayWheel {
  constructor() {
    this.participants = [];
    this.isSpinning = false;
    this.wheel = null;
    this.canvas = null;
    this.ctx = null;
    this.rotation = 0;
    this.spinVelocity = 0;
    this.winner = null;
    this.colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    
    this.init();
  }

  init() {
    this.createGiveawayPanel();
    this.createCanvas();
    this.loadParticipants();
  }

  createGiveawayPanel() {
    console.log('Creating giveaway panel...');
    // Create main control panel (small, compact)
    const panel = document.createElement('div');
    panel.id = 'giveaway-panel';
    panel.className = 'info-section giveaway-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
      <div class="giveaway-header">
        <h3>🎁 Giveaway</h3>
        <button class="close-giveaway-btn" id="close-giveaway">×</button>
      </div>
      
      <div class="giveaway-content">
        <div class="participant-input-section">
          <div class="input-row">
            <input type="text" id="participant-name" placeholder="Enter name..." maxlength="20">
            <button id="add-participant-btn" class="giveaway-btn primary">Add</button>
          </div>
          <div class="compact-actions">
            <button id="clear-all-btn" class="giveaway-btn secondary small">Clear</button>
            <span class="participant-count">Count: <span id="participant-count">0</span></span>
            <button id="toggle-wheel-btn" class="giveaway-btn secondary small">Show Wheel</button>
            <button id="spin-wheel-btn" class="giveaway-btn spin-btn" disabled>🎰 SPIN!</button>
          </div>
        </div>

        <div class="participants-list compact">
          <h5 style="color: #00e1ff; margin: 5px 0; font-size: 12px;">Participants:</h5>
          <div class="participants-container" id="participants-container" style="background: rgba(255,255,255,0.15) !important; border: 1px solid #00e1ff;">
            <p class="no-participants">Add participants to start</p>
          </div>
        </div>
      </div>

      <!-- Hidden import textarea -->
      <textarea id="import-textarea" style="display: none;" placeholder="Paste participant names here (one per line)..."></textarea>
    `;

    document.body.appendChild(panel);
    console.log('Panel added to DOM');
    
    // Create separate wheel container on the right side
    const wheelContainer = document.createElement('div');
    wheelContainer.id = 'giveaway-wheel-container';
    wheelContainer.className = 'giveaway-wheel-container';
    wheelContainer.style.display = 'none';
      wheelContainer.innerHTML = `
      <div class="wheel-section">
        <canvas id="giveaway-wheel" width="500" height="500"></canvas>
        <div class="wheel-pointer"></div>
      </div>
    `;    document.body.appendChild(wheelContainer);
    console.log('Wheel container added to DOM');
    
    // Make wheel draggable
    this.makeDraggable(wheelContainer);
    
    // Setup event listeners after elements are added to DOM
    this.setupEventListeners();
  }

  createCanvas() {
    this.canvas = document.getElementById('giveaway-wheel');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.drawWheel();
    } else {
      console.error('Canvas element not found');
      // Try again after a short delay
      setTimeout(() => {
        this.canvas = document.getElementById('giveaway-wheel');
        if (this.canvas) {
          this.ctx = this.canvas.getContext('2d');
          this.drawWheel();
        }
      }, 100);
    }
  }

  setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Add participant
    const addBtn = document.getElementById('add-participant-btn');
    const nameInput = document.getElementById('participant-name');
    
    console.log('Add button found:', !!addBtn);
    console.log('Name input found:', !!nameInput);
    
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        console.log('Add button clicked!');
        this.addParticipant();
      });
    }

    if (nameInput) {
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          console.log('Enter key pressed!');
          this.addParticipant();
        }
      });
    }

    // Clear all participants
    document.getElementById('clear-all-btn').addEventListener('click', () => {
      this.clearAllParticipants();
    });

    // Import names (right-click for bulk import)
    document.getElementById('participant-name').addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showImportDialog();
    });

    // Toggle wheel visibility
    document.getElementById('toggle-wheel-btn').addEventListener('click', () => {
      this.toggleWheel();
    });

    // Spin wheel
    document.getElementById('spin-wheel-btn').addEventListener('click', () => {
      this.spinWheel();
    });

    // Close panel
    document.getElementById('close-giveaway').addEventListener('click', () => {
      this.hideGiveawayPanel();
    });
  }

  addParticipant() {
    const input = document.getElementById('participant-name');
    const name = input.value.trim();
    
    console.log('Adding participant:', name);
    
    if (!name) {
      console.log('No name entered');
      return;
    }
    
    if (this.participants.includes(name)) {
      this.showFeedback('Participant already exists!', 'error');
      return;
    }
    
    if (this.participants.length >= 20) {
      this.showFeedback('Maximum 20 participants allowed!', 'error');
      return;
    }

    this.participants.push(name);
    console.log('Participants array now:', this.participants);
    input.value = '';
    this.updateParticipantsList();
    this.drawWheel();
    this.saveParticipants();
    this.showFeedback(`Added "${name}"!`, 'success');
  }

  removeParticipant(name) {
    const index = this.participants.indexOf(name);
    if (index > -1) {
      this.participants.splice(index, 1);
      this.updateParticipantsList();
      this.drawWheel();
      this.saveParticipants();
      this.showFeedback(`Removed "${name}"!`, 'info');
    }
  }

  clearAllParticipants() {
    if (this.participants.length === 0) return;
    
    if (confirm('Are you sure you want to clear all participants?')) {
      this.participants = [];
      this.updateParticipantsList();
      this.drawWheel();
      this.saveParticipants();
      this.showFeedback('All participants cleared!', 'info');
    }
  }

  showImportDialog() {
    const textarea = document.getElementById('import-textarea');
    textarea.style.display = 'block';
    textarea.focus();
    
    const importBtn = document.getElementById('import-names-btn');
    importBtn.textContent = 'Confirm Import';
    importBtn.onclick = () => this.importNames();
    
    // Add cancel option
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'giveaway-btn secondary';
    cancelBtn.onclick = () => this.cancelImport();
    importBtn.parentNode.insertBefore(cancelBtn, importBtn.nextSibling);
  }

  importNames() {
    const textarea = document.getElementById('import-textarea');
    const names = textarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name && name.length <= 20);
    
    if (names.length === 0) {
      this.showFeedback('No valid names found!', 'error');
      return;
    }
    
    const newNames = names.filter(name => !this.participants.includes(name));
    const totalAfterImport = this.participants.length + newNames.length;
    
    if (totalAfterImport > 20) {
      this.showFeedback(`Can only add ${20 - this.participants.length} more participants!`, 'error');
      return;
    }
    
    this.participants.push(...newNames);
    this.updateParticipantsList();
    this.drawWheel();
    this.saveParticipants();
    this.cancelImport();
    this.showFeedback(`Imported ${newNames.length} participants!`, 'success');
  }

  cancelImport() {
    const textarea = document.getElementById('import-textarea');
    textarea.style.display = 'none';
    textarea.value = '';
    
    const importBtn = document.getElementById('import-names-btn');
    importBtn.textContent = 'Import Names';
    importBtn.onclick = () => this.showImportDialog();
    
    // Remove cancel button
    const cancelBtn = importBtn.nextSibling;
    if (cancelBtn && cancelBtn.textContent === 'Cancel') {
      cancelBtn.remove();
    }
  }

  updateParticipantsList() {
    console.log('Updating participants list, current participants:', this.participants);
    const container = document.getElementById('participants-container');
    const countElement = document.getElementById('participant-count');
    const spinBtn = document.getElementById('spin-wheel-btn');
    
    console.log('Container found:', !!container, 'Count element found:', !!countElement);
    
    if (countElement) {
      countElement.textContent = this.participants.length;
      console.log('Updated count to:', this.participants.length);
    }
    
    if (this.participants.length === 0) {
      if (container) {
        container.innerHTML = '<p class="no-participants">Add participants to start</p>';
        console.log('Set no participants message');
      }
      if (spinBtn) spinBtn.disabled = true;
      return;
    }
    
    if (spinBtn) spinBtn.disabled = false;
    
    if (container) {
      const participantHTML = this.participants.map(name => `
        <div class="participant-item" style="background: rgba(255,255,255,0.3) !important; border: 1px solid #00e1ff; margin: 2px 0;">
          <span class="participant-name" style="color: #ffffff !important; font-weight: bold; display: inline-block; padding: 2px;">${name}</span>
          <button class="remove-participant" onclick="window.giveawayWheel.removeParticipant('${name}')" style="background: #ff6b6b; color: white; border: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer;">×</button>
        </div>
      `).join('');
      
      console.log('Setting participant HTML:', participantHTML);
      container.innerHTML = participantHTML;
      
      // Force visibility test
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.height = 'auto';
    }
  }

  drawWheel() {
    if (!this.canvas || !this.ctx) {
      console.error('Canvas or context not available for drawing');
      return;
    }
    
    const canvas = this.canvas;
    const ctx = this.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 235;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (this.participants.length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#2a2b3d';
      ctx.fill();
      ctx.strokeStyle = '#00e1ff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Add participants', centerX, centerY - 5);
      ctx.fillText('to spin!', centerX, centerY + 15);
      return;
    }
    
    const anglePerSegment = (2 * Math.PI) / this.participants.length;
    
    // Draw segments starting from top (-π/2 to align with arrow)
    this.participants.forEach((participant, index) => {
      // Start from top and go clockwise
      const startAngle = (-Math.PI / 2) + (index * anglePerSegment) + this.rotation;
      const endAngle = startAngle + anglePerSegment;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[index % this.colors.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      
      const textRadius = radius * 0.7;
      ctx.fillText(participant, textRadius, 5);
      ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#00e1ff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  spinWheel() {
    if (this.isSpinning || this.participants.length === 0) return;
    
    this.isSpinning = true;
    const spinBtn = document.getElementById('spin-wheel-btn');
    spinBtn.disabled = true;
    spinBtn.textContent = '🌀 SPINNING...';
    
    // Random spin parameters
    const minSpins = 3;
    const maxSpins = 6;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalRotation = spins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    
    this.animateWheel(finalRotation, 3000); // 3 second spin
  }

  animateWheel(targetRotation, duration) {
    const startTime = Date.now();
    const startRotation = this.rotation;
    let animationId;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.rotation = startRotation + targetRotation * easeOut;
      this.drawWheel();
      
      if (progress < 1 && this.isSpinning) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Ensure final position is set
        this.rotation = startRotation + targetRotation;
        this.drawWheel();
        console.log('Animation complete, final rotation:', this.rotation);
        this.handleSpinComplete();
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Safety timeout
    setTimeout(() => {
      if (this.isSpinning) {
        console.log('Force completing spin due to timeout');
        if (animationId) cancelAnimationFrame(animationId);
        this.rotation = startRotation + targetRotation;
        this.drawWheel();
        this.handleSpinComplete();
      }
    }, duration + 500);
  }

  handleSpinComplete() {
    this.isSpinning = false;
    
    try {
      // Since segments start from top (-π/2), we just need to find which segment
      // is at the top position after rotation
      const anglePerSegment = (2 * Math.PI) / this.participants.length;
      
      // Normalize rotation to positive value
      let normalizedRotation = (-this.rotation) % (2 * Math.PI);
      if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;
      
      // Find which segment is at the top (where arrow points)
      let winnerIndex = Math.floor(normalizedRotation / anglePerSegment);
      
      // Ensure valid index
      winnerIndex = Math.max(0, Math.min(winnerIndex, this.participants.length - 1));
      
      this.winner = this.participants[winnerIndex];
      
      console.log('Winner calculation:', {
        rotation: this.rotation,
        normalizedRotation,
        anglePerSegment,
        winnerIndex,
        winner: this.winner,
        participants: this.participants
      });
    } catch (error) {
      console.error('Error calculating winner:', error);
      this.winner = this.participants[0];
    }
    
    // Reset spin button
    const spinBtn = document.getElementById('spin-wheel-btn');
    spinBtn.disabled = false;
    spinBtn.textContent = '🎰 SPIN AGAIN!';
    
    // Show winner with celebration
    this.celebrateWinner();
  }

  celebrateWinner() {
    // Play horn sound
    this.playHornSound();
    
    // Create winner display
    this.showWinnerDisplay();
    
    // Create confetti
    this.createConfetti();
    
    // Log winner
    console.log(`🎉 GIVEAWAY WINNER: ${this.winner} 🎉`);
  }

  showWinnerDisplay() {
    // Remove existing winner overlay
    const existingOverlay = document.querySelector('.wheel-winner-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Create winner overlay that covers the wheel
    const wheelContainer = document.getElementById('giveaway-wheel-container');
    if (!wheelContainer) return;
    
    const winnerOverlay = document.createElement('div');
    winnerOverlay.className = 'wheel-winner-overlay';
    winnerOverlay.innerHTML = `
      <div class="wheel-winner-content">
        <div class="winner-crown">👑</div>
        <h2 class="winner-title">WINNER!</h2>
        <div class="winner-name">${this.winner}</div>
        <p class="winner-subtitle">Congratulations!</p>
      </div>
    `;
    
    wheelContainer.appendChild(winnerOverlay);
    
    // Add close button to giveaway panel
    this.addCloseButtonToPanel();
  }

  createConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.remove();
          }
        }, 5000);
      }, i * 50);
    }
  }

  playHornSound() {
    // Create audio context and generate horn sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const duration = 2;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate horn-like sound
      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const freq1 = 220 + Math.sin(t * 10) * 50; // Base frequency with vibrato
        const freq2 = 440 + Math.sin(t * 15) * 30; // Harmonic
        const envelope = Math.exp(-t * 2) * (1 - Math.exp(-t * 20)); // Attack and decay
        
        data[i] = (Math.sin(2 * Math.PI * freq1 * t) + 0.5 * Math.sin(2 * Math.PI * freq2 * t)) * envelope * 0.3;
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.log('Could not play horn sound:', error);
      // Fallback: play a beep
      this.playBeep();
    }
  }

  playBeep() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play beep sound:', error);
    }
  }

  toggleWheel() {
    const wheelContainer = document.getElementById('giveaway-wheel-container');
    const toggleBtn = document.getElementById('toggle-wheel-btn');
    
    if (!wheelContainer) return;
    
    const isVisible = wheelContainer.style.display !== 'none';
    
    if (isVisible) {
      wheelContainer.style.display = 'none';
      toggleBtn.textContent = 'Show Wheel';
    } else {
      wheelContainer.style.display = 'block';
      toggleBtn.textContent = 'Hide Wheel';
      // Ensure canvas is ready before drawing
      if (!this.canvas) {
        this.createCanvas();
      }
      this.drawWheel();
    }
  }

  showGiveawayPanel() {
    console.log('Showing giveaway panel...');
    const panel = document.getElementById('giveaway-panel');
    console.log('Panel found:', !!panel);
    
    if (panel) panel.style.display = 'block';
    // Don't automatically show wheel container - let user toggle it
  }

  hideGiveawayPanel() {
    console.log('Hiding giveaway panel...');
    const panel = document.getElementById('giveaway-panel');
    const wheelContainer = document.getElementById('giveaway-wheel-container');
    const toggleBtn = document.getElementById('toggle-wheel-btn');
    
    if (panel) panel.style.display = 'none';
    if (wheelContainer) wheelContainer.style.display = 'none';
    if (toggleBtn) toggleBtn.textContent = 'Show Wheel';
    
    // Remove active state from giveaway button
    const giveawayBtn = document.getElementById('giveaway-btn');
    if (giveawayBtn) {
      giveawayBtn.classList.remove('active');
    }
  }

  // Draggable functionality
  makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', (e) => {
      if (this.isSpinning) return; // Don't allow dragging while spinning
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = element.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      element.style.cursor = 'grabbing';
      element.style.transform = 'none'; // Remove center transform while dragging
      element.style.left = initialX + 'px';
      element.style.top = initialY + 'px';
      element.style.right = 'auto';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      e.preventDefault();
    });

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newX = initialX + deltaX;
      const newY = initialY + deltaY;
      
      // Keep within screen bounds
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      
      element.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
      element.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    };

    const handleMouseUp = () => {
      isDragging = false;
      element.style.cursor = 'move';
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }

  addCloseButtonToPanel() {
    // Remove existing close button
    const existingCloseBtn = document.querySelector('.panel-close-winner-btn');
    if (existingCloseBtn) {
      existingCloseBtn.remove();
    }
    
    // Add close button to giveaway panel header
    const giveawayHeader = document.querySelector('.giveaway-header');
    if (giveawayHeader) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'panel-close-winner-btn';
      closeBtn.textContent = 'Close Winner';
      closeBtn.onclick = () => this.closeWinnerDisplay();
      giveawayHeader.appendChild(closeBtn);
    }
  }

  closeWinnerDisplay() {
    // Remove winner overlay from wheel
    const winnerOverlay = document.querySelector('.wheel-winner-overlay');
    if (winnerOverlay) {
      winnerOverlay.remove();
    }
    
    // Remove close button from panel
    const closeBtn = document.querySelector('.panel-close-winner-btn');
    if (closeBtn) {
      closeBtn.remove();
    }
  }

  showFeedback(message, type = 'info') {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.giveaway-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = `giveaway-feedback ${type}`;
    feedback.textContent = message;
    
    const header = document.querySelector('.giveaway-header');
    header.appendChild(feedback);
    
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 3000);
  }

  saveParticipants() {
    localStorage.setItem('giveaway-participants', JSON.stringify(this.participants));
  }

  loadParticipants() {
    const saved = localStorage.getItem('giveaway-participants');
    if (saved) {
      try {
        this.participants = JSON.parse(saved);
        this.updateParticipantsList();
        this.drawWheel();
      } catch (error) {
        console.error('Error loading participants:', error);
      }
    }
  }
}

// Initialize giveaway wheel when DOM is loaded
let giveawayWheel = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing GiveawayWheel...');
  giveawayWheel = new GiveawayWheel();
  // Export for global access after initialization
  window.giveawayWheel = giveawayWheel;
  console.log('GiveawayWheel initialized:', !!giveawayWheel);
});