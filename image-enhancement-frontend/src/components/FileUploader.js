import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // X icon for removing the image

const FileUploader = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        if (onFileUpload) {
            onFileUpload(file); // Pass the file to the parent component
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreview(null);
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
                    onClick={() => alert("Upload functionality to be added!")}
                    disabled={!selectedFile}
                >
                    Upload
                </Button>
            </CardContent>
        </Card>
    );
};

export default FileUploader;