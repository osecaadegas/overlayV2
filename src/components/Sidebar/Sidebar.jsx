import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { checkUserAccess } from '../../utils/adminUtils';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOverlayAccess, setHasOverlayAccess] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin, isModerator } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // Check overlay access when user changes
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        const { hasAccess } = await checkUserAccess(user.id);
        setHasOverlayAccess(hasAccess);
      } else {
        setHasOverlayAccess(false);
      }
    };
    checkAccess();
  }, [user]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/', show: true },
    { icon: '🎁', label: 'Offers', path: '/offers', show: true },
    { icon: '👤', label: 'Profile', path: '/profile', show: user },
    { icon: '💎', label: 'Points Store', path: '/points', show: user },
    { icon: '🎮', label: 'Points Manager', path: '/points-manager', show: isModerator },
    { icon: '🎰', label: 'Overlay', path: '/overlay', show: hasOverlayAccess },
    { icon: '🛡️', label: 'Admin Panel', path: '/admin', show: isAdmin },
    { icon: '📺', label: 'Stream', path: '/stream', show: true },
    { icon: 'ℹ️', label: 'About Us', path: '/about', show: true },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🎰</span>
            <h2>Stream Overlay</h2>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Featured Cards */}
        <div className="sidebar-featured">
          <div className="featured-card featured-card-blue" onClick={() => handleNavigation('/offers')}>
            <div className="featured-icon">🎁</div>
            <div className="featured-content">
              <div className="featured-label">Claim</div>
              <div className="featured-title">Offers</div>
            </div>
          </div>
          <div className="featured-card featured-card-green" onClick={() => handleNavigation('/points')}>
            <div className="featured-icon">🎉</div>
            <div className="featured-content">
              <div className="featured-label">Daily</div>
              <div className="featured-title">Giveaways</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => 
            item.show ? (
              <button
                key={index}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ) : null
          )}

          {user && (
            <>
              <div className="sidebar-divider"></div>
              <button
                className="sidebar-item logout"
                onClick={handleLogout}
              >
                <span className="sidebar-icon">🚪</span>
                <span className="sidebar-label">Log Out</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {user ? (
              <>
                <div className="user-avatar">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <p className="user-email">{user.email}</p>
                  <p className="user-role">{isAdmin ? 'Admin' : 'User'}</p>
                </div>
              </>
            ) : (
              <button 
                className="login-btn"
                onClick={() => handleNavigation('/')}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
