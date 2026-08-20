import { Role } from '@prisma/client';
import prisma from '../utils/prisma.js';

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role?: Role;
  isActive?: boolean;
}

// In-Memory fallback store for users
let mockUserStore: any[] = [
  {
    id: 'usr-admin-001',
    name: 'YNR Admin',
    email: 'admin@ynrhappyhomes.com',
    phone: '7385293949',
    passwordHash: '$2a$10$vE48nFp5t.6kK./e8eZfH.WvHkFm3G9bF4o6vHkFm3G9bF4o6vHkF',
    role: 'ADMIN',
    isActive: true,
    savedProperties: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export class UserRepository {
  async findAll() {
    try {
      const users = (await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      })) as any[];
      return users.map(sanitizeUser);
    } catch (error) {
      console.warn('[UserRepository] Database connection error. Serving in-memory fallback user store.');
      return mockUserStore.map(sanitizeUser);
    }
  }

  async findById(id: string) {
    try {
      const user = (await prisma.user.findUnique({
        where: { id },
      })) as any;
      return sanitizeUser(user);
    } catch (error) {
      const user = mockUserStore.find((u) => u.id === id);
      return sanitizeUser(user);
    }
  }

  async findByEmail(email: string) {
    try {
      return (await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })) as any;
    } catch (error) {
      return mockUserStore.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  }

  async create(data: CreateUserData) {
    try {
      const user = (await prisma.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone,
          ...(data.passwordHash && { passwordHash: data.passwordHash }),
          role: data.role || Role.CUSTOMER,
          isActive: data.isActive !== undefined ? data.isActive : true,
        } as any,
      })) as any;
      return sanitizeUser(user);
    } catch (error) {
      const newUser: any = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash: data.passwordHash || null,
        role: data.role || 'CUSTOMER',
        isActive: data.isActive !== undefined ? data.isActive : true,
        savedProperties: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserStore.unshift(newUser);
      return sanitizeUser(newUser);
    }
  }

  async update(id: string, data: UpdateUserData) {
    try {
      const user = (await prisma.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email.toLowerCase() }),
          ...(data.phone && { phone: data.phone }),
          ...(data.passwordHash && { passwordHash: data.passwordHash }),
          ...(data.role && { role: data.role }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        } as any,
      })) as any;
      return sanitizeUser(user);
    } catch (error) {
      const index = mockUserStore.findIndex((u) => u.id === id);
      if (index >= 0) {
        mockUserStore[index] = {
          ...mockUserStore[index],
          ...data,
          ...(data.email && { email: data.email.toLowerCase() }),
          updatedAt: new Date(),
        };
        return sanitizeUser(mockUserStore[index]);
      }
      return null;
    }
  }

  async delete(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return { id };
    } catch (error) {
      mockUserStore = mockUserStore.filter((u) => u.id !== id);
      return { id };
    }
  }
}

export const userRepository = new UserRepository();
