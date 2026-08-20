import { IAuthRepository } from '../interfaces';
import { User, CompanyInfo } from '../../types';
import { storageService } from '../../services/storage';

export class LocalStorageAuthRepository implements IAuthRepository {
  getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  }

  setCurrentUser(user: User | null): void {
    storageService.setCurrentUser(user);
  }

  async loginCustomer(email: string, phone: string): Promise<User> {
    const user: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0] || 'Valued Customer',
      email,
      phone,
      role: 'customer',
      savedProperties: [],
      createdAt: new Date().toISOString(),
    };
    storageService.setCurrentUser(user);
    return user;
  }

  async loginAdmin(_email?: string, _password?: string): Promise<User> {
    return this.loginAdminDev();
  }

  async loginAdminDev(): Promise<User> {
    const adminUser: User = {
      id: 'admin-dev-session',
      name: 'YNR Admin (Dev Mode)',
      email: 'admin@ynrhappyhomes.com',
      phone: '7385293949',
      role: 'admin',
      savedProperties: [],
      createdAt: new Date().toISOString(),
    };
    storageService.setCurrentUser(adminUser);
    return adminUser;
  }

  async verifySession(): Promise<User | null> {
    return this.getCurrentUser();
  }

  async logout(): Promise<void> {
    storageService.setCurrentUser(null);
  }

  toggleSaveProperty(propertyId: string): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const currentSaved = user.savedProperties || [];
    const exists = currentSaved.includes(propertyId);
    let updated: string[];
    if (exists) {
      updated = currentSaved.filter(id => id !== propertyId);
    } else {
      updated = [...currentSaved, propertyId];
    }
    const updatedUser = { ...user, savedProperties: updated };
    storageService.setCurrentUser(updatedUser);
    return updatedUser;
  }

  getCompanyInfo(): CompanyInfo {
    return storageService.getCompanyInfo();
  }

  updateCompanyInfo(info: CompanyInfo): CompanyInfo {
    return storageService.updateCompanyInfo(info);
  }
}
