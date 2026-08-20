import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { userRepository } from '../repositories';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userRepository.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load user directory from API:', err);
      setError(err.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createUser = async (data: Partial<User> & { password?: string }) => {
    const created = await userRepository.create(data);
    await refresh();
    return created;
  };

  const updateUser = async (id: string, data: Partial<User> & { password?: string }) => {
    const updated = await userRepository.update(id, data);
    await refresh();
    return updated;
  };

  const deleteUser = async (id: string) => {
    const success = await userRepository.delete(id);
    await refresh();
    return success;
  };

  return { users, loading, error, refresh, createUser, updateUser, deleteUser };
}
