import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button } from "@mui/material";

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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: 3,
                border: "2px dashed grey",
                borderRadius: "8px",
                width: "300px",
                margin: "auto",
                textAlign: "center",
            }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <Typography variant="h6">
                Drag & drop an image here, or click to select
            </Typography>
            {preview && (
                <Box
                    sx={{
                        width: "100%",
                        height: "200px",
                        marginTop: 2,
                        overflow: "hidden",
                        borderRadius: "8px",
                    }}
                >
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </Box>
            )}
            {selectedFile && (
                <Typography variant="body2">
                    Selected: {selectedFile.name}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Upload functionality to be added!")}
                disabled={!selectedFile}
                sx={{ marginTop: 2 }}
            >
                Upload
            </Button>
        </Box>
    );
};

export default FileUploader;