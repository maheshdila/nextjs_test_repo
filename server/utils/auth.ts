import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Types for better type safety
export interface JWTPayload {
  userId: number;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload extends JWTPayload {
  tokenVersion: number;
}

/**
 * Password validation rules
 */
export function isPasswordValid(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: 'Password is valid' };
}

/**
 * Hash a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against its hash
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT access token
 * @param payload - The data to be encoded in the token
 * @returns string - The JWT token
 * @throws Error if JWT_SECRET is not set
 */
export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '1h', // Access token expires in 1 hour
  });
}

/**
 * Generate a refresh token
 * @param payload - The data to be encoded in the token
 * @returns string - The refresh token
 * @throws Error if JWT_SECRET is not set
 */
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '7d', // Refresh token expires in 7 days
  });
}

/**
 * Verify and decode a JWT token
 * @param token - The token to verify
 * @returns JWTPayload - The decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyJWT(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns string - The extracted token
 * @throws Error if header is missing or invalid
 */
export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid Authorization header format. Use: Bearer <token>');
  }

  return parts[1];
} 