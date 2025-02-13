import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeProviderWrapper = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const purpleLight = "#6200EE";
    const purpleBright = "#8C3FFD";

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: { main: darkMode ? purpleBright : purpleLight },
            background: {
                default: darkMode ? "#1E1E1E" : "#F7F7F7",
                paper: darkMode ? "#2A2A2A" : "#FFFFFF",
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#000000",
                secondary: darkMode ? "#CFCFCF" : "#555555",
            },
        },
        typography: {
            fontFamily: ["-apple-system", "BlinkMacSystemFont", "Roboto", "Arial"].join(","),
            h4: { fontWeight: 600 },
            body1: { fontWeight: 400, lineHeight: 1.6 },
        },
        shape: { borderRadius: 12 },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children(darkMode, setDarkMode)}
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;