import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import { Container, Typography } from "@mui/material";

const App = () => {
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileUpload = (file) => {
        setUploadedFile(file);
        console.log("Uploaded file:", file); // For debugging
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Image Enhancement App
            </Typography>
            <FileUploader onFileUpload={handleFileUpload} />
            {uploadedFile && (
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    File ready for processing: {uploadedFile.name}
                </Typography>
            )}
        </Container>
    );
};

export default App;