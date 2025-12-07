import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import './OffersPage.css';

export default function OffersPage() {
  const [flippedCards, setFlippedCards] = useState({});
  const [casinoOffers, setCasinoOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('casino_offers')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading offers:', error);
        setCasinoOffers([]);
      } else {
        // Transform data to match component format
        const transformedOffers = data.map(offer => ({
          id: offer.id,
          badge: offer.badge,
          badgeClass: offer.badge_class,
          casino: offer.casino_name,
          title: offer.title,
          image: offer.image_url,
          bonusLink: offer.bonus_link,
          minDeposit: offer.min_deposit,
          cashback: offer.cashback,
          bonusValue: offer.bonus_value,
          freeSpins: offer.free_spins,
          isPremium: offer.is_premium,
          details: offer.details
        }));
        
        setCasinoOffers(transformedOffers || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setCasinoOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="offers-page">
        <div className="offers-loading">Loading offers...</div>
      </div>
    );
  }

  if (casinoOffers.length === 0) {
    return (
      <div className="offers-page">
        <div className="offers-container">
          <h1>Casinos & Offers</h1>
          <div className="no-offers" style={{textAlign: 'center', padding: '60px 20px', color: 'white'}}>
            <p>No casino offers available at the moment. Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  const offerOfTheMonth = casinoOffers[0]; // First offer is featured
  const regularOffers = casinoOffers.slice(1); // Rest of the offers

  return (
    <div className="offers-page">
      <div className="offers-container">
        <h1>Casinos & Offers</h1>
        <p className="offers-subtitle">Best offers and bonuses exclusive for you</p>
        
        <div className="offers-grid">
          {/* Premium Card */}
          <div className={`offer-card-wrapper premium ${flippedCards['premium'] ? 'flipped' : ''}`}>
            <div className="offer-card-inner">
              {/* Front of card */}
              <div className="offer-card-front premium-card-box">
                <span />
                <div className="casino-image-container">
                  <img src="https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop" alt="Premium Offer" className="casino-image" />
                  <div className="casino-overlay">
                    <h3 className="casino-name">Premium Exclusive</h3>
                  </div>
                </div>
                <p className="offer-title">🌟 VIP Exclusive Package</p>
                <p className="offer-terms">+18 | T&C APPLY</p>
                
                <div className="offer-stats">
                  <div className="stat">
                    <div className="stat-icon">💳</div>
                    <div className="stat-label">Min. deposit</div>
                    <div className="stat-value">50€</div>
                  </div>
                  <div className="stat">
                    <div className="stat-icon">💰</div>
                    <div className="stat-label">Cashback</div>
                    <div className="stat-value">50%</div>
                  </div>
                  <div className="stat">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-label">Bonus value</div>
                    <div className="stat-value">1000%</div>
                  </div>
                  <div className="stat">
                    <div className="stat-icon">🎰</div>
                    <div className="stat-label">Free spins</div>
                    <div className="stat-value">Up to 1000</div>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="info-btn" onClick={() => toggleFlip('premium')}>
                    MORE INFO
                  </button>
                  <a 
                    href={offerOfTheMonth?.bonusLink || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="claim-btn"
                  >
                    CLAIM BONUS
                  </a>
                </div>
              </div>

              {/* Back of card */}
              <div className="offer-card-back">
                <h3 className="casino-name">Premium Exclusive</h3>
                <div className="offer-details">
                  <h4>Terms & Conditions</h4>
                  <p>+18 | T&C APPLY

Exclusive VIP offer for premium members. Min deposit €50. Max bonus €10,000 + 1000 Free Spins. 50% cashback on all losses. Wagering 30x. Game weighting applies. T&Cs apply.</p>
                </div>
                <button className="back-btn" onClick={() => toggleFlip('premium')}>
                  ← BACK
                </button>
              </div>
            </div>
          </div>

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
                    <a 
                      href={offer.bonusLink || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="claim-btn"
                    >
                      CLAIM BONUS
                    </a>
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
