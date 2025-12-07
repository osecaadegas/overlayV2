import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { useStreamElements } from '../../context/StreamElementsContext';
import { checkUserAccess } from '../../utils/adminUtils';
import { supabase } from '../../config/supabaseClient';
import './Sidebar.css';

export default function Sidebar() {
  const [hasOverlayAccess, setHasOverlayAccess] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showGamesDropdown, setShowGamesDropdown] = useState(false);
  const [showStreamDropdown, setShowStreamDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin, isModerator } = useAdmin();
  const { points, loading: pointsLoading } = useStreamElements();
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

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load avatar from user metadata
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setSelectedAvatar(user.user_metadata.avatar_url);
    } else if (user) {
      setSelectedAvatar(avatarOptions[0]);
    }
  }, [user]);

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    
    // Update user metadata in Supabase
    if (user) {
      await supabase.auth.updateUser({
        data: { avatar_url: avatar }
      });
    }
    
    setShowAvatarPicker(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    try {
      setUploadingAvatar(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      // Update user metadata
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      setSelectedAvatar(publicUrl);
      setShowAvatarPicker(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const menuItems = [
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, 
      label: 'Home', 
      path: '/', 
      show: true 
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
      path: '/points', 
      show: user 
    },
    { 
      icon: <svg viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>, 
      label: 'Points Manager', 
      path: '/points-manager', 
      show: isModerator 
    },
    { 
      icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>, 
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
      {user && (
        <div className="sidebar-avatar-section">
          <div className="avatar-container" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
            <img src={selectedAvatar} alt="Avatar" className="avatar-image" />
          </div>
          <div className="points-display">
            <svg viewBox="0 0 24 24" className="points-icon" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
            </svg>
            <span className="points-value">
              {pointsLoading ? '...' : points.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {showAvatarPicker && (
        <div className="avatar-picker-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div className="avatar-picker-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="avatar-picker-title">Choose Avatar</h3>
            <div className="avatar-grid">
              {avatarOptions.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
            <div className="avatar-upload-section">
              <label htmlFor="avatar-upload" className={`avatar-upload-btn ${uploadingAvatar ? 'uploading' : ''}`}>
                {uploadingAvatar ? (
                  <>
                    <div className="spinner"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="upload-icon" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                    Upload Custom Image
                  </>
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploadingAvatar}
              />
            </div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {menuItems.slice(0, 3).map((item, index) => 
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

        {/* Games Dropdown - Right after Points Store */}
        <div className="sidebar-dropdown">
          <button
            className={`sidebar-item ${location.pathname.startsWith('/games') ? 'active' : ''}`}
            onClick={() => setShowGamesDropdown(!showGamesDropdown)}
          >
            <span className="sidebar-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
              </svg>
            </span>
            <span className="sidebar-label">Games</span>
            <span className={`dropdown-arrow ${showGamesDropdown ? 'open' : ''}`}>▼</span>
          </button>
          
          {showGamesDropdown && (
            <div className="sidebar-submenu">
              <button
                className={`sidebar-subitem ${isActive('/games/coinflip') ? 'active' : ''}`}
                onClick={() => handleNavigation('/games/coinflip')}
              >
                <span className="subitem-icon">🪙</span>
                <span className="subitem-label">Coin Flip</span>
              </button>
              <button
                className={`sidebar-subitem ${isActive('/games/dice') ? 'active' : ''}`}
                onClick={() => handleNavigation('/games/dice')}
              >
                <span className="subitem-icon">🎲</span>
                <span className="subitem-label">Dice Roll</span>
              </button>
              <button
                className={`sidebar-subitem ${isActive('/games/roulette') ? 'active' : ''}`}
                onClick={() => handleNavigation('/games/roulette')}
              >
                <span className="subitem-icon">🎰</span>
                <span className="subitem-label">Roulette</span>
              </button>
              <button
                className={`sidebar-subitem ${isActive('/games/slots') ? 'active' : ''}`}
                onClick={() => handleNavigation('/games/slots')}
              >
                <span className="subitem-icon">🎰</span>
                <span className="subitem-label">Slot Machine</span>
              </button>
            </div>
          )}
        </div>

        {/* Points Manager item */}
        {menuItems[3].show && (
          <button
            className={`sidebar-item ${isActive(menuItems[3].path) ? 'active' : ''}`}
            onClick={() => handleNavigation(menuItems[3].path)}
          >
            <span className="sidebar-icon">{menuItems[3].icon}</span>
            <span className="sidebar-label">{menuItems[3].label}</span>
          </button>
        )}

        {/* Overlay item */}
        {menuItems[4].show && (
          <button
            className={`sidebar-item ${isActive(menuItems[4].path) ? 'active' : ''}`}
            onClick={() => handleNavigation(menuItems[4].path)}
          >
            <span className="sidebar-icon">{menuItems[4].icon}</span>
            <span className="sidebar-label">{menuItems[4].label}</span>
          </button>
        )}

        {/* Admin Panel item */}
        {menuItems[5].show && (
          <button
            className={`sidebar-item ${isActive(menuItems[5].path) ? 'active' : ''}`}
            onClick={() => handleNavigation(menuItems[5].path)}
          >
            <span className="sidebar-icon">{menuItems[5].icon}</span>
            <span className="sidebar-label">{menuItems[5].label}</span>
          </button>
        )}

        {/* Stream Dropdown */}
        {menuItems[6].show && (
          <div className="sidebar-dropdown">
            <button
              className={`sidebar-item ${location.pathname.startsWith('/stream') || location.pathname.startsWith('/tournaments') || location.pathname.startsWith('/guess-balance') || location.pathname.startsWith('/giveaways') ? 'active' : ''}`}
              onClick={() => setShowStreamDropdown(!showStreamDropdown)}
            >
              <span className="sidebar-icon">{menuItems[6].icon}</span>
              <span className="sidebar-label">{menuItems[6].label}</span>
              <span className={`dropdown-arrow ${showStreamDropdown ? 'open' : ''}`}>▼</span>
            </button>
            
            {showStreamDropdown && (
              <div className="sidebar-submenu">
                <button
                  className={`sidebar-subitem ${isActive('/stream') ? 'active' : ''}`}
                  onClick={() => handleNavigation('/stream')}
                >
                  <span className="subitem-icon">📺</span>
                  <span className="subitem-label">Live Stream</span>
                </button>
                <button
                  className={`sidebar-subitem ${isActive('/tournaments') ? 'active' : ''}`}
                  onClick={() => handleNavigation('/tournaments')}
                >
                  <span className="subitem-icon">🏆</span>
                  <span className="subitem-label">Tournaments</span>
                </button>
                <button
                  className={`sidebar-subitem ${isActive('/guess-balance') ? 'active' : ''}`}
                  onClick={() => handleNavigation('/guess-balance')}
                >
                  <span className="subitem-icon">💰</span>
                  <span className="subitem-label">Guess the Balance</span>
                </button>
                <button
                  className={`sidebar-subitem ${isActive('/giveaways') ? 'active' : ''}`}
                  onClick={() => handleNavigation('/giveaways')}
                >
                  <span className="subitem-icon">🎁</span>
                  <span className="subitem-label">Giveaways</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* About Us item */}
        {menuItems[7].show && (
          <button
            className={`sidebar-item ${isActive(menuItems[7].path) ? 'active' : ''}`}
            onClick={() => handleNavigation(menuItems[7].path)}
          >
            <span className="sidebar-icon">{menuItems[7].icon}</span>
            <span className="sidebar-label">{menuItems[7].label}</span>
          </button>
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
    </aside>
  );
}
