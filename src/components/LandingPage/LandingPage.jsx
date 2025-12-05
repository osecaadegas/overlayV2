import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import AuthModal from '../Auth/AuthModal';
import './LandingPage.css';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleOverlayClick = () => {
    navigate('/overlay');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="landing-page">
      {/* Header with Login/Logout */}
      <header className="landing-header">
        <div className="landing-logo">
          <h2>🎰 Stream Overlay</h2>
        </div>
        <div className="landing-auth-buttons">
          {user ? (
            <>
              {isAdmin && (
                <button onClick={handleAdminClick} className="admin-button">
                  🛡️ Admin
                </button>
              )}
              <button onClick={handleOverlayClick} className="overlay-button">
                Go to Overlay
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="login-button">
              Login / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Professional Streaming Overlay</h1>
          <p className="hero-subtitle">
            Enhance your casino streaming experience with our feature-rich overlay system
          </p>
          {user && (
            <button onClick={handleOverlayClick} className="cta-button">
              Launch Overlay →
            </button>
          )}
        </div>
      </section>

      {/* Features/Offers Section */}
      <section className="offers-section">
        <h2 className="section-title">What's Included</h2>
        <div className="offers-grid">
          <div className="offer-card">
            <div className="offer-icon">🎯</div>
            <h3>Bonus Hunt Tracker</h3>
            <p>Track your bonus hunts with beautiful cards and real-time statistics</p>
          </div>

          <div className="offer-card">
            <div className="offer-icon">🏆</div>
            <h3>Tournament Brackets</h3>
            <p>Create and manage slot tournaments with automated bracket systems</p>
          </div>

          <div className="offer-card">
            <div className="offer-icon">🎁</div>
            <h3>Giveaway Manager</h3>
            <p>Run engaging giveaways with multiple winner selection modes</p>
          </div>

          <div className="offer-card">
            <div className="offer-icon">🎲</div>
            <h3>Random Slot Picker</h3>
            <p>Let your viewers decide what to play with our slot machine picker</p>
          </div>

          <div className="offer-card">
            <div className="offer-icon">🎨</div>
            <h3>Customizable Themes</h3>
            <p>Multiple layouts and themes to match your stream's aesthetic</p>
          </div>

          <div className="offer-card">
            <div className="offer-icon">💬</div>
            <h3>Twitch Integration</h3>
            <p>Integrated chat widget and Spotify controls for your stream</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to enhance your stream?</h2>
        {user ? (
          <button onClick={handleOverlayClick} className="cta-button-large">
            Launch Overlay Now
          </button>
        ) : (
          <button onClick={() => setShowAuthModal(true)} className="cta-button-large">
            Get Started - It's Free
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 Stream Overlay. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
