import { Role } from '@prisma/client';
import { userRepository } from './user.repository.js';

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role?: Role;
}

export class AuthRepository {
  async findByEmail(email: string) {
    return userRepository.findByEmail(email);
  }

  async findById(id: string) {
    return userRepository.findById(id);
  }

  async createUser(data: CreateUserData) {
    return userRepository.create(data);
  }

  async deleteUser(id: string) {
    return userRepository.delete(id);
  }
}

export const authRepository = new AuthRepository();
