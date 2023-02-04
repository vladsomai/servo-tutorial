
import { ref, uploadBytes } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyBYGT4ZJTEdI6W2CDW-Lyh49GPMDStgpb4",
  authDomain: "servo-tutorial.firebaseapp.com",
  projectId: "servo-tutorial",
  storageBucket: "servo-tutorial.appspot.com",
  messagingSenderId: "728487511246",
  appId: "1:728487511246:web:dec731d83425c83103fc9f",
  measurementId: "G-LE0KT6GPTR",
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStore = getFirestore(firebaseApp);
export const firebaseFileStorage = getStorage(firebaseApp);
