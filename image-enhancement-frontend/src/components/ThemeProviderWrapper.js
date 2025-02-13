import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Box } from "@mui/material";

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
            primary: { main: darkMode ? "#8C3FFD" : "#6200EE" },
            background: {
                default: darkMode ? "#1E1E1E" : "#F7F7F7",
                paper: darkMode ? "#2A2A2A" : "#FFFFFF",
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#000000",
                secondary: darkMode ? "#CFCFCF" : "#555555",
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: "100vh",
                    background: darkMode
                        ? `linear-gradient(to bottom, #1C1C1E 10%, rgba(30, 30, 30, 0.9) 40%)`
                        : `linear-gradient(to bottom, #FFFFFF 20%, rgba(255, 255, 255, 0.95) 40%)`,
                    backgroundSize: "100% 100%",
                }}
            >
                {children(darkMode, setDarkMode)}
            </Box>
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;