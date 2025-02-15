import React, { useState, useEffect } from "react";
import { Box, Modal, Typography, Backdrop, Fade, IconButton } from "@mui/material";
import { Close, HourglassEmpty, Layers } from "@mui/icons-material";
import ButtonComponent from "../components/ButtonComponent"; // Green reusable button
import SubscriptionModal from "./SubscriptionModal"; // Import SubscriptionModal

const CREDIT_REFRESH_INTERVAL = 8 * 60 * 60 * 1000; // 8 hours
const MAX_CREDITS = 3;

const CreditsModal = ({ open, onClose, darkMode }) => {
    const [credits, setCredits] = useState(3);
    const [timeLeft, setTimeLeft] = useState(CREDIT_REFRESH_INTERVAL);
    const [subscriptionOpen, setSubscriptionOpen] = useState(false);

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
        <>
            <Modal open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 300 }}>
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: "90%", sm: 300 },
                            bgcolor: darkMode ? "rgba(34, 34, 34, 0.9)" : "rgba(255, 255, 255, 0.9)",
                            boxShadow: 24,
                            p: { xs: 2, sm: 3 },
                            borderRadius: "12px",
                            textAlign: "center",
                            backdropFilter: "blur(8px)"
                        }}
                    >
                        <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10, color: darkMode ? "#FFF" : "#000" }}>
                            <Close />
                        </IconButton>
                        <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: darkMode ? "#F5F5F5" : "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Layers sx={{ fontSize: 22, mr: 1, color: "#F5B400" }} />
                            {credits} free credits
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: darkMode ? "#AAA" : "#555", mt: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <HourglassEmpty sx={{ fontSize: 16, mr: 0.5 }} /> Free credits refresh in {formatTime(timeLeft)}
                        </Typography>
                        <ButtonComponent
                            onClick={() => setSubscriptionOpen(true)}
                            sx={{ mt: 2, background: "linear-gradient(90deg, #48EFA7, #B2F7A7)" }}
                        >
                            Add credits
                        </ButtonComponent>
                    </Box>
                </Fade>
            </Modal>

            {/* Subscription Modal */}
            <SubscriptionModal open={subscriptionOpen} onClose={() => setSubscriptionOpen(false)} darkMode={darkMode} />
        </>
    );
};

export default CreditsModal;