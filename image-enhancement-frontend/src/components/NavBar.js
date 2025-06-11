import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import GoogleLoginModal from "./GoogleLoginModal";
import DarkModeToggle from "./DarkModeToggle";
import logo from "../resources/logo.png";

const NavBar = ({ darkMode, setDarkMode }) => {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout(setUser);
        navigate("/");
        handleMenuClose();
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: darkMode ? "rgba(15, 15, 15, 0.35)" : "rgba(255, 255, 255, 0.35)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "none",
                    transition: "background 0.3s ease-in-out",
                    height: "70px",
                    display: "flex",
                    justifyContent: "center",
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
                    {/* Left Menu Button (Mobile Only) */}
                    <IconButton
                        onClick={() => setMenuOpen(true)}
                        sx={{
                            display: { xs: "block", md: "none" },
                            color: darkMode ? "#F5F5F5" : "#000",
                            alignSelf: "center",
                        }}
                    >
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </IconButton>

                    {/* App Logo and Name */}
                    <Box
                        onClick={() => navigate("/")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            cursor: "pointer",
                            height: "100%",
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="SharpifyAI Logo"
                            sx={{
                                height: { xs: 40, sm: 40, md: 40 },
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

                    {/* Right Section: Profile/Login | Dark Mode */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
                        {/* Profile / Login */}
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
                                        boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
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
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    sx={{
                                        mt: 1,
                                        "& .MuiPaper-root": {
                                            borderRadius: "12px",
                                            minWidth: "150px",
                                            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                                            backdropFilter: "blur(8px)",
                                            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)",
                                            color: darkMode ? "#F5F5F5" : "#000",
                                        },
                                    }}
                                >
                                    <MenuItem
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                                        }}
                                        onClick={() => { navigate("/profile"); handleMenuClose(); }}
                                    >
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "#D32F2F",
                                            "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
                                        }}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
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

            {/* Login Modal */}
            <GoogleLoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
};

export default NavBar;