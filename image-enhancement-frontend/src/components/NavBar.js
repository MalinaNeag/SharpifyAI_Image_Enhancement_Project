import React, { useState, useEffect } from "react";
import {
    AppBar, Toolbar, Typography, IconButton, Box, Drawer, List,
    ListItem, ListItemText, Menu, MenuItem
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import GoogleLoginModal from "./GoogleLoginModal";
import DarkModeToggle from "./DarkModeToggle";
import logo from "../resources/logo.png";

// Top navigation bar component with authentication and theme control
const NavBar = ({ darkMode, setDarkMode }) => {
    const [user, setUser] = useState(null); // Firebase user state
    const [menuOpen, setMenuOpen] = useState(false); // Mobile drawer open/close
    const [loginModalOpen, setLoginModalOpen] = useState(false); // Google login modal
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for dropdown menu
    const navigate = useNavigate();

    // Watch for Firebase authentication changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Open user menu (avatar dropdown)
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close user menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Logout logic + redirect to homepage
    const handleLogout = async () => {
        await logout(setUser);
        navigate("/");
        handleMenuClose();
    };

    return (
        <>
            {/* AppBar with blur + responsive layout */}
            <AppBar
                position="fixed"
                sx={{
                    background: darkMode ? "rgba(15, 15, 15, 0.35)" : "rgba(255, 255, 255, 0.35)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "none",
                    height: "70px",
                    display: "flex",
                    justifyContent: "center",
                    transition: "background 0.3s ease-in-out",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        px: { xs: 1, sm: 4, md: 6 },
                        minHeight: "70px !important",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Left hamburger menu icon (visible on small screens) */}
                    <IconButton
                        onClick={() => setMenuOpen(true)}
                        sx={{
                            display: { xs: "block", md: "none" },
                            color: darkMode ? "#F5F5F5" : "#000",
                        }}
                    >
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </IconButton>

                    {/* Logo + App name (clickable) */}
                    <Box
                        onClick={() => navigate("/")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            cursor: "pointer",
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="SharpifyAI Logo"
                            sx={{
                                height: 40,
                                width: "auto",
                                objectFit: "contain",
                                filter: darkMode ? "brightness(0) invert(1)" : "none",
                                transition: "height 0.3s ease",
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "20px", sm: "24px" },
                                color: darkMode ? "#F5F5F5" : "#000",
                                letterSpacing: "0.5px",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            SharpifyAI
                        </Typography>
                    </Box>

                    {/* Right side: Auth controls + Dark Mode */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
                        {/* Authenticated: Show profile avatar + menu */}
                        {user ? (
                            <>
                                <Box
                                    onClick={handleMenuOpen}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: darkMode ? "#222" : "#fff",
                                        padding: { xs: "5px", sm: "6px 12px" },
                                        borderRadius: "30px",
                                        boxShadow: darkMode
                                            ? "0px 3px 8px rgba(255, 255, 255, 0.1)"
                                            : "0px 3px 8px rgba(0,0,0,0.1)",
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <AccountCircle sx={{ fontSize: { xs: 24, sm: 28 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                                    <Typography
                                        sx={{
                                            ml: 1,
                                            fontWeight: 700,
                                            fontSize: { xs: 0, sm: "13px" },
                                            display: { xs: "none", sm: "block" },
                                            color: darkMode ? "#F5F5F5" : "#000",
                                        }}
                                    >
                                        {user.displayName?.split(" ")[0]}'s Profile
                                    </Typography>
                                </Box>

                                {/* Dropdown menu for authenticated user */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                                    sx={{
                                        mt: 1,
                                        "& .MuiPaper-root": {
                                            borderRadius: "12px",
                                            minWidth: "150px",
                                            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                                            backdropFilter: "blur(8px)",
                                            backgroundColor: darkMode
                                                ? "rgba(255, 255, 255, 0.1)"
                                                : "rgba(255, 255, 255, 0.8)",
                                            color: darkMode ? "#F5F5F5" : "#000",
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            navigate("/profile");
                                            handleMenuClose();
                                        }}
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                                        }}
                                    >
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "#D32F2F",
                                            "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            // Unauthenticated: Show login button (avatar only)
                            <Box
                                onClick={() => setLoginModalOpen(true)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: darkMode ? "#222" : "#fff",
                                    padding: { xs: "5px 10px", sm: "6px 12px" },
                                    borderRadius: "30px",
                                    boxShadow: darkMode
                                        ? "0px 3px 8px rgba(255, 255, 255, 0.1)"
                                        : "0px 3px 8px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <AccountCircle sx={{ fontSize: { xs: 18, sm: 20 }, color: darkMode ? "#F5F5F5" : "#000" }} />
                            </Box>
                        )}

                        {/* Dark/light mode toggle */}
                        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer with route links */}
            <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
                <Box sx={{ width: 250, padding: 2 }}>
                    <List>
                        <ListItem button onClick={() => navigate("/")}>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/profile")}>
                            <ListItemText primary="Profile" />
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

            {/* Google login modal (appears if not authenticated) */}
            <GoogleLoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
};

export default NavBar;