import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";

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
            primary: { main: darkMode ? "#1DE9B6" : "#1DC4E9" }, // Matching green buttons
            secondary: { main: darkMode ? "#00BFA5" : "#00897B" }, // Slightly darker green for contrast
            background: {
                default: darkMode ? "#1C1C1E" : "#F5F5F7",
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
        shape: { borderRadius: 10 }, // Rounder buttons
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: "100vh",
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
                            #FFFFFF 20%, 
                            rgba(255, 255, 255, 0.95) 40%,
                            rgba(255, 255, 255, 0.85) 55%, 
                            rgba(255, 255, 255, 0.6) 70%, 
                            transparent 80%
                        ), 
                        linear-gradient(to right, 
                            #E3F2FD 0%, 
                            #E0F7FA 33%, 
                            #FFF9C4 66%, 
                            #FCE4EC 100%)`,
                    backgroundSize: "100% 100%",
                }}
            >
                {children(darkMode, setDarkMode)}
            </Box>
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;