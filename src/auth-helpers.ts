import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth';
import { auth } from './config/firebase';

// Sign-up function to create a new user with email and password
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
// Sign-in function to authenticate a user with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
// Sign-out function to log the user out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}; 