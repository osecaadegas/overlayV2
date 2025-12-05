import './StreamPage.css';

export default function StreamPage() {
  const twitchChannel = 'osecaadegas95';
  
  return (
    <div className="stream-page">
      <div className="stream-container">
        <h1>📺 Live Stream</h1>
        <p className="stream-subtitle">Watch our live casino streaming sessions</p>
        
        <div className="stream-content">
          <div className="stream-embed">
            <iframe
              src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}`}
              height="600"
              width="100%"
              allowFullScreen
              title="Twitch Stream"
              style={{ border: 'none', borderRadius: '12px' }}
            />
          </div>

          <div className="stream-info">
            <h3>Stream Information</h3>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="status-badge offline">Offline</span>
            </div>
            <div className="info-item">
              <span className="info-label">Viewers:</span>
              <span>0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Schedule:</span>
              <span>Daily at 8PM EST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
