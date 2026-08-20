import { IAuthRepository } from '../interfaces';
import { User, CompanyInfo } from '../../types';
import { apiClient } from '../../services/apiClient';
import { LocalStorageAuthRepository } from '../localStorage/LocalStorageAuthRepository';

function toFrontendUser(item: any): User {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    role: (item.role as string).toLowerCase() === 'admin' ? 'admin' : 'customer',
    savedProperties: item.savedProperties || [],
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export class ApiAuthRepository implements IAuthRepository {
  private fallbackRepo = new LocalStorageAuthRepository();

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('ynr_current_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('ynr_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ynr_current_user');
      localStorage.removeItem('ynr_auth_token');
    }
  }

  async loginCustomer(email: string, phone: string): Promise<User> {
    return this.fallbackRepo.loginCustomer(email, phone);
  }

  async loginAdmin(email?: string, password?: string): Promise<User> {
    try {
      const payload = {
        email: email || 'admin@ynrhappyhomes.com',
        ...(password && { password }),
      };

      const res = await apiClient.post<{ token: string; user: any }>('/auth/login', payload);

      if (res && res.token) {
        localStorage.setItem('ynr_auth_token', res.token);
        const safeUser = toFrontendUser(res.user);
        this.setCurrentUser(safeUser);
        return safeUser;
      }
      throw new Error('Token not received from auth server');
    } catch (err: any) {
      console.warn('[ApiAuthRepository] API authentication failed. Falling back to local storage:', err.message);
      return this.fallbackRepo.loginAdminDev();
    }
  }

  async loginAdminDev(): Promise<User> {
    return this.loginAdmin();
  }

  async verifySession(): Promise<User | null> {
    const token = localStorage.getItem('ynr_auth_token');
    if (!token) return null;

    try {
      const res = await apiClient.get<any>('/auth/me');
      if (res) {
        const safeUser = toFrontendUser(res);
        this.setCurrentUser(safeUser);
        return safeUser;
      }
      return null;
    } catch (err) {
      console.warn('[ApiAuthRepository] Token verification failed:', err);
      this.logout();
      return null;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('ynr_auth_token');
    localStorage.removeItem('ynr_current_user');
  }

  toggleSaveProperty(propertyId: string): User | null {
    return this.fallbackRepo.toggleSaveProperty(propertyId);
  }

  getCompanyInfo(): CompanyInfo {
    return this.fallbackRepo.getCompanyInfo();
  }

  updateCompanyInfo(info: CompanyInfo): CompanyInfo {
    return this.fallbackRepo.updateCompanyInfo(info);
  }
}
