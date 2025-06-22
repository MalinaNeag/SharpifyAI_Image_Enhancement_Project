import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { motion } from "framer-motion";

// Theme wrapper to apply global MUI theming and animated background logic
const ThemeProviderWrapper = ({ children }) => {
    // Load initial dark mode preference from localStorage (defaults to false if not set)
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    // Update localStorage whenever the darkMode state changes
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // Define the custom theme object, which dynamically adjusts based on dark mode
    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: { main: darkMode ? "#1DE9B6" : "#1DC4E9" },      // Cyan tones
            secondary: { main: darkMode ? "#00BFA5" : "#00897B" },    // Teal tones
            background: {
                default: darkMode ? "#1C1C1E" : "#FFFFFF",            // Main background
                paper: darkMode ? "#2A2A2A" : "#FFFFFF"               // Card background
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#000000",            // Headings, main text
                secondary: darkMode ? "#CFCFCF" : "#555555"           // Descriptions, subtext
            },
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            h3: { fontWeight: 700, letterSpacing: "0.5px" },
            h5: { fontWeight: 600 },
            button: { textTransform: "none", fontWeight: 500 }
        },
        shape: {
            borderRadius: 10 // Global border radius for buttons, cards, etc.
        }
    });

    return (
        <ThemeProvider theme={theme}>
            {/* Resets MUI styles globally */}
            <CssBaseline />

            {/* Global container for page content */}
            <Box
                sx={{
                    minHeight: "100vh",
                    position: "relative",
                    overflow: "hidden",
                    background: darkMode
                        ? theme.palette.background.default // Solid dark background
                        : `linear-gradient(90deg, #FFDDE4, #CDECF9, #DCCAFF, #FFC9B8, #FFF8CC, #CDEECF)`, // Animated light gradient
                    backgroundSize: darkMode ? "auto" : "100% 100%",
                }}
            >
                {/* Render animated gradient only in light mode using framer-motion */}
                {!darkMode && (
                    <motion.div
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{
                            backgroundPosition: [
                                "0% 0%",
                                "100% 100%",
                                "50% 50%",
                                "20% 80%"
                            ]
                        }}
                        transition={{
                            duration: 50,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "linear"
                        }}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, #FFDDE4, #CDECF9, #DCCAFF, #FFC9B8, #FFF8CC, #CDEECF)",
                            animation: "bgMove 50s infinite alternate ease-in-out",
                            backgroundSize: "400% 400%",
                            opacity: 0.8 // subtle overlay
                        }}
                    />
                )}

                {/* Render child content and pass darkMode + setter for toggles */}
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    {children(darkMode, setDarkMode)}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;