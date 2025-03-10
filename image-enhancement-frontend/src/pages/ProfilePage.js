import React from "react";
import { Container, Typography, Avatar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";

const ProfilePage = () => {
    const user = auth.currentUser; // Get the logged-in user
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/"); // Redirect to home after logout
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                textAlign: "center",
                paddingY: { xs: 4, sm: 6 },
                backgroundColor: "background.paper",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                marginTop: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
            >
                My Profile
            </Typography>

            {user && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    {/* Profile Picture */}
                    <Avatar
                        src={user.photoURL || "/default-avatar.png"}
                        alt="Profile Picture"
                        sx={{
                            width: { xs: 80, sm: 120 },
                            height: { xs: 80, sm: 120 },
                            margin: "auto",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    />

                    {/* User Information */}
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                        {user.displayName || "Anonymous"}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                    >
                        {user.email}
                    </Typography>

                    {/* Logout Button */}
                    <Button
                        onClick={handleLogout}
                        sx={{
                            mt: 4,
                            backgroundColor: "rgba(211, 47, 47, 0.1)",
                            color: "#D32F2F",
                            padding: "10px 24px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.2)",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default ProfilePage;