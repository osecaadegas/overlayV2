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
      streamerName: localStorage.getItem('streamerName') || 'Your Name',
      websiteUrl: '',
      logoUrl: '',
      backgroundType: 'stars',
      backgroundStyle: 'animated-stars',
      customBackgroundUrl: '',
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
      chatHeight: 500,
      
      // Spotify
      showSpotify: false
    };
  });

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('overlaySettings', JSON.stringify(settings));
    
    alert('Settings saved successfully!');
    onClose();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('overlaySettings');
      window.location.reload();
    }
  };

  const renderBrandingTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>🏷️ Branding</h3>
        <div className="setting-row">
          <label>Streamer Name:</label>
          <input 
            type="text" 
            id="custom-streamer-name" 
            placeholder="Enter streamer name"
            defaultValue={settings.streamerName}
            onChange={(e) => {
              const newName = e.target.value;
              const newSettings = { ...settings, streamerName: newName };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              localStorage.setItem('streamerName', newName);
              localStorage.setItem('twitchChannel', newName);
              window.dispatchEvent(new CustomEvent('streamerNameChanged', { detail: { name: newName } }));
            }}
          />
        </div>
        <div className="setting-row">
          <label>Default Slot Image:</label>
          <select 
            value={localStorage.getItem('defaultSlotImage') || 'zilhas.png'}
            onChange={(e) => {
              localStorage.setItem('defaultSlotImage', e.target.value);
              window.dispatchEvent(new CustomEvent('defaultSlotImageChanged'));
            }}
          >
            <option value="zilhas.png">Zilhas</option>
            <option value="seca.png">Seca</option>
            <option value="TnT.png">TnT</option>
          </select>
        </div>
      </div>
    </div>
  );



  const renderBackgroundTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>🎨 Background Style</h3>
        
        <div className="background-grid">
          {/* Animated Backgrounds */}
          <div 
            className={`background-option ${settings.backgroundStyle === 'animated-stars' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'animated-stars' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'animated-stars';
            }}
          >
            <div className="bg-preview animated-stars-preview"></div>
            <span>Animated Stars</span>
          </div>

          <div 
            className={`background-option ${settings.backgroundStyle === 'particles' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'particles' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'particles';
            }}
          >
            <div className="bg-preview particles-preview"></div>
            <span>Particles</span>
          </div>

          {/* Solid Colors */}
          <div 
            className={`background-option ${settings.backgroundStyle === 'dark' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'dark' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'dark';
            }}
          >
            <div className="bg-preview" style={{ background: '#0f0f23' }}></div>
            <span>Dark Blue</span>
          </div>

          <div 
            className={`background-option ${settings.backgroundStyle === 'black' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'black' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'black';
            }}
          >
            <div className="bg-preview" style={{ background: '#000000' }}></div>
            <span>Pure Black</span>
          </div>

          <div 
            className={`background-option ${settings.backgroundStyle === 'purple' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'purple' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'purple';
            }}
          >
            <div className="bg-preview" style={{ background: '#1a0f2e' }}></div>
            <span>Deep Purple</span>
          </div>

          {/* Gradients */}
          <div 
            className={`background-option ${settings.backgroundStyle === 'gradient-purple' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'gradient-purple' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'gradient-purple';
            }}
          >
            <div className="bg-preview" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            <span>Purple Gradient</span>
          </div>

          <div 
            className={`background-option ${settings.backgroundStyle === 'gradient-blue' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'gradient-blue' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'gradient-blue';
            }}
          >
            <div className="bg-preview" style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}></div>
            <span>Ocean Gradient</span>
          </div>

          <div 
            className={`background-option ${settings.backgroundStyle === 'gradient-sunset' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'gradient-sunset' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'gradient-sunset';
            }}
          >
            <div className="bg-preview" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)' }}></div>
            <span>Sunset Gradient</span>
          </div>

          <div 
            className={`background-option ${settings.backgroundStyle === 'gradient-neon' ? 'active' : ''}`}
            onClick={() => {
              const newSettings = { ...settings, backgroundStyle: 'gradient-neon' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              document.body.className = 'gradient-neon';
            }}
          >
            <div className="bg-preview" style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #9147ff 50%, #ff006e 100%)' }}></div>
            <span>Neon Gradient</span>
          </div>
        </div>

        <div className="setting-row">
          <label>Custom Background URL:</label>
          <input 
            type="text" 
            placeholder="Enter image URL or upload below"
            value={settings.customBackgroundUrl || ''}
            onChange={(e) => {
              const url = e.target.value;
              const newSettings = { ...settings, customBackgroundUrl: url, backgroundStyle: 'custom' };
              setSettings(newSettings);
              localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
              if (url) {
                document.body.style.background = `url(${url}) center/cover fixed`;
              }
            }}
          />
        </div>

        <div className="setting-row">
          <label>Or Upload Background:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const url = event.target.result;
                  const newSettings = { ...settings, customBackgroundUrl: url, backgroundStyle: 'custom' };
                  setSettings(newSettings);
                  localStorage.setItem('overlaySettings', JSON.stringify(newSettings));
                  document.body.style.background = `url(${url}) center/cover fixed`;
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderWidgetsTab = () => (
    <div className="tab-panel">
      <div className="section">
        <h3>🎵 Spotify Widget</h3>
        <div className="setting-row">
          <label>Enable Spotify Widget:</label>
          <input 
            type="checkbox" 
            id="enable-spotify"
            defaultChecked={localStorage.getItem('showSpotify') === 'true'}
            onChange={(e) => {
              const showSpotify = e.target.checked;
              localStorage.setItem('showSpotify', showSpotify);
              window.dispatchEvent(new CustomEvent('toggleSpotify', { detail: { show: showSpotify } }));
            }}
          />
        </div>
      </div>

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
          <input 
            type="text" 
            id="twitch-channel" 
            placeholder="Enter channel name"
            defaultValue={localStorage.getItem('twitchChannel') || ''}
            onChange={(e) => {
              const newChannel = e.target.value;
              localStorage.setItem('twitchChannel', newChannel);
              localStorage.setItem('streamerName', newChannel);
              window.dispatchEvent(new CustomEvent('streamerNameChanged', { detail: { name: newChannel } }));
            }}
          />
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
            className={`tab-btn ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => setActiveTab('background')}
          >
            🎨 Background
          </button>
          <button 
            className={`tab-btn ${activeTab === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >
            🔌 Widgets
          </button>
        </div>

        <div className="customization-body">
          {activeTab === 'branding' && renderBrandingTab()}
          {activeTab === 'background' && renderBackgroundTab()}
          {activeTab === 'widgets' && renderWidgetsTab()}
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
