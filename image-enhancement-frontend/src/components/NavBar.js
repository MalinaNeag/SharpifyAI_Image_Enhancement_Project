import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { LightMode, AccountCircle, Menu as MenuIcon, Layers, NightsStay } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CreditsModal from "./CreditsModal"; // Import the credits modal

const NavBar = ({ darkMode, setDarkMode }) => {
    const [creditsModalOpen, setCreditsModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
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
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        px: { xs: 1, sm: 4, md: 6 },
                        minHeight: "50px",
                        flexWrap: "wrap" // Ensures wrapping on smaller screens
                    }}
                >
                    {/* App Name / Logo - Clickable */}
                    <Typography
                        variant="h6"
                        onClick={() => navigate("/")}
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "16px", sm: "18px" }, // Adjust font size for mobile
                            color: darkMode ? "#F5F5F5" : "#000000",
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Image Enhancer
                    </Typography>

                    {/* Right Section: Credits | Profile | Dark Mode */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, sm: 1.5 }, // Reduce gap for mobile
                            flexWrap: "wrap" // Ensures icons don't overflow on small screens
                        }}
                    >
                        {/* Credits - Clickable */}
                        <Box
                            onClick={() => setCreditsModalOpen(true)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: darkMode ? "#222" : "#fff",
                                padding: { xs: "3px 8px", sm: "4px 12px" }, // Reduce padding for mobile
                                borderRadius: "30px",
                                boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <Layers sx={{ fontSize: { xs: 18, sm: 20 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                            <Typography
                                sx={{
                                    ml: 1,
                                    fontWeight: "bold",
                                    fontSize: { xs: "12px", sm: "14px" }, // Adjust text size for mobile
                                    color: darkMode ? "#F5F5F5" : "#000"
                                }}
                            >
                                3
                            </Typography>
                        </Box>

                        {/* Profile */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: darkMode ? "#222" : "#fff",
                                padding: { xs: "3px 8px", sm: "4px 12px" }, // Reduce padding for mobile
                                borderRadius: "30px",
                                boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <AccountCircle sx={{ fontSize: { xs: 18, sm: 20 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                        </Box>

                        {/* Dark Mode Toggle */}
                        <Box
                            onClick={() => setDarkMode(!darkMode)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: darkMode ? "#222" : "#fff",
                                padding: { xs: "3px 8px", sm: "4px 12px" }, // Reduce padding for mobile
                                borderRadius: "30px",
                                boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <motion.div key={darkMode ? "sun" : "moon"} initial={{ rotate: 180 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
                                {darkMode ? <LightMode sx={{ fontSize: { xs: 18, sm: 20 }, color: "#FFD700" }} /> : <NightsStay sx={{ fontSize: { xs: 18, sm: 20 }, color: "#FFD700" }} />}
                            </motion.div>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Credits Modal */}
            <CreditsModal open={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} darkMode={darkMode} />
        </>
    );
};

export default NavBar;