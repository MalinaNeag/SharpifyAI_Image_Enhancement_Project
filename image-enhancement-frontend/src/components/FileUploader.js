import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Switch,
    FormControlLabel,
    Grid,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FaceIcon from "@mui/icons-material/Face";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { uploadFile, enhanceImage } from "../services/fileUploadService";
import ButtonGlowing from "../components/ButtonGlowing";

const FileUploader = () => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";

    const [user, setUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [enhancedSrc, setEnhancedSrc] = useState(null);

    // Enhancement options
    const [faceEnhancement, setFaceEnhancement] = useState(false);
    const [backgroundEnhancement, setBackgroundEnhancement] = useState(false);
    const [colorization, setColorization] = useState(false);
    const [textEnhancement, setTextEnhancement] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setEnhancedSrc(null);
        setErrorMessage(null);
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setEnhancedSrc(null);
        setErrorMessage(null);
    };

    const handleEnhance = async () => {
        if (!selectedFile || !user) {
            setErrorMessage("No file selected or user not logged in.");
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // 1) upload to Flask → S3
            const fileUrl = await uploadFile(selectedFile, user.email, {
                face: faceEnhancement,
                background: backgroundEnhancement,
                colorization,
                text: textEnhancement,
            });
            if (!fileUrl) throw new Error("Upload to S3 failed.");

            // 2) call Gradio → base64 data-URI
            const dataUri = await enhanceImage(fileUrl, {
                face: faceEnhancement,
                background: backgroundEnhancement,
                colorization,
                text: textEnhancement,
            });

            setEnhancedSrc(dataUri);
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <Card
            sx={{
                maxWidth: 800,
                mx: "auto",
                p: 4,
                borderRadius: 4,
                boxShadow: darkMode
                    ? "0 6px 15px rgba(255,255,255,0.2)"
                    : "0 6px 15px rgba(0,0,0,0.2)",
                bgcolor: darkMode ? "#121212" : "#f8f9fa",
                color: darkMode ? "#fff" : "#000",
            }}
        >
            <CardContent>
                {/* Dropzone */}
                {!selectedFile && (
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: `2px dashed ${darkMode ? "#1DE9B6" : "#1DC4E9"}`,
                            borderRadius: 2,
                            p: 3,
                            height: 200,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            bgcolor: darkMode ? "#1E1E1E" : "#fafafa",
                            "&:hover": {
                                bgcolor: darkMode ? "#333" : "#e3dffa",
                            },
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography color="text.secondary">
                            Drag & drop an image here, or click to select
                        </Typography>
                    </Box>
                )}

                {/* Preview + Options */}
                {preview && (
                    <Grid container spacing={3} alignItems="center" mt={3}>
                        {/* Preview */}
                        <Grid item xs={12} sm={7}>
                            <Box sx={{ position: "relative" }}>
                                <CardMedia
                                    component="img"
                                    image={preview}
                                    alt="Preview"
                                    sx={{
                                        height: 250,
                                        borderRadius: 2,
                                        objectFit: "cover",
                                        boxShadow: darkMode
                                            ? "0 4px 10px rgba(255,255,255,0.2)"
                                            : "0 4px 10px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <IconButton
                                    onClick={removeImage}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        bgcolor: "rgba(0,0,0,0.6)",
                                        color: "#fff",
                                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Grid>

                        {/* Switches */}
                        <Grid item xs={12} sm={5}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="bold"
                                mb={1}
                            >
                                Enhance Image:
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={faceEnhancement}
                                            onChange={(e) => setFaceEnhancement(e.target.checked)}
                                        />
                                    }
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <FaceIcon /> Face
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={backgroundEnhancement}
                                            onChange={(e) =>
                                                setBackgroundEnhancement(e.target.checked)
                                            }
                                        />
                                    }
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LandscapeIcon /> Background
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={colorization}
                                            onChange={(e) => setColorization(e.target.checked)}
                                        />
                                    }
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <ColorLensIcon /> Colorize
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={textEnhancement}
                                            onChange={(e) => setTextEnhancement(e.target.checked)}
                                        />
                                    }
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <TextFieldsIcon /> Text
                                        </Box>
                                    }
                                />
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {/* Enhance Button */}
                {preview && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <ButtonGlowing
                            text={isProcessing ? "Processing..." : "Enhance"}
                            onClick={handleEnhance}
                            icon={<AutoFixHighIcon />}
                        />
                    </Box>
                )}

                {/* Error */}
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Enhanced Result */}
                {enhancedSrc && (
                    <Box mt={4} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Enhanced Result
                        </Typography>
                        <Box
                            component="img"
                            src={enhancedSrc}
                            alt="Enhanced"
                            sx={{
                                maxWidth: "100%",
                                borderRadius: 2,
                                boxShadow: theme.shadows[4],
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default FileUploader;