import { useState } from 'react';
import './SpotifyWidget.css';

const SpotifyWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('No track playing');
  const [currentArtist, setCurrentArtist] = useState('Connect to Spotify');
  const [albumArt, setAlbumArt] = useState('');

  const handleConnect = () => {
    // Spotify OAuth would go here
    alert('Spotify OAuth integration: You would need to set up Spotify Developer credentials and implement OAuth flow.');
    setIsConnected(true);
    setIsVisible(true);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button className="spotify-show-btn" onClick={() => setIsVisible(true)}>
        🎵 Show Spotify
      </button>
    );
  }

  return (
    <div className="spotify-widget">
      <div className="spotify-content">
        {albumArt && (
          <img src={albumArt} alt="Album Art" className="spotify-album-art" />
        )}
        <div className="spotify-info">
          <div className="spotify-track">{currentTrack}</div>
          <div className="spotify-artist">{currentArtist}</div>
        </div>
        <div className="spotify-controls">
          {!isConnected ? (
            <button className="spotify-auth-btn" onClick={handleConnect}>
              Connect Spotify
            </button>
          ) : (
            <button className="spotify-toggle-btn" onClick={toggleVisibility}>
              Hide
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotifyWidget;
