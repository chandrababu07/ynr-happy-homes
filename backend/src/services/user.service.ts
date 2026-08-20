import bcrypt from 'bcryptjs';
import { userRepository, CreateUserData, UpdateUserData } from '../repositories/user.repository.js';

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error: any = new Error(`User with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async createUser(data: CreateUserData & { password?: string }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const error: any = new Error(`A user with email '${data.email}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    let passwordHash: string | undefined = undefined;
    if (data.password && data.password.trim() !== '') {
      passwordHash = await bcrypt.hash(data.password.trim(), 10);
    }

    return userRepository.create({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      passwordHash,
      role: data.role,
      isActive: data.isActive,
    });
  }

  async updateUser(currentUserId: string, targetUserId: string, data: UpdateUserData & { password?: string }) {
    const user = await userRepository.findById(targetUserId);
    if (!user) {
      const error: any = new Error(`User with ID '${targetUserId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    // Safety Lockout Protection: An admin cannot demote or disable their own active user account
    if (currentUserId === targetUserId) {
      if (data.role && data.role !== 'ADMIN') {
        const error: any = new Error('Security Violation: Administrators cannot demote their own active administrative role');
        error.statusCode = 400;
        throw error;
      }
      if (data.isActive === false) {
        const error: any = new Error('Security Violation: Administrators cannot disable their own active user session account');
        error.statusCode = 400;
        throw error;
      }
    }

    // Email Uniqueness Check if email changed
    if (data.email && data.email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== targetUserId) {
        const error: any = new Error(`A user with email '${data.email}' already exists`);
        error.statusCode = 409;
        throw error;
      }
    }

    let passwordHash: string | undefined = undefined;
    if (data.password && data.password.trim() !== '') {
      passwordHash = await bcrypt.hash(data.password.trim(), 10);
    }

    return userRepository.update(targetUserId, {
      ...(data.name && { name: data.name.trim() }),
      ...(data.email && { email: data.email.trim() }),
      ...(data.phone && { phone: data.phone.trim() }),
      ...(passwordHash && { passwordHash }),
      ...(data.role && { role: data.role }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    });
  }

  async deleteUser(currentUserId: string, targetUserId: string) {
    const user = await userRepository.findById(targetUserId);
    if (!user) {
      const error: any = new Error(`User with ID '${targetUserId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    // Safety Lockout Protection: An admin cannot delete their own active user account
    if (currentUserId === targetUserId) {
      const error: any = new Error('Security Violation: Administrators cannot delete their own active user account');
      error.statusCode = 400;
      throw error;
    }

    return userRepository.delete(targetUserId);
  }
}

export const userService = new UserService();
