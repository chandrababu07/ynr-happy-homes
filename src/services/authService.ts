import { authRepository } from '../repositories';
import { User } from '../types';

export const authService = {
  getCurrentUser(): User | null {
    return authRepository.getCurrentUser();
  },

  async loginCustomer(email: string, phone: string): Promise<User> {
    return authRepository.loginCustomer(email, phone);
  },

  async loginAdmin(email?: string, password?: string): Promise<User> {
    return authRepository.loginAdmin(email, password);
  },

  async loginAdminDev(): Promise<User> {
    return authRepository.loginAdminDev();
  },

  async verifySession(): Promise<User | null> {
    if (authRepository.verifySession) {
      return authRepository.verifySession();
    }
    return authRepository.getCurrentUser();
  },

  async logout(): Promise<void> {
    return authRepository.logout();
  },

  toggleSaveProperty(propertyId: string): User | null {
    return authRepository.toggleSaveProperty(propertyId);
  }
};
