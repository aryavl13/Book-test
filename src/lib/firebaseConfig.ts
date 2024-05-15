// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import 'firebase/auth'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: Object = {
  apiKey: "AIzaSyDNvhHcrT1QS4uNYw78pnRHK8kPSykeoF8",
  authDomain: "book-dd323.firebaseapp.com",
  projectId: "book-dd323",
  storageBucket: "book-dd323.appspot.com",
  messagingSenderId: "647129426063",
  appId: "1:647129426063:web:680c5bbbaf58646b90a8fa",
  measurementId: "G-8ED0W2FEHP"
};

// Initialize Firebase
export  const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
