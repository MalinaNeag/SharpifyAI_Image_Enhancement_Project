import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFilePath, setUploadedFilePath] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setUploadedFilePath(null);
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            console.log("Response:", response); // Log response object

            if (!response.ok) {
                // Log status and error details
                console.error("Response not OK:", response.status, response.statusText);
                throw new Error("Failed to upload file!");
            }

            const data = await response.json();
            console.log("Response Data:", data); // Log JSON response
            alert(`File uploaded successfully! File Path: ${data.file_path}`);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <Card
            sx={{
                maxWidth: 400,
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
                            border: "2px dashed #FF00FF",
                            borderRadius: "8px",
                            padding: 3,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "action.hover" },
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography variant="body1" color="text.secondary">
                            Drag & drop an image here, or click to select
                        </Typography>
                    </Box>
                )}
                {preview && (
                    <Box sx={{ position: "relative", marginTop: 2 }}>
                        <CardMedia
                            component="img"
                            image={preview}
                            alt="Preview"
                            sx={{
                                height: 200,
                                width: "100%",
                                borderRadius: 2,
                                objectFit: "cover",
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
                )}
                {selectedFile && (
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                        Selected File: {selectedFile.name}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        marginTop: 3,
                        backgroundColor: "#FF00FF",
                        color: "#FFFFFF",
                        "&:hover": {
                            backgroundColor: "#D000D0",
                        },
                    }}
                    onClick={uploadFile}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </Button>
                {uploadedFilePath && (
                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h6">Uploaded Image:</Typography>
                        <img
                            src={uploadedFilePath}
                            alt="Uploaded"
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: 8,
                                marginTop: 8,
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default FileUploader;