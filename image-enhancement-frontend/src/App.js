import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Typography, Container, AppBar, Toolbar, IconButton } from "@mui/material";
import { Brightness4, LightMode } from "@mui/icons-material"; // Icons for dark and light mode
import FileUploader from "./components/FileUploader";
import { motion } from "framer-motion";

const App = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const purpleLight = "#6200EE"; // Standard Purple
    const purpleBright = "#8C3FFD"; // Brighter Purple for Dark Mode

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
                main: darkMode ? purpleBright : purpleLight,
            },
            background: {
                default: darkMode ? "#1E1E1E" : "#F7F7F7", // Neutral tones
                paper: darkMode ? "#2A2A2A" : "#FFFFFF", // Card backgrounds
            },
            text: {
                primary: darkMode ? "#FFFFFF" : "#000000", // High contrast for readability
                secondary: darkMode ? "#CFCFCF" : "#555555", // Subtle text
            },
        },
        typography: {
            fontFamily: [
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "sans-serif",
            ].join(","),
            h4: {
                fontWeight: 600,
            },
            body1: {
                fontWeight: 400,
                lineHeight: 1.6,
            },
        },
        shape: {
            borderRadius: 12, // Softer corners for elegance
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
                position="sticky"
                sx={{
                    backgroundColor: darkMode ? "#2A2A2A" : "#FFFFFF",
                    color: darkMode ? purpleBright : "#000000", // Purple in dark mode
                    boxShadow: "none", // No shadow for minimalism
                    borderBottom: darkMode ? "1px solid #444" : "1px solid #E0E0E0",
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            color: darkMode ? "#FFFFFF" : "#000000", // Matches mode
                        }}
                    >
                        Image Enhancement App
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="Toggle dark mode"
                    >
                        <motion.div
                            key={darkMode ? "sun" : "moon"}
                            initial={{ rotate: 180 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {darkMode ? <LightMode /> : <Brightness4 />}
                        </motion.div>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth="lg" // Automatically adjusts width
                sx={{
                    textAlign: "center",
                    paddingY: { xs: 4, sm: 6 }, // Responsive padding
                    backgroundColor: "background.paper",
                    borderRadius: 4,
                    boxShadow: darkMode
                        ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                        : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    marginTop: { xs: 2, sm: 4 },
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font size
                    }}
                >
                    Upload and Enhance Your Images
                </Typography>
                <FileUploader onFileUpload={(file) => console.log("Uploaded file:", file)} />
            </Container>
        </ThemeProvider>
    );
};

export default App;