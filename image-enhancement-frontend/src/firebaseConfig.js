import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC-Bgx5Hry9xm0FoUPcCjjLz3u3fWB7LiQ",
    authDomain: "superres-e34fd.firebaseapp.com",
    projectId: "superres-e34fd",
    storageBucket: "superres-e34fd.firebasestorage.app",
    messagingSenderId: "555133015514",
    appId: "1:555133015514:web:cf8d82338adc4b9ae75ce3",
    measurementId: "G-YVSKVMRHDD"
};

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
    await fetch("http://127.0.0.1:5000/auth/logout", { method: "POST" });

    setUser(null);
};

export { auth, signInWithGoogle, logout };