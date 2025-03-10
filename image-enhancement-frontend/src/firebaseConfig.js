import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Ensure environment variables are loaded
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
};

// Check if Firebase is correctly configured
if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is missing! Check your .env file.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async (setUser) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();

        const response = await fetch("http://127.0.0.1:5000/auth/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",  // Ensures session cookies persist
            body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error("Token verification failed");
        const data = await response.json();

        setUser(data.user);
        return data.user;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};

const logout = async (setUser) => {
    await signOut(auth);
    await fetch("http://127.0.0.1:5000/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    setUser(null);
};

export { auth, signInWithGoogle, logout };