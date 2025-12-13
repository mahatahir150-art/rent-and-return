// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCkYfusJfqzlXBugzu6pBgflxXAKcZfz9U",
    authDomain: "rent-return.firebaseapp.com",
    projectId: "rent-return",
    storageBucket: "rent-return.appspot.com",
    messagingSenderId: "499330204534",
    appId: "1:499330204534:web:93b9ca8385723fd5d67057",
    measurementId: "G-KWTQ8M4Z4X",
    databaseURL: "https://rent-return-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// Initialize Firebase services
let analytics = null;
let auth = null;
let firestoreDb = null;
let realtimeDb = null;
let storage = null;

try {
    analytics = getAnalytics(app);
} catch (e) { console.error("Firebase Analytics failed", e); }

try {
    auth = getAuth(app);
} catch (e) { console.error("Firebase Auth failed", e); }

try {
    firestoreDb = getFirestore(app);
} catch (e) { console.error("Firebase Firestore failed", e); }

try {
    realtimeDb = getDatabase(app);
} catch (e) { console.error("Firebase RealTime DB failed", e); }

try {
    storage = getStorage(app);
} catch (e) { console.error("Firebase Storage failed", e); }

let messaging = null;
isSupported().then(supported => {
    if (supported) {
        messaging = getMessaging(app);
    }
}).catch(err => {
    console.log('Firebase Messaging not supported in this environment', err);
});


// Export Firebase services for use in other parts of the app
export { app, analytics, auth, firestoreDb, realtimeDb, storage, messaging };
