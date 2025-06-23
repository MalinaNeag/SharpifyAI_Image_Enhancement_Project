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
  useTheme,
  Fade,
  Zoom,
  Tooltip,
  CircularProgress,
  Collapse,
  Alert,
  Paper,
  Divider,
  Backdrop,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FaceIcon from "@mui/icons-material/Face";
import LandscapeIcon from "@mui/icons-material/Landscape";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import InfoIcon from "@mui/icons-material/Info";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { uploadAndEnhance } from "../services/fileUploadService";
import ButtonGlowing from "./ButtonGlowing";
import Gallery from "./Gallery";
import GoogleLoginModal from "./GoogleLoginModal";
export default function FileUploader() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  // Auth + file state
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);

  // Enhancement toggles
  const [faceEnhancement, setFaceEnhancement] = useState(false);
  const [backgroundEnhancement, setBackgroundEnhancement] = useState(false);
  const [textEnhancement, setTextEnhancement] = useState(false);

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Gallery state
  const [images, setImages] = useState([]);

  // Check if any enhancement is selected
  const hasEnhancementSelected = faceEnhancement || backgroundEnhancement || textEnhancement;

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check if user is logged in
    if (!user) {
      setSelectedFile(null);
      setPreview(null);
      setShowLoginModal(true);
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      setErrorMessage('Please upload an image file (JPEG, PNG, WEBP)');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setEnhancedImage(null);
    setErrorMessage("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1
  });

  // Clear the current selection
  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setEnhancedImage(null);
    setErrorMessage("");
  };

  // Parent handler for deleting from the gallery
  const handleRemove = (urlToRemove) => {
    setImages((imgs) => imgs.filter((img) => img.url !== urlToRemove));
  };

  // Main enhancement
  const handleEnhance = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first.");
      return;
    }

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!hasEnhancementSelected) {
      setErrorMessage("Please select at least one enhancement option.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const {
        enhancedUrl,
        originalUrl,
        runId,
        plots
      } = await uploadAndEnhance(
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

      // Set the enhanced image to preview
      setEnhancedImage(enhancedUrl);

      // Append both original and enhanced images to gallery with keys for pairing
      setImages((imgs) => [
        ...imgs,
        {
          key: `${runId}_original`,
          url: originalUrl,
          enhancements: [],
          plots: [],
          timestamp: new Date().toISOString()
        },
        {
          key: `${runId}_enhanced`,
          url: enhancedUrl,
          enhancements,
          plots,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (e) {
      console.error("[FileUploader] enhance error:", e);
      setErrorMessage(e.message || "Enhancement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
        {/* Google Login Modal */}
        <GoogleLoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            setUser={setUser}
        />

        <Card
            sx={{
              borderRadius: 4,
              boxShadow: darkMode
                  ? "0 8px 24px rgba(0, 150, 136, 0.3)"
                  : "0 8px 24px rgba(0, 0, 0, 0.1)",
              bgcolor: darkMode ? "background.paper" : "#ffffff",
              overflow: "visible",
              position: "relative",
              border: darkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)"
            }}
        >
          <Box
              sx={{
                position: "absolute",
                top: -20,
                right: 20,
                bgcolor: darkMode ? "#1DE9B6" : "#1DC4E9",
                color: darkMode ? "#000" : "#fff",
                px: 2,
                py: 1,
                borderRadius: 2,
                boxShadow: 2,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
          >
            <AutoFixHighIcon fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              Image Enhancer
            </Typography>
          </Box>

          <CardContent sx={{ pt: 4 }}>
            {!selectedFile ? (
                <Box
                    {...getRootProps()}
                    sx={{
                      border: `2px dashed ${isDragActive
                          ? (darkMode ? "#00BFA5" : "#00ACC1")
                          : (darkMode ? "#1DE9B6" : "#1DC4E9")}`,
                      borderRadius: 3,
                      p: 4,
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      bgcolor: isDragActive
                          ? (darkMode ? "rgba(29, 233, 182, 0.15)" : "rgba(29, 196, 233, 0.15)")
                          : (darkMode ? "rgba(29, 233, 182, 0.05)" : "rgba(29, 196, 233, 0.05)"),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: darkMode ? "rgba(29, 233, 182, 0.1)" : "rgba(29, 196, 233, 0.1)",
                        borderColor: darkMode ? "#00BFA5" : "#00ACC1"
                      }
                    }}
                >
                  <input {...getInputProps()} />
                  <Zoom in={true}>
                    <Box textAlign="center">
                      <AutoFixHighIcon
                          sx={{
                            fontSize: 48,
                            mb: 1,
                            color: darkMode ? "#1DE9B6" : "#1DC4E9"
                          }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {isDragActive ? "Drop your image here" : "Drag & Drop Your Image"}
                      </Typography>
                      <Typography color="text.secondary">
                        or click to browse files
                      </Typography>
                      <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2, display: "block" }}
                      >
                        Supports: JPG, PNG, WEBP
                      </Typography>
                    </Box>
                  </Zoom>
                </Box>
            ) : (
                <Fade in={true}>
                  <Box>
                    {/* Image Comparison Section */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 3,
                      mb: 3
                    }}>
                      {/* Original Image */}
                      <Box sx={{
                        flex: 1,
                        position: 'relative',
                        border: darkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: darkMode ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "0 4px 20px rgba(0, 0, 0, 0.1)"
                      }}>
                        <CardMedia
                            component="img"
                            src={preview}
                            alt="Original"
                            sx={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '70vh',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          px: 1,
                          borderRadius: 1
                        }}>
                          <Typography variant="caption">Original</Typography>
                        </Box>
                        <IconButton
                            onClick={removeImage}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "rgba(0,0,0,0.7)",
                              color: "#fff",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                              transition: "all 0.2s ease"
                            }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Enhanced Image */}
                      {enhancedImage && (
                          <>
                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                            <Divider orientation="horizontal" flexItem sx={{ display: { xs: 'block', md: 'none' } }} />
                            <Box sx={{
                              flex: 1,
                              position: 'relative',
                              border: darkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: darkMode ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "0 4px 20px rgba(0, 0, 0, 0.1)"
                            }}>
                              <CardMedia
                                  component="img"
                                  src={enhancedImage}
                                  alt="Enhanced"
                                  sx={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '70vh',
                                    objectFit: 'contain',
                                    display: 'block'
                                  }}
                              />
                              <Box sx={{
                                position: 'absolute',
                                bottom: 8,
                                left: 8,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                px: 1,
                                borderRadius: 1
                              }}>
                                <Typography variant="caption">Enhanced</Typography>
                              </Box>
                              <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = enhancedImage;
                                    link.download = `enhanced-${selectedFile.name}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: darkMode ? '#1DE9B6' : '#1DC4E9',
                                    color: darkMode ? '#000' : '#fff',
                                    '&:hover': {
                                      bgcolor: darkMode ? '#00BFA5' : '#00ACC1'
                                    }
                                  }}
                              >
                                Download
                              </Button>
                            </Box>
                          </>
                      )}
                    </Box>

                    {/* Enhancement Options */}
                    <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                          border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.12)"
                              : "1px solid rgba(0, 0, 0, 0.08)"
                        }}
                    >
                      <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2
                          }}
                      >
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="text.primary"
                        >
                          Enhancement Options
                        </Typography>
                        <Tooltip title="Info about enhancements">
                          <IconButton
                              size="small"
                              onClick={() => setShowInfo(!showInfo)}
                              sx={{ color: darkMode ? "#1DE9B6" : "#1DC4E9" }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Collapse in={showInfo}>
                        <Alert
                            severity="info"
                            sx={{ mb: 2, borderRadius: 1 }}
                            onClose={() => setShowInfo(false)}
                        >
                          <Typography variant="body2">
                            Select which aspects of your image to enhance. Face
                            enhancement improves portraits, background
                            enhancement adjusts scenery, and text enhancement
                            makes written content clearer.
                          </Typography>
                        </Alert>
                      </Collapse>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <FormControlLabel
                            control={
                              <Switch
                                  checked={faceEnhancement}
                                  onChange={(e) =>
                                      setFaceEnhancement(e.target.checked)
                                  }
                                  color={darkMode ? "secondary" : "primary"}
                              />
                            }
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <FaceIcon
                                    sx={{
                                      color: faceEnhancement
                                          ? darkMode
                                              ? "#1DE9B6"
                                              : "#1DC4E9"
                                          : "inherit"
                                    }}
                                />
                                <Typography
                                    sx={{
                                      fontWeight: faceEnhancement ? "bold" : "normal",
                                      color: faceEnhancement
                                          ? darkMode
                                              ? "#1DE9B6"
                                              : "#1DC4E9"
                                          : "inherit"
                                    }}
                                >
                                  Face Enhancement
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0 }}
                        />
                        <FormControlLabel
                            control={
                              <Switch
                                  checked={backgroundEnhancement}
                                  onChange={(e) =>
                                      setBackgroundEnhancement(e.target.checked)
                                  }
                                  color={darkMode ? "secondary" : "primary"}
                              />
                            }
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <LandscapeIcon
                                    sx={{
                                      color: backgroundEnhancement
                                          ? darkMode
                                              ? "#1DE9B6"
                                              : "#1DC4E9"
                                          : "inherit"
                                    }}
                                />
                                <Typography
                                    sx={{
                                      fontWeight: backgroundEnhancement
                                          ? "bold"
                                          : "normal",
                                      color: backgroundEnhancement
                                          ? darkMode
                                              ? "#1DE9B6"
                                              : "#1DC4E9"
                                          : "inherit"
                                    }}
                                >
                                  Background Enhancement
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0 }}
                        />
                        <FormControlLabel
                            control={
                              <Switch
                                  checked={textEnhancement}
                                  onChange={(e) =>
                                      setTextEnhancement(e.target.checked)
                                  }
                                  color={darkMode ? "secondary" : "primary"}
                              />
                            }
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <TextFieldsIcon
                                    sx={{
                                      color: textEnhancement
                                          ? darkMode
                                              ? "#1DE9B6"
                                              : "#1DC4E9"
                                          : "inherit"
                                    }}
                                />
                                <Typography
                                    sx={{
                                      fontWeight: textEnhancement
                                          ? "bold"
                                          : "normal",
                                      color: textEnhancement
                                          ? darkMode
                                              ? "#1DE9B6"
                                              : "#1DC4E9"
                                          : "inherit"
                                    }}
                                >
                                  Text Enhancement
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0 }}
                        />
                      </Box>

                      {/* Processing Message */}
                      <Fade in={isProcessing}>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{
                              mt: 2,
                              mb: 1,
                              color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                              fontStyle: 'italic'
                            }}
                        >
                          Processing may take a few moments...
                        </Typography>
                      </Fade>

                      <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "center"
                          }}
                      >
                        <ButtonGlowing
                            icon={
                              isProcessing ? (
                                  <CircularProgress size={20} color="inherit" />
                              ) : (
                                  <AutoFixHighIcon />
                              )
                            }
                            text={isProcessing ? "Processing..." : "Enhance Image"}
                            onClick={handleEnhance}
                            disabled={isProcessing || !selectedFile || !hasEnhancementSelected}
                            fullWidth
                        />
                      </Box>
                    </Paper>
                  </Box>
                </Fade>
            )}

            <Collapse in={Boolean(errorMessage)}>
              <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    boxShadow: "none",
                    border: darkMode
                        ? "1px solid rgba(255, 0, 0, 0.3)"
                        : "1px solid rgba(255, 0, 0, 0.1)"
                  }}
              >
                {errorMessage}
              </Alert>
            </Collapse>
          </CardContent>
        </Card>
      </Box>
  );
}