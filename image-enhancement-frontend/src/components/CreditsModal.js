import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography, Backdrop, Fade, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CREDIT_REFRESH_INTERVAL = 8 * 60 * 60 * 1000; // 8 hours
const MAX_CREDITS = 3;

const CreditsModal = ({ open, onClose, darkMode }) => {
    const [credits, setCredits] = useState(3);
    const [timeLeft, setTimeLeft] = useState(CREDIT_REFRESH_INTERVAL);
    const navigate = useNavigate();

    useEffect(() => {
        const lastRefillTime = localStorage.getItem("lastRefillTime") || Date.now();
        updateCredits(parseInt(lastRefillTime, 10));

        const interval = setInterval(() => {
            updateCredits(parseInt(localStorage.getItem("lastRefillTime"), 10));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateCredits = (lastRefill) => {
        const now = Date.now();
        const elapsed = now - lastRefill;
        const creditsToRefill = Math.floor(elapsed / CREDIT_REFRESH_INTERVAL);
        setTimeLeft(CREDIT_REFRESH_INTERVAL - (elapsed % CREDIT_REFRESH_INTERVAL));

        if (creditsToRefill > 0 && credits < MAX_CREDITS) {
            setCredits(Math.min(credits + creditsToRefill, MAX_CREDITS));
            localStorage.setItem("lastRefillTime", now);
        }
    };

    const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 300 }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 300 }, // Adjust width for small screens
                        bgcolor: darkMode ? "#222" : "#fff",
                        boxShadow: 24,
                        p: { xs: 2, sm: 3 }, // Adjust padding for smaller screens
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: darkMode ? "#FFF" : "#000",
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: darkMode ? "#F5F5F5" : "#000" }}>
                        You have {credits} credits
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: darkMode ? "#AAA" : "#555", mt: 1 }}>
                        Next credit in {formatTime(timeLeft)}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            background: "linear-gradient(135deg, #FFDE59, #FFC857)",
                            color: "#000",
                            textTransform: "none",
                            borderRadius: "8px",
                            width: "100%", // Full width button on small screens
                        }}
                        onClick={() => navigate("/pricing")}
                    >
                        Subscribe Now
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default CreditsModal;