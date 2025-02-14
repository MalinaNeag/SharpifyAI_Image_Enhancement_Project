import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { motion } from "framer-motion";

const ThemeProviderWrapper = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: { main: darkMode ? "#1DE9B6" : "#1DC4E9" },
            secondary: { main: darkMode ? "#00BFA5" : "#00897B" },
            background: {
                default: darkMode ? "#1C1C1E" : "#FFFFFF",
                paper: darkMode ? "#2A2A2A" : "#FFFFFF",
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#000000",
                secondary: darkMode ? "#CFCFCF" : "#555555",
            },
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            h3: { fontWeight: 700, letterSpacing: "0.5px" },
            h5: { fontWeight: 600 },
            button: { textTransform: "none", fontWeight: 500 },
        },
        shape: { borderRadius: 10 },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: "100vh",
                    position: "relative",
                    overflow: "hidden",
                    background: darkMode
                        ? theme.palette.background.default // Solid dark background
                        : `linear-gradient(90deg, #FFDDE4, #CDECF9, #DCCAFF, #FFC9B8, #FFF8CC, #CDEECF)`,
                    backgroundSize: darkMode ? "auto" : "100% 100%",
                }}
            >
                {/* Light Mode Animated Gradient (only rendered in light mode) */}
                {!darkMode && (
                    <motion.div
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "50% 50%", "20% 80%"],
                        }}
                        transition={{
                            duration: 50,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "linear",
                        }}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, #FFDDE4, #CDECF9, #DCCAFF, #FFC9B8, #FFF8CC, #CDEECF)",
                            animation: "bgMove 50s infinite alternate ease-in-out",
                            backgroundSize: "400% 400%",
                            opacity: 0.8,
                        }}
                    />
                )}

                {/* Children Content */}
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    {children(darkMode, setDarkMode)}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;