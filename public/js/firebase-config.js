// Firebase Configuration and Initialization
// MindMaze Project - Patient Dashboard

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBz51wgf5qkrDUJCLmkCzV6jjca8rf2XpA",
  authDomain: "mindmaze-64133.firebaseapp.com",
  projectId: "mindmaze-64133",
  storageBucket: "mindmaze-64133.firebasestorage.app",
  messagingSenderId: "671544529067",
  appId: "1:671544529067:web:32fa79ea61afa9ac6367ee",
  measurementId: "G-XEF3FNNS0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (optional)
let analytics = null;
try {
  analytics = getAnalytics(app);
  console.log('Firebase Analytics initialized');
} catch (error) {
  console.log('Analytics not available:', error.message);
}

// Export services for use in other modules
export { auth, db, analytics };

// Log successful initialization
console.log('Firebase initialized successfully for MindMaze Dashboard');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);