import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabaseClient';

const StreamElementsContext = createContext();

export function useStreamElements() {
  const context = useContext(StreamElementsContext);
  if (!context) {
    throw new Error('useStreamElements must be used within StreamElementsProvider');
  }
  return context;
}

export function StreamElementsProvider({ children }) {
  const { user } = useAuth();
  const [seAccount, setSeAccount] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's StreamElements connection from database
  useEffect(() => {
    if (user) {
      loadStreamElementsConnection();
    } else {
      setSeAccount(null);
      setPoints(0);
    }
  }, [user]);

  const loadStreamElementsConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('streamelements_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSeAccount(data);
        // Fetch current points
        await fetchPoints(data.se_channel_id, data.se_jwt_token);
      }
    } catch (err) {
      console.error('Error loading SE connection:', err);
    }
  };

  const fetchPoints = async (channelId, jwtToken) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call StreamElements API to get user points
      const response = await fetch(
        `https://api.streamelements.com/kappa/v2/points/${channelId}/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch points');
      
      const data = await response.json();
      setPoints(data.points || 0);
    } catch (err) {
      console.error('Error fetching points:', err);
      setError(err.message);
      setPoints(0);
    } finally {
      setLoading(false);
    }
  };

  const linkAccount = async (channelId, jwtToken, username) => {
    setLoading(true);
    setError(null);

    try {
      // Verify the JWT token works by fetching points
      const response = await fetch(
        `https://api.streamelements.com/kappa/v2/points/${channelId}`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Invalid StreamElements credentials');

      // Save to database
      const { data, error } = await supabase
        .from('streamelements_connections')
        .upsert({
          user_id: user.id,
          se_channel_id: channelId,
          se_jwt_token: jwtToken,
          se_username: username,
          connected_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setSeAccount(data);
      await fetchPoints(channelId, jwtToken);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const unlinkAccount = async () => {
    try {
      const { error } = await supabase
        .from('streamelements_connections')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setSeAccount(null);
      setPoints(0);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const redeemPoints = async (redemptionId, pointCost) => {
    if (points < pointCost) {
      return { success: false, error: 'Insufficient points' };
    }

    setLoading(true);
    setError(null);

    try {
      // Deduct points via StreamElements API
      const response = await fetch(
        `https://api.streamelements.com/kappa/v2/points/${seAccount.se_channel_id}/${user.id}/${-pointCost}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${seAccount.se_jwt_token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to deduct points');

      // Record redemption in database
      const { error: dbError } = await supabase
        .from('point_redemptions')
        .insert({
          user_id: user.id,
          redemption_id: redemptionId,
          points_spent: pointCost,
          redeemed_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      // Update local points
      setPoints(prev => prev - pointCost);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshPoints = async () => {
    if (seAccount) {
      await fetchPoints(seAccount.se_channel_id, seAccount.se_jwt_token);
    }
  };

  const value = {
    seAccount,
    points,
    loading,
    error,
    linkAccount,
    unlinkAccount,
    redeemPoints,
    refreshPoints,
    isConnected: !!seAccount
  };

  return (
    <StreamElementsContext.Provider value={value}>
      {children}
    </StreamElementsContext.Provider>
  );
}
