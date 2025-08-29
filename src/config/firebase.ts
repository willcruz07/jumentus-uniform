import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBll5VNIpFOw793SfdnW2fVrDGX8Fmr38w",
  authDomain: "jumentus-uniform.firebaseapp.com",
  projectId: "jumentus-uniform",
  storageBucket: "jumentus-uniform.firebasestorage.app",
  messagingSenderId: "772867194871",
  appId: "1:772867194871:web:ec2fddbf72e0ffd3b1f8f2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login anônimo:', error);
    throw error;
  }
};
