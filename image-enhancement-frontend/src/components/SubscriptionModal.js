import React from "react";
import { Box, Modal, Typography, IconButton, Card, CardContent, Divider, useMediaQuery } from "@mui/material";
import { Close, CheckCircle, Layers } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import GreenButton from "./GreenButton";
import GoldButton from "./GoldButton";

const plans = [
    {
        plan: "Basic",
        price: "$5.99",
        credits: "100 credits",
        features: [
            "Enhance 10 photos",
            "Full photo enhancement: face, background, text",
        ],
        tag: "Casual Use",
        tagColor: "#FFF",
        tagBg: "#FF6F61",
        buttonText: "Basic Plan"
    },
    {
        plan: "Plus",
        price: "$9.99",
        credits: "200 credits",
        features: [
            "Enhance 20 photos",
            "Full photo enhancement: face, background, text",
            "Gallery access: download your resulted photo anytime you want",
            "Photo colorization and restauration"
        ],
        tag: "Smart Features",
        tagColor: "#FFF",
        tagBg: "#FF9800",
        buttonText: "Plus Plan"
    },
    {
        plan: "Pro",
        price: "$19.99",
        credits: "500 credits",
        features: [
            "Enhance 50 photos",
            "Gallery access",
            "Personalized AI Enhancement based on gallery",
            "Face recognition & swap",
        ],
        tag: "More Features",
        discount: "Best Value",
        buttonText: "Pro Plan"
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
                    animation: "bgMove 20s infinite alternate ease-in-out",
                    backgroundSize: theme.palette.mode === "dark" ? "auto" : "400% 400%",
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
                        mt: { xs: 2, md: 6 },
                        mb: { xs: 4, md: 5 },
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
                        flexDirection : "row",
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
                                whileHover={isMobile ? {} : { scale: 1.01 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card
                                    sx={{
                                        position: "relative",
                                        borderRadius: "18px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        minHeight: "440px",
                                        width: "100%",
                                        maxWidth: "350px",
                                        textAlign: "center",
                                        transition: "0.3s ease-in-out",
                                        backgroundColor: theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.15)"
                                            : "rgba(255,255,255,0.6)",
                                        boxShadow: theme.palette.mode === "dark"
                                            ? "0 6px 20px rgba(0, 0, 0, 0.5)"
                                            : "0 6px 20px rgba(0, 0, 0, 0.1)",
                                        "&:hover": {
                                            backgroundColor: theme.palette.mode === "dark"
                                                ? "rgba(255,255,255,0.25)"
                                                : "rgba(255,255,255,0.9)",
                                            transform: "scale(1)",
                                        },
                                        ...(option.plan === "Pro" && {
                                            border: "3px solid #FF8C00",
                                            boxShadow: "0px 0px 12px rgba(255, 140, 0, 0.5)",
                                        }),
                                    }}
                                >
                                    {option.plan === "Pro" && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                background: "linear-gradient(90deg, #FF8C00, #FFD700)",
                                                color: "#FFF",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                padding: "6px 14px",
                                                borderRadius: "0 8px 0 8px",
                                                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                                                zIndex: 10,
                                            }}
                                        >
                                            Best Value
                                        </Box>
                                    )}
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            flexGrow: 1,
                                            padding: 3,
                                            textAlign: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        {/* Top Section - Plan Name & Price */}
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: theme.palette.text.primary }}>
                                                {option.plan}
                                            </Typography>

                                            <Box>
                                                {option.plan === "Pro" ? (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center", // Center green price
                                                            position: "relative", // Absolute positioning for grey price
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h5"
                                                            fontWeight={700}
                                                            sx={{
                                                                color: "#4CAF50",
                                                                fontSize: "28px",
                                                                textAlign: "center",
                                                                flexGrow: 1,
                                                            }}
                                                        >
                                                            $19.99
                                                        </Typography>

                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                position: "absolute",
                                                                right: 10,
                                                                fontSize: "18px",
                                                                color: "#808080",
                                                                textDecoration: "line-through",
                                                                opacity: 0.7,
                                                            }}
                                                        >
                                                            $39.99
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography
                                                        variant="h5"
                                                        fontWeight={700}
                                                        sx={{
                                                            color: "#4CAF50",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {option.price}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Divider sx={{ my: 1, bgcolor: "#4CAF50" }} />

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center", // Center horizontally
                                                    gap: "6px", // Space between icon and text
                                                }}
                                            >
                                                <Layers sx={{ fontSize: 18, color: "#F5B400" }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 500,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {option.credits}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                textAlign: "left",
                                                px: 2,
                                                mt: 2,
                                                minHeight: "150px",
                                                wordBreak: "break-word",
                                                overflowWrap: "break-word",
                                                whiteSpace: "normal",
                                            }}
                                        >
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

                                        <Box
                                            sx={{
                                                mt: "auto",
                                                width: "100%",
                                                pb: 2,
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {option.plan === "Pro" ? (
                                                <GoldButton onClick={() => console.log("Subscribed to", option.plan)}>
                                                    {option.buttonText}
                                                </GoldButton>
                                            ) : (
                                                <GreenButton onClick={() => console.log("Subscribed to", option.plan)}>
                                                    {option.buttonText}
                                                </GreenButton>
                                            )}
                                        </Box>
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