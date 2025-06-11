import React, { useState, useEffect } from "react";
import {
    Typography,
    Avatar,
    Button,
    Box,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Container,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Gallery from "../components/Gallery";
import { motion, AnimatePresence } from "framer-motion";
import { Stars, Logout, PhotoLibrary, Person, Email } from "@mui/icons-material";
import { keyframes } from "@mui/system";

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

const S3_BUCKET = "image-enhancement-bucket";
const REGION = "eu-north-1";

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "",
    },
});

const ProfilePage = () => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                fetchUserImages(firebaseUser.email);
            } else {
                setImages([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserImages = async (email) => {
        try {
            const userFolder = email.replace(/[^a-zA-Z0-9]/g, "_") + "/";
            const listCommand = new ListObjectsV2Command({ Bucket: S3_BUCKET, Prefix: userFolder });
            const { Contents } = await s3Client.send(listCommand);

            if (!Contents || Contents.length === 0) {
                setImages([]);
                setLoading(false);
                return;
            }

            const imageUrls = await Promise.all(
                Contents.map(async (file) => {
                    const getObjectParams = { Bucket: S3_BUCKET, Key: file.Key };

                    // Generate signed GET URL
                    const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), {
                        expiresIn: 3600,
                    });

                    // Fetch metadata securely using SDK
                    let enhancements = [];
                    try {
                        const headCommand = new HeadObjectCommand({ Bucket: S3_BUCKET, Key: file.Key });
                        const metadataResponse = await s3Client.send(headCommand);
                        const metadata = metadataResponse.Metadata || {};

                        enhancements = Object.entries(metadata)
                            .filter(([_, value]) => value?.toLowerCase?.() === "true")
                            .map(([key]) => key.toLowerCase());

                    } catch (err) {
                        console.warn("No metadata for", file.Key, err);
                    }

                    return { url, key: file.Key, enhancements };
                })
            );

            setImages(imageUrls);
        } catch (error) {
            console.error("Error retrieving images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async (imageUrl) => {
        try {
            const imageToRemove = images.find((img) => img.url === imageUrl);
            if (!imageToRemove || !imageToRemove.key) {
                console.error("Error: Image key not found.");
                return;
            }

            const deleteCommand = new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: imageToRemove.key,
            });
            await s3Client.send(deleteCommand);

            setImages((prevImages) =>
                prevImages.filter((img) => img.key !== imageToRemove.key)
            );
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
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
            <Container
                sx={{
                    position: "relative",
                    textAlign: "center",
                    py: { xs: 4, sm: 6 },
                    zIndex: 1
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
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
                        Welcome to your profile!
                    </Typography>
                </motion.div>

                {loading ? (
                    <CircularProgress sx={{ mt: 5 }} />
                ) : (
                    <>
                        {user && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <Card
                                    sx={{
                                        maxWidth: 800,
                                        mx: "auto",
                                        mt: 4,
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        boxShadow: `0 8px 32px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                                        background: darkMode
                                            ? "rgba(30,30,40,0.7)"
                                            : "rgba(255,255,255,0.8)",
                                        border: darkMode
                                            ? "1px solid rgba(255,255,255,0.1)"
                                            : "1px solid rgba(0,0,0,0.05)",
                                        backdropFilter: "blur(10px)",
                                        p: { xs: 3, sm: 4 }
                                    }}
                                >
                                    <Grid container spacing={4} alignItems="center">
                                        <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "center" }}>
                                            <motion.div whileHover={{ scale: 1.05 }}>
                                                <Avatar
                                                    src={user.photoURL || "/default-avatar.png"}
                                                    alt="Profile Picture"
                                                    sx={{
                                                        width: { xs: 120, sm: 160 },
                                                        height: { xs: 120, sm: 160 },
                                                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                                                        border: `4px solid ${theme.palette.primary.main}`
                                                    }}
                                                />
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <CardContent sx={{ textAlign: { xs: "center", sm: "left" } }}>
                                                <Typography
                                                    variant="h4"
                                                    fontWeight={700}
                                                    sx={{
                                                        color: darkMode ? "#FFF" : "#000",
                                                        mb: 2
                                                    }}
                                                >
                                                    {user.displayName || "Anonymous User"}
                                                </Typography>

                                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                    <Email sx={{ mr: 1, color: theme.palette.primary.main }} />
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            color: darkMode ? "#BBB" : "#666",
                                                            fontSize: "1.1rem"
                                                        }}
                                                    >
                                                        {user.email}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                                    <PhotoLibrary sx={{ mr: 1, color: theme.palette.primary.main }} />
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            color: darkMode ? "#BBB" : "#666",
                                                            fontSize: "1.1rem"
                                                        }}
                                                    >
                                                        {images.length} enhanced {images.length === 1 ? "image" : "images"}
                                                    </Typography>
                                                </Box>

                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Button
                                                        onClick={handleLogout}
                                                        startIcon={<Logout />}
                                                        variant="contained"
                                                        color="error"
                                                        sx={{
                                                            px: 4,
                                                            py: 1.5,
                                                            borderRadius: 8,
                                                            fontWeight: 600,
                                                            textTransform: "none",
                                                            fontSize: "1rem"
                                                        }}
                                                    >
                                                        Logout
                                                    </Button>
                                                </motion.div>
                                            </CardContent>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            style={{ width: "100%" }}
                        >
                            <Box sx={{ mt: 8, mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
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
                                    Your Enhanced Gallery
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        maxWidth: 600,
                                        mx: "auto",
                                        color: darkMode ? "#BBB" : "#666",
                                        fontSize: "1.1rem",
                                        mt: 3,
                                        mb: 4
                                    }}
                                >
                                    All your enhanced images are securely stored and can be accessed anytime.
                                    Click on any image to view it in full resolution.
                                </Typography>

                                {images.length > 0 ? (
                                    <Box sx={{
                                        mt: 4,
                                        p: { xs: 1, sm: 2 },
                                        borderRadius: 4,
                                        background: darkMode
                                            ? "rgba(30,30,40,0.5)"
                                            : "rgba(255,255,255,0.5)",
                                        backdropFilter: "blur(10px)",
                                        border: darkMode
                                            ? "1px solid rgba(255,255,255,0.1)"
                                            : "1px solid rgba(0,0,0,0.05)"
                                    }}>
                                        <Gallery images={images} onRemove={handleRemoveImage} />
                                    </Box>
                                ) : (
                                    <Card
                                        sx={{
                                            maxWidth: 600,
                                            mx: "auto",
                                            mt: 4,
                                            p: 4,
                                            textAlign: "center",
                                            borderRadius: 4,
                                            background: darkMode
                                                ? "rgba(30,30,40,0.5)"
                                                : "rgba(255,255,255,0.5)",
                                            backdropFilter: "blur(10px)",
                                            border: darkMode
                                                ? "1px solid rgba(255,255,255,0.1)"
                                                : "1px solid rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            No images yet
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: darkMode ? "#BBB" : "#666", mb: 3 }}>
                                            You haven't enhanced any images yet. Get started by uploading your first image!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate("/upload")}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 8,
                                                fontWeight: 600
                                            }}
                                        >
                                            Enhance Your First Image
                                        </Button>
                                    </Card>
                                )}
                            </Box>
                        </motion.div>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default ProfilePage;