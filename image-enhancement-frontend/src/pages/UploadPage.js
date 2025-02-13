import React from "react";
import { Container, Typography } from "@mui/material";
import FileUploader from "../components/FileUploader";

const UploadPage = () => {
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
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
            >
                Upload and Enhance Your Images
            </Typography>
            <FileUploader />
        </Container>
    );
};

export default UploadPage;