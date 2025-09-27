import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration, read from .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const createAdmin = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "1755vijay1755@gmail.com", "test-password");
    console.log("Admin user created! UID:", userCredential.user.uid);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

createAdmin();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);