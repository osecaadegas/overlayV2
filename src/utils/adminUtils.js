import { supabase } from '../config/supabaseClient';

// Get all users with their roles
export const getAllUsers = async () => {
  try {
    // Get auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Get user roles from our custom table
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError && rolesError.code !== 'PGRST116') { // Ignore "table not found" error
      console.error('Roles error:', rolesError);
    }

    // Merge auth data with roles data
    const users = authData.users.map(user => {
      const roleInfo = rolesData?.find(r => r.user_id === user.id) || {};
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        role: roleInfo.role || 'user',
        access_expires_at: roleInfo.access_expires_at || null,
        is_active: roleInfo.is_active !== false,
        moderator_permissions: roleInfo.moderator_permissions || {},
      };
    });

    return { data: users, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get user role by user ID
export const getUserRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist yet or no record found
      return { data: { role: 'user', is_active: true, moderator_permissions: {} }, error: null };
    }

    if (error) throw error;

    return { data: data || { role: 'user', is_active: true, moderator_permissions: {} }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Update user role and permissions
export const updateUserRole = async (userId, role, accessExpiresAt = null, moderatorPermissions = null) => {
  try {
    const updateData = {
      user_id: userId,
      role: role,
      access_expires_at: accessExpiresAt,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    // Only include moderator_permissions if provided and role is moderator
    if (role === 'moderator' && moderatorPermissions !== null) {
      updateData.moderator_permissions = moderatorPermissions;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .upsert(updateData)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Revoke user access
export const revokeUserAccess = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Check if user has admin access
export const isAdmin = async (userId) => {
  try {
    const { data, error } = await getUserRole(userId);
    if (error) return false;
    return data?.role === 'admin';
  } catch {
    return false;
  }
};

// Check if user has moderator access
export const isModerator = async (userId) => {
  try {
    const { data, error } = await getUserRole(userId);
    if (error) return false;
    return data?.role === 'moderator';
  } catch {
    return false;
  }
};

// Check if user has admin or moderator access
export const isAdminOrModerator = async (userId) => {
  try {
    const { data, error } = await getUserRole(userId);
    if (error) return false;
    return data?.role === 'admin' || data?.role === 'moderator';
  } catch {
    return false;
  }
};

// Check if user has specific moderator permission
export const hasModeratorPermission = async (userId, permission) => {
  try {
    const { data, error } = await getUserRole(userId);
    if (error) return false;
    if (data?.role === 'admin') return true; // Admins have all permissions
    if (data?.role !== 'moderator') return false;
    return data?.moderator_permissions?.[permission] === true;
  } catch {
    return false;
  }
};

// Check if user access is valid
export const checkUserAccess = async (userId) => {
  try {
    const { data, error } = await getUserRole(userId);
    
    if (error) return { hasAccess: true, reason: null }; // Default allow if table doesn't exist

    // Check if role allows overlay access
    const allowedRoles = ['admin', 'moderator', 'premium'];
    if (!allowedRoles.includes(data.role)) {
      return { hasAccess: false, reason: 'Your account does not have overlay access. Please upgrade to Premium or contact an admin.' };
    }

    if (!data.is_active) {
      return { hasAccess: false, reason: 'Account has been deactivated' };
    }

    if (data.access_expires_at) {
      const expiryDate = new Date(data.access_expires_at);
      const now = new Date();
      
      if (now > expiryDate) {
        return { hasAccess: false, reason: 'Access has expired' };
      }
    }

    return { hasAccess: true, reason: null };
  } catch (error) {
    return { hasAccess: true, reason: null }; // Default allow on error
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    // First delete from user_roles
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Then delete from auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

// Available moderator permissions
export const MODERATOR_PERMISSIONS = {
  view_users: 'View Users',
  edit_user_roles: 'Edit User Roles (Premium only)',
  revoke_access: 'Revoke User Access',
  view_statistics: 'View Statistics',
};
