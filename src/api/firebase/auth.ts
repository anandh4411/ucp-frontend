import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface UserProfile {
  uuid: string;
  email: string;
  name: string;
  rank: string;
  role: 'adjt' | 'it_jco' | 'user';
  serviceNumber: string;
  unit: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: FirebaseUser;
  profile: UserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string | null;
  };
}

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const user = userCredential.user;

    // Get access token
    const accessToken = await user.getIdToken();
    const refreshToken = user.refreshToken;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const profile = {
      ...userDoc.data(),
      createdAt: userDoc.data().createdAt?.toDate(),
      updatedAt: userDoc.data().updatedAt?.toDate(),
    } as UserProfile;

    return {
      user,
      profile,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Update password for current user
 */
export const updatePassword = async (newPassword: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    await firebaseUpdatePassword(user, newPassword);
  } catch (error: any) {
    console.error('Update password error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      return null;
    }

    return {
      ...userDoc.data(),
      createdAt: userDoc.data().createdAt?.toDate(),
      updatedAt: userDoc.data().updatedAt?.toDate(),
    } as UserProfile;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

/**
 * Get access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    return await user.getIdToken();
  } catch (error) {
    console.error('Get access token error:', error);
    return null;
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    // Force refresh
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

/**
 * Get user-friendly error message
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already in use',
    'auth/weak-password': 'Password is too weak',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/requires-recent-login': 'Please log in again to perform this action',
  };

  return errorMessages[errorCode] || 'Authentication failed. Please try again';
}
