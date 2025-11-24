import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYkBy8bikBJ8hr0u53j595beqJqEC6GY8",
  authDomain: "tourlocal-31d99.firebaseapp.com",
  projectId: "tourlocal-31d99",
  storageBucket: "tourlocal-31d99.firebasestorage.app",
  messagingSenderId: "719463384920",
  appId: "1:719463384920:web:3f16072bea2f61cac2872d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, db, auth, storage}