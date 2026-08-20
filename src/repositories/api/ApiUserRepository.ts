import { IUserRepository } from '../interfaces';
import { User, UserRole } from '../../types';
import { apiClient } from '../../services/apiClient';

function toFrontendUser(item: any): User {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    role: ((item.role as string) || 'CUSTOMER').toLowerCase() as UserRole,
    isActive: item.isActive !== undefined ? item.isActive : true,
    savedProperties: item.savedProperties || [],
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export class ApiUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    try {
      const data = await apiClient.get<any[]>('/users');
      return data.map(toFrontendUser);
    } catch (err) {
      console.warn('[ApiUserRepository] Error loading users:', err);
      return [];
    }
  }

  async getById(id: string): Promise<User | undefined> {
    try {
      const data = await apiClient.get<any>(`/users/${id}`);
      return toFrontendUser(data);
    } catch (err) {
      console.warn(`[ApiUserRepository] Error loading user '${id}':`, err);
      return undefined;
    }
  }

  async create(user: Partial<User> & { password?: string }): Promise<User> {
    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: (user.role || 'customer').toUpperCase(),
      isActive: user.isActive !== undefined ? user.isActive : true,
    };

    const created = await apiClient.post<any>('/users', payload);
    return toFrontendUser(created);
  }

  async update(id: string, user: Partial<User> & { password?: string }): Promise<User> {
    const payload = {
      ...(user.name && { name: user.name }),
      ...(user.email && { email: user.email }),
      ...(user.phone && { phone: user.phone }),
      ...(user.password && { password: user.password }),
      ...(user.role && { role: user.role.toUpperCase() }),
      ...(user.isActive !== undefined && { isActive: user.isActive }),
    };

    const updated = await apiClient.put<any>(`/users/${id}`, payload);
    return toFrontendUser(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/users/${id}`);
      return true;
    } catch (err) {
      console.warn(`[ApiUserRepository] Error deleting user '${id}':`, err);
      throw err;
    }
  }
}
