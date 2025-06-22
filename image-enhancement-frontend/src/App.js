import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Custom wrapper that provides MUI theme and dark mode toggle
import ThemeProviderWrapper from "./components/ThemeProviderWrapper";

// Page and layout components
import WelcomeScreen from "./pages/WelcomeScreen";
import UploadPage from "./pages/UploadPage";
import NavBar from "./components/NavBar";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
    return (
        // Provide Material UI theme context (light/dark)
        <ThemeProviderWrapper>
            {(darkMode, setDarkMode) => (
                // React Router handles navigation between views
                <Router>
                    {/* Top navigation bar receives dark mode state */}
                    <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

                    {/* Define route paths and their corresponding components */}
                    <Routes>
                        <Route path="/" element={<WelcomeScreen />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Router>
            )}
        </ThemeProviderWrapper>
    );
};

export default App;