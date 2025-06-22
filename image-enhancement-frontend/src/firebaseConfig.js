import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Load Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Validate essential Firebase config values
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
    throw new Error("Firebase configuration is missing. Check your .env file.");
}

// Initialize Firebase app and authentication provider
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Backend URL for API calls, fallback to localhost in development
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

/**
 * Sign in with Google and send the Firebase ID token to the Flask backend for verification.
 * If verification succeeds, set the authenticated user in the frontend state.
 */
const signInWithGoogle = async (setUser) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();

        console.log("Google login successful:", user.email);

        // Send token to backend for validation
        const response = await fetch(`${BACKEND_URL}/auth/verify-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error(`Token verification failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Backend verified user:", data.user);

        if (typeof setUser === "function") {
            setUser(data.user);
        } else {
            console.warn("setUser is not a function; user state was not updated.");
        }

        return data.user;
    } catch (error) {
        console.error("Login failed:", error.message);
        return null;
    }
};

/**
 * Sign out the user from both Firebase and the Flask backend.
 * Clears authentication state and removes session cookies.
 */
const logout = async (setUser) => {
    try {
        console.log("Logging out user...");
        await signOut(auth);

        const response = await fetch(`${BACKEND_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            console.warn("Backend logout request did not return OK.");
        }

        console.log("User logged out.");
        setUser(null);
    } catch (error) {
        console.error("Logout failed:", error.message);
    }
};

export { auth, signInWithGoogle, logout };