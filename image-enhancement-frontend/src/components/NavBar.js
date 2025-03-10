import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { AccountCircle, Menu as MenuIcon, Layers } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import CreditsModal from "./CreditsModal";
import GoogleLoginModal from "./GoogleLoginModal";
import DarkModeToggle from "./DarkModeToggle";

const NavBar = ({ darkMode, setDarkMode }) => {
    const [user, setUser] = useState(null);
    const [creditsModalOpen, setCreditsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    // Monitor Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

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
                        flexWrap: "wrap",
                    }}
                >
                    {/* Left Menu Button (Mobile Only) */}
                    <IconButton
                        onClick={() => setMenuOpen(true)}
                        sx={{
                            display: { xs: "block", md: "none" },
                            color: darkMode ? "#F5F5F5" : "#000",
                        }}
                    >
                        <MenuIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    {/* App Name / Logo */}
                    <Typography
                        variant="h6"
                        onClick={() => navigate("/")}
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "18px", sm: "20px" },
                            color: darkMode ? "#F5F5F5" : "#000",
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Image Enhancer
                    </Typography>

                    {/* Right Section: Credits | Profile/Login | Dark Mode */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
                        {/* Credits */}
                        <Box
                            onClick={() => setCreditsModalOpen(true)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: darkMode ? "#222" : "#fff",
                                padding: { xs: "5px 10px", sm: "6px 12px" },
                                borderRadius: "30px",
                                boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <Layers sx={{ fontSize: { xs: 18, sm: 20 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                            <Typography sx={{ ml: 1, fontWeight: "bold", fontSize: { xs: "13px", sm: "15px" }, color: darkMode ? "#F5F5F5" : "#000" }}>
                                3
                            </Typography>
                        </Box>

                        {/* Profile / Login */}
                        {user ? (
                            <Box
                                onClick={() => logout(setUser)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: darkMode ? "#222" : "#fff",
                                    padding: { xs: "5px 10px", sm: "6px 12px" },
                                    borderRadius: "30px",
                                    boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <Typography sx={{ mr: 1, fontSize: "14px", fontWeight: 600 }}>
                                    Hi, {user.displayName.split(" ")[0]}
                                </Typography>
                                <AccountCircle sx={{ fontSize: { xs: 18, sm: 20 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                            </Box>
                        ) : (
                            <Box
                                onClick={() => setLoginModalOpen(true)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: darkMode ? "#222" : "#fff",
                                    padding: { xs: "5px 10px", sm: "6px 12px" },
                                    borderRadius: "30px",
                                    boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <AccountCircle sx={{ fontSize: { xs: 18, sm: 20 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                            </Box>
                        )}

                        {/* Dark Mode Toggle */}
                        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Sidebar Drawer */}
            <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
                <Box sx={{ width: 250, padding: 2 }}>
                    <List>
                        <ListItem button onClick={() => navigate("/")}>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/upload")}>
                            <ListItemText primary="Upload" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/pricing")}>
                            <ListItemText primary="Pricing" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Credits Modal */}
            <CreditsModal open={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} darkMode={darkMode} />

            {/* Google Login Modal */}
            <GoogleLoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
};

export default NavBar;