import { useState } from 'react';
import './OffersPage.css';
import { offersData } from './offersData';

export default function OffersPage() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="offers-page">
      <div className="offers-container">
        <div className="offers-header">
          <h1>Casinos & Offers</h1>
          <p>Best offers and bonuses exclusive for you</p>
        </div>

        <div className="offers-grid">
          {offersData.map((offer) => (
            <div key={offer.id} className="offer-card-wrapper">
              <div className={`offer-card ${flippedCards[offer.id] ? 'flipped' : ''}`}>
                {/* Front of card */}
                <div className="offer-card-front">
                  {offer.badge && (
                    <div className={`offer-badge ${offer.badge.toLowerCase()}`}>
                      ● {offer.badge}
                    </div>
                  )}
                  
                  <div className="offer-image">
                    <img src={offer.image} alt={offer.name} />
                    <div className="offer-name">{offer.name}</div>
                  </div>

                  <div className="offer-title">{offer.bonusTitle}</div>
                  <div className="offer-terms">{offer.terms}</div>

                  <div className="offer-features">
                    <div className="feature">
                      <div className="feature-icon">💰</div>
                      <div className="feature-label">Min. deposit</div>
                      <div className="feature-value">{offer.minDeposit}</div>
                    </div>
                    
                    {offer.cashback && (
                      <div className="feature">
                        <div className="feature-icon">💸</div>
                        <div className="feature-label">Cashback</div>
                        <div className="feature-value">{offer.cashback}</div>
                      </div>
                    )}
                    
                    {offer.code && (
                      <div className="feature">
                        <div className="feature-icon">🎟️</div>
                        <div className="feature-label">Code</div>
                        <div className="feature-value">{offer.code}</div>
                      </div>
                    )}

                    <div className="feature">
                      <div className="feature-icon">🎁</div>
                      <div className="feature-label">Bonus value</div>
                      <div className="feature-value">{offer.bonusValue}</div>
                    </div>

                    {offer.freeSpins && (
                      <div className="feature">
                        <div className="feature-icon">🎰</div>
                        <div className="feature-label">Free spins</div>
                        <div className="feature-value">{offer.freeSpins}</div>
                      </div>
                    )}
                  </div>

                  <button 
                    className="offer-more-info"
                    onClick={() => toggleFlip(offer.id)}
                  >
                    MORE INFO
                  </button>

                  <a 
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="offer-claim-btn"
                  >
                    CLAIM BONUS
                  </a>
                </div>

                {/* Back of card */}
                <div className="offer-card-back">
                  <button 
                    className="offer-back-close"
                    onClick={() => toggleFlip(offer.id)}
                  >
                    ✕
                  </button>

                  <div className="offer-back-header">
                    <div className="offer-back-name">{offer.name}</div>
                    <div className="offer-back-date">Est. 2023</div>
                  </div>

                  <div className="offer-back-info">
                    <div className="info-row">
                      <span className="info-label">Withdraw Time</span>
                      <span className="info-value">{offer.withdrawTime}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">License</span>
                      <span className="info-value">{offer.license}</span>
                    </div>
                  </div>

                  <div className="offer-back-description">
                    {offer.description}
                  </div>

                  <a 
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="offer-claim-btn"
                  >
                    CLAIM BONUS
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
