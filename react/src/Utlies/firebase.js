// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxW5rW3WpNKoESY77lZxFqenxAbvohcW4",
  authDomain: "novakart-bf6ff.firebaseapp.com",
  projectId: "novakart-bf6ff",
  storageBucket: "novakart-bf6ff.firebasestorage.app",
  messagingSenderId: "736783878989",
  appId: "1:736783878989:web:083ce8647b907f6c730504",
  measurementId: "G-YFF71XEMRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { db, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, auth };