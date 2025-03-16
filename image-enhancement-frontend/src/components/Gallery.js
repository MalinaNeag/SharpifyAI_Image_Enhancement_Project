import React, { useState } from "react";
import {
    Grid,
    Card,
    CardMedia,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Tooltip,
    Button,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";

/**
 * 📸 Enhanced Gallery Component
 * ✅ Square images for uniformity
 * ✅ Stacked download & delete buttons
 * ✅ Confirmation dialog before delete
 * ✅ Subtle hover effects & polished look
 */
const Gallery = ({ images, onRemove }) => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // Track image to delete

    // Open image in modal
    const handleOpen = (image) => {
        setSelectedImage(image);
    };

    // Close modal
    const handleClose = () => {
        setSelectedImage(null);
    };

    // Show delete confirmation
    const handleConfirmDelete = (image) => {
        setConfirmDelete(image);
    };

    // Handle Image Download
    const handleDownload = (imgUrl) => {
        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = `Enhanced_Image_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ mt: 4, width: "100%" }}>
            {images.length > 0 ? (
                <Grid container spacing={2} justifyContent="center">
                    {images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <Card
                                    sx={{
                                        position: "relative",
                                        cursor: "pointer",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow: darkMode
                                            ? "0 4px 15px rgba(255, 255, 255, 0.1)"
                                            : "0 4px 15px rgba(0, 0, 0, 0.1)",
                                        transition: "0.3s",
                                        "&:hover": { boxShadow: darkMode ? "0 6px 20px rgba(255, 255, 255, 0.2)" : "0 6px 20px rgba(0, 0, 0, 0.2)" },
                                    }}
                                >
                                    {/* Square Image Display */}
                                    <CardMedia
                                        component="img"
                                        image={image.url}
                                        alt={`Uploaded ${index}`}
                                        onClick={() => handleOpen(image)}
                                        sx={{
                                            width: "100%",
                                            height: 200, // Makes all images square
                                            objectFit: "cover",
                                            transition: "0.3s",
                                            "&:hover": { opacity: 0.85 },
                                        }}
                                    />

                                    {/* Enhancement Info Tooltip */}
                                    {image.enhancements && image.enhancements.length > 0 && (
                                        <Tooltip title={image.enhancements.join(", ")} placement="top">
                                            <IconButton
                                                sx={{
                                                    position: "absolute",
                                                    top: 10,
                                                    left: 10,
                                                    backgroundColor: "rgba(0,0,0,0.6)",
                                                    color: "#fff",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                                                }}
                                            >
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {/* Remove & Download Buttons (Stacked) */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        {/* Delete Confirmation */}
                                        <Tooltip title="Remove">
                                            <IconButton
                                                onClick={() => handleConfirmDelete(image)}
                                                sx={{
                                                    backgroundColor: "rgba(255,0,0,0.7)",
                                                    color: "#fff",
                                                    "&:hover": { backgroundColor: "rgba(255,0,0,0.9)" },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {/* Download Button */}
                                        <Tooltip title="Download">
                                            <IconButton
                                                onClick={() => handleDownload(image.url)}
                                                sx={{
                                                    backgroundColor: "rgba(0,0,0,0.6)",
                                                    color: "#fff",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
                    No images uploaded yet.
                </Typography>
            )}

            {/* Fullscreen Image Modal */}
            <Dialog open={Boolean(selectedImage)} onClose={handleClose} maxWidth="md">
                <DialogActions sx={{ justifyContent: "space-between", padding: "10px" }}>
                    <Tooltip title="Close">
                        <IconButton onClick={handleClose} sx={{ color: darkMode ? "#fff" : "#000" }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                        <IconButton onClick={() => handleDownload(selectedImage?.url)} sx={{ color: darkMode ? "#fff" : "#000" }}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </DialogActions>
                <DialogContent sx={{ display: "flex", justifyContent: "center", padding: 0 }}>
                    {selectedImage && (
                        <img
                            src={selectedImage.url}
                            alt="Selected"
                            style={{
                                width: "100%",
                                maxWidth: "800px",
                                borderRadius: "10px",
                                objectFit: "contain",
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
                <DialogContent>
                    <Typography variant="h6" textAlign="center">
                        Are you sure you want to delete this image?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onRemove(confirmDelete.url);
                            setConfirmDelete(null);
                        }}
                    >
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={() => setConfirmDelete(null)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Gallery;