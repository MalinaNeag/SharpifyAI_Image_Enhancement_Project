import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProviderWrapper from "./components/ThemeProviderWrapper";
import WelcomeScreen from "./pages/WelcomeScreen";
import UploadPage from "./pages/UploadPage";
import NavBar from "./components/NavBar";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get("user");

        if (userEmail) {
            localStorage.setItem("userEmail", userEmail);
            setUser(userEmail);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            const storedUser = localStorage.getItem("userEmail");
            if (storedUser) {
                setUser(storedUser);
            }
        }
    }, []);

    return (
        <ThemeProviderWrapper>
            {(darkMode, setDarkMode) => (
                <Router>
                    <NavBar darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
                    <Routes>
                        <Route path="/" element={<WelcomeScreen />} />
                        <Route path="/upload" element={<UploadPage />} />
                    </Routes>
                </Router>
            )}
        </ThemeProviderWrapper>
    );
};

export default App;