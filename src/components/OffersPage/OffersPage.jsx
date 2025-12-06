import { useState } from 'react';
import './OffersPage.css';

const casinoOffers = [
  {
    id: 1,
    badge: 'HOT',
    badgeClass: 'hot',
    casino: 'Ignibet',
    title: '665% Bonus & 750 FS up to €6250',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop',
    minDeposit: '20€',
    cashback: '30%',
    bonusValue: '665%',
    freeSpins: 'Up to 750',
    isPremium: true,
    details: '+18 | T&C APPLY\n\nNew players only. Min deposit €20. Max bonus €6250 + 750 Free Spins. Wagering 40x. Game weighting applies. T&Cs apply.'
  },
  {
    id: 2,
    badge: 'HOT',
    badgeClass: 'hot',
    casino: 'Betfury',
    title: 'Special GODMOTA VIP Program',
    image: 'https://images.unsplash.com/photo-1518449965925-3439867d4d36?w=400&h=300&fit=crop',
    minDeposit: '20€',
    cashback: '20%',
    bonusValue: '100%',
    freeSpins: 'Up to 100',
    isPremium: true,
    details: '+18 | T&C APPLY\n\nExclusive VIP program for GODMOTA viewers. Level up for better rewards. Cashback on every bet. T&Cs apply.'
  },
  {
    id: 3,
    badge: 'NEW',
    badgeClass: 'new',
    casino: 'Free Coins',
    title: '400% Bonus up to €2200 & 350FS',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop',
    minDeposit: '25€',
    cashback: '35%',
    bonusValue: '400%',
    freeSpins: 'Up to 350',
    isPremium: true,
    details: '+18 | T&C APPLY\n\nWelcome package spread across first 3 deposits. Min deposit €25. Wagering requirements apply. T&Cs apply.'
  },
  {
    id: 4,
    badge: '',
    badgeClass: '',
    casino: 'Flagman',
    title: '125FS on signup & 100€ Free Bets',
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=400&h=300&fit=crop',
    minDeposit: '10€',
    cashback: '',
    bonusValue: '150%',
    freeSpins: 'Up to 125',
    code: 'GODMOTA',
    isPremium: true,
    details: '+18 | T&C APPLY\n\nNo deposit required for signup spins. Use code GODMOTA for extra bonus. T&Cs apply.'
  },
  {
    id: 5,
    badge: '',
    badgeClass: '',
    casino: 'Lootbox',
    title: '5% On Every Deposit & VIP Battle',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
    minDeposit: '1€',
    cashback: '',
    bonusValue: '5%',
    freeSpins: '',
    code: 'GODMOTA',
    details: '+18 | T&C APPLY\n\nGet 5% extra on every deposit. Join exclusive VIP battles. Use code GODMOTA. T&Cs apply.'
  },
  {
    id: 6,
    badge: '',
    badgeClass: '',
    casino: 'Crasher',
    title: '400% Bonus & 350FS up to €2200',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=300&fit=crop',
    minDeposit: '10€',
    cashback: '',
    bonusValue: '400%',
    freeSpins: 'Up to 350',
    code: 'GODCB',
    details: '+18 | T&C APPLY\n\nMassive welcome package. Min deposit €10. Use code GODCB. Wagering 35x. T&Cs apply.'
  },
  {
    id: 7,
    badge: '',
    badgeClass: '',
    casino: 'BC.GAME',
    title: '360% Bonus & Daily Wheel of Fortune',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=400&h=300&fit=crop',
    minDeposit: '10€',
    cashback: '25%',
    bonusValue: '360%',
    freeSpins: '',
    details: '+18 | T&C APPLY\n\nDaily wheel of fortune with guaranteed prizes. 25% cashback on losses. Min deposit €10. T&Cs apply.'
  },
  {
    id: 8,
    badge: '',
    badgeClass: '',
    casino: 'Ribace',
    title: '400% Bonus + 350FS up to €2000',
    image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=300&fit=crop',
    minDeposit: '25€',
    cashback: '35%',
    bonusValue: '450%',
    freeSpins: 'Up to 350',
    details: '+18 | T&C APPLY\n\nPremium welcome package. Min deposit €25. 35% weekly cashback. Wagering 40x. T&Cs apply.'
  }
];

