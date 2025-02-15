import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { Close, HourglassEmpty, Layers } from "@mui/icons-material";
import { motion } from "framer-motion";
import ButtonComponent from "../components/ButtonComponent";
import SubscriptionModal from "./SubscriptionModal";

const CREDIT_REFRESH_INTERVAL = 8 * 60 * 60 * 1000; // 8 hours
const MAX_CREDITS = 3;

const CreditsPopup = ({ open, onClose, darkMode }) => {
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

    if (!open) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            <Paper
                elevation={5}
                sx={{
                    position: "absolute",
                    top: 60,
                    right: 15,
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                    zIndex: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.85)", // ✅ More transparency
                    minWidth: { xs: "90%", sm: "280px" },
                    backdropFilter: "blur(6px)", // ✅ Glass effect
                    textAlign: "center",
                }}
            >
                {/* Close Button */}
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{ position: "absolute", top: 10, right: 10, color: "#5f6368" }}
                >
                    <Close fontSize="small" />
                </IconButton>

                {/* Credits Display */}
                <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#202124", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Layers sx={{ fontSize: 22, mr: 1, color: "#F5B400" }} />
                    {credits} free credits
                </Typography>

                {/* Refresh Timer */}
                <Typography sx={{ fontSize: "13px", color: "#5f6368", mt: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HourglassEmpty sx={{ fontSize: 16, mr: 0.5 }} /> Free credits refresh in {formatTime(timeLeft)}
                </Typography>

                {/* Add Credits Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <ButtonComponent
                        onClick={() => setSubscriptionOpen(true)}
                        sx={{ mt: 2, background: "linear-gradient(90deg, #48EFA7, #B2F7A7)" }}
                    >
                        Add credits
                    </ButtonComponent>
                </motion.div>
            </Paper>

            {/* Subscription Modal */}
            <SubscriptionModal open={subscriptionOpen} onClose={() => setSubscriptionOpen(false)} darkMode={darkMode} />
        </motion.div>
    );
};

export default CreditsPopup;