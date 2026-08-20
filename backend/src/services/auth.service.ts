import bcrypt from 'bcryptjs';
import { authRepository } from '../repositories/auth.repository.js';
import { generateToken } from '../utils/jwt.js';

export class AuthService {
  async login(email: string, password?: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Account Status Check: Reject authentication for disabled accounts
    if (user.isActive === false) {
      const error: any = new Error('Account is disabled. Please contact system administrator.');
      error.statusCode = 401;
      throw error;
    }

    // Verify password if user has a passwordHash and password is provided
    if (user.passwordHash && password) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        const error: any = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...safeUser } = user;

    return {
      token,
      user: safeUser,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

export const authService = new AuthService();
