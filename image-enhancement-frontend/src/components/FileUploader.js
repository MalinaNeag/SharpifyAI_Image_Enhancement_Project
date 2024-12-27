import React, { useState } from "react";
import { Box, Button, Typography, Input } from "@mui/material";

const FileUploader = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (onFileUpload) {
            onFileUpload(file); // Pass the file to the parent component
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: 3,
                border: "1px dashed grey",
                borderRadius: "8px",
                width: "300px",
                margin: "auto",
            }}
        >
            <Typography variant="h6">Upload an Image</Typography>
            <Input
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: "image/*" }}
            />
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
            >
                Upload
            </Button>
        </Box>
    );
};

export default FileUploader;