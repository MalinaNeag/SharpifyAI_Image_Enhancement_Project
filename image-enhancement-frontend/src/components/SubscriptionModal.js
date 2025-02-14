import React from "react";
import { Box, Modal, Typography, IconButton, Card, CardContent, Divider, useMediaQuery } from "@mui/material";
import { Close, CheckCircle, Layers } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import ButtonComponent from "../components/ButtonComponent"; // Custom reusable button

const plans = [
    {
        plan: "Basic",
        price: "$5.99",
        credits: "90 credits",
        features: [
            "Enhance 9 photos",
            "Full access to Modular Pipeline",
            "Face, Background, Text Enhancement",
            "Colorization Included"
        ],
        tag: "Best for Casual Use",
        tagColor: "#FFF",
        tagBg: "#FF6F61",
        buttonText: "Get 90 Credits"
    },
    {
        plan: "Plus",
        price: "$9.99",
        credits: "90 credits",
        features: [
            "Enhance 9 photos",
            "Full access to Modular Pipeline",
            "History Access",
            "Enhancement based on Gallery"
        ],
        tag: "Smart AI Features",
        tagColor: "#FFF",
        tagBg: "#FF9800",
        buttonText: "Unlock Plus"
    },
    {
        plan: "Pro",
        price: "$49.99",
        credits: "900 credits",
        features: [
            "Enhance 90 photos",
            "Full access to Modular Pipeline",
            "History Access",
            "Priority Processing"
        ],
        discount: "Best Value",
        buttonText: "Go Pro"
    }
];

const SubscriptionModal = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Modal open={open} onClose={onClose} fullScreen>
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    p: { xs: 2, md: 4 },
                    overflow: "hidden",
                    background: theme.palette.mode === "dark"
                        ? "#1C1C1E" // Solid dark background—no transparency
                        : "linear-gradient(90deg, #FFDDE4, #CDECF9, #DCCAFF, #FFC9B8, #FFF8CC, #CDEECF)", // Light mode with pastel colors
                    backgroundSize: theme.palette.mode === "dark" ? "auto" : "400% 400%",
                    animation: theme.palette.mode === "dark"
                        ? "none"
                        : "bgMove 20s infinite alternate ease-in-out", // Animation only for light mode
                    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000", // White text in dark mode
                    "@keyframes bgMove": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                    },
                }}
            >
                {/* Close Button */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        backgroundColor: theme.palette.mode === "light" ? "#FFF" : "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        p: 1.2,
                        transition: "0.3s ease",
                        "&:hover": {
                            backgroundColor: theme.palette.mode === "light"
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(255, 255, 255, 0.3)",
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    <Close sx={{ fontSize: 24, color: theme.palette.mode === "light" ? "#000" : "#FFF" }} />
                </IconButton>

                {/* Title */}
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        color: theme.palette.text.primary,
                        mt: { xs: 2, md: 6 },  // Ensure proper spacing at the top
                        mb: { xs: 4, md: 5 },  // Adjust bottom spacing for consistency
                        textAlign: "center",
                        fontFamily: 'Roboto, sans-serif',
                    }}
                >
                    Unlock More AI Super-Resolution Credits
                </Typography>

                {/* Subscription Plans with Horizontal Scroll for Mobile */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMobile ? "row" : "row",
                        gap: 2,
                        overflowX: isMobile ? "auto" : "hidden",
                        width: "100%",
                        justifyContent: isMobile ? "flex-start" : "center",
                        pb: 10,
                        px: { xs: 2, md: 3 },
                        whiteSpace: isMobile ? "nowrap" : "normal",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    {plans.map((option, index) => (
                        <Box
                            key={index}
                            sx={{
                                minWidth: isMobile ? "85%" : "320px",
                                display: "inline-block",
                            }}
                        >
                            <motion.div
                                whileHover={isMobile ? {} : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    sx={{
                                        borderRadius: "18px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        minHeight: "440px",
                                        boxShadow: theme.palette.mode === "dark"
                                            ? "0 6px 20px rgba(0, 0, 0, 0.5)"
                                            : "0 6px 20px rgba(0, 0, 0, 0.1)",
                                        transition: "0.3s ease-in-out",
                                        backgroundColor: theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.15)"
                                            : "rgba(255,255,255,0.6)",
                                        "&:hover": {
                                            backgroundColor: theme.palette.mode === "dark"
                                                ? "rgba(255,255,255,0.25)"
                                                : "rgba(255,255,255,0.9)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ padding: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                        {/* Discount Tag */}
                                        {option.discount && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 10,
                                                    right: 10,
                                                    backgroundColor: "#FF4081",
                                                    color: "#FFF",
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: "10px",
                                                    zIndex: 1,
                                                }}
                                            >
                                                {option.discount}
                                            </Box>
                                        )}

                                        {/* Plan Name */}
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: theme.palette.text.primary }}>
                                            {option.plan}
                                        </Typography>

                                        {/* Price */}
                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            sx={{
                                                color: "#4CAF50",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            {option.price}
                                        </Typography>

                                        {/* Divider */}
                                        <Divider sx={{ my: 1, bgcolor: "#4CAF50" }} />

                                        {/* Credits Info */}
                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                            <Layers sx={{ fontSize: 16, mr: 0.5, color: "#F5B400" }} />
                                            {option.credits}
                                        </Typography>

                                        {/* Features List */}
                                        <Box sx={{ mt: 1, textAlign: "left", px: 2 }}>
                                            {option.features.map((feature, i) => (
                                                <Typography
                                                    key={i}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: theme.palette.text.primary,
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 16, mr: 1 }} />
                                                    {feature}
                                                </Typography>
                                            ))}
                                        </Box>

                                        {/* Subscribe Button */}
                                        <ButtonComponent
                                            sx={{
                                                mt: 2,
                                                width: "100%",
                                                background: "linear-gradient(90deg, #1DE9B6, #B2F7A7)",
                                                color: "#000",
                                                fontWeight: 600,
                                                py: 1,
                                            }}
                                            onClick={() => console.log("Subscribed to", option.plan)}
                                        >
                                            {option.buttonText}
                                        </ButtonComponent>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Modal>
    );
};

export default SubscriptionModal;