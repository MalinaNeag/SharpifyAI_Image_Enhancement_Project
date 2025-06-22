import React from "react";
import { Box, Typography, useMediaQuery, useTheme, keyframes } from "@mui/material";
import { motion } from "framer-motion";
import FileUploader from "../components/FileUploader";

// Gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const UploadPage = () => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            component="main"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",           // ← stack from top
                minHeight: "100vh",
                overflowY: "auto",                       // ← enable vertical scrolling
                px: { xs: 2, sm: 4 },
                // push everything below the AppBar
                pt: {
                    xs: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`,
                    sm: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(3)})`,
                },
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    background: darkMode
                        ? "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
                        : "linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee)",
                    backgroundSize: "400% 400%",
                    animation: `${gradientAnimation} 15s ease infinite`,
                    opacity: darkMode ? 0.6 : 0.3,
                },
            }}
        >
            {/* Title section */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: isMobile ? theme.spacing(3) : theme.spacing(4),
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        background: darkMode
                            ? "linear-gradient(45deg, #fff 30%, #aaa 90%)"
                            : "linear-gradient(45deg, #000 30%, #444 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textAlign: "center",
                        mb: 1,
                    }}
                >
                    Upload & Enhance Your Images
                </Typography>

                {!isMobile && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: darkMode ? "#EEE" : "#444",
                            maxWidth: "600px",
                            mx: "auto",
                            fontSize: "1.1rem",
                        }}
                    >
                        Drag and drop your image or click to browse files
                    </Typography>
                )}
            </motion.div>

            {/* Uploader card */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "800px" },
                    position: "relative",
                    background: darkMode ? "rgba(30,30,40,0.75)" : "rgba(255,255,255,0.85)",
                    borderRadius: 4,
                    border: darkMode
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(0,0,0,0.05)",
                    boxShadow: darkMode
                        ? "0 8px 32px rgba(0,0,0,0.3)"
                        : "0 8px 32px rgba(0,0,0,0.1)",
                    backdropFilter: "blur(10px)",
                    p: { xs: 2, sm: 4 },
                    mb: 4,  // give some breathing room at bottom
                }}
            >
                <FileUploader />
            </Box>

            {/* Bottom fade */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "20%",
                    background: darkMode
                        ? "linear-gradient(to top, rgba(18,18,18,1), transparent)"
                        : "linear-gradient(to top, rgba(250,250,250,1), transparent)",
                    zIndex: -1,
                }}
            />
        </Box>
    );
};

export default UploadPage;