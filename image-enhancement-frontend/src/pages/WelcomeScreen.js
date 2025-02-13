import React from "react";
import { Container, Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import ButtonComponent from "../components/ButtonComponent"; // Custom reusable button

// Feature list
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

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: darkMode
                    ? `linear-gradient(to bottom, 
                        #1C1C1E 10%, 
                        rgba(30, 30, 30, 0.9) 40%, 
                        rgba(45, 45, 45, 0.85) 55%, 
                        rgba(60, 60, 60, 0.7) 70%, 
                        transparent 80%
                    ), 
                    linear-gradient(to right, 
                        #2D2D30 0%, 
                        #3E3E42 33%, 
                        #545454 66%, 
                        #6C6C70 100%)`
                    : `linear-gradient(to bottom, 
                        #FFFFFF 20%, 
                        rgba(255, 255, 255, 0.95) 40%,
                        rgba(255, 255, 255, 0.85) 55%, 
                        rgba(255, 255, 255, 0.6) 70%, 
                        transparent 80%
                    ), 
                    linear-gradient(to right, 
                        #E3F2FD 0%, 
                        #E0F7FA 33%, 
                        #FFF9C4 66%, 
                        #FCE4EC 100%)`,
                backgroundSize: "100% 100%",
                overflow: "hidden",
                paddingX: { xs: 0.5, sm: 2, md: 3 },
                paddingTop: { xs: 2, sm: 4, md: 6 },
            }}
        >
            {/* Main Section */}
            <Container sx={{ textAlign: "center", paddingY: { xs: 4, sm: 6 } }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: darkMode ? "#F5F5F5" : "#000" }}>
                        Enlight Your Photos
                    </Typography>
                </motion.div>

                {/* Features Section */}
                <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 4 }}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card
                                    sx={{
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        boxShadow: darkMode
                                            ? "0 6px 18px rgba(255, 255, 255, 0.1)"
                                            : "0 6px 18px rgba(0,0,0,0.1)",
                                        transition: "0.3s ease-in-out",
                                        backgroundColor: darkMode ? "#2C2C2E" : "#FFF",
                                        "&:hover": {
                                            boxShadow: darkMode
                                                ? "0 8px 20px rgba(255, 255, 255, 0.2)"
                                                : "0 8px 20px rgba(0,0,0,0.2)",
                                        },
                                    }}
                                    onClick={() => navigate(feature.link)}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            height: 200,
                                            background: `url(${feature.image}) center/cover no-repeat`,
                                        }}
                                    />
                                    <CardContent sx={{ padding: 2 }}>
                                        <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? "#F5F5F5" : "#000" }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: darkMode ? "#BBB" : "#666" }}>
                                            {feature.description}
                                        </Typography>
                                        <ButtonComponent onClick={() => navigate(feature.link)}>Start</ButtonComponent>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ marginTop: { xs: 5, sm: 6 }, textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={600} sx={{ color: darkMode ? "#F5F5F5" : "#000" }}>
                        Enhance image quality with one click
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            background: "linear-gradient(135deg, #1DE9B6, #1DC4E9)",
                            color: "#fff",
                            marginTop: 3,
                            padding: "10px 40px",
                            borderRadius: "20px",
                            fontSize: "16px",
                            "&:hover": {
                                background: "linear-gradient(135deg, #1DC4E9, #1DE9B6)",
                                transform: "scale(1.05)",
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