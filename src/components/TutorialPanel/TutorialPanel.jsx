import { useState } from 'react';
import './TutorialPanel.css';

const TutorialPanel = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to Bonus Hunt Overlay',
      icon: '👋',
      content: 'This tutorial will guide you through all the features of the overlay. Use the navigation buttons or arrow keys to move between steps.',
      tip: 'Press ESC at any time to close this tutorial'
    },
    {
      title: 'Circular Menu',
      icon: '🎯',
      content: 'Click the spinning button on the left to open the circular fan menu. This gives you quick access to all major features: Customization, Bonus Hunt Panel, Tutorial, Random Slot, Tournament, Giveaway, Art/Ad, and Lock.',
      tip: 'Double-click the center button to lock the menu in open position'
    },
    {
      title: 'Adding Bonuses',
      icon: '➕',
      content: 'Click the crosshair button in the fan menu to open the Bonus Hunt Panel. Enter the slot name (it will auto-suggest from the database), bet size, and mark as Super if needed. Click "Add Slot" to add it to your list.',
      tip: 'Press Enter to quickly jump between fields'
    },
    {
      title: 'Opening Bonuses',
      icon: '🎰',
      content: 'Click any bonus in your list to open it. Enter the payout amount and the multiplier will be calculated automatically. Use arrow keys to navigate between bonuses, Enter to save, and ESC to close.',
      tip: 'Double-click a bonus to toggle Super status'
    },
    {
      title: 'Statistics Panel',
      icon: '📊',
      content: 'The stats panel shows real-time statistics: total bonuses, completed count, winnings, average multiplier, profit/loss, required multiplier, and best/worst slots.',
      tip: 'Stats update automatically as you open bonuses'
    },
    {
      title: 'Customization',
      icon: '🎨',
      content: 'Click the palette button to access full customization. Change colors, apply theme presets, adjust gradients, toggle effects, configure Twitch chat integration, and customize the navbar.',
      tip: '15 theme presets available for quick styling'
    },
    {
      title: 'Tournament Bracket',
      icon: '🏆',
      content: 'Access the tournament feature to create and manage tournament brackets. Add players, track matches, and display the bracket overlay for your stream.',
      tip: 'Supports single and double elimination formats'
    },
    {
      title: 'Giveaway System',
      icon: '🎁',
      content: 'Run giveaways directly from the overlay. Manage entries, select random winners, and display the results on screen for your viewers.',
      tip: 'Winners are selected using secure random selection'
    },
    {
      title: 'Random Slot Picker',
      icon: '🎲',
      content: 'Need to pick a random bonus from your list? Use the random slot picker for an animated selection that adds excitement to your stream.',
      tip: 'Perfect for letting chat decide which bonus to open next'
    },
    {
      title: 'Art & Advertisements',
      icon: '🖼️',
      content: 'Upload custom images or ads to display on your overlay. Position them anywhere, adjust size, and toggle visibility as needed.',
      tip: 'Supports PNG, JPG, and GIF formats'
    },
    {
      title: 'Lock & Shortcuts',
      icon: '🔒',
      content: 'Click the lock button to freeze all panel positions. This prevents accidental moving during your stream. Remember: Single-click bonus items to open, double-click to toggle Super status.',
      tip: 'Keyboard shortcuts work throughout the overlay'
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-panel">
        <div className="tutorial-header">
          <h2>📚 Tutorial</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tutorial-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>
        </div>

        <div className="tutorial-content">
          <div className="tutorial-icon">{currentStepData.icon}</div>
          <h3 className="tutorial-title">{currentStepData.title}</h3>
          <p className="tutorial-description">{currentStepData.content}</p>
          
          <div className="tutorial-tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">{currentStepData.tip}</span>
          </div>
        </div>

        <div className="tutorial-navigation">
          <button 
            className="nav-btn" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          <button className="skip-btn" onClick={handleSkip}>
            Skip Tutorial
          </button>
          <button 
            className="nav-btn primary" 
            onClick={handleNext}
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish ✓' : 'Next →'}
          </button>
        </div>

        <div className="keyboard-hints">
          <span className="hint">← → Navigate</span>
          <span className="hint">ESC Close</span>
        </div>
      </div>
    </div>
  );
};

export default TutorialPanel;
