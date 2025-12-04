import { useState } from 'react';
import './CustomizationPanel.css';
import useDraggable from '../../hooks/useDraggable';

const CustomizationPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('branding');
  const [settings, setSettings] = useState(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem('overlaySettings');
    return saved ? JSON.parse(saved) : {
      // General
      streamerName: 'Your Name',
      websiteUrl: '',
      logoUrl: '',
      backgroundType: 'stars',
      panelPosition: 'right',
      carouselSpeed: 3,
      dragResize: true,
      
      // Colors
      primaryColor: '#9147ff',
      secondaryColor: '#00e1ff',
      accentColor: '#667eea',
      backgroundColor: '#0f0f23',
      textColor: '#ffffff',
      
      // Gradients
      gradient1: '#667eea',
      gradient2: '#764ba2',
      gradientAngle: 135,
      
      // Effects
      animations: true,
      particles: true,
      blur: true,
      shadows: true,
      glow: true,
      
      // Chat
      twitchChannel: '',
      showChat: false,
      chatPosition: 'bottom-left',
      chatWidth: 350,
      chatHeight: 500
    };
  });

  const themes = [
    { id: 'default', name: 'Default', colors: ['#23243a', '#9346ff', '#00e1ff'] },
    { id: 'dark-purple', name: 'Dark Purple', colors: ['#1a1625', '#7b2cbf', '#c77dff'] },
    { id: 'neon-cyan', name: 'Neon Cyan', colors: ['#0a192f', '#00ffff', '#00cccc'] },
    { id: 'sunset-orange', name: 'Sunset Orange', colors: ['#2d1b1e', '#ff6b35', '#ffaa00'] },
    { id: 'forest-green', name: 'Forest Green', colors: ['#1a2e1a', '#52b788', '#95d5b2'] },
    { id: 'royal-blue', name: 'Royal Blue', colors: ['#0d1b2a', '#415a77', '#778da9'] },
    { id: 'hot-pink', name: 'Hot Pink', colors: ['#2b1628', '#ff006e', '#fb5607'] },
    { id: 'crimson-red', name: 'Crimson Red', colors: ['#1a0a0a', '#dc2f02', '#e85d04'] },
    { id: 'gold-rush', name: 'Gold Rush', colors: ['#2d2102', '#ffd60a', '#ffc300'] },
    { id: 'ocean-blue', name: 'Ocean Blue', colors: ['#03045e', '#0077b6', '#00b4d8'] },
    { id: 'midnight-black', name: 'Midnight Black', colors: ['#0d0d0d', '#333333', '#1a1a1a'] },
    { id: 'pastel-dream', name: 'Pastel Dream', colors: ['#f8f9fa', '#e9ecef', '#dee2e6'] },
    { id: 'retro-vibes', name: 'Retro Vibes', colors: ['#3d0066', '#ff00ff', '#00ffff'] },
    { id: 'christmas', name: 'Christmas', colors: ['#0d3b0d', '#c41e3a', '#4cbb17'] },
    { id: 'matrix', name: 'Matrix', colors: ['#000000', '#00ff00', '#003300'] }
  ];

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('overlaySettings', JSON.stringify(settings));
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
    document.documentElement.style.setProperty('--text-color', settings.textColor);
    document.documentElement.style.setProperty('--gradient-1', settings.gradient1);
    document.documentElement.style.setProperty('--gradient-2', settings.gradient2);
    document.documentElement.style.setProperty('--gradient-angle', `${settings.gradientAngle}deg`);
    
    alert('Settings saved successfully!');
    onClose();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('overlaySettings');
      window.location.reload();
    }
  };

  const applyTheme = (theme) => {
    setSettings({
      ...settings,
      backgroundColor: theme.colors[0],
      primaryColor: theme.colors[1],
      secondaryColor: theme.colors[2]
    });
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const renderBrandingTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>🏷️ Branding</h3>
        <div className="setting-row">
          <label>Streamer Name:</label>
          <input type="text" id="custom-streamer-name" placeholder="Enter streamer name" />
        </div>
        <div className="setting-row">
          <label>Website URL:</label>
          <input type="url" id="custom-website-url" placeholder="https://your-website.com" />
        </div>
        <div className="setting-row">
          <label>Logo:</label>
          <button className="file-btn" onClick={() => document.getElementById('custom-logo-file').click()}>
            Choose Logo
          </button>
          <input type="file" id="custom-logo-file" accept="image/*" style={{ display: 'none' }} />
          <button className="reset-btn">Reset</button>
        </div>
      </div>

      <div className="section">
        <h3>🖼️ Background</h3>
        <div className="setting-row">
          <label>Background Type:</label>
          <select id="background-type">
            <option value="color">Solid Color</option>
            <option value="gradient">Gradient</option>
            <option value="image">Image</option>
          </select>
        </div>
        <div className="setting-row">
          <label>Background Color:</label>
          <input type="color" id="bg-color" defaultValue="#0c1445" />
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>📍 Panel Positioning</h3>
        <div className="setting-row">
          <label>Info Panel Position:</label>
          <select id="info-panel-position">
            <option value="upper-right">Upper Right</option>
            <option value="lower-right">Lower Right</option>
            <option value="upper-left">Upper Left</option>
            <option value="lower-left">Lower Left</option>
            <option value="center-right">Center Right (Default)</option>
          </select>
        </div>
        <div className="setting-row">
          <label>Tournament Position:</label>
          <select id="tournament-position">
            <option value="upper-right">Upper Right</option>
            <option value="lower-right">Lower Right</option>
            <option value="upper-left">Upper Left</option>
            <option value="lower-left">Lower Left</option>
            <option value="center-right">Center Right (Default)</option>
          </select>
        </div>
      </div>

      <div className="section">
        <h3>🎠 Bonus List</h3>
        <div className="setting-row">
          <label>Carousel Control:</label>
          <div className="button-group">
            <button className="control-btn" title="Pause/Play">⏸️</button>
            <button className="control-btn" title="Speed">🏃</button>
          </div>
        </div>
        <div className="setting-row">
          <label>Enable Drag/Resize:</label>
          <input type="checkbox" id="enable-drag-resize" />
        </div>
      </div>
    </div>
  );

  const renderColorsTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>🎨 Base Colors</h3>
        <div className="setting-row">
          <label>Primary Color:</label>
          <input type="color" id="primary-color" defaultValue="#9346ff" />
        </div>
        <div className="setting-row">
          <label>Secondary Color:</label>
          <input type="color" id="secondary-color" defaultValue="#00e1ff" />
        </div>
        <div className="setting-row">
          <label>Accent Color:</label>
          <input type="color" id="accent-color" defaultValue="#ff006e" />
        </div>
        <div className="setting-row">
          <label>Background Color:</label>
          <input type="color" id="panel-bg-color" defaultValue="#23243a" />
        </div>
        <div className="setting-row">
          <label>Text Color:</label>
          <input type="color" id="text-color" defaultValue="#f3f4f6" />
        </div>
      </div>

      <div className="section">
        <h3>🌈 Gradients</h3>
        <div className="setting-row">
          <label>Gradient Color 1:</label>
          <input type="color" id="gradient-color-1" defaultValue="#9346ff" />
        </div>
        <div className="setting-row">
          <label>Gradient Color 2:</label>
          <input type="color" id="gradient-color-2" defaultValue="#00e1ff" />
        </div>
        <div className="setting-row">
          <label>Gradient Angle:</label>
          <input type="range" id="gradient-angle" min="0" max="360" defaultValue="135" />
          <span id="gradient-angle-value">135°</span>
        </div>
      </div>
    </div>
  );

  const renderEffectsTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>✨ Visual Effects</h3>
        <div className="setting-row">
          <label>Animations:</label>
          <input type="checkbox" id="enable-animations" defaultChecked />
        </div>
        <div className="setting-row">
          <label>Particles:</label>
          <input type="checkbox" id="enable-particles" />
        </div>
        <div className="setting-row">
          <label>Blur Effects:</label>
          <input type="checkbox" id="enable-blur" defaultChecked />
        </div>
        <div className="setting-row">
          <label>Shadows:</label>
          <input type="checkbox" id="enable-shadows" defaultChecked />
        </div>
        <div className="setting-row">
          <label>Glow Effects:</label>
          <input type="checkbox" id="enable-glow" defaultChecked />
        </div>
      </div>
    </div>
  );

  const renderWidgetsTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>💬 Twitch Chat</h3>
        <div className="setting-row">
          <label>Enable Twitch Chat:</label>
          <input 
            type="checkbox" 
            id="enable-twitch-chat"
            defaultChecked={localStorage.getItem('showTwitchChat') === 'true'}
            onChange={(e) => {
              const showChat = e.target.checked;
              localStorage.setItem('showTwitchChat', showChat);
              window.dispatchEvent(new CustomEvent('toggleTwitchChat', { detail: { show: showChat } }));
            }}
          />
        </div>
        <div className="setting-row">
          <label>Twitch Channel:</label>
          <input type="text" id="twitch-channel" placeholder="Enter channel name" />
        </div>
        <div className="setting-row">
          <label>Chat Position:</label>
          <select 
            id="chat-position"
            defaultValue={settings.chatPosition || 'bottom-left'}
            onChange={(e) => {
              const newSettings = { ...settings, chatPosition: e.target.value };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              window.dispatchEvent(new CustomEvent('chatSettingsUpdated'));
            }}
          >
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
        <div className="setting-row">
          <label>Chat Width:</label>
          <input 
            type="range" 
            id="chat-width" 
            min="200" 
            max="500" 
            defaultValue={settings.chatWidth || 350}
            onChange={(e) => {
              const width = parseInt(e.target.value);
              document.getElementById('chat-width-value').textContent = `${width}px`;
              const newSettings = { ...settings, chatWidth: width };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              window.dispatchEvent(new CustomEvent('chatSettingsUpdated'));
            }}
          />
          <span id="chat-width-value">{settings.chatWidth || 350}px</span>
        </div>
        <div className="setting-row">
          <label>Chat Height:</label>
          <input 
            type="range" 
            id="chat-height" 
            min="300" 
            max="800" 
            defaultValue={settings.chatHeight || 500}
            onChange={(e) => {
              const height = parseInt(e.target.value);
              document.getElementById('chat-height-value').textContent = `${height}px`;
              const newSettings = { ...settings, chatHeight: height };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              window.dispatchEvent(new CustomEvent('chatSettingsUpdated'));
            }}
          />
          <span id="chat-height-value">{settings.chatHeight || 500}px</span>
        </div>
      </div>
      
      <div className="section">
        <h3>🎵 Spotify Widget</h3>
        <div className="setting-row">
          <label>Enable Spotify Widget:</label>
          <input 
            type="checkbox" 
            id="enable-spotify-widget"
            defaultChecked={localStorage.getItem('showSpotify') === 'true'}
            onChange={(e) => {
              const showSpotify = e.target.checked;
              localStorage.setItem('showSpotify', showSpotify);
              window.dispatchEvent(new CustomEvent('toggleSpotify', { detail: { show: showSpotify } }));
            }}
          />
        </div>
        <div className="setting-row">
          <label>Spotify Position:</label>
          <select id="spotify-position">
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderThemesTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>🌈 Theme Presets</h3>
        <div className="themes-grid">
          {themes.map(theme => (
            <button 
              key={theme.id} 
              className="theme-card"
              onClick={() => applyTheme(theme)}
            >
              <div className="theme-preview">
                <div className="preview-bar" style={{ background: theme.colors[0] }} />
                <div className="preview-bar" style={{ background: theme.colors[1] }} />
                <div className="preview-bar" style={{ background: theme.colors[2] }} />
              </div>
              <span className="theme-name">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const draggableRef = useDraggable(true, 'customization');

  return (
    <div className="customization-overlay">
      <div className="customization-panel" ref={draggableRef}>
        <div className="customization-header drag-handle">
          <h2>🎨 Customization Panel</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="customization-tabs">
          <button 
            className={`tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            🏷️ Brand
          </button>
          <button 
            className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            📐 Layout
          </button>
          <button 
            className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            🎨 Colors
          </button>
          <button 
            className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
            onClick={() => setActiveTab('effects')}
          >
            ✨ Effects
          </button>
          <button 
            className={`tab-btn ${activeTab === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >
            🔌 Widgets
          </button>
          <button 
            className={`tab-btn ${activeTab === 'themes' ? 'active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            🌈 Themes
          </button>
        </div>

        <div className="customization-body">
          {activeTab === 'branding' && renderBrandingTab()}
          {activeTab === 'layout' && renderLayoutTab()}
          {activeTab === 'colors' && renderColorsTab()}
          {activeTab === 'effects' && renderEffectsTab()}
          {activeTab === 'widgets' && renderWidgetsTab()}
          {activeTab === 'themes' && renderThemesTab()}
        </div>

        <div className="customization-footer">
          <button className="action-btn reset-btn" onClick={handleReset}>Reset All</button>
          <button className="action-btn save-btn" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
