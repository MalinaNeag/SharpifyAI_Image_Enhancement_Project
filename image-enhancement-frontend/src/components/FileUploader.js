import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Switch,
    FormControlLabel,
    Grid,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FaceIcon from "@mui/icons-material/Face";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import UploadIcon from "@mui/icons-material/Upload";

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Enhancement options
    const [faceEnhancement, setFaceEnhancement] = useState(false);
    const [backgroundEnhancement, setBackgroundEnhancement] = useState(false);
    const [colorization, setColorization] = useState(false);
    const [textEnhancement, setTextEnhancement] = useState(false);

    const purpleColor = "#6200EE";

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setIsUploaded(false);
        setUploadedFileUrl(null);
        setErrorMessage(null);
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setIsUploaded(false);
        setUploadedFileUrl(null);
        setErrorMessage(null);
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsUploading(true);
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setIsUploaded(true);
                setUploadedFileUrl(data.file_url);
                setErrorMessage(null);
            } else {
                setErrorMessage(data.message || "Upload failed.");
            }
        } catch (error) {
            setErrorMessage("File was not uploaded. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const enhanceImage = async () => {
        if (!uploadedFileUrl) {
            alert("Please upload an image first!");
            return;
        }

        const requestBody = {
            file_url: uploadedFileUrl,
            face: faceEnhancement,
            background: backgroundEnhancement,
            colorization: colorization,
            text: textEnhancement,
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Enhanced image:", data.enhanced_file_url);
                alert("Enhancement completed!");
            } else {
                alert(data.message || "Enhancement failed.");
            }
        } catch (error) {
            console.error("Error enhancing image:", error);
            alert("An error occurred while enhancing the image.");
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
                margin: "auto",
                textAlign: "center",
                padding: 3,
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                backgroundColor: "background.paper",
            }}
        >
            <CardContent>
                {!selectedFile && (
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: `2px dashed ${purpleColor}`,
                            borderRadius: "12px",
                            padding: 0,
                            cursor: "pointer",
                            height: "300px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "&:hover": {
                                backgroundColor: "#EDE7F6",
                            },
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography variant="body1" color="text.secondary">
                            Drag & drop an image here, or click to select
                        </Typography>
                    </Box>
                )}

                {preview && !isUploaded && (
                    <>
                        <Box sx={{ position: "relative", marginTop: 3 }}>
                            <CardMedia
                                component="img"
                                image={preview}
                                alt="Preview"
                                sx={{
                                    height: 300,
                                    width: "100%",
                                    borderRadius: 4,
                                    objectFit: "cover",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    marginBottom: 2,
                                }}
                            />
                            <IconButton
                                onClick={removeImage}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    color: "#FFFFFF",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: purpleColor,
                                    color: "#FFFFFF",
                                    "&:hover": {
                                        backgroundColor: "#3700B3",
                                    },
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: 2,
                                }}
                                onClick={uploadFile}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    <>
                                        <UploadIcon />
                                        Upload
                                    </>
                                )}
                            </Button>
                        </Box>
                    </>
                )}

                {isUploaded && (
                    <>
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <CardMedia
                                    component="img"
                                    image={preview}
                                    alt="Preview"
                                    sx={{
                                        height: 300,
                                        width: "100%",
                                        borderRadius: 4,
                                        objectFit: "cover",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontStyle: "italic",
                                        marginBottom: 3,
                                        textAlign: "left",
                                    }}
                                >
                                    Choose enhancements:
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={faceEnhancement}
                                                onChange={(e) =>
                                                    setFaceEnhancement(e.target.checked)
                                                }
                                            />
                                        }
                                        label={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <FaceIcon />
                                                Face
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
                                                <LandscapeIcon />
                                                Background
                                            </Box>
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={colorization}
                                                onChange={(e) =>
                                                    setColorization(e.target.checked)
                                                }
                                            />
                                        }
                                        label={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <ColorLensIcon />
                                                Colorize
                                            </Box>
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={textEnhancement}
                                                onChange={(e) =>
                                                    setTextEnhancement(e.target.checked)
                                                }
                                            />
                                        }
                                        label={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <TextFieldsIcon />
                                                Text
                                            </Box>
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: purpleColor,
                                    color: "#FFFFFF",
                                    "&:hover": {
                                        backgroundColor: "#3700B3",
                                    },
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                                onClick={enhanceImage}
                            >
                                Enhance <AutoFixHighIcon sx={{ marginLeft: 1 }} />
                            </Button>
                        </Box>
                    </>
                )}
                {errorMessage && (
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{
                            marginTop: 2,
                            fontWeight: "bold",
                        }}
                    >
                        {errorMessage}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default FileUploader;