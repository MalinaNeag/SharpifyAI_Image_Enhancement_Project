// src/components/FileUploader.jsx
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
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { uploadAndEnhance } from "../services/fileUploadService";
import ButtonGlowing from "./ButtonGlowing";
import Gallery from "./Gallery";

export default function FileUploader() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  // Auth + file state
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Enhancement toggles
  const [faceEnhancement, setFaceEnhancement] = useState(false);
  const [backgroundEnhancement, setBackgroundEnhancement] = useState(false);
  const [textEnhancement, setTextEnhancement] = useState(false);

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // **Our gallery state** – list of all enhanced images
  const [images, setImages] = useState([]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Dropzone
  const onDrop = (files) => {
    const f = files[0];
    setSelectedFile(f);
    setPreview(URL.createObjectURL(f));
    setErrorMessage("");
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Clear the current selection
  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setErrorMessage("");
  };

  // Parent handler for deleting from the gallery
  const handleRemove = (urlToRemove) => {
    setImages((imgs) => imgs.filter((img) => img.url !== urlToRemove));
  };

  // Main enhancement
  const handleEnhance = async () => {
    if (!selectedFile || !user) {
      setErrorMessage("Select a file and make sure you’re logged in.");
      return;
    }
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const { enhancedUrl, plots } = await uploadAndEnhance(
        selectedFile,
        user.email,
        {
          face: faceEnhancement,
          background: backgroundEnhancement,
          text: textEnhancement,
        }
      );
      // Build the enhancements array for tags
      const enhancements = [];
      if (faceEnhancement) enhancements.push("face");
      if (backgroundEnhancement) enhancements.push("background");
      if (textEnhancement) enhancements.push("text");

      // Append to our gallery
      setImages((imgs) => [
        ...imgs,
        {
          key: enhancedUrl,
          url: enhancedUrl,
          enhancements,
          plots,
        },
      ]);
      // Clear dropzone
      removeImage();
    } catch (e) {
      console.error("[FileUploader] enhance error:", e);
      setErrorMessage(e.message || "Enhancement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
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
          {!selectedFile ? (
            <Box
              {...getRootProps()}
              sx={{
                border: `2px dashed ${
                  darkMode ? "#1DE9B6" : "#1DC4E9"
                }`,
                borderRadius: 2,
                p: 3,
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: darkMode ? "#1E1E1E" : "#fafafa",
                "&:hover": { bgcolor: darkMode ? "#333" : "#e3dffa" },
              }}
            >
              <input {...getInputProps()} />
              <Typography color="text.secondary">
                Drag & drop an image here, or click to select
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3} alignItems="center" mt={3}>
                <Grid item xs={12} sm={7}>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      src={preview}
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
                <Grid item xs={12} sm={5}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    mb={1}
                  >
                    Enhance Options
                  </Typography>
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
                        checked={textEnhancement}
                        onChange={(e) =>
                          setTextEnhancement(e.target.checked)
                        }
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <TextFieldsIcon /> Text
                      </Box>
                    }
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <ButtonGlowing
                  icon={<AutoFixHighIcon />}
                  text={isProcessing ? "Processing…" : "Enhance"}
                  onClick={handleEnhance}
                />
              </Box>
            </>
          )}

          {errorMessage && (
            <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
              {errorMessage}
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}