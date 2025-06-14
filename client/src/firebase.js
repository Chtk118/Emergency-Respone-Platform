import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa7qqscgPugKu26JwYCoaUuiV43NJsMUU",
  authDomain: "emergency-response-de345.firebaseapp.com",
  projectId: "emergency-response-de345",
  storageBucket: "emergency-response-de345.appspot.com",
  messagingSenderId: "1047763579025",
  appId: "1:1047763579025:web:33f1d59996c5189b3acf30",
  measurementId: "G-C3P2TBS9LF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ added