export default function OffersPage() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const offerOfTheMonth = casinoOffers[0]; // First offer is featured
  const regularOffers = casinoOffers.slice(1); // Rest of the offers

  return (
    <div className="offers-page">
      <div className="offers-container">
        <h1>Casinos & Offers</h1>
        <p className="offers-subtitle">Best offers and bonuses exclusive for you</p>
        
        {/* Offer of the Month */}
        <div className="featured-offer-section">
          <h2 className="featured-title">🌟 Offer of the Month</h2>
          <div className={`offer-card-wrapper featured ${flippedCards[offerOfTheMonth.id] ? 'flipped' : ''} ${offerOfTheMonth.isPremium ? 'premium' : ''}`}>
            <div className="offer-card-inner">
              {/* Front of card */}
              <div className="offer-card-front">
                {offerOfTheMonth.badge && (
                  <div className={`offer-badge ${offerOfTheMonth.badgeClass}`}>{offerOfTheMonth.badge}</div>
                )}
                {offerOfTheMonth.isPremium && <div className="premium-shine"></div>}
                <div className="casino-image-container">
                  <img src={offerOfTheMonth.image} alt={offerOfTheMonth.casino} className="casino-image" />
                  <div className="casino-overlay">
                    <h3 className="casino-name">{offerOfTheMonth.casino}</h3>
                  </div>
                </div>
                <p className="offer-title">{offerOfTheMonth.title}</p>
                <p className="offer-terms">+18 | T&C APPLY</p>
                
                <div className="offer-stats">
                  <div className="stat">
                    <div className="stat-icon">💳</div>
                    <div className="stat-label">Min. deposit</div>
                    <div className="stat-value">{offerOfTheMonth.minDeposit}</div>
                  </div>
                  {offerOfTheMonth.cashback && (
                    <div className="stat">
                      <div className="stat-icon">💰</div>
                      <div className="stat-label">Cashback</div>
                      <div className="stat-value">{offerOfTheMonth.cashback}</div>
                    </div>
                  )}
                  {offerOfTheMonth.code && (
                    <div className="stat">
                      <div className="stat-icon">🔐</div>
                      <div className="stat-label">Code</div>
                      <div className="stat-value">{offerOfTheMonth.code}</div>
                    </div>
                  )}
                  <div className="stat">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-label">Bonus value</div>
                    <div className="stat-value">{offerOfTheMonth.bonusValue}</div>
                  </div>
                  {offerOfTheMonth.freeSpins && (
                    <div className="stat">
                      <div className="stat-icon">🎰</div>
                      <div className="stat-label">Free spins</div>
                      <div className="stat-value">{offerOfTheMonth.freeSpins}</div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button className="info-btn" onClick={() => toggleFlip(offerOfTheMonth.id)}>
                    MORE INFO
                  </button>
                  <button className="claim-btn">CLAIM BONUS</button>
                </div>
              </div>

              {/* Back of card */}
              <div className="offer-card-back">
                <h3 className="casino-name">{offerOfTheMonth.casino}</h3>
                <div className="offer-details">
                  <h4>Terms & Conditions</h4>
                  <p>{offerOfTheMonth.details}</p>
                </div>
                <button className="back-btn" onClick={() => toggleFlip(offerOfTheMonth.id)}>
                  ← BACK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Offers Grid */}
        <h2 className="section-title">All Offers</h2>
        <div className="offers-grid">
          {regularOffers.map(offer => (
            <div key={offer.id} className={`offer-card-wrapper ${flippedCards[offer.id] ? 'flipped' : ''} ${offer.isPremium ? 'premium' : ''}`}>
              <div className="offer-card-inner">
                {/* Front of card */}
                <div className="offer-card-front">
                  {offer.badge && (
                    <div className={`offer-badge ${offer.badgeClass}`}>{offer.badge}</div>
                  )}
                  {offer.isPremium && <div className="premium-shine"></div>}
                  <div className="casino-image-container">
                    <img src={offer.image} alt={offer.casino} className="casino-image" />
                    <div className="casino-overlay">
                      <h3 className="casino-name">{offer.casino}</h3>
                    </div>
                  </div>
                  <p className="offer-title">{offer.title}</p>
                  <p className="offer-terms">+18 | T&C APPLY</p>
                  
                  <div className="offer-stats">
                    <div className="stat">
                      <div className="stat-icon">💳</div>
                      <div className="stat-label">Min. deposit</div>
                      <div className="stat-value">{offer.minDeposit}</div>
                    </div>
                    {offer.cashback && (
                      <div className="stat">
                        <div className="stat-icon">💰</div>
                        <div className="stat-label">Cashback</div>
                        <div className="stat-value">{offer.cashback}</div>
                      </div>
                    )}
                    {offer.code && (
                      <div className="stat">
                        <div className="stat-icon">🔐</div>
                        <div className="stat-label">Code</div>
                        <div className="stat-value">{offer.code}</div>
                      </div>
                    )}
                    <div className="stat">
                      <div className="stat-icon">🎁</div>
                      <div className="stat-label">Bonus value</div>
                      <div className="stat-value">{offer.bonusValue}</div>
                    </div>
                    {offer.freeSpins && (
                      <div className="stat">
                        <div className="stat-icon">🎰</div>
                        <div className="stat-label">Free spins</div>
                        <div className="stat-value">{offer.freeSpins}</div>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button className="info-btn" onClick={() => toggleFlip(offer.id)}>
                      MORE INFO
                    </button>
                    <button className="claim-btn">CLAIM BONUS</button>
                  </div>
                </div>

                {/* Back of card */}
                <div className="offer-card-back">
                  <h3 className="casino-name">{offer.casino}</h3>
                  <div className="offer-details">
                    <h4>Terms & Conditions</h4>
                    <p>{offer.details}</p>
                  </div>
                  <button className="back-btn" onClick={() => toggleFlip(offer.id)}>
                    ← BACK
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
