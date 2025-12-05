import { useState, useEffect } from 'react';
import { useStreamElements } from '../../context/StreamElementsContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';
import './StreamElementsPanel.css';

export default function StreamElementsPanel() {
  const {
    seAccount,
    points,
    loading,
    error,
    linkAccount,
    unlinkAccount,
    redeemPoints,
    refreshPoints,
    isConnected
  } = useStreamElements();

  const { user } = useAuth();

  const [showLinkForm, setShowLinkForm] = useState(false);
  const [channelId, setChannelId] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [username, setUsername] = useState('');
  const [linkError, setLinkError] = useState('');
  const [redemptionItems, setRedemptionItems] = useState([]);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    loadRedemptionItems();
  }, []);

  const loadRedemptionItems = async () => {
    try {
      const { data, error } = await supabase
        .from('redemption_items')
        .select('*')
        .eq('is_active', true)
        .order('point_cost', { ascending: true });

      if (error) throw error;
      setRedemptionItems(data || []);
    } catch (err) {
      console.error('Error loading redemption items:', err);
    }
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setLinkError('');

    if (!channelId || !jwtToken) {
      setLinkError('Please fill in all fields');
      return;
    }

    const result = await linkAccount(channelId, jwtToken, username);
    
    if (result.success) {
      setShowLinkForm(false);
      setChannelId('');
      setJwtToken('');
      setUsername('');
    } else {
      setLinkError(result.error);
    }
  };

  const handleUnlink = async () => {
    if (confirm('Are you sure you want to unlink your StreamElements account?')) {
      await unlinkAccount();
    }
  };

  const handleRedeem = async (item) => {
    if (points < item.point_cost) {
      alert('You don\'t have enough points for this redemption!');
      return;
    }

    if (!confirm(`Redeem "${item.name}" for ${item.point_cost.toLocaleString()} points?`)) {
      return;
    }

    setRedeeming(item.id);
    const result = await redeemPoints(item.id, item.point_cost);
    setRedeeming(null);

    if (result.success) {
      alert('Redemption successful! Your reward has been applied.');
      await refreshPoints();
    } else {
      alert(`Redemption failed: ${result.error}`);
    }
  };

  return (
    <div className="se-panel">
      <div className="se-header">
        <h2>🎁 StreamElements Points</h2>
        <p>Link your StreamElements account to redeem loyalty points for rewards</p>
      </div>

      {!isConnected ? (
        <div className="se-not-connected">
          {!showLinkForm ? (
            <>
              <div className="se-info-box">
                <h3>Why Link Your Account?</h3>
                <ul>
                  <li>View your loyalty points balance</li>
                  <li>Redeem points for premium access</li>
                  <li>Unlock exclusive features</li>
                  <li>Support the stream!</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowLinkForm(true)}
                className="se-connect-btn"
              >
                Connect StreamElements
              </button>
            </>
          ) : (
            <form onSubmit={handleLinkAccount} className="se-link-form">
              <h3>Link StreamElements Account</h3>
              
              <div className="form-group">
                <label>Channel ID</label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Your SE Channel ID"
                />
                <small>Find this in your SE dashboard URL</small>
              </div>

              <div className="form-group">
                <label>JWT Token</label>
                <input
                  type="password"
                  value={jwtToken}
                  onChange={(e) => setJwtToken(e.target.value)}
                  placeholder="Your SE JWT Token"
                />
                <small>
                  Get this from StreamElements → Account → Show secrets → JWT Token
                </small>
              </div>

              <div className="form-group">
                <label>Username (Optional)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your SE username"
                />
              </div>

              {linkError && <div className="se-error">{linkError}</div>}

              <div className="form-actions">
                <button type="submit" disabled={loading} className="se-submit-btn">
                  {loading ? 'Connecting...' : 'Connect Account'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowLinkForm(false);
                    setLinkError('');
                  }}
                  className="se-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="se-connected">
          <div className="se-account-info">
            <div className="se-points-display">
              <div className="se-points-label">Your Points</div>
              <div className="se-points-value">
                {loading ? '...' : points.toLocaleString()}
              </div>
              <button onClick={refreshPoints} className="se-refresh-btn" disabled={loading}>
                🔄 Refresh
              </button>
            </div>
            
            <div className="se-account-details">
              <div className="se-user-info">
                <div className="se-user-avatar">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User Avatar" />
                  ) : (
                    <div className="se-avatar-placeholder">
                      {(seAccount?.se_username || user?.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="se-user-details">
                  <p className="se-username">{seAccount?.se_username || user?.email || 'User'}</p>
                  <p className="se-connected-label">Connected as: <span>{seAccount?.se_username || 'osecaadegas95'}</span></p>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="se-error">{error}</div>}

          <div className="se-redemptions">
            <h3>Available Redemptions</h3>
            {redemptionItems.length === 0 ? (
              <p className="se-no-items">No redemption items available</p>
            ) : (
              <div className="se-items-grid">
                {redemptionItems.map(item => {
                  const canAfford = points >= item.point_cost;
                  const isRedeeming = redeeming === item.id;
                  
                  // Use a default premium image if no image URL is provided
                  const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop';
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`se-item ${!canAfford ? 'disabled' : ''}`}
                    >
                      <div className="se-item-image">
                        <img src={imageUrl} alt={item.name} />
                      </div>
                      <div className="se-item-content">
                        <div className="se-item-header">
                          <h4>{item.name}</h4>
                          <div className="se-item-cost">
                            {item.point_cost.toLocaleString()} pts
                          </div>
                        </div>
                        <p className="se-item-description">{item.description}</p>
                        <button
                          onClick={() => handleRedeem(item)}
                          disabled={!canAfford || isRedeeming || loading}
                          className="se-redeem-btn"
                        >
                          {isRedeeming ? 'Redeeming...' : canAfford ? 'Redeem' : 'Not Enough Points'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
