import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Switch, Typography, Container } from "@mui/material";
import FileUploader from "./components/FileUploader";

const App = () => {
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Image Enhancement App
                </Typography>
                <Typography variant="body1">
                    Toggle Dark Mode
                </Typography>
                <Switch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    sx={{ marginBottom: 3 }}
                />
                <FileUploader onFileUpload={(file) => console.log("Uploaded file:", file)} />
            </Container>
        </ThemeProvider>
    );
};

export default App;