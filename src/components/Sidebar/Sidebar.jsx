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
            </div>ssName="avatar-container" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
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
              <label htmlFor="avatar-upload" className="avatar-upload-btn">
                <svg viewBox="0 0 24 24" className="upload-icon" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                </svg>
                Upload Custom Image
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

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
    </aside>
  );
}
