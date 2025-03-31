import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import FileUploader from "../components/FileUploader";

const UploadPage = () => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile responsive

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                paddingX: { xs: 2, sm: 4 },
                backdropFilter: "blur(15px)",
                backgroundColor: darkMode
                    ? "rgba(255, 255, 255, 0.1)" // Slight transparency in dark mode
                    : "rgba(0, 0, 0, 0.05)", // Light mode transparency
            }}
        >
            {/* Title Animation */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: "100%", textAlign: "center" }} // Ensures proper alignment
            >
                <Typography
                    variant={isMobile ? "h6" : "h4"} // Smaller text for mobile
                    fontWeight={600}
                    gutterBottom
                    sx={{
                        color: darkMode ? "#F5F5F5" : "#000",
                        paddingBottom: { xs: 2, sm: 3 }, // Less bottom space on mobile
                        textAlign: "center",
                    }}
                >
                    Upload & Enhance Your Images
                </Typography>
            </motion.div>

            {/* File Uploader Component - Auto Scales for Mobile */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: { xs: "90%", sm: "75%", md: "60%" }, // Scales correctly for mobile
                }}
            >
                <FileUploader />
            </Box>
        </Box>
    );
};

export default UploadPage;