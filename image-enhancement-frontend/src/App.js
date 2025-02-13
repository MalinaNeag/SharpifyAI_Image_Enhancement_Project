import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Container } from "@mui/material";
import { Brightness4, LightMode } from "@mui/icons-material";
import { motion } from "framer-motion";
import FileUploader from "./components/FileUploader";
import ThemeProviderWrapper from "./components/ThemeProviderWrapper";

const App = () => {
    return (
        <ThemeProviderWrapper>
            {(darkMode, setDarkMode) => (
                <>
                    <AppBar
                        position="sticky"
                        sx={{
                            backgroundColor: darkMode ? "#2A2A2A" : "#FFFFFF",
                            color: darkMode ? "#8C3FFD" : "#000000",
                            boxShadow: "none",
                            borderBottom: darkMode ? "1px solid #444" : "1px solid #E0E0E0",
                        }}
                    >
                        <Toolbar>
                            <Typography
                                variant="h6"
                                sx={{
                                    flexGrow: 1,
                                    fontWeight: 700,
                                    color: darkMode ? "#FFFFFF" : "#000000",
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
                        maxWidth="lg"
                        sx={{
                            textAlign: "center",
                            paddingY: { xs: 4, sm: 6 },
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
                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                        >
                            Upload and Enhance Your Images
                        </Typography>
                        <FileUploader />
                    </Container>
                </>
            )}
        </ThemeProviderWrapper>
    );
};

export default App;