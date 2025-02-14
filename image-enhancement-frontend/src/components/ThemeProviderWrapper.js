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
                        ? `linear-gradient(to bottom, 
                            #1C1C1E 10%, 
                            rgba(30, 30, 30, 0.9) 40%, 
                            rgba(45, 45, 45, 0.85) 55%, 
                            rgba(60, 60, 60, 0.7) 70%, 
                            transparent 80%
                        ), 
                        linear-gradient(to right, 
                            #2D2D30 0%, 
                            #3E3E42 33%, 
                            #545454 66%, 
                            #6C6C70 100%)`
                        : `linear-gradient(to bottom, 
                            #FFFFFF 5%,  
                            rgba(255, 255, 255, 0.98) 15%,  
                            rgba(255, 255, 255, 0.95) 30%,  
                            rgba(255, 255, 255, 0.9) 45%,  
                            rgba(255, 255, 255, 0.85) 60%,  
                            rgba(255, 245, 180, 0.6) 75%,  
                            rgba(250, 210, 255, 0.5) 85%,  
                            rgba(230, 190, 255, 0.4) 100%
                        )`,
                    backgroundSize: "100% 100%",
                }}
            >
                {/* Light Mode Animated Gradient (No Slide Effect) */}
                {!darkMode && (
                    <motion.div
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "50% 50%", "20% 80%"],
                        }}
                        transition={{ duration: 50, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: `radial-gradient(circle at 30% 30%, 
                                rgba(255, 140, 160, 0.5) 0%,  /* Pink */
                                rgba(120, 200, 255, 0.4) 25%, /* Light Blue */
                                rgba(100, 255, 190, 0.5) 50%,  /* Teal */
                                rgba(255, 230, 150, 0.5) 75%, /* Soft Yellow */
                                rgba(255, 240, 200, 0.4) 100% /* Peach */
                            )`,
                            backgroundSize: "400% 400%",
                            opacity: 0.8,
                        }}
                    />
                )}

                {/* Children Content */}
                <Box sx={{ position: "relative", zIndex: 1 }}>{children(darkMode, setDarkMode)}</Box>
            </Box>
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;
