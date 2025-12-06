import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { checkUserAccess } from '../../utils/adminUtils';
import './Sidebar.css';

export default function Sidebar() {
  const [hasOverlayAccess, setHasOverlayAccess] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin, isModerator } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show sidebar on overlay page
  if (location.pathname === '/overlay') {
    return null;
  }

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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      icon: <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m1.5 13v1a.5.5 0 0 0 .3379.4731 18.9718 18.9718 0 0 0 6.1621 1.0269 18.9629 18.9629 0 0 0 6.1621-1.0269.5.5 0 0 0 .3379-.4731v-1a6.5083 6.5083 0 0 0 -4.461-6.1676 3.5 3.5 0 1 0 -4.078 0 6.5083 6.5083 0 0 0 -4.461 6.1676zm4-9a2.5 2.5 0 1 1 2.5 2.5 2.5026 2.5026 0 0 1 -2.5-2.5zm2.5 3.5a5.5066 5.5066 0 0 1 5.5 5.5v.6392a18.08 18.08 0 0 1 -11 0v-.6392a5.5066 5.5066 0 0 1 5.5-5.5z" /></svg>, 
      label: 'Profile', 
      path: '/profile', 
      show: user 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>, 
      label: 'Casino Offers', 
      path: '/offers', 
      show: true 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/></svg>, 
      label: 'Points Store', 
      path: '/streamelements', 
      show: user 
    },
    { 
      icon: <svg viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>, 
      label: 'Points Manager', 
      path: '/points-manager', 
      show: isModerator 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>, 
      label: 'Bonus Hunt', 
      path: '/bonushunt', 
      show: user 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>, 
      label: 'Giveaway', 
      path: '/giveaway', 
      show: user 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>, 
      label: 'Tournament', 
      path: '/tournament', 
      show: user 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/></svg>, 
      label: 'Overlay', 
      path: '/overlay', 
      show: hasOverlayAccess 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/></svg>, 
      label: 'Admin Panel', 
      path: '/admin', 
      show: isAdmin 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>, 
      label: 'Stream', 
      path: '/stream', 
      show: true 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>, 
      label: 'About Us', 
      path: '/about', 
      show: true 
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-icon">✕</span>
        <h2>Stream Overlay</h2>
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
        <div className="featured-card featured-card-green" onClick={() => handleNavigation('/streamelements')}>
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
                <p className="user-role">{isAdmin ? 'ADMIN' : 'USER'}</p>
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
  );
}
