import React, { useState, useEffect } from "react";
import { Container, Typography, Avatar, Button, Box, Grid, Card, CardMedia, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET = "image-enhancement-bucket";
const REGION = "eu-north-1";

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
});

const ProfilePage = () => {
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

            if (!Contents) {
                setImages([]);
                setLoading(false);
                return;
            }

            const imageUrls = await Promise.all(
                Contents.map(async (file) => {
                    const getObjectParams = { Bucket: S3_BUCKET, Key: file.Key };
                    const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
                    return url;
                })
            );

            setImages(imageUrls);
        } catch (error) {
            console.error("Error retrieving images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                textAlign: "center",
                paddingY: { xs: 4, sm: 6 },
                backgroundColor: "background.paper",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                marginTop: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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

                            <Button onClick={handleLogout} sx={{ mt: 4 }}>
                                Logout
                            </Button>
                        </Box>
                    )}

                    <Typography variant="h5" sx={{ mt: 6 }}>
                        Your Uploaded Images
                    </Typography>

                    {images.length > 0 ? (
                        <Grid container spacing={3} sx={{ mt: 4 }}>
                            {images.map((img, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card onClick={() => window.open(img, "_blank")}>
                                        <CardMedia component="img" height="180" image={img} alt={`Uploaded ${index}`} />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 3 }}>
                            No images uploaded yet.
                        </Typography>
                    )}
                </>
            )}
        </Container>
    );
};

export default ProfilePage;