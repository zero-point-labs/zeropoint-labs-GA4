import bcrypt from 'bcryptjs';
import { appwriteService, ClientData } from './appwrite';

// Authentication configuration
export const authConfig = {
  saltRounds: 12,
  sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Interface for login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interface for client session
export interface ClientSession {
  clientId: string;
  username: string;
  clientName: string;
  websiteDomain: string;
  trackingId: string;
  isActive: boolean;
  expiresAt: number;
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(authConfig.saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

// Generate a secure session token
export function generateSessionToken(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

// Authenticate client credentials
export async function authenticateClient(credentials: LoginCredentials): Promise<ClientData | null> {
  try {
    const { username, password } = credentials;
    
    // Get client by username
    const client = await appwriteService.getClientByUsername(username);
    if (!client) {
      return null; // Client not found
    }

    // Check if client is active
    if (!client.isActive) {
      throw new Error('Client account is disabled');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, client.password);
    if (!isValidPassword) {
      return null; // Invalid password
    }

    // Update last login
    if (client.$id) {
      await appwriteService.updateClientLastLogin(client.$id);
    }

    return client;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Create client session data
export function createClientSession(client: ClientData): ClientSession {
  return {
    clientId: client.$id || '',
    username: client.username,
    clientName: client.clientName,
    websiteDomain: client.websiteDomain,
    trackingId: client.trackingId,
    isActive: client.isActive,
    expiresAt: Date.now() + authConfig.sessionDuration,
  };
}

// Validate session expiry
export function isSessionValid(session: ClientSession): boolean {
  return session.expiresAt > Date.now() && session.isActive;
}

// Session storage utilities (for client-side)
export const sessionStorage = {
  // Store session in browser
  setSession: (session: ClientSession): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zp_client_session', JSON.stringify(session));
    }
  },

  // Get session from browser
  getSession: (): ClientSession | null => {
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem('zp_client_session');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData) as ClientSession;
          return isSessionValid(session) ? session : null;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  // Remove session from browser
  clearSession: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zp_client_session');
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    const session = sessionStorage.getSession();
    return session !== null && isSessionValid(session);
  }
};

// Admin authentication (simple token-based for now)
export const adminAuth = {
  // Check if admin token is valid
  isValidAdminToken: (token: string): boolean => {
    const validToken = process.env.ADMIN_ACCESS_TOKEN;
    return Boolean(validToken && token === validToken);
  },

  // Get admin token from headers
  getAdminTokenFromHeaders: (headers: Headers): string | null => {
    const authHeader = headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
};

// Utility function to validate client creation data
export function validateClientData(data: {
  clientName: string;
  username: string;
  password: string;
  websiteDomain: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate client name
  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.push('Client name must be at least 2 characters long');
  }

  // Validate username
  if (!data.username || data.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  // Validate password
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Validate website domain
  if (!data.websiteDomain || !isValidDomain(data.websiteDomain)) {
    errors.push('Please provide a valid website domain');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Simple domain validation
function isValidDomain(domain: string): boolean {
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  
  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.?[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

// Generate secure random password (for admin use)
export function generateSecurePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

export default {
  hashPassword,
  verifyPassword,
  authenticateClient,
  createClientSession,
  isSessionValid,
  sessionStorage,
  adminAuth,
  validateClientData,
  generateSecurePassword,
}; 