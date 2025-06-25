import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import firebaseConfig from '../config/firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// Log initialization
//console.log('Firebase services initialized');

export { app };

// Helper function to get user info by ID
export const getUserById = async (userId: string): Promise<{ displayName: string } | null> => {
  try {
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists()) {
      return userDoc.data() as { displayName: string };
    }
    return null;
  } catch (error) {
    //console.error('Error fetching user:', error);
    return null;
  }
}; 