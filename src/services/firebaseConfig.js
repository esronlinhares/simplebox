import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuX0_mqmYZAFHAi9lvk60EaGL_vDHQDZo",
  authDomain: "simpleboxalpha-5e0a7.firebaseapp.com",
  projectId: "simpleboxalpha-5e0a7",
  storageBucket: "simpleboxalpha-5e0a7.appspot.com",
  messagingSenderId: "142911036181",
  appId: "1:142911036181:web:af7a0ea3b72c6411f6a71c",
  measurementId: "G-6Y76C9RZMS"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);