import { useState, useEffect } from 'react';
import './App.css';
import { BonusHuntProvider, useBonusHunt } from './context/BonusHuntContext';
import Navbar from './components/Navbar/Navbar';
import BonusList from './components/BonusList/BonusList';
import StatsPanel from './components/StatsPanel/StatsPanel';
import ModernCardLayout from './components/ModernCardLayout/ModernCardLayout';
import ModernSidebarLayout from './components/ModernSidebarLayout/ModernSidebarLayout';
import CurrentlyOpening from './components/CurrentlyOpening/CurrentlyOpening';
import BHPanel from './components/BHPanel/BHPanel';
import CircularSidebar from './components/CircularSidebar/CircularSidebar';
import BonusOpening from './components/BonusOpening/BonusOpening';
import EditSlots from './components/EditSlots/EditSlots';
import CustomizationPanel from './components/CustomizationPanel/CustomizationPanel';
import TutorialPanel from './components/TutorialPanel/TutorialPanel';
import TournamentPanel from './components/TournamentPanel/TournamentPanel';
import GiveawayPanel from './components/GiveawayPanel/GiveawayPanel';
import RandomSlotPicker from './components/RandomSlotPicker/RandomSlotPicker';
import ArtAdPanel from './components/ArtAdPanel/ArtAdPanel';
import SlotMachine from './components/SlotMachine/SlotMachine';
import CoinFlip from './components/CoinFlip/CoinFlip';
import SpotifyWidget from './components/SpotifyWidget/SpotifyWidget';
import TwitchChat from './components/TwitchChat/TwitchChat';

