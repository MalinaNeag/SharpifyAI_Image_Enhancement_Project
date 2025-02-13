import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Brightness4, LightMode, AccountCircle, Menu as MenuIcon, Layers, NightsStay } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const NavBar = ({ darkMode, setDarkMode }) => {
    const [credits, setCredits] = useState(3); // Hardcoded credits; TO BE MODIFIED
    const navigate = useNavigate(); // Get the navigate function

    const handleTitleClick = () => {
        navigate("/"); // Redirect to home when clicking title
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                background: darkMode ? "rgba(15, 15, 15, 0.35)" : "rgba(255, 255, 255, 0.35)",
                backdropFilter: "blur(6px)",
                boxShadow: "none",
                transition: "background 0.3s ease-in-out",
                height: "50px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, sm: 4, md: 6 }, minHeight: "50px" }}>

                {/* App Name / Logo - Clickable */}
                <Typography
                    variant="h6"
                    onClick={handleTitleClick} // Click event triggers navigation
                    sx={{
                        fontWeight: 700,
                        fontSize: "18px",
                        color: darkMode ? "#F5F5F5" : "#000000",
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" }, // Optional hover effect
                    }}
                >
                    Image Enhancer
                </Typography>

                {/* Right Section: Credits | Profile | Dark Mode */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {/* Credits */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: darkMode ? "#222" : "#fff",
                            padding: "4px 12px",
                            borderRadius: "30px",
                            boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        <Layers sx={{ fontSize: 20, color: darkMode ? "#F5F5F5" : "#000" }} />
                        <Typography sx={{ ml: 1, fontWeight: "bold", fontSize: "14px", color: darkMode ? "#F5F5F5" : "#000" }}>
                            {credits}
                        </Typography>
                    </Box>

                    {/* Profile */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: darkMode ? "#222" : "#fff",
                            padding: "4px 12px",
                            borderRadius: "30px",
                            boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        <AccountCircle sx={{ fontSize: 20, color: darkMode ? "#F5F5F5" : "#000" }} />
                    </Box>

                    {/* Dark Mode Toggle */}
                    <Box
                        onClick={() => setDarkMode(!darkMode)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: darkMode ? "#222" : "#fff",
                            padding: "4px 12px",
                            borderRadius: "30px",
                            boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        <motion.div
                            key={darkMode ? "sun" : "moon"}
                            initial={{ rotate: 180 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {darkMode ? (
                                <LightMode sx={{ fontSize: 20, color: "#FFD700" }} /> // Sun Icon for Dark Mode
                            ) : (
                                <NightsStay sx={{ fontSize: 20, color: "#FFD700" }} /> // Yellow Moon for Light Mode
                            )}
                        </motion.div>
                    </Box>

                    {/* Mobile Menu */}
                    <IconButton sx={{ display: { md: "none" }, ml: 1 }}>
                        <MenuIcon sx={{ fontSize: 22 }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;