import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Ensure environment variables are set correctly
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
};

// Ensure Firebase is properly configured
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
    console.error("Firebase configuration is missing! Check your .env file.");
}

// Initialize Firebase App & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Get Backend URL dynamically from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

const signInWithGoogle = async (setUser) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();

        // Send token to Flask backend for validation
        const response = await fetch(`${BACKEND_URL}/auth/verify-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error("Token verification failed");
        }

        const data = await response.json();
        setUser(data.user);
        return data.user;
    } catch (error) {
        console.error("Login failed:", error.message);
        return null;
    }
};

const logout = async (setUser) => {
    try {
        await signOut(auth);
        await fetch(`${BACKEND_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    } catch (error) {
        console.error("Logout failed:", error.message);
    }
};

export { auth, signInWithGoogle, logout };