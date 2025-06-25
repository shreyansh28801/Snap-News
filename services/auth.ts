// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   updateProfile,
//   User as FirebaseUser,
//   AuthError
// } from 'firebase/auth';
// import { 
//   doc, 
//   setDoc, 
//   getDoc, 
//   serverTimestamp,
//   Timestamp 
// } from 'firebase/firestore';
// import { auth, db } from './firebase';
// import { User, RegisterFormData, LoginFormData } from '../types';
// import { APP_CONFIG, ERROR_MESSAGES } from '../constants';

import { APP_CONFIG } from '@/constants';
import { User } from "@/types";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type FirebaseUser = FirebaseAuthTypes.User;


type DocumentData = { [key: string]: any };

const convertFirebaseUser = async (
  firebaseUser: FirebaseUser
): Promise<User | null> => {
  try {
    const userDocRef = firestore()
      .collection(APP_CONFIG.collections.users)
      .doc(firebaseUser.uid);

    const userDoc = await userDocRef.get();

    if (userDoc.exists()) {
      const userData = userDoc.data() as DocumentData;
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: userData.displayName || firebaseUser.displayName || '',
        createdAt: userData.createdAt?.toDate?.() || new Date(),
        updatedAt: userData.updatedAt?.toDate?.(),
        photoURL: userData.photoURL,
        role: userData.role || 'user'
      };
    }

    // If user document doesn't exist, return fallback user
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      createdAt: new Date(),
      role: 'user'
    };
  } catch (error) {
    //console.error('Error converting Firebase user:', error);
    return null;
  }
};

// // Sign up function
// export const signUp = async (formData: RegisterFormData): Promise<User> => {
//   try {
//     // Validate password match
//     if (formData.password !== formData.confirmPassword) {
//       throw new Error(ERROR_MESSAGES.auth.passwordMismatch);
//     }

//     // Create user with email and password
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       formData.email,
//       formData.password
//     );

//     // Update display name
//     await updateProfile(userCredential.user, {
//       displayName: formData.displayName
//     });

//     // Create user document in Firestore
//     const userData = {
//       uid: userCredential.user.uid,
//       email: formData.email,
//       displayName: formData.displayName,
//       createdAt: serverTimestamp(),
//       role: 'user'
//     };

//     await setDoc(
//       doc(db, APP_CONFIG.collections.users, userCredential.user.uid),
//       userData
//     );

//     // Return user object
//     return {
//       uid: userCredential.user.uid,
//       email: formData.email,
//       displayName: formData.displayName,
//       createdAt: new Date(),
//       role: 'user'
//     };
//   } catch (error) {
//     const authError = error as AuthError;
    
//     // Handle specific Firebase auth errors
//     switch (authError.code) {
//       case 'auth/email-already-in-use':
//         throw new Error(ERROR_MESSAGES.auth.emailInUse);
//       case 'auth/invalid-email':
//         throw new Error(ERROR_MESSAGES.auth.invalidEmail);
//       case 'auth/weak-password':
//         throw new Error(ERROR_MESSAGES.auth.weakPassword);
//       default:
//         throw new Error(authError.message || ERROR_MESSAGES.general);
//     }
//   }
// };

// // Sign in function
// export const signIn = async (formData: LoginFormData): Promise<User> => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       formData.email,
//       formData.password
//     );

//     const user = await convertFirebaseUser(userCredential.user);
    
//     if (!user) {
//       throw new Error(ERROR_MESSAGES.general);
//     }

//     return user;
//   } catch (error) {
//     const authError = error as AuthError;
    
//     // Handle specific Firebase auth errors
//     switch (authError.code) {
//       case 'auth/user-not-found':
//         throw new Error(ERROR_MESSAGES.auth.userNotFound);
//       case 'auth/wrong-password':
//         throw new Error(ERROR_MESSAGES.auth.wrongPassword);
//       case 'auth/invalid-email':
//         throw new Error(ERROR_MESSAGES.auth.invalidEmail);
//       default:
//         throw new Error(authError.message || ERROR_MESSAGES.general);
//     }
//   }
// };

// // Sign out function
// export const logout = async (): Promise<void> => {
//   try {
//     //console.log('Attempting to sign out user');
//     await signOut(auth);
//     //console.log('User signed out successfully');
//   } catch (error) {
//     //console.error('Logout error - Full details:', error);
//     if (error instanceof Error) {
//       //console.error('Error message:', error.message);
//       //console.error('Error stack:', error.stack);
//     }
//     throw error; // Rethrow so we can handle it in the component
//   }
// };

// // Force logout and clear auth state
// export const forceLogout = async (): Promise<void> => {
//   try {
//     //console.log('Force logout: Attempting to sign out user');
//     await signOut(auth);
    
//     // Clear any cached auth data if needed
//     // This is where you would clear AsyncStorage tokens if you're using them
    
//     //console.log('Force logout: Successfully signed out user');
//   } catch (error) {
//     //console.error('Force logout error:', error);
//     // Even if there's an error, we consider the user logged out
//   }
// };

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth().currentUser;

  if (!firebaseUser) {
    return null;
  }

  return convertFirebaseUser(firebaseUser);
};


// // Auth state observer
// export const subscribeToAuthChanges = (
//   callback: (user: User | null) => void
// ): (() => void) => {
//   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//     if (firebaseUser) {
//       const user = await convertFirebaseUser(firebaseUser);
//       callback(user);
//     } else {
//       callback(null);
//     }
//   });

//   return unsubscribe;
// };

// // Check if user is authenticated
// export const isAuthenticated = (): boolean => {
//   return !!auth.currentUser;
// };

// // Get auth error message
// export const getAuthErrorMessage = (error: AuthError): string => {
//   switch (error.code) {
//     case 'auth/email-already-in-use':
//       return ERROR_MESSAGES.auth.emailInUse;
//     case 'auth/invalid-email':
//       return ERROR_MESSAGES.auth.invalidEmail;
//     case 'auth/user-not-found':
//       return ERROR_MESSAGES.auth.userNotFound;
//     case 'auth/wrong-password':
//       return ERROR_MESSAGES.auth.wrongPassword;
//     case 'auth/weak-password':
//       return ERROR_MESSAGES.auth.weakPassword;
//     default:
//       return error.message || ERROR_MESSAGES.general;
//   }
// }; 