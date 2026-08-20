import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.verifySession();
      setCurrentUser(user);
    } catch (err: any) {
      console.warn('[useAuth] Session verification error:', err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginCustomer = async (email: string, phone: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.loginCustomer(email, phone);
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email?: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.loginAdmin(email, password);
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const toggleSaveProperty = (propertyId: string) => {
    const updated = authService.toggleSaveProperty(propertyId);
    if (updated) setCurrentUser(updated);
    return updated;
  };

  return {
    user: currentUser,
    loading,
    error,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isCustomer: currentUser?.role === 'customer',
    loginCustomer,
    loginAdmin,
    logout,
    toggleSaveProperty,
    refreshUser,
  };
}
