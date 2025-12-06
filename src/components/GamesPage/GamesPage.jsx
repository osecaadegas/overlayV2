import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './GamesPage.css';

export default function GamesPage() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'coinflip',
      title: '🪙 Coin Flip',
      description: 'Bet on heads or tails. Double or nothing!',
      minBet: 10,
      icon: '🪙'
    },
    {
      id: 'dice',
      title: '🎲 Dice Roll',
      description: 'Roll the dice and predict the outcome!',
      minBet: 20,
      icon: '🎲'
    },
    {
      id: 'roulette',
      title: '🎰 Roulette',
      description: 'Spin the wheel and test your luck!',
      minBet: 50,
      icon: '🎰'
    },
    {
      id: 'slots',
      title: '🎰 Slot Machine',
      description: 'Pull the lever and win big!',
      minBet: 25,
      icon: '🎰'
    }
  ];

  const handleGameSelect = (game) => {
    if (!user) {
      alert('Please log in with Twitch to play games!');
      return;
    }
    setSelectedGame(game);
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <h1>🎮 Games</h1>
        <p className="games-subtitle">
          {user 
            ? 'Choose a game and test your luck!' 
            : 'Log in with Twitch to play games and win points!'}
        </p>

        {!user && (
          <div className="games-login-notice">
            <div className="login-notice-icon">🔒</div>
            <h3>Twitch Login Required</h3>
            <p>Please log in with your Twitch account to access and play games.</p>
          </div>
        )}

        <div className="games-grid">
          {games.map((game) => (
            <div 
              key={game.id}
              className={`game-card ${!user ? 'locked' : ''}`}
              onClick={() => handleGameSelect(game)}
            >
              <div className="game-icon">{game.icon}</div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-meta">
                <span className="min-bet">Min Bet: {game.minBet} pts</span>
                {!user && <span className="locked-badge">🔒 Locked</span>}
              </div>
            </div>
          ))}
        </div>

        {selectedGame && user && (
          <div className="game-modal-overlay" onClick={() => setSelectedGame(null)}>
            <div className="game-modal" onClick={(e) => e.stopPropagation()}>
              <div className="game-modal-header">
                <h2>{selectedGame.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedGame(null)}
                >
                  ×
                </button>
              </div>
              <div className="game-modal-content">
                <p className="coming-soon">🚧 Coming Soon! 🚧</p>
                <p>This game is currently under development.</p>
                <p>Check back later for exciting gameplay!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
