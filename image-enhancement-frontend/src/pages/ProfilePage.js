import React, { useState, useEffect } from "react";
import { Typography, Avatar, Button, Box, CircularProgress, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Gallery from "../components/Gallery"; // Uses updated Gallery

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
            console.log(`Fetching images from: ${S3_BUCKET}/${userFolder}`);

            const listCommand = new ListObjectsV2Command({ Bucket: S3_BUCKET, Prefix: userFolder });
            const { Contents } = await s3Client.send(listCommand);

            if (!Contents || Contents.length === 0) {
                setImages([]);
                setLoading(false);
                return;
            }

            console.log("Found images in S3:", Contents);

            const imageUrls = await Promise.all(
                Contents.map(async (file) => {
                    const getObjectParams = { Bucket: S3_BUCKET, Key: file.Key };
                    const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), {
                        expiresIn: 3600,
                    });

                    // Extract enhancements from filename (Assumes format: filename_face_bg_text.jpg)
                    const enhancements = file.Key.match(/face|background|text|colorization/gi) || [];

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
            // Find the corresponding image object from the images array
            const imageToRemove = images.find((img) => img.url === imageUrl);
            if (!imageToRemove || !imageToRemove.key) {
                console.error("Error: Image key not found.");
                return;
            }

            console.log(`Removing image: ${imageToRemove.key}`);

            // Delete the image from AWS S3
            const deleteCommand = new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: imageToRemove.key, // Use the S3 object key
            });
            await s3Client.send(deleteCommand);

            // Remove the image from UI state
            setImages((prevImages) => prevImages.filter((img) => img.key !== imageToRemove.key));
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
                textAlign: "center",
                paddingY: { xs: 6, sm: 6 },
                backdropFilter: "blur(15px)",
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
            }}
        >
            {loading ? (
                <CircularProgress sx={{ mt: 5 }} />
            ) : (
                <>
                    <Typography variant="h4" gutterBottom>
                        My Profile
                    </Typography>

                    {user && (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Avatar
                                src={user.photoURL || "/default-avatar.png"}
                                alt="Profile Picture"
                                sx={{
                                    width: { xs: 80, sm: 120 },
                                    height: { xs: 80, sm: 120 },
                                    margin: "auto",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                            />

                            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                                {user.displayName || "Anonymous"}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                                {user.email}
                            </Typography>

                            <Button
                                onClick={handleLogout}
                                sx={{
                                    mt: 4,
                                    padding: "10px 20px",
                                    borderRadius: 8,
                                    backgroundColor: "#ff4757",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#e84118" },
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    )}

                    <Typography variant="h5" sx={{ mt: 6 }}>
                        Your Uploaded Images
                    </Typography>

                    {/* Pass images with enhancements to Gallery */}
                    <Gallery images={images} onRemove={handleRemoveImage} />
                </>
            )}
        </Box>
    );
};

export default ProfilePage;