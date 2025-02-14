import React from "react";
import { Container, Box, Grid, Card, CardContent, Typography, Button, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import ButtonComponent from "../components/ButtonComponent"; // Custom reusable button

const features = [
    {
        title: "General Enhancement",
        description: "Improve image quality instantly.",
        image: "/images/enhance.jpg",
        link: "/upload",
    },
    {
        title: "Face Enhancement",
        description: "Enhance facial details with AI.",
        image: "/images/face_enhance.jpg",
        link: "/face-enhance",
    },
    {
        title: "Text Enhancement",
        description: "Improve text clarity in images.",
        image: "/images/text_enhance.jpg",
        link: "/text-enhance",
    },
    {
        title: "Colorization",
        description: "Bring black-and-white images to life.",
        image: "/images/colorization.jpg",
        link: "/colorization",
    },
];

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                paddingTop: { xs: 4, sm: 4, md: 6 },
            }}
        >
            {/* Main Section */}
            <Container sx={{ textAlign: "center", paddingY: { xs: 6, sm: 6 }, paddingX: 0 }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Typography
                        variant={isMobile ? "h4" : "h3"} // Adjusted heading size
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            color: darkMode ? "#F5F5F5" : "#000",
                            paddingBottom: { xs: 3, md: 2 },
                        }}
                    >
                        Enlight Your Photos
                    </Typography>
                </motion.div>

                {/* Features Section */}
                {isMobile ? (
                    <Box
                        sx={{
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            paddingBottom: 2,
                            display: "flex",
                            gap: 2,
                            paddingLeft: 2, // Add space to the left of the first card
                            paddingRight: 2, // Add space to the right of the last card
                        }}
                    >
                        {features.map((feature, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "inline-block",
                                    minWidth: "230px", // Adjusted width for better fit
                                }}
                            >
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                            boxShadow: darkMode
                                                ? "0 6px 18px rgba(255, 255, 255, 0.1)"
                                                : "0 6px 18px rgba(0,0,0,0.1)",
                                            transition: "0.3s ease-in-out",
                                            backgroundColor: darkMode ? "#2C2C2E" : "#FFF",
                                        }}
                                        onClick={() => navigate(feature.link)}
                                    >
                                        <Box
                                            sx={{
                                                position: "relative",
                                                height: 180, // Adjusted height for better fit
                                                backgroundImage: `url(${feature.image})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        />
                                        <CardContent sx={{ padding: 1.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                sx={{ fontSize: "16px", color: darkMode ? "#F5F5F5" : "#000" }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontSize: "13px", color: darkMode ? "#BBB" : "#666", flexGrow: 1 }}
                                            >
                                                {feature.description}
                                            </Typography>
                                            <Box sx={{ marginTop: "auto" }}>
                                                <ButtonComponent onClick={() => navigate(feature.link)}>Start</ButtonComponent>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                            boxShadow: darkMode
                                                ? "0 6px 18px rgba(255, 255, 255, 0.1)"
                                                : "0 6px 18px rgba(0,0,0,0.1)",
                                            transition: "0.3s ease-in-out",
                                            backgroundColor: darkMode ? "#2C2C2E" : "#FFF",
                                        }}
                                        onClick={() => navigate(feature.link)}
                                    >
                                        <Box
                                            sx={{
                                                position: "relative",
                                                height: 200,
                                                backgroundImage: `url(${feature.image})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        />
                                        <CardContent sx={{ padding: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? "#F5F5F5" : "#000" }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: darkMode ? "#BBB" : "#666", flexGrow: 1 }}>
                                                {feature.description}
                                            </Typography>
                                            <Box sx={{ marginTop: "auto" }}>
                                                <ButtonComponent onClick={() => navigate(feature.link)}>Start</ButtonComponent>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Box sx={{ marginTop: { xs: 4, sm: 6 }, textAlign: "center" }}>
                    <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600} sx={{ color: darkMode ? "#F5F5F5" : "#000" }}>
                        Enhance image quality with one click
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            background: "linear-gradient(135deg, #1DE9B6, #1DC4E9)",
                            color: "#fff",
                            marginTop: 3,
                            padding: "12px 40px",
                            borderRadius: "20px",
                            fontSize: isMobile ? "14px" : "18px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            boxShadow: "0 0 25px rgba(29, 233, 182, 0.9)",
                            position: "relative",
                            overflow: "hidden",
                            animation: "pulseGlow 1.5s infinite alternate",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: "-100%",
                                width: "200%",
                                height: "100%",
                                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
                                animation: "shimmer 1.2s infinite linear",
                            },
                            "@keyframes shimmer": {
                                "0%": { left: "-100%" },
                                "100%": { left: "100%" },
                            },
                            "@keyframes pulseGlow": {
                                "0%": { boxShadow: "0 0 25px rgba(29, 233, 182, 0.9)" },
                                "100%": { boxShadow: "0 0 40px rgba(29, 233, 182, 1.0)" },
                            },
                            "&:hover": {
                                background: "linear-gradient(135deg, #1DC4E9, #1DE9B6)",
                                transform: "scale(1.08)",
                                boxShadow: "0 0 50px rgba(29, 233, 182, 1.2)",
                            },
                        }}
                        onClick={() => navigate("/upload")}
                    >
                         GET STARTED
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default WelcomeScreen;