import { useState } from 'react';
import { useBonusHunt } from '../../context/BonusHuntContext';
import useDraggable from '../../hooks/useDraggable';
import './EditSlots.css';

const EditSlots = ({ onClose }) => {
  const { bonuses, updateBonus, deleteBonus, getSlotImage } = useBonusHunt();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const panelRef = useDraggable(true);

  const handleEdit = (bonus) => {
    setEditingId(bonus.id);
    setEditForm({
      slotName: bonus.slotName,
      betSize: bonus.betSize,
      multiplier: bonus.multiplier || 0,
      isSuper: bonus.isSuper
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateBonus(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (bonusId) => {
    if (window.confirm('Are you sure you want to delete this bonus?')) {
      deleteBonus(bonusId);
    }
  };

  const handleToggleOpened = (bonus) => {
    updateBonus(bonus.id, {
      opened: !bonus.opened,
      multiplier: bonus.opened ? null : bonus.multiplier
    });
  };

  return (
    <div className="edit-slots-overlay">
      <div className="edit-slots-panel" ref={panelRef}>
        <div className="edit-slots-header">
          <h2>✏️ Edit Slots</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="edit-slots-content">
          {bonuses.length === 0 ? (
            <div className="no-slots">
              <div className="no-slots-icon">🎰</div>
              <div className="no-slots-text">No slots to edit</div>
            </div>
          ) : (
            <div className="slots-list">
              {bonuses.map((bonus) => {
                const image = getSlotImage(bonus.slotName);
                return (
                <div key={bonus.id} className={`slot-edit-card ${bonus.opened ? 'opened' : 'unopened'}`}>
                  {editingId === bonus.id ? (
                    <div className="edit-form">
                      <div className="form-row">
                        <label>
                          Slot Name:
                          <input
                            type="text"
                            value={editForm.slotName}
                            onChange={(e) => setEditForm({ ...editForm, slotName: e.target.value })}
                          />
                        </label>
                      </div>
                      <div className="form-row">
                        <label>
                          Bet Size (€):
                          <input
                            type="number"
                            value={editForm.betSize}
                            onChange={(e) => setEditForm({ ...editForm, betSize: parseFloat(e.target.value) })}
                            step="0.01"
                            min="0"
                          />
                        </label>
                        <label>
                          Multiplier:
                          <input
                            type="number"
                            value={editForm.multiplier}
                            onChange={(e) => setEditForm({ ...editForm, multiplier: parseFloat(e.target.value) })}
                            step="0.01"
                            min="0"
                          />
                        </label>
                      </div>
                      <div className="form-row">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editForm.isSuper}
                            onChange={(e) => setEditForm({ ...editForm, isSuper: e.target.checked })}
                          />
                          <span>Super Bonus</span>
                        </label>
                      </div>
                      <div className="form-actions">
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="slot-info">
                        <img 
                          src={image} 
                          alt={bonus.slotName}
                          className="slot-thumbnail"
                        />
                        <div className="slot-details">
                          <h3 className="slot-name">
                            {bonus.slotName}
                            {bonus.isSuper && <span className="super-tag">⭐</span>}
                          </h3>
                          <div className="slot-stats">
                            <span className="stat">Bet: €{bonus.betSize.toFixed(2)}</span>
                            {bonus.opened && (
                              <>
                                <span className="stat">Payout: €{(bonus.multiplier * bonus.betSize || 0).toFixed(2)}</span>
                                <span className={`stat multiplier ${bonus.multiplier >= 1 ? 'positive' : 'negative'}`}>
                                  {(bonus.multiplier || 0).toFixed(2)}x
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="slot-actions">
                        <button 
                          className={`toggle-btn ${bonus.opened ? 'opened' : 'unopened'}`}
                          onClick={() => handleToggleOpened(bonus)}
                          title={bonus.opened ? 'Mark as Unopened' : 'Mark as Opened'}
                        >
                          {bonus.opened ? '✓' : '○'}
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(bonus)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(bonus.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSlots;
