import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import FileUploader from "../components/FileUploader";

const UploadPage = () => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: { xs: 2, sm: 4 },
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Title Animation */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: isMobile ? theme.spacing(3) : theme.spacing(4)
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight={600}
                    gutterBottom
                    sx={{
                        color: "#000", // Kept as black per request
                        textAlign: "center",
                        textShadow: darkMode ? "0 1px 2px rgba(255,255,255,0.3)" : "none"
                    }}
                >
                    Upload & Enhance Your Images
                </Typography>
                {!isMobile && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                            maxWidth: "600px",
                            margin: "0 auto"
                        }}
                    >
                        Drag and drop your image or click to browse files
                    </Typography>
                )}
            </motion.div>

            {/* File Uploader Component */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "800px" },
                    position: "relative",
                }}
            >
                <FileUploader />
            </Box>

            {/* Subtle decorative elements */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "20%",
                    background: darkMode
                        ? "linear-gradient(to top, rgba(18, 18, 18, 1), transparent)"
                        : "linear-gradient(to top, rgba(250, 250, 250, 1), transparent)",
                    zIndex: -1
                }}
            />
        </Box>
    );
};

export default UploadPage;