// ==================== THEMES MODULE ====================
// Centralized theme management for the Streamer Overlay

class ThemeManager {
  constructor() {
    this.themes = this.initializeThemes();
    this.seasonalThemes = ['christmas-candy-cane', 'winter-wonderland', 'halloween-spooky', 'valentine-love'];
    this.init();
  }

  init() {
    // Initialize theme event listeners when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bindEventListeners());
    } else {
      this.bindEventListeners();
    }
  }

  bindEventListeners() {
    // Theme preset buttons
    const themePresets = document.querySelectorAll('.theme-preset');
    themePresets.forEach(btn => {
      btn.addEventListener('click', () => this.applyTheme(btn.dataset.theme));
    });

    // Restore saved theme on load
    this.restoreSavedTheme();
  }

  initializeThemes() {
    return {
      // CLASSIC THEMES
      default: {
        primary: '#9346ff', accent: '#00e1ff', background: '#1a1b2e', text: '#ffffff',
        cardBg: '#2a2b3d',
        slotStart: '#9346ff', slotEnd: '#00e1ff',
        buttonStart: '#9346ff', buttonEnd: '#7c3aed',
        sidebarStart: '#1a1b2e', sidebarEnd: '#16213e',
        bgPattern: 'radial-gradient(circle at 20% 50%, rgba(147, 70, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 225, 255, 0.15) 0%, transparent 50%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '400'
      },
      purple: {
        primary: '#a855f7', accent: '#c084fc', background: '#1e1b4b', text: '#ffffff',
        cardBg: '#2d1b69',
        slotStart: '#a855f7', slotEnd: '#c084fc',
        buttonStart: '#a855f7', buttonEnd: '#9333ea',
        sidebarStart: '#1e1b4b', sidebarEnd: '#312e81',
        bgPattern: 'repeating-linear-gradient(45deg, #1e1b4b 0px, #1e1b4b 40px, #312e81 40px, #312e81 80px)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500'
      },
      blue: {
        primary: '#3b82f6', accent: '#60a5fa', background: '#1e3a8a', text: '#ffffff',
        cardBg: '#1e40af',
        slotStart: '#3b82f6', slotEnd: '#60a5fa',
        buttonStart: '#3b82f6', buttonEnd: '#2563eb',
        sidebarStart: '#1e3a8a', sidebarEnd: '#1e40af',
        bgPattern: 'linear-gradient(0deg, #1e3a8a 0%, #1e40af 100%), repeating-linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0px, transparent 1px, transparent 40px, rgba(59, 130, 246, 0.1) 41px)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      green: {
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#ffffff',
        cardBg: '#065f46',
        slotStart: '#10b981', slotEnd: '#34d399',
        buttonStart: '#10b981', buttonEnd: '#059669',
        sidebarStart: '#064e3b', sidebarEnd: '#065f46',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%), linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      red: {
        primary: '#ef4444', accent: '#f87171', background: '#7f1d1d', text: '#ffffff',
        cardBg: '#991b1b',
        slotStart: '#ef4444', slotEnd: '#f87171',
        buttonStart: '#ef4444', buttonEnd: '#dc2626',
        sidebarStart: '#7f1d1d', sidebarEnd: '#991b1b',
        bgPattern: 'repeating-radial-gradient(circle at 0 0, transparent 0, #7f1d1d 40px), repeating-linear-gradient(#991b1b55, #991b1b)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '500'
      },
      dark: {
        primary: '#6b7280', accent: '#9ca3af', background: '#111827', text: '#ffffff',
        cardBg: '#1f2937',
        slotStart: '#6b7280', slotEnd: '#9ca3af',
        buttonStart: '#6b7280', buttonEnd: '#4b5563',
        sidebarStart: '#111827', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },

      // HEAVY THEMES
      gold: {
        primary: '#fbbf24', accent: '#fcd34d', background: '#1c1917', text: '#fef3c7',
        cardBg: '#292524',
        slotStart: '#d97706', slotEnd: '#fbbf24',
        buttonStart: '#b45309', buttonEnd: '#d97706',
        sidebarStart: '#292524', sidebarEnd: '#1c1917',
        bgPattern: 'repeating-linear-gradient(45deg, #1c1917 0px, #1c1917 20px, #292524 20px, #292524 40px), radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'grey-red': {
        primary: '#dc2626', accent: '#ef4444', background: '#374151', text: '#f3f4f6',
        cardBg: '#1f2937',
        slotStart: '#6b7280', slotEnd: '#dc2626',
        buttonStart: '#991b1b', buttonEnd: '#dc2626',
        sidebarStart: '#374151', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(135deg, #374151 25%, transparent 25%), linear-gradient(225deg, #374151 25%, transparent 25%), linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(315deg, #1f2937 25%, #374151 25%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '500'
      },
      'black-red': {
        primary: '#dc2626', accent: '#f87171', background: '#000000', text: '#ffffff',
        cardBg: '#1a0000',
        slotStart: '#7f1d1d', slotEnd: '#dc2626',
        buttonStart: '#450a0a', buttonEnd: '#991b1b',
        sidebarStart: '#0a0a0a', sidebarEnd: '#000000',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(127, 29, 29, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600'
      },
      chrome: {
        primary: '#e5e7eb', accent: '#f3f4f6', background: '#1f2937', text: '#ffffff',
        cardBg: '#374151',
        slotStart: '#9ca3af', slotEnd: '#d1d5db',
        buttonStart: '#6b7280', buttonEnd: '#9ca3af',
        sidebarStart: '#374151', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%), repeating-linear-gradient(0deg, transparent 0px, rgba(229, 231, 235, 0.05) 1px, transparent 2px, transparent 40px)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
      },
      'neon-blue': {
        primary: '#06b6d4', accent: '#22d3ee', background: '#0c4a6e', text: '#e0f2fe',
        cardBg: '#075985',
        slotStart: '#0284c7', slotEnd: '#06b6d4',
        buttonStart: '#0369a1', buttonEnd: '#0891b2',
        sidebarStart: '#0c4a6e', sidebarEnd: '#075985',
        bgPattern: 'repeating-linear-gradient(0deg, #0c4a6e 0px, #0c4a6e 2px, #075985 2px, #075985 4px), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'neon-pink': {
        primary: '#ec4899', accent: '#f472b6', background: '#831843', text: '#fce7f3',
        cardBg: '#9f1239',
        slotStart: '#db2777', slotEnd: '#ec4899',
        buttonStart: '#9f1239', buttonEnd: '#db2777',
        sidebarStart: '#831843', sidebarEnd: '#9f1239',
        bgPattern: 'radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'neon-green': {
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#d1fae5',
        cardBg: '#065f46',
        slotStart: '#059669', slotEnd: '#10b981',
        buttonStart: '#047857', buttonEnd: '#059669',
        sidebarStart: '#064e3b', sidebarEnd: '#065f46',
        bgPattern: 'repeating-linear-gradient(45deg, #064e3b 0px, #064e3b 40px, #065f46 40px, #065f46 80px), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      rainbow: {
        primary: '#f472b6', accent: '#a78bfa', background: '#1e1b4b', text: '#ffffff',
        cardBg: '#312e81',
        slotStart: '#ec4899', slotEnd: '#8b5cf6',
        buttonStart: '#f97316', buttonEnd: '#ec4899',
        sidebarStart: '#1e1b4b', sidebarEnd: '#312e81',
        bgPattern: 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(249, 115, 22, 0.1) 100%), linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'black-sky': {
        primary: '#4b5563', accent: '#6b7280', background: '#000000', text: '#e5e7eb',
        cardBg: '#111827',
        slotStart: '#1f2937', slotEnd: '#374151',
        buttonStart: '#111827', buttonEnd: '#1f2937',
        sidebarStart: '#000000', sidebarEnd: '#0a0a0a',
        bgPattern: 'radial-gradient(ellipse at top, rgba(31, 41, 55, 0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(17, 24, 39, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(75, 85, 99, 0.1) 0%, transparent 30%), radial-gradient(circle at 80% 80%, rgba(55, 65, 81, 0.1) 0%, transparent 30%), linear-gradient(180deg, #000000 0%, #050505 50%, #000000 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
      },

      // PREMIUM THEMES
      'cyber-purple': {
        primary: '#ba55d3', accent: '#9370db', background: '#1a0033', text: '#e9d5ff',
        cardBg: '#2d1b4e',
        slotStart: '#6a0dad', slotEnd: '#ba55d3',
        buttonStart: '#6a0dad', buttonEnd: '#9370db',
        sidebarStart: '#1a0033', sidebarEnd: '#2d1b4e',
        bgPattern: 'radial-gradient(circle at 30% 50%, rgba(186, 85, 211, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(147, 112, 219, 0.15) 0%, transparent 50%), linear-gradient(135deg, #1a0033 0%, #2d1b4e 100%)',
        fontFamily: 'Orbitron, monospace',
        fontWeight: '700'
      },
      'ocean-blue': {
        primary: '#00acc1', accent: '#00758f', background: '#001f3f', text: '#e0f7fa',
        cardBg: '#003d5c',
        slotStart: '#003d5c', slotEnd: '#00acc1',
        buttonStart: '#003d5c', buttonEnd: '#00758f',
        sidebarStart: '#001f3f', sidebarEnd: '#003d5c',
        bgPattern: 'linear-gradient(180deg, #001f3f 0%, #003d5c 50%, #001f3f 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      'sunset-orange': {
        primary: '#ffa500', accent: '#ff6347', background: '#1a0f00', text: '#fff3e0',
        cardBg: '#2d1a00',
        slotStart: '#ff4500', slotEnd: '#ffa500',
        buttonStart: '#ff4500', buttonEnd: '#ff6347',
        sidebarStart: '#1a0f00', sidebarEnd: '#2d1a00',
        bgPattern: 'linear-gradient(0deg, #1a0f00 0%, #ff4500 40%, #ff6347 60%, #ffa500 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500'
      },
      'forest-green': {
        primary: '#2e7d32', accent: '#1b5e20', background: '#0b1f0d', text: '#c8e6c9',
        cardBg: '#1b5e20',
        slotStart: '#0b4619', slotEnd: '#2e7d32',
        buttonStart: '#0b4619', buttonEnd: '#1b5e20',
        sidebarStart: '#0b1f0d', sidebarEnd: '#1b5e20',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(46, 125, 50, 0.2) 0%, transparent 60%), linear-gradient(180deg, #0b1f0d 0%, #1b5e20 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400'
      },
      'midnight-purple': {
        primary: '#6a1b9a', accent: '#4a148c', background: '#0a0014', text: '#e1bee7',
        cardBg: '#1a0033',
        slotStart: '#1a0033', slotEnd: '#6a1b9a',
        buttonStart: '#1a0033', buttonEnd: '#4a148c',
        sidebarStart: '#0a0014', sidebarEnd: '#1a0033',
        bgPattern: 'radial-gradient(ellipse at center, rgba(106, 27, 154, 0.3) 0%, transparent 70%), linear-gradient(180deg, #0a0014 0%, #1a0033 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500'
      },
      'lava-red': {
        primary: '#ff5722', accent: '#d32f2f', background: '#1a0000', text: '#ffccbc',
        cardBg: '#2d0000',
        slotStart: '#b71c1c', slotEnd: '#ff5722',
        buttonStart: '#b71c1c', buttonEnd: '#d32f2f',
        sidebarStart: '#1a0000', sidebarEnd: '#2d0000',
        bgPattern: 'radial-gradient(circle at 50% 30%, rgba(211, 47, 47, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255, 87, 34, 0.3) 0%, transparent 50%), linear-gradient(180deg, #1a0000 0%, #2d0000 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600'
      },
      'ice-blue': {
        primary: '#80deea', accent: '#b2ebf2', background: '#003d5c', text: '#003d5c',
        cardBg: '#26a69a',
        slotStart: '#e0f7fa', slotEnd: '#80deea',
        buttonStart: '#b2ebf2', buttonEnd: '#80deea',
        sidebarStart: '#e0f7fa', sidebarEnd: '#b2ebf2',
        bgPattern: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
      },
      'toxic-green': {
        primary: '#7cb342', accent: '#558b2f', background: '#1a2e0b', text: '#dcedc8',
        cardBg: '#33691e',
        slotStart: '#33691e', slotEnd: '#7cb342',
        buttonStart: '#33691e', buttonEnd: '#558b2f',
        sidebarStart: '#1a2e0b', sidebarEnd: '#33691e',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(124, 179, 66, 0.3) 0%, transparent 60%), linear-gradient(180deg, #1a2e0b 0%, #33691e 100%)',
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: '600'
      },
      'royal-gold': {
        primary: '#ffd54f', accent: '#ffb74d', background: '#2d2000', text: '#3e2723',
        cardBg: '#ffecb3',
        slotStart: '#f9a825', slotEnd: '#ffd54f',
        buttonStart: '#f9a825', buttonEnd: '#ffb74d',
        sidebarStart: '#fff3e0', sidebarEnd: '#ffecb3',
        bgPattern: 'linear-gradient(135deg, #fff3e0 0%, #ffecb3 50%, #ffe082 100%)',
        fontFamily: 'Georgia, serif',
        fontWeight: '600'
      },
      'wine-lovers': {
        primary: '#ad1457', accent: '#880e4f', background: '#000000', text: '#fce4ec',
        cardBg: '#2d0000',
        slotStart: '#000000', slotEnd: '#ad1457',
        buttonStart: '#000000', buttonEnd: '#880e4f',
        sidebarStart: '#000000', sidebarEnd: '#0a0000',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(173, 20, 87, 0.4) 0%, transparent 60%), linear-gradient(180deg, #000000 0%, #0a0000 100%)',
        fontFamily: 'Crimson Text, serif',
        fontWeight: '600'
      },
      'matrix-green': {
        primary: '#00ff00', accent: '#33ff33', background: '#001100', text: '#00ff00',
        cardBg: '#003300',
        slotStart: '#003300', slotEnd: '#00ff00',
        buttonStart: '#003300', buttonEnd: '#33ff33',
        sidebarStart: '#001100', sidebarEnd: '#003300',
        bgPattern: 'linear-gradient(180deg, #001100 0%, #003300 100%)',
        fontFamily: 'Courier New, monospace',
        fontWeight: '700'
      },
      'synthwave': {
        primary: '#06ffa5', accent: '#3a86ff', background: '#1a0033', text: '#ffffff',
        cardBg: '#2d004d',
        slotStart: '#ff006e', slotEnd: '#06ffa5',
        buttonStart: '#8338ec', buttonEnd: '#3a86ff',
        sidebarStart: '#1a0033', sidebarEnd: '#2d004d',
        bgPattern: 'linear-gradient(135deg, #ff006e 0%, #8338ec 33%, #3a86ff 66%, #06ffa5 100%)',
        fontFamily: 'Orbitron, monospace',
        fontWeight: '700'
      },

      // SEASONAL THEMES
      'christmas-candy-cane': {
        primary: '#dc2626', accent: '#ffffff', background: '#0f1b3c', text: '#ffffff',
        cardBg: '#0f2f4a',
        slotStart: '#dc2626', slotEnd: '#ffffff',
        buttonStart: '#dc2626', buttonEnd: '#b91c1c',
        sidebarStart: '#0f1b3c', sidebarEnd: '#0f2f4a',
        bgPattern: 'radial-gradient(circle at 30% 20%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0a1a2e 0%, #16213e 25%, #1a2650 50%, #0f1b3c 75%, #001122 100%), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.05) 10px, rgba(220, 38, 38, 0.05) 20px)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'winter-wonderland': {
        primary: '#60a5fa', accent: '#e0f2fe', background: '#0c4a6e', text: '#e0f2fe',
        cardBg: '#075985',
        slotStart: '#0284c7', slotEnd: '#60a5fa',
        buttonStart: '#0369a1', buttonEnd: '#0891b2',
        sidebarStart: '#0c4a6e', sidebarEnd: '#075985',
        bgPattern: 'radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(224, 242, 254, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500',
        seasonal: true
      },
      'halloween-spooky': {
        primary: '#f97316', accent: '#1a0b00', background: '#451a03', text: '#f97316',
        cardBg: '#1a0b00',
        slotStart: '#451a03', slotEnd: '#f97316',
        buttonStart: '#451a03', buttonEnd: '#ea580c',
        sidebarStart: '#451a03', sidebarEnd: '#1a0b00',
        bgPattern: 'radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(26, 11, 0, 0.8) 0%, transparent 50%), linear-gradient(135deg, #451a03 0%, #1a0b00 25%, #451a03 50%, #1a0b00 75%, #451a03 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'valentine-love': {
        primary: '#ec4899', accent: '#fce7f3', background: '#831843', text: '#fce7f3',
        cardBg: '#9f1239',
        slotStart: '#be185d', slotEnd: '#ec4899',
        buttonStart: '#9f1239', buttonEnd: '#be185d',
        sidebarStart: '#831843', sidebarEnd: '#9f1239',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(252, 231, 243, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 25%, #be185d 50%, #9f1239 75%, #831843 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      
      // NEW CHRISTMAS THEMES
      'christmas-modern': {
        primary: '#c41e3a', accent: '#0f8b5f', background: '#1a0f0f', text: '#ffffff',
        cardBg: '#2d1a1a',
        slotStart: '#c41e3a', slotEnd: '#0f8b5f',
        buttonStart: '#c41e3a', buttonEnd: '#a01729',
        sidebarStart: '#1a0f0f', sidebarEnd: '#0f1a15',
        bgPattern: 'radial-gradient(circle at 30% 20%, rgba(196, 30, 58, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(15, 139, 95, 0.2) 0%, transparent 50%), linear-gradient(135deg, #1a0f0f 0%, #0f1a15 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'christmas-snow': {
        primary: '#e8f4f8', accent: '#4a90e2', background: '#0d1b2a', text: '#e8f4f8',
        cardBg: '#1b263b',
        slotStart: '#e8f4f8', slotEnd: '#4a90e2',
        buttonStart: '#4a90e2', buttonEnd: '#2c5f8d',
        sidebarStart: '#0d1b2a', sidebarEnd: '#1b263b',
        bgPattern: 'radial-gradient(circle at 20% 30%, rgba(232, 244, 248, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(74, 144, 226, 0.3) 0%, transparent 50%), linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500',
        seasonal: true
      },
      'christmas-gold': {
        primary: '#d4af37', accent: '#c41e3a', background: '#1a1410', text: '#ffd700',
        cardBg: '#2d1f1a',
        slotStart: '#d4af37', slotEnd: '#c41e3a',
        buttonStart: '#d4af37', buttonEnd: '#b8860b',
        sidebarStart: '#1a1410', sidebarEnd: '#2d1f1a',
        bgPattern: 'radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(196, 30, 58, 0.2) 0%, transparent 50%), linear-gradient(135deg, #1a1410 0%, #2d1f1a 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      
      // NEW HALLOWEEN THEMES
      'halloween-classic': {
        primary: '#ff6b00', accent: '#8b00ff', background: '#0a0a0a', text: '#ff6b00',
        cardBg: '#1a0f1a',
        slotStart: '#ff6b00', slotEnd: '#8b00ff',
        buttonStart: '#ff6b00', buttonEnd: '#cc5500',
        sidebarStart: '#0a0a0a', sidebarEnd: '#1a0f1a',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(255, 107, 0, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(139, 0, 255, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0a0a0a 0%, #1a0f1a 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'halloween-blood': {
        primary: '#8b0000', accent: '#ff4500', background: '#000000', text: '#ff6b6b',
        cardBg: '#1a0000',
        slotStart: '#8b0000', slotEnd: '#ff4500',
        buttonStart: '#8b0000', buttonEnd: '#660000',
        sidebarStart: '#000000', sidebarEnd: '#1a0000',
        bgPattern: 'radial-gradient(circle at 50% 30%, rgba(139, 0, 0, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255, 69, 0, 0.3) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #1a0000 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'halloween-witch': {
        primary: '#6a0dad', accent: '#00ff00', background: '#0f0520', text: '#e0b0ff',
        cardBg: '#1a0a2e',
        slotStart: '#6a0dad', slotEnd: '#00ff00',
        buttonStart: '#6a0dad', buttonEnd: '#4b0082',
        sidebarStart: '#0f0520', sidebarEnd: '#1a0a2e',
        bgPattern: 'radial-gradient(circle at 30% 20%, rgba(106, 13, 173, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0, 255, 0, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0f0520 0%, #1a0a2e 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      },
      'halloween-candy': {
        primary: '#ff00ff', accent: '#ff6600', background: '#1a0a1a', text: '#ffb3ff',
        cardBg: '#2d1a2d',
        slotStart: '#ff00ff', slotEnd: '#ff6600',
        buttonStart: '#ff00ff', buttonEnd: '#cc00cc',
        sidebarStart: '#1a0a1a', sidebarEnd: '#2d1a2d',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(255, 0, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 102, 0, 0.2) 0%, transparent 50%), linear-gradient(135deg, #1a0a1a 0%, #2d1a2d 100%)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '600',
        seasonal: true
      }
    };
  }

  applyTheme(theme) {
    const selectedTheme = this.themes[theme];
    if (!selectedTheme) {
      console.warn(`Theme "${theme}" not found`);
      return;
    }

    // Handle seasonal themes with special effects
    if (selectedTheme.seasonal) {
      this.applySeasonalTheme(theme, selectedTheme);
      return;
    }
    
    // Clear any existing seasonal classes for regular themes
    document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
    
    // Remove existing seasonal effects
    const existingStyle = document.getElementById('seasonal-effects');
    if (existingStyle) existingStyle.remove();
    
    // Update color inputs
    this.updateColorInputs(selectedTheme);
    
    // Apply background pattern
    if (selectedTheme.bgPattern) {
      document.body.style.background = selectedTheme.bgPattern;
      document.body.style.backgroundColor = selectedTheme.background;
    }
    
    // Apply font family and weight
    if (selectedTheme.fontFamily) {
      document.body.style.fontFamily = selectedTheme.fontFamily;
    }
    if (selectedTheme.fontWeight) {
      document.body.style.fontWeight = selectedTheme.fontWeight;
    }
    
    // Apply colors to all elements
    if (window.CustomizationManager && window.CustomizationManager.applyAllColors) {
      window.CustomizationManager.applyAllColors();
    }
    
    // Update active theme button
    this.updateActiveThemeButton(theme);
    
    // Save theme selection
    localStorage.setItem('selectedTheme', theme);
    
    // Refresh tournament bracket styling if function exists
    setTimeout(() => {
      if (window.refreshTournamentBracketStyling) {
        window.refreshTournamentBracketStyling();
      }
    }, 100);
    
    console.log(`🎨 Applied theme: ${theme}`);
  }

  applySeasonalTheme(theme, themeData) {
    // Clear existing seasonal classes
    document.body.classList.remove('christmas-theme', 'winter-theme', 'halloween-theme', 'valentine-theme');
    
    // Remove existing seasonal effects
    const existingStyle = document.getElementById('seasonal-effects');
    if (existingStyle) existingStyle.remove();
    
    // Add appropriate seasonal class
    let seasonalClass = '';
    let effectsCSS = '';
    
    switch(theme) {
      case 'christmas-candy-cane':
        seasonalClass = 'christmas-theme';
        effectsCSS = this.getChristmasEffects();
        break;
      case 'winter-wonderland':
        seasonalClass = 'winter-theme';
        effectsCSS = this.getWinterEffects();
        break;
      case 'halloween-spooky':
        seasonalClass = 'halloween-theme';
        effectsCSS = this.getHalloweenEffects();
        break;
      case 'valentine-love':
        seasonalClass = 'valentine-theme';
        effectsCSS = this.getValentineEffects();
        break;
    }
    
    document.body.classList.add(seasonalClass);
    
    // Apply seasonal effects
    if (effectsCSS) {
      const styleElement = document.createElement('style');
      styleElement.id = 'seasonal-effects';
      styleElement.textContent = effectsCSS;
      document.head.appendChild(styleElement);
    }
    
    // Update color inputs
    this.updateColorInputs(themeData);
    
    // Apply colors using regular color system
    if (window.CustomizationManager && window.CustomizationManager.applyAllColors) {
      window.CustomizationManager.applyAllColors();
    }
    
    // Update active theme button
    this.updateActiveThemeButton(theme);
    
    // Save theme selection
    localStorage.setItem('selectedTheme', theme);
    
    console.log(`🎨 Applied ${theme} seasonal theme`);
    
    // Show theme change message
    this.showThemeMessage(`${this.getThemeEmoji(theme)} ${this.getThemeName(theme)} activated!`);
  }

  updateColorInputs(themeData) {
    const inputs = [
      { id: 'primary-color', value: themeData.primary },
      { id: 'accent-color', value: themeData.accent },
      { id: 'background-color', value: themeData.background },
      { id: 'text-color', value: themeData.text },
      { id: 'slot-gradient-start', value: themeData.slotStart },
      { id: 'slot-gradient-end', value: themeData.slotEnd },
      { id: 'button-gradient-start', value: themeData.buttonStart },
      { id: 'button-gradient-end', value: themeData.buttonEnd },
      { id: 'sidebar-gradient-start', value: themeData.sidebarStart },
      { id: 'sidebar-gradient-end', value: themeData.sidebarEnd }
    ];

    inputs.forEach(input => {
      const element = document.getElementById(input.id);
      if (element && input.value) {
        element.value = input.value;
      }
    });

    // Set card background if available
    const cardBgInput = document.getElementById('card-background-color');
    if (cardBgInput && themeData.cardBg) {
      cardBgInput.value = themeData.cardBg;
      localStorage.setItem('customCardBackground', themeData.cardBg);
    }
  }

  updateActiveThemeButton(theme) {
    document.querySelectorAll('.theme-preset').forEach(btn => btn.classList.remove('active'));
    const themeBtn = document.querySelector(`[data-theme="${theme}"]`);
    if (themeBtn) {
      themeBtn.classList.add('active');
    }
  }

  restoreSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && this.themes[savedTheme]) {
      console.log(`🎨 Restoring saved theme: ${savedTheme}`);
      
      // Apply the saved theme
      this.applyTheme(savedTheme);
    }
  }

  getThemeEmoji(theme) {
    const emojis = {
      'christmas-candy-cane': '🎄🍭',
      'winter-wonderland': '❄️⛄',
      'halloween-spooky': '🎃👻',
      'valentine-love': '💖💝'
    };
    return emojis[theme] || '🎨';
  }

  getThemeName(theme) {
    const names = {
      'christmas-candy-cane': 'Christmas Candy Cane',
      'winter-wonderland': 'Winter Wonderland',
      'halloween-spooky': 'Halloween Spooky',
      'valentine-love': 'Valentine Love'
    };
    return names[theme] || theme;
  }

  showThemeMessage(message) {
    // Remove existing message
    const existing = document.getElementById('theme-message');
    if (existing) existing.remove();
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.id = 'theme-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px 30px;
      border-radius: 25px;
      border: 2px solid #00e1ff;
      font-weight: 600;
      font-size: 16px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      animation: theme-message-fade 4s ease-in-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after animation
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 4000);
  }

  // SEASONAL EFFECTS CSS GENERATORS
  getChristmasEffects() {
    return `
      /* Christmas snowflakes animation */
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
        animation: christmas-snow-fall 15s linear infinite !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      body.christmas-theme::after {
        content: '❅ ❅ ❅ ❅ ❅ ❅ ❅ ❅ ❅ ❅' !important;
        position: fixed !important;
        top: -50px !important;
        left: -40px !important;
        width: 100% !important;
        height: 100vh !important;
        color: rgba(255, 255, 255, 0.6) !important;
        font-size: 18px !important;
        letter-spacing: 100px !important;
        animation: christmas-snow-fall-layer2 18s linear infinite !important;
        pointer-events: none !important;
        z-index: 999 !important;
      }
      
      @keyframes christmas-snow-fall {
        0% { transform: translateY(-100vh) translateX(0px); }
        25% { transform: translateY(-50vh) translateX(10px); }
        75% { transform: translateY(50vh) translateX(-10px); }
        100% { transform: translateY(100vh) translateX(0px); }
      }
      
      @keyframes christmas-snow-fall-layer2 {
        0% { transform: translateY(-100vh) translateX(0px); }
        33% { transform: translateY(-33vh) translateX(-15px); }
        66% { transform: translateY(33vh) translateX(15px); }
        100% { transform: translateY(100vh) translateX(0px); }
      }
      
      /* Christmas theme - red elements with candy cane striped borders */
      body.christmas-theme .bonus-card,
      body.christmas-theme .info-section,
      body.christmas-theme .middle-panel,
      body.christmas-theme .modern-bh-panel,
      body.christmas-theme .modern-bonus-sidebar,
      body.christmas-theme .tournament-left-panel,
      body.christmas-theme .navbar {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%) !important;
        border: 4px solid !important;
        border-radius: 12px !important;
        border-image: repeating-linear-gradient(
          45deg,
          #ffffff 0px,
          #ffffff 6px,
          #dc2626 6px,
          #dc2626 12px
        ) 4 !important;
        animation: christmas-candy-glow 3s ease-in-out infinite alternate !important;
      }
      
      /* Special styling for text in Christmas theme */
      body.christmas-theme h1,
      body.christmas-theme h2,
      body.christmas-theme h3,
      body.christmas-theme h4,
      body.christmas-theme .bonus-list-header,
      body.christmas-theme .middle-panel-title,
      body.christmas-theme .tournament-bracket-header {
        color: #ffffff !important;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
      }
      
      /* Christmas buttons - but preserve sidebar functionality */
      body.christmas-theme .middle-btn,
      body.christmas-theme .tournament-action-btn {
        background: linear-gradient(135deg, #dc2626 0%, #ffffff 50%, #dc2626 100%) !important;
        color: #dc2626 !important;
        font-weight: bold !important;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
      }
      
      @keyframes christmas-candy-glow {
        0% { 
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
          filter: brightness(1);
        }
        100% { 
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 35px rgba(220, 38, 38, 0.8);
          filter: brightness(1.1);
        }
      }
      
      /* Christmas holly decoration */
      body.christmas-theme .navbar::after {
        content: '🎄 ❄️ 🎅 ❄️ 🎄';
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        font-size: 18px;
        animation: christmas-holly-twinkle 3s ease-in-out infinite;
      }
      
      @keyframes christmas-holly-twinkle {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }
      }
    `;
  }

  getWinterEffects() {
    return `
      /* Winter snowflakes - gentle drift */
      body.winter-theme::before {
        content: '❅ ❄ ❅ ❄ ❅ ❄ ❅ ❄ ❅ ❄';
        position: fixed;
        top: -50px;
        left: 0;
        width: 100%;
        height: 100vh;
        color: rgba(224, 242, 254, 0.8);
        font-size: 24px;
        letter-spacing: 90px;
        animation: winter-snow-drift 20s linear infinite;
        pointer-events: none;
        z-index: 1000;
      }
      
      @keyframes winter-snow-drift {
        0% { transform: translateY(-100vh) translateX(0px); }
        20% { transform: translateY(-60vh) translateX(15px); }
        40% { transform: translateY(-20vh) translateX(-10px); }
        60% { transform: translateY(20vh) translateX(20px); }
        80% { transform: translateY(60vh) translateX(-15px); }
        100% { transform: translateY(100vh) translateX(5px); }
      }
      
      /* Winter frost effect */
      body.winter-theme .bonus-card,
      body.winter-theme .info-section {
        border: 2px solid rgba(96, 165, 250, 0.6) !important;
        box-shadow: 
          0 0 20px rgba(96, 165, 250, 0.4),
          inset 0 0 20px rgba(224, 242, 254, 0.1) !important;
        backdrop-filter: blur(10px) !important;
      }
    `;
  }

  getHalloweenEffects() {
    return `
      /* Halloween misty fog with spirits */
      body.halloween-theme::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: 
          radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(26, 11, 0, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.1) 0%, transparent 30%),
          radial-gradient(circle at 60% 80%, rgba(26, 11, 0, 0.15) 0%, transparent 40%);
        animation: halloween-mist 30s ease-in-out infinite;
        pointer-events: none;
        z-index: 999;
      }
      
      body.halloween-theme::after {
        content: '👻 🎃 🦇 🕷️ 👻 🎃 🦇 🕷️';
        position: fixed;
        top: 20px;
        left: 0;
        width: 100%;
        height: 100vh;
        color: rgba(249, 115, 22, 0.4);
        font-size: 18px;
        letter-spacing: 120px;
        animation: halloween-spirits-drift 40s linear infinite;
        pointer-events: none;
        z-index: 1000;
      }
      
      @keyframes halloween-mist {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        25% { opacity: 0.8; transform: scale(1.05); }
        50% { opacity: 0.7; transform: scale(1.1); }
        75% { opacity: 0.9; transform: scale(1.02); }
      }
      
      @keyframes halloween-spirits-drift {
        0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        25% { transform: translateY(-20px) translateX(30px); opacity: 0.6; }
        50% { transform: translateY(-10px) translateX(-20px); opacity: 0.4; }
        75% { transform: translateY(-30px) translateX(40px); opacity: 0.7; }
        100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
      }
      
      /* Spooky glow effect */
      body.halloween-theme .bonus-card,
      body.halloween-theme .info-section {
        border: 2px solid rgba(249, 115, 22, 0.8) !important;
        box-shadow: 
          0 0 25px rgba(249, 115, 22, 0.6),
          0 0 50px rgba(26, 11, 0, 0.8) !important;
        animation: halloween-spooky-pulse 3s ease-in-out infinite alternate !important;
      }
      
      @keyframes halloween-spooky-pulse {
        0% { box-shadow: 0 0 25px rgba(249, 115, 22, 0.6), 0 0 50px rgba(26, 11, 0, 0.8); }
        100% { box-shadow: 0 0 35px rgba(249, 115, 22, 0.9), 0 0 70px rgba(26, 11, 0, 1); }
      }
    `;
  }

  getValentineEffects() {
    return `
      /* Valentine hearts animation */
      body.valentine-theme::before {
        content: '💖 💝 💕 💗 💖 💝 💕 💗 💖 💝';
        position: fixed;
        top: -50px;
        left: 0;
        width: 100%;
        height: 100vh;
        color: rgba(252, 231, 243, 0.8);
        font-size: 20px;
        letter-spacing: 120px;
        animation: valentine-hearts-float 25s linear infinite;
        pointer-events: none;
        z-index: 1000;
      }
      
      @keyframes valentine-hearts-float {
        0% { transform: translateY(-100vh) scale(0.8) translateX(0px); }
        20% { transform: translateY(-60vh) scale(1.0) translateX(10px); }
        40% { transform: translateY(-20vh) scale(1.1) translateX(-5px); }
        60% { transform: translateY(20vh) scale(0.9) translateX(15px); }
        80% { transform: translateY(60vh) scale(1.0) translateX(-10px); }
        100% { transform: translateY(100vh) scale(0.8) translateX(0px); }
      }
      
      /* Romantic glow */
      body.valentine-theme .bonus-card,
      body.valentine-theme .info-section {
        border: 2px solid rgba(236, 72, 153, 0.8) !important;
        box-shadow: 
          0 0 20px rgba(236, 72, 153, 0.6),
          0 0 40px rgba(252, 231, 243, 0.4) !important;
        animation: valentine-romantic-glow 2.5s ease-in-out infinite alternate !important;
      }
      
      @keyframes valentine-romantic-glow {
        0% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(252, 231, 243, 0.4); }
        100% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.9), 0 0 60px rgba(252, 231, 243, 0.7); }
      }
    `;
  }
}

// Create global instance
window.ThemeManager = new ThemeManager();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}