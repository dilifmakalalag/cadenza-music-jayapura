// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKRzfslgwaVvnOyLcQKIBi64iiKbSLFfQ",
  authDomain: "kwitansi-telur.firebaseapp.com",
  projectId: "kwitansi-telur",
  storageBucket: "kwitansi-telur.firebasestorage.app",
  messagingSenderId: "171997909517",
  appId: "1:171997909517:web:0a935efbf52d31c670fb44",
  measurementId: "G-29DBQKPRCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
