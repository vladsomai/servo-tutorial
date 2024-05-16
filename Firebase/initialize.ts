
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBYGT4ZJTEdI6W2CDW-Lyh49GPMDStgpb4",
  authDomain: "servo-tutorial.firebaseapp.com",
  projectId: "servo-tutorial",
  storageBucket: "servo-tutorial.appspot.com",
  messagingSenderId: "728487511246",
  appId: "1:728487511246:web:dec731d83425c83103fc9f",
  measurementId: "G-LE0KT6GPTR",
}

export const geminiAPIKey = "AIzaSyC1DCMUZM1zennnH5CfeNih12x1ex-Omu8"

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStore = getFirestore(firebaseApp);
export const firebaseFileStorage = getStorage(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);