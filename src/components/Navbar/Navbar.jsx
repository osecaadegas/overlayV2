import './Navbar.css';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [streamerName, setStreamerName] = useState('Streamer');
  const [isEditingName, setIsEditingName] = useState(false);
  const [logoSrc, setLogoSrc] = useState('https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png');
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [contentImage, setContentImage] = useState('/wager.png'); // Default to wager
  const contentImages = ['/wager.png', '/raw.png', '/content.png'];

  const toggleContentImage = () => {
    setContentImage(prev => {
      const currentIndex = contentImages.indexOf(prev);
      const nextIndex = (currentIndex + 1) % contentImages.length;
      return contentImages[nextIndex];
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,ripple,dogecoin,polkadot&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        
        const formattedPrices = [
          { symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin?.usd, change: data.bitcoin?.usd_24h_change },
          { symbol: 'ETH', name: 'Ethereum', price: data.ethereum?.usd, change: data.ethereum?.usd_24h_change },
          { symbol: 'BNB', name: 'BNB', price: data.binancecoin?.usd, change: data.binancecoin?.usd_24h_change },
          { symbol: 'SOL', name: 'Solana', price: data.solana?.usd, change: data.solana?.usd_24h_change },
          { symbol: 'XRP', name: 'XRP', price: data.ripple?.usd, change: data.ripple?.usd_24h_change },
          { symbol: 'ADA', name: 'Cardano', price: data.cardano?.usd, change: data.cardano?.usd_24h_change },
          { symbol: 'DOGE', name: 'Dogecoin', price: data.dogecoin?.usd, change: data.dogecoin?.usd_24h_change },
          { symbol: 'DOT', name: 'Polkadot', price: data.polkadot?.usd, change: data.polkadot?.usd_24h_change },
        ];
        
        setCryptoPrices(formattedPrices);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setLogoSrc(e.target.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleNameClick = () => setIsEditingName(true);
  const handleNameBlur = (e) => {
    setStreamerName(e.target.value || 'Streamer');
    setIsEditingName(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img 
          src={logoSrc} 
          alt="Logo" 
          className="navbar-logo" 
          onClick={handleLogoClick}
          title="Click to change logo"
        />
        {isEditingName ? (
          <input
            type="text"
            defaultValue={streamerName}
            onBlur={handleNameBlur}
            onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
            autoFocus
            className="streamer-name-input"
          />
        ) : (
          <span 
            className="streamer-name" 
            onClick={handleNameClick}
            title="Click to edit streamer name"
          >
            {streamerName}
          </span>
        )}
        <img 
          src={contentImage} 
          alt="Content Badge" 
          className="content-badge" 
          onClick={toggleContentImage}
          title="Click to switch content badge"
        />
      </div>
      
      <div className="navbar-center">
        <span className="current-time">{currentTime}</span>
      </div>
      
      <div className="navbar-right">
        <div className="crypto-ticker">
          <div className="crypto-ticker-track">
            {cryptoPrices.length > 0 && (
              <>
                {[...cryptoPrices, ...cryptoPrices].map((crypto, index) => (
                  <div key={index} className="crypto-item">
                    <span className="crypto-symbol">{crypto.symbol}</span>
                    <span className="crypto-price">${crypto.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={`crypto-change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                      {crypto.change >= 0 ? '▲' : '▼'} {Math.abs(crypto.change)?.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="aware-link">
          Be Gamble Aware|+🔞
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
