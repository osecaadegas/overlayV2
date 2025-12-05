import './OffersPage.css';

export default function OffersPage() {
  return (
    <div className="offers-page">
      <div className="offers-container">
        <h1>🎁 Special Offers</h1>
        <p className="offers-subtitle">Check out our exclusive deals and promotions</p>
        
        <div className="offers-grid">
          <div className="offer-card">
            <div className="offer-badge">NEW</div>
            <h3>Premium Access</h3>
            <p>Get full overlay access with all features</p>
            <div className="offer-price">$9.99/month</div>
            <button className="offer-btn">Get Started</button>
          </div>

          <div className="offer-card featured">
            <div className="offer-badge">POPULAR</div>
            <h3>Pro Package</h3>
            <p>Everything in Premium plus priority support</p>
            <div className="offer-price">$19.99/month</div>
            <button className="offer-btn">Choose Pro</button>
          </div>

          <div className="offer-card">
            <div className="offer-badge">BEST VALUE</div>
            <h3>Lifetime Deal</h3>
            <p>One-time payment for permanent access</p>
            <div className="offer-price">$99.99</div>
            <button className="offer-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
