import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import './PointsManager.css';

export default function PointsManager() {
  const [users, setUsers] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [redemptionItems, setRedemptionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'redemptions', 'items'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // For adding/removing points
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAmount, setPointsAmount] = useState('');
  const [showPointsModal, setShowPointsModal] = useState(false);

  // For managing redemption items
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    point_cost: '',
    reward_type: 'custom',
    reward_details: '',
    image_url: '',
    available_units: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const SE_CHANNEL_ID = import.meta.env.VITE_SE_CHANNEL_ID;
  const SE_JWT_TOKEN = import.meta.env.VITE_SE_JWT_TOKEN;

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `redemption-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image: ' + err.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'redemptions') {
        await loadRedemptions();
      } else if (activeTab === 'items') {
        await loadRedemptionItems();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    // Get all users with SE connections
    const { data: connections, error: connError } = await supabase
      .from('streamelements_connections')
      .select('*');

    if (connError) throw connError;

    // Get user emails using the getAllUsers RPC function
    const { data: allUsers } = await supabase.rpc('get_all_user_emails');
    
    // Create a map of user_id to email
    const emailMap = {};
    if (allUsers) {
      allUsers.forEach(user => {
        emailMap[user.user_id] = user.email;
      });
    }

    // Fetch current points for each user from SE API
    const usersWithPoints = await Promise.all(
      connections.map(async (conn) => {
        const userEmail = emailMap[conn.user_id] || conn.se_username || 'Unknown';

        try {
          const response = await fetch(
            `https://api.streamelements.com/kappa/v2/points/${conn.se_channel_id}/${conn.se_username}`,
            {
              headers: {
                'Authorization': `Bearer ${conn.se_jwt_token}`,
                'Accept': 'application/json'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            return {
              ...conn,
              current_points: data.points || 0,
              email: userEmail
            };
          }
        } catch (err) {
          console.error(`Failed to fetch points for ${conn.se_username}`, err);
        }

        return {
          ...conn,
          current_points: 0,
          email: userEmail
        };
      })
    );

    setUsers(usersWithPoints);
  };

  const loadRedemptions = async () => {
    const { data: redemptionsData, error } = await supabase
      .from('point_redemptions')
      .select('*')
      .order('redeemed_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading redemptions:', error);
      throw error;
    }

    // Get user emails
    const { data: allUsers } = await supabase.rpc('get_all_user_emails');
    const emailMap = {};
    if (allUsers) {
      allUsers.forEach(user => {
        emailMap[user.user_id] = user.email;
      });
    }

    // Get SE connections for usernames
    const { data: connections } = await supabase
      .from('streamelements_connections')
      .select('*');
    
    const usernameMap = {};
    if (connections) {
      connections.forEach(conn => {
        usernameMap[conn.user_id] = conn.se_username;
      });
    }

    // Get redemption items
    const { data: items } = await supabase
      .from('redemption_items')
      .select('*');
    
    const itemMap = {};
    if (items) {
      items.forEach(item => {
        itemMap[item.id] = item;
      });
    }

    // Combine data
    const enrichedRedemptions = redemptionsData.map(redemption => ({
      ...redemption,
      user: { 
        email: emailMap[redemption.user_id] || 'Unknown',
        username: usernameMap[redemption.user_id] || 'Unknown'
      },
      item: itemMap[redemption.redemption_id] || { name: 'Deleted Item', point_cost: 0 }
    }));

    setRedemptions(enrichedRedemptions);
  };

  const loadRedemptionItems = async () => {
    const { data, error } = await supabase
      .from('redemption_items')
      .select('*')
      .order('point_cost', { ascending: true });

    if (error) throw error;
    setRedemptionItems(data || []);
  };

  const handleAddPoints = async (amount) => {
    if (!selectedUser || !amount) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `https://api.streamelements.com/kappa/v2/points/${SE_CHANNEL_ID}/${selectedUser.se_username}/${amount}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${SE_JWT_TOKEN}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to update points');

      setSuccess(`Successfully ${amount > 0 ? 'added' : 'removed'} ${Math.abs(amount)} points ${amount > 0 ? 'to' : 'from'} ${selectedUser.se_username}`);
      setShowPointsModal(false);
      setPointsAmount('');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = itemForm.image_url;
      
      // Upload image if a new file was selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const itemData = {
        name: itemForm.name,
        description: itemForm.description,
        point_cost: parseInt(itemForm.point_cost),
        reward_type: itemForm.reward_type,
        reward_value: {
          details: itemForm.reward_details,
          reward_type: itemForm.reward_type
        },
        image_url: imageUrl || null,
        available_units: itemForm.available_units ? parseInt(itemForm.available_units) : null,
        is_active: true
      };

      if (editingItem) {
        // Update existing
        const { error } = await supabase
          .from('redemption_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        setSuccess('Redemption item updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('redemption_items')
          .insert(itemData);

        if (error) throw error;
        setSuccess('Redemption item created successfully');
      }

      setShowItemModal(false);
      setEditingItem(null);
      setImageFile(null);
      setItemForm({
        name: '',
        description: '',
        point_cost: '',
        reward_type: 'custom',
        reward_details: '',
        image_url: '',
        available_units: ''
      });
      await loadRedemptionItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (item) => {
    try {
      const { error } = await supabase
        .from('redemption_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      await loadRedemptionItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this redemption item?')) return;

    try {
      const { error } = await supabase
        .from('redemption_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      setSuccess('Redemption item deleted');
      await loadRedemptionItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApproveRedemption = async (redemptionId) => {
    try {
      const { error } = await supabase
        .from('point_redemptions')
        .update({ processed: true, status: 'approved' })
        .eq('id', redemptionId);

      if (error) throw error;
      setSuccess('Redemption approved');
      await loadRedemptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDenyRedemption = async (redemption) => {
    if (!confirm('Are you sure you want to deny this redemption? Points will be refunded to the user.')) return;

    try {
      // Refund points to user
      const { data: connections } = await supabase
        .from('streamelements_connections')
        .select('*')
        .eq('user_id', redemption.user_id)
        .single();

      if (connections) {
        // Refund via SE API
        await fetch(
          `https://api.streamelements.com/kappa/v2/points/${connections.se_channel_id}/${connections.se_username}/${redemption.points_spent}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${connections.se_jwt_token}`,
              'Accept': 'application/json'
            }
          }
        );

        // Restore stock if applicable
        const { data: item } = await supabase
          .from('redemption_items')
          .select('available_units')
          .eq('id', redemption.redemption_id)
          .single();

        if (item && item.available_units !== null) {
          await supabase
            .from('redemption_items')
            .update({ available_units: item.available_units + 1 })
            .eq('id', redemption.redemption_id);
        }
      }

      // Mark as denied
      const { error } = await supabase
        .from('point_redemptions')
        .update({ processed: true, status: 'denied' })
        .eq('id', redemption.id);

      if (error) throw error;
      setSuccess('Redemption denied and points refunded');
      await loadRedemptions();
    } catch (err) {
      setError('Failed to deny redemption: ' + err.message);
    }
  };

  return (
    <div className="points-manager">
      <div className="pm-header">
        <h1>🎁 Points Manager</h1>
        <p>Manage StreamElements points and redemptions</p>
      </div>

      {error && <div className="pm-error">{error}</div>}
      {success && <div className="pm-success">{success}</div>}

      <div className="pm-tabs">
        <button
          className={`pm-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button
          className={`pm-tab ${activeTab === 'redemptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('redemptions')}
        >
          📜 Redemptions ({redemptions.length})
        </button>
        <button
          className={`pm-tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          🎁 Items ({redemptionItems.length})
        </button>
      </div>

      {loading ? (
        <div className="pm-loading">Loading...</div>
      ) : (
        <>
          {activeTab === 'users' && (
            <div className="pm-users">
              <div className="pm-users-header">
                <h2>Connected Users</h2>
                <button onClick={loadUsers} className="pm-refresh-btn">
                  🔄 Refresh Points
                </button>
              </div>
              <div className="pm-table-container">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>SE Username</th>
                      <th>Current Points</th>
                      <th>Connected</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.se_username}</td>
                        <td className="pm-points">{user.current_points.toLocaleString()}</td>
                        <td>{new Date(user.connected_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowPointsModal(true);
                            }}
                            className="pm-action-btn"
                          >
                            ✏️ Edit Points
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="pm-empty">No users connected yet</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'redemptions' && (
            <div className="pm-redemptions">
              <h2>Recent Redemptions</h2>
              <div className="pm-table-container">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Item</th>
                      <th>Points Spent</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptions.map((redemption) => (
                      <tr key={redemption.id}>
                        <td>
                          <div className="pm-user-info">
                            <div className="pm-username">{redemption.user?.username || 'Unknown'}</div>
                            <div className="pm-email">{redemption.user?.email || 'Unknown'}</div>
                          </div>
                        </td>
                        <td>{redemption.item?.name || 'Deleted Item'}</td>
                        <td className="pm-points">{redemption.points_spent.toLocaleString()}</td>
                        <td>{new Date(redemption.redeemed_at).toLocaleString()}</td>
                        <td>
                          {(() => {
                            const currentStatus = redemption.status || (redemption.processed ? 'approved' : 'pending');
                            return (
                              <span className={`pm-status-badge ${currentStatus}`}>
                                {currentStatus === 'approved' && '✅ Approved'}
                                {currentStatus === 'denied' && '❌ Denied'}
                                {currentStatus === 'pending' && '⏳ Pending'}
                              </span>
                            );
                          })()}
                        </td>
                        <td>
                          {!redemption.status || redemption.status === 'pending' ? (
                            <div className="pm-redemption-actions">
                              <button
                                onClick={() => handleApproveRedemption(redemption.id)}
                                className="pm-approve-btn"
                                title="Approve redemption"
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => handleDenyRedemption(redemption)}
                                className="pm-deny-btn"
                                title="Deny and refund"
                              >
                                ❌ Deny
                              </button>
                            </div>
                          ) : (
                            <span className="pm-no-action">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {redemptions.length === 0 && (
                  <div className="pm-empty">No redemptions yet</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="pm-items">
              <div className="pm-items-header">
                <h2>Redemption Items</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setImageFile(null);
                    setItemForm({
                      name: '',
                      description: '',
                      point_cost: '',
                      reward_type: 'custom',
                      reward_details: '',
                      image_url: '',
                      available_units: ''
                    });
                    setShowItemModal(true);
                  }}
                  className="pm-add-btn"
                >
                  + Add New Item
                </button>
              </div>
              <div className="pm-items-grid">
                {redemptionItems.map((item) => (
                  <div key={item.id} className={`pm-item-card ${!item.is_active ? 'inactive' : ''}`}>
                    <div className="pm-item-header">
                      <h3>{item.name}</h3>
                      <div className="pm-item-cost">{item.point_cost.toLocaleString()} pts</div>
                    </div>
                    <p className="pm-item-description">{item.description}</p>
                    <div className="pm-item-meta">
                      <span>Type: {item.reward_type}</span>
                      {item.available_units !== null && (
                        <span>Stock: {item.available_units} units</span>
                      )}
                      <span className={`pm-item-status ${item.is_active ? 'active' : 'inactive'}`}>
                        {item.is_active ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                    <div className="pm-item-actions">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setImageFile(null);
                          setItemForm({
                            name: item.name,
                            description: item.description,
                            point_cost: item.point_cost.toString(),
                            reward_type: item.reward_type || 'custom',
                            reward_details: item.reward_value?.details || item.reward_value?.duration_days || '',
                            image_url: item.image_url || '',
                            available_units: item.available_units ? item.available_units.toString() : ''
                          });
                          setShowItemModal(true);
                        }}
                        className="pm-edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleToggleItem(item)}
                        className="pm-toggle-btn"
                      >
                        {item.is_active ? '❌ Disable' : '✅ Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="pm-delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Points Modal */}
      {showPointsModal && selectedUser && (
        <div className="pm-modal-overlay" onClick={() => setShowPointsModal(false)}>
          <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Points for {selectedUser.se_username}</h2>
            <p>Current Points: <strong>{selectedUser.current_points.toLocaleString()}</strong></p>

            <div className="pm-form-group">
              <label>Points Amount (positive to add, negative to remove)</label>
              <input
                type="number"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                placeholder="e.g., 1000 or -500"
              />
            </div>

            <div className="pm-modal-actions">
              <button
                onClick={() => handleAddPoints(parseInt(pointsAmount))}
                disabled={!pointsAmount || loading}
                className="pm-submit-btn"
              >
                {loading ? 'Updating...' : 'Update Points'}
              </button>
              <button
                onClick={() => setShowPointsModal(false)}
                className="pm-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="pm-modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit' : 'Create'} Redemption Item</h2>

            <div className="pm-form-group">
              <label>Name</label>
              <input
                type="text"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="e.g., Premium Access (30 Days)"
              />
            </div>

            <div className="pm-form-group">
              <label>Description</label>
              <textarea
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Describe what the user gets"
                rows="3"
              />
            </div>

            <div className="pm-form-group">
              <label>Point Cost</label>
              <input
                type="number"
                value={itemForm.point_cost}
                onChange={(e) => setItemForm({ ...itemForm, point_cost: e.target.value })}
                placeholder="e.g., 15000"
              />
            </div>

            <div className="pm-form-group">
              <label>Reward Type</label>
              <select
                value={itemForm.reward_type}
                onChange={(e) => setItemForm({ ...itemForm, reward_type: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #2a3142', borderRadius: '8px', background: '#0f1318', color: '#a0aec0', fontSize: '1rem' }}
              >
                <option value="custom">Custom Reward</option>
                <option value="premium_access">Premium Access</option>
                <option value="exclusive_role">Exclusive Role</option>
                <option value="bonus_entry">Bonus Entry</option>
                <option value="special_feature">Special Feature</option>
              </select>
            </div>

            <div className="pm-form-group">
              <label>Reward Details</label>
              <input
                type="text"
                value={itemForm.reward_details}
                onChange={(e) => setItemForm({ ...itemForm, reward_details: e.target.value })}
                placeholder="e.g., 30 days premium, VIP role, special badge, etc."
              />
              <small style={{ color: '#a0aec0', marginTop: '5px', display: 'block' }}>
                Describe what the user receives (e.g., duration, features, perks)
              </small>
            </div>

            <div className="pm-form-group">
              <label>Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ color: '#a0aec0' }}
              />
              {imageFile && (
                <small style={{ color: '#d4af37', marginTop: '5px', display: 'block' }}>
                  Selected: {imageFile.name}
                </small>
              )}
              {itemForm.image_url && !imageFile && (
                <div style={{ marginTop: '10px' }}>
                  <img src={itemForm.image_url} alt="Current" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
                  <small style={{ color: '#a0aec0', marginTop: '5px', display: 'block' }}>
                    Current image (upload a new file to replace)
                  </small>
                </div>
              )}
              <small style={{ color: '#a0aec0', marginTop: '5px', display: 'block' }}>
                Upload an image to display on the redemption card
              </small>
            </div>

            <div className="pm-form-group">
              <label>Available Units (Optional)</label>
              <input
                type="number"
                value={itemForm.available_units}
                onChange={(e) => setItemForm({ ...itemForm, available_units: e.target.value })}
                placeholder="e.g., 10 (leave empty for unlimited)"
                min="0"
              />
              <small style={{ color: '#a0aec0', marginTop: '5px', display: 'block' }}>
                Number of units available for redemption. Leave empty for unlimited stock.
              </small>
            </div>

            <div className="pm-modal-actions">
              <button
                onClick={handleSaveItem}
                disabled={!itemForm.name || !itemForm.point_cost || loading || uploadingImage}
                className="pm-submit-btn"
              >
                {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
              </button>
              <button
                onClick={() => setShowItemModal(false)}
                className="pm-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
