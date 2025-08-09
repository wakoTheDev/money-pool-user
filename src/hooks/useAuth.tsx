/**
 * Authentication Context and Hooks
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, GroupRegistrationData } from '@/types/auth';

// Auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// Auth context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  registerGroup: (data: GroupRegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (data: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication service (replace with real API calls)
const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    if (credentials.email === 'admin@moneypool.com') {
      return {
        id: '1',
        email: credentials.email,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+254700000000',
        role: 'super_admin',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [
          'admin.all',
          'groups.verify',
          'groups.manage',
          'users.manage',
          'system.manage',
          'database.admin'
        ]
      };
    } else if (credentials.email === 'leader@example.com') {
      return {
        id: '2',
        email: credentials.email,
        firstName: 'Group',
        lastName: 'Leader',
        phone: '+254700000001',
        role: 'group_leader',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        chamaId: 'chama1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [
          'members.view', 'members.create', 'members.edit',
          'contributions.view', 'contributions.create', 'contributions.edit',
          'loans.view', 'loans.approve',
          'meetings.view', 'meetings.create', 'meetings.edit',
          'finance.view', 'finance.reports'
        ]
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  async register(data: RegisterData): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'member',
      status: 'pending',
      emailVerified: false,
      phoneVerified: false,
      chamaId: data.chamaId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: ['members.view', 'contributions.view']
    };
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
};

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.login(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-jwt-token');
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const user = await authService.register(data);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-jwt-token');
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const registerGroup = async (data: GroupRegistrationData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      // Mock group registration - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // For now, just show success message
      console.log('Group registration submitted:', data);
      
      // In a real app, you would get a confirmation or update user's role
      dispatch({ type: 'REGISTER_SUCCESS', payload: state.user! });
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions.includes(permission) || 
           state.user?.permissions.includes('admin.all') || false;
  };

  const hasRole = (role: string): boolean => {
    return state.user?.role === role || false;
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    registerGroup,
    logout,
    clearError,
    updateUser,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[]
) => {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, hasPermission } = useAuth();

    if (!isAuthenticated) {
      return <div>Please log in to access this page</div>;
    }

    if (requiredPermissions) {
      const hasRequiredPermissions = requiredPermissions.some(permission =>
        hasPermission(permission)
      );
      
      if (!hasRequiredPermissions) {
        return <div>You don't have permission to access this page</div>;
      }
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return AuthenticatedComponent;
};