function AppContent() {
  const { layoutMode, setLayoutMode } = useBonusHunt();
  const [showBHPanel, setShowBHPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showBonusOpening, setShowBonusOpening] = useState(false);
  const [showBHStats, setShowBHStats] = useState(() => localStorage.getItem('showBHStats') !== 'false');
  const [showBHCards, setShowBHCards] = useState(() => localStorage.getItem('showBHCards') !== 'false');
  const [showEditSlots, setShowEditSlots] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedBonusId, setSelectedBonusId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTournament, setShowTournament] = useState(false);
  const [showGiveaway, setShowGiveaway] = useState(false);
  const [showRandomSlot, setShowRandomSlot] = useState(false);
  const [showArtAd, setShowArtAd] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showSpotify, setShowSpotify] = useState(() => localStorage.getItem('showSpotify') === 'true');
  const [showTwitchChatWidget, setShowTwitchChatWidget] = useState(() => localStorage.getItem('showTwitchChat') === 'true');
  const [chatSettings, setChatSettings] = useState(() => {
    const settings = localStorage.getItem('overlaySettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      return {
        position: parsed.chatPosition || 'bottom-right',
        width: parsed.chatWidth || 350,
        height: parsed.chatHeight || 500
      };
    }
    return { position: 'bottom-right', width: 350, height: 500 };
  });

  // Listen for customization panel toggles
  useEffect(() => {
    const handleToggleSpotify = (e) => setShowSpotify(e.detail.show);
    const handleToggleTwitch = (e) => setShowTwitchChatWidget(e.detail.show);
    const handleToggleBHStats = (e) => {
      setShowBHStats(e.detail.show);
      if (e.detail.show) setShowStatsPanel(true);
    };
    const handleToggleBHCards = (e) => setShowBHCards(e.detail.show);
    const handleChatSettingsUpdate = () => {
      const settings = localStorage.getItem('overlaySettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setChatSettings({
          position: parsed.chatPosition || 'bottom-left',
          width: parsed.chatWidth || 350,
          height: parsed.chatHeight || 500
        });
      }
    };
    
    window.addEventListener('toggleSpotify', handleToggleSpotify);
    window.addEventListener('toggleTwitchChat', handleToggleTwitch);
    window.addEventListener('toggleBHStats', handleToggleBHStats);
    window.addEventListener('toggleBHCards', handleToggleBHCards);
    window.addEventListener('chatSettingsUpdated', handleChatSettingsUpdate);
    
    return () => {
      window.removeEventListener('toggleSpotify', handleToggleSpotify);
      window.removeEventListener('toggleTwitchChat', handleToggleTwitch);
      window.removeEventListener('toggleBHStats', handleToggleBHStats);
      window.removeEventListener('toggleBHCards', handleToggleBHCards);
      window.removeEventListener('chatSettingsUpdated', handleChatSettingsUpdate);
    };
  }, []);

  const handleBonusClick = (bonusId) => {
    setSelectedBonusId(bonusId);
    setShowBonusOpening(true);
  };

  const handleMenuSelect = (menuId) => {
    console.log('Menu selected:', menuId);
    if (menuId === 'slotMachine') {
      console.log('SLOT MACHINE CLICKED - Current state:', showSlotMachine);
      setShowSlotMachine(!showSlotMachine);
      console.log('SLOT MACHINE NEW STATE:', !showSlotMachine);
      return;
    }
    if (menuId === 'coinFlip') {
      setShowCoinFlip(!showCoinFlip);
      return;
    }
    switch(menuId) {
      case 'customization':
        setShowCustomization(!showCustomization); // Toggle instead of just opening
        break;
      case 'bonusHunt':
        setShowBHPanel(!showBHPanel);
        setShowStatsPanel(!showBHPanel); // Toggle stats panel with BH panel
        break;
      case 'editSlots':
        setShowEditSlots(true);
        break;
      case 'tutorial':
        setShowTutorial(true);
        break;
      case 'randomSlot':
        setShowRandomSlot(!showRandomSlot); // Toggle instead of just opening
        break;
      case 'tournament':
        setShowTournament(!showTournament); // Toggle instead of just opening
        break;
      case 'giveaway':
        setShowGiveaway(!showGiveaway); // Toggle instead of just opening
        break;
      case 'artAd':
        setShowArtAd(!showArtAd); // Toggle instead of just opening
        break;
      default:
        break;
    }
  };

  return (
    <div className="overlay-container">
      <Navbar />
      
      <div className="main-layout">
        {/* Currently Opening Card - Outside scroll container */}
        {showBonusOpening && layoutMode === 'modern-sidebar' && showStatsPanel && <CurrentlyOpening selectedBonusId={selectedBonusId} />}
        
        {/* Right Sidebar - Info Panel (Conditionally visible) */}
        <aside className={`info-panel ${showStatsPanel && showBHStats ? 'info-panel--visible' : ''}`} style={{ display: showStatsPanel && showBHStats ? 'flex' : 'none' }}>
          {/* Layout Switcher */}
          <div className="layout-switcher">
            <button 
              className={`layout-btn ${layoutMode === 'classic' ? 'active' : ''}`}
              onClick={() => setLayoutMode('classic')}
              title="Classic Layout"
            >
              📋
            </button>
            <button 
              className={`layout-btn ${layoutMode === 'modern-card' ? 'active' : ''}`}
              onClick={() => setLayoutMode('modern-card')}
              title="Card Layout"
            >
              🎴
            </button>
            <button 
              className={`layout-btn ${layoutMode === 'modern-sidebar' ? 'active' : ''}`}
              onClick={() => setLayoutMode('modern-sidebar')}
              title="Sidebar Layout"
            >
              📊
            </button>
          </div>

          {/* Statistics Section - Only show for classic layout */}
          {showStatsPanel && showBHStats && layoutMode === 'classic' && <StatsPanel />}

          {/* Bonus List Section */}
          {layoutMode === 'classic' && <BonusList onBonusClick={handleBonusClick} />}
          {layoutMode === 'modern-card' && <ModernCardLayout showCards={showBHCards} />}
          {layoutMode === 'modern-sidebar' && <ModernSidebarLayout showCards={showBHCards} />}
        </aside>
      </div>
      {showBHPanel && <BHPanel onClose={() => setShowBHPanel(false)} onOpenBonusOpening={(bonusId) => {
        setSelectedBonusId(bonusId);
        setShowBonusOpening(true);
      }} />}
      {showEditSlots && <EditSlots onClose={() => setShowEditSlots(false)} />}
      {showCustomization && <CustomizationPanel onClose={() => setShowCustomization(false)} />}
      {showTutorial && <TutorialPanel onClose={() => setShowTutorial(false)} />}
      {showTournament && <TournamentPanel onClose={() => setShowTournament(false)} />}
      {showGiveaway && <GiveawayPanel onClose={() => setShowGiveaway(false)} />}
      {showRandomSlot && <RandomSlotPicker onClose={() => setShowRandomSlot(false)} />}
      {showArtAd && <ArtAdPanel onClose={() => setShowArtAd(false)} />}
      
      {/* Slot Machine */}
      {console.log('Rendering SlotMachine check:', showSlotMachine)}
      {showSlotMachine && (
        <>
          {console.log('RENDERING SLOT MACHINE NOW')}
          <SlotMachine onClose={() => {
            console.log('CLOSING SLOT MACHINE');
            setShowSlotMachine(false);
          }} />
        </>
      )}
      
      {/* Coin Flip */}
      {showCoinFlip && <CoinFlip onClose={() => setShowCoinFlip(false)} />}
      
      {/* Spotify Widget (only show if enabled in customization) */}
      {showSpotify && <SpotifyWidget />}
      
      {/* Twitch Chat (only show if enabled in customization) */}
      {showTwitchChatWidget && <TwitchChat channel={localStorage.getItem('twitchChannel') || ''} position={chatSettings.position} width={chatSettings.width} height={chatSettings.height} />}
      
      {/* Bonus Opening Panel */}
      {showBonusOpening && (
        <BonusOpening 
          bonusId={selectedBonusId} 
          onClose={() => { 
            setShowBonusOpening(false); 
            setSelectedBonusId(null);
            setShowBHPanel(true);
          }}
          onBonusChange={(bonusId) => setSelectedBonusId(bonusId)}
        />
      )}
      
      <CircularSidebar onMenuSelect={handleMenuSelect} isLocked={isLocked} onLockToggle={() => setIsLocked(!isLocked)} />
    </div>
  );
}

function App() {
  return (
    <BonusHuntProvider>
      <AppContent />
    </BonusHuntProvider>
  );
}

export default App;
