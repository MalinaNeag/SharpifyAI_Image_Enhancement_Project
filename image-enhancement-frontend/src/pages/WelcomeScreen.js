import React from "react";
import {
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    useMediaQuery,
    useTheme,
    keyframes
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowForward, Stars, AutoFixHigh, FaceRetouchingNatural, TextFields, Wallpaper } from "@mui/icons-material";

import generalImg from "../resources/image.jpg";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import ButtonComponent from "../components/ButtonComponent";
import ButtonGlowing from "../components/ButtonGlowing";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const features = [
    {
        title: "Magic Enhance",
        description: "One-click solution that automatically applies all enhancements for perfect results every time.",
        icon: <AutoFixHigh fontSize="large" />,
        image: generalImg,
        link: "/upload",
        color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
        title: "Face Restoration",
        description: "Revitalize blurry faces and recover lost details in portraits using advanced AI for natural, clear, and sharp results.",
        icon: <FaceRetouchingNatural fontSize="large" />,
        image: "/images/face_enhance.jpg",
        link: "/face-enhance",
        color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
        title: "Text Clarifier",
        description: "Transform illegible text into razor-sharp clarity. Ideal for documents, screenshots, and historical records.",
        icon: <TextFields fontSize="large" />,
        image: "/images/text_enhance.jpg",
        link: "/text-enhance",
        color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
        title: "Scene Enhancement",
        description: "Enhance natural scenery, landscapes, buildings and urban environments with stunning clarity.",
        icon: <Wallpaper fontSize="large" />,
        image: "/images/background_enhance.jpg",
        link: "/background",
        color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
];

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
                pt: { xs: 4, sm: 6, md: 8 },
                '&::before': {
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
                    opacity: darkMode ? 0.6 : 0.3
                }
            }}
        >
            {/* Header with Title */}
            <Container
                sx={{
                    position: "relative",
                    textAlign: "center",
                    py: { xs: 4, sm: 6 },
                    zIndex: 1
                }}
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Main Title */}
                    <motion.div variants={itemVariants}>
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            fontWeight={800}
                            sx={{
                                fontSize: isMobile ? "2.2rem" : "3.5rem",
                                background: darkMode
                                    ? "linear-gradient(45deg, #fff 30%, #aaa 90%)"
                                    : "linear-gradient(45deg, #000 30%, #444 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 2,
                                lineHeight: 1.2
                            }}
                        >
                            SharpifyAI — One Click to High Definition
                        </Typography>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants}>
                        <Typography
                            variant="body1"
                            sx={{
                                maxWidth: 680,
                                mx: "auto",
                                color: darkMode ? "#EEE" : "#555",
                                fontSize: isMobile ? "1.1rem" : "1.25rem",
                                mt: 2,
                                mb: 4,
                                lineHeight: 1.6
                            }}
                        >
                            <Box component="span" sx={{ fontWeight: 600 }}>SharpifyAI</Box> uses cutting-edge AI technology to transform blurry, low-quality images into stunning high-definition masterpieces.
                            Powered by <strong>GFPGAN</strong> for face restoration, <strong>Real-ESRGAN</strong> for scene enhancement,
                            and <strong>BSRGAN</strong> for text clarification.
                        </Typography>
                    </motion.div>

                    {/* Tech Badges */}
                    <motion.div variants={itemVariants}>
                        <Box sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 2,
                            mb: 0
                        }}>
                            {["GFPGAN", "Real-ESRGAN", "BSRGAN"].map((tech, i) => (
                                <motion.div
                                    key={tech}
                                    whileHover={{ y: -2 }}
                                >
                                <Box sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: 4,
                                  background: darkMode ? "#222" : "#FFF",             // dark background in dark mode, white in light mode
                                  border: darkMode ? "1px solid #333" : "1px solid #EEE",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  boxShadow: darkMode
                                    ? "0 2px 12px rgba(0,0,0,0.26)"
                                    : "0 2px 12px rgba(60,60,60,0.06)"
                                }}>
                                  <Stars fontSize="small" sx={{ color: darkMode ? "#ffda47" : "#007FFF" }} />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: darkMode ? "#FFF" : "#222"         // white text in dark, dark text in light
                                    }}
                                  >
                                    {tech}
                                  </Typography>
                                </Box>

                                </motion.div>
                            ))}
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Features Section */}
            <Container
                sx={{
                    position: "relative",
                    textAlign: "center",
                    py: { xs: 1, sm: 1, md: 2 },
                    zIndex: 1
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            mt: 0,
                            mb: 6,
                            color: darkMode ? "#FFF" : "#000",
                            position: "relative",
                            display: "inline-block",
                            "&:after": {
                                content: '""',
                                position: "absolute",
                                bottom: -8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "60%",
                                height: 4,
                                background: theme.palette.primary.main,
                                borderRadius: 2
                            }
                        }}
                    >
                        Our AI Enhancements
                    </Typography>
                </motion.div>

               {isMobile ? (
    <Box
        sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            pb: 4,
            display: "flex",
            gap: 3,
            pl: 2,
            pr: 2,
            "&::-webkit-scrollbar": { display: "none" },
        }}
    >
        <AnimatePresence>
            {features.map((feature, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    style={{ display: "inline-block", minWidth: 280 }}
                >
                    <Card
                        onClick={() => navigate(feature.link)}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            height: 380, // Fixed height for mobile
                            width: 280, // Fixed width for mobile
                            boxShadow: `0 8px 32px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                            background: darkMode
                                ? "rgba(30,30,40,0.7)"
                                : "rgba(255,255,255,0.8)",
                            border: darkMode
                                ? "1px solid rgba(255,255,255,0.1)"
                                : "1px solid rgba(0,0,0,0.05)",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: `0 12px 40px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)"}`
                            }
                        }}
                    >
                        <Box sx={{
                            height: 180, // Fixed height for mobile
                            minHeight: 180,
                            position: "relative",
                            overflow: "hidden",
                            background: feature.color
                        }}>
                            <BeforeAfterSlider
                                src={feature.image}
                                height="100%"
                                width="100%"
                                style={{ objectFit: "cover" }}
                                overlayColor={feature.color}
                            />
                            <Box sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backdropFilter: "blur(5px)",
                                border: "1px solid rgba(255,255,255,0.3)"
                            }}>
                                {React.cloneElement(feature.icon, {
                                    sx: {
                                        color: "#FFF",
                                        fontSize: "1.8rem"
                                    }
                                })}
                            </Box>
                        </Box>
                        <CardContent
                            sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                textAlign: "left"
                            }}
                        >
                            <Box sx={{ minHeight: 72, mb: 1.5 }}>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{
                                        color: darkMode ? "#FFF" : "#000",
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                            </Box>
                            <Box sx={{ minHeight: 72, mb: 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: darkMode ? "#BBB" : "#666",
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                            <Box sx={{
                                mt: "auto",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <ButtonComponent
                                    size="medium"
                                    endIcon={<ArrowForward />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(feature.link);
                                    }}
                                    sx={{
                                        px: 3,
                                        fontWeight: 600
                                    }}
                                >
                                    Try Now
                                </ButtonComponent>
                                <Typography variant="caption" sx={{
                                    color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                                }}>
                                    {idx + 1}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </AnimatePresence>
    </Box>
) : (
    <Grid container spacing={4} justifyContent="center">
        <AnimatePresence>
            {features.map((feature, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        whileHover={{ y: -10 }}
                    >
                        <Card
                            onClick={() => navigate(feature.link)}
                            sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                minHeight: 420, // Set minimum height for desktop
                                boxShadow: `0 8px 32px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                                background: darkMode
                                    ? "rgba(30,30,40,0.7)"
                                    : "rgba(255,255,255,0.8)",
                                border: darkMode
                                    ? "1px solid rgba(255,255,255,0.1)"
                                    : "1px solid rgba(0,0,0,0.05)",
                                backdropFilter: "blur(10px)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-10px)",
                                    boxShadow: `0 16px 48px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)"}`
                                }
                            }}
                        >
                            <Box sx={{
                                height: 200, // Fixed height for desktop
                                minHeight: 200,
                                position: "relative",
                                overflow: "hidden",
                                background: feature.color
                            }}>
                                <BeforeAfterSlider
                                    src={feature.image}
                                    height="100%"
                                    width="100%"
                                    style={{ objectFit: "cover" }}
                                    overlayColor={feature.color}
                                />
                                <Box sx={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backdropFilter: "blur(5px)",
                                    border: "1px solid rgba(255,255,255,0.3)"
                                }}>
                                    {React.cloneElement(feature.icon, {
                                        sx: {
                                            color: "#FFF",
                                            fontSize: "2rem"
                                        }
                                    })}
                                </Box>
                            </Box>
                            <CardContent
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                    textAlign: "left"
                                }}
                            >
                                <Box sx={{ minHeight: 72, mb: 2 }}>
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        sx={{
                                            color: darkMode ? "#FFF" : "#000",
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                </Box>
                                <Box sx={{ minHeight: 72, mb: 2 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: darkMode ? "#BBB" : "#666",
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    mt: "auto",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <ButtonComponent
                                        size="medium"
                                        endIcon={<ArrowForward />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(feature.link);
                                        }}
                                        sx={{
                                            px: 3,
                                            fontWeight: 600
                                        }}
                                    >
                                        Try Now
                                    </ButtonComponent>
                                    <Typography variant="caption" sx={{
                                        color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                                    }}>
                                        {idx + 1}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
        </AnimatePresence>
    </Grid>
)}

                {/* Final CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ width: "100%" }}
                >
                    <Box sx={{
                        mt: { xs: 6, sm: 8, md: 8 },
                        mb: 4,
                        textAlign: "center",
                        position: "relative"
                    }}>
                        <Box sx={{
                            maxWidth: 1000,
                            mx: "auto",
                            p: { xs: 3, sm: 4, md: 6 },
                            borderRadius: 4,
                            background: darkMode
                                ? "linear-gradient(145deg, rgba(40,40,60,0.8) 0%, rgba(30,30,50,0.9) 100%)"
                                : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,245,255,0.95) 100%)",
                            boxShadow: `0 8px 32px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                            border: darkMode
                                ? "1px solid rgba(255,255,255,0.1)"
                                : "1px solid rgba(0,0,0,0.05)",
                            backdropFilter: "blur(10px)",
                            position: "relative",
                            overflow: "hidden",
                            "&:before": {
                                content: '""',
                                position: "absolute",
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: theme.palette.primary.main,
                                opacity: 0.1,
                                filter: "blur(40px)"
                            }
                        }}>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    color: darkMode ? "#FFF" : "#000",
                                    mb: 3,
                                    position: "relative"
                                }}
                            >
                                Ready to Transform Your Photos with SharpifyAI?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    maxWidth: 600,
                                    mx: "auto",
                                    color: darkMode ? "#CCC" : "#555",
                                    fontSize: "1.1rem",
                                    mb: 4
                                }}
                            >
                                Experience professional-grade AI photo enhancement today. Whether it's old family photos,
                                important documents, or professional portraits - SharpifyAI will make them look better than ever.
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ButtonGlowing
                                    text="Start Enhancing Now →"
                                    onClick={() => navigate("/upload")}
                                    size="large"
                                    fullWidth={isMobile}
                                    sx={{
                                        fontSize: "1.1rem",
                                        px: 5,
                                        py: 1.5,
                                        maxWidth: isMobile ? "100%" : 300,
                                        mx: "auto"
                                    }}
                                />
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default WelcomeScreen;