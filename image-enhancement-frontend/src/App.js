import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProviderWrapper from "./components/ThemeProviderWrapper";
import WelcomeScreen from "./pages/WelcomeScreen";
import UploadPage from "./pages/UploadPage";
import NavBar from "./components/NavBar";

const App = () => {
    return (
        <ThemeProviderWrapper>
            {(darkMode, setDarkMode) => (
                <Router>
                    <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
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