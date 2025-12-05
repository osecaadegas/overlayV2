import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>👤 Profile & Settings</h1>
        
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar-large">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.email}</h2>
            <p className="profile-id">User ID: {user?.id.substring(0, 8)}...</p>
          </div>

          <div className="settings-card">
            <h3>Account Settings</h3>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
            <div className="setting-item">
              <label>Password</label>
              <button className="change-btn">Change Password</button>
            </div>
            <div className="setting-item">
              <label>Notifications</label>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
