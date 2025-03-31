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
    Tooltip,
    Button,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

const enhancementLabels = {
    face: "😊 Face",
    background: "🏞️ Background",
    text: "📝 Text",
    colorization: "🎨 Colorization",
};

const Gallery = ({ images, onRemove }) => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleOpen = (image) => setSelectedImage(image);
    const handleClose = () => setSelectedImage(null);
    const handleConfirmDelete = (image) => setConfirmDelete(image);

    const handleDownload = (imgUrl) => {
        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = `Enhanced_Image_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ mt: 4, px: { xs: 2, sm: 3, md: 6 } }}>
            {images.length > 0 ? (
                <Grid container spacing={2} justifyContent="center">
                    {images.map((image, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <motion.div whileHover={{ scale: 1.03 }}>
                                <Card
                                    sx={{
                                        position: "relative",
                                        cursor: "pointer",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        boxShadow: darkMode
                                            ? "0 4px 15px rgba(255,255,255,0.1)"
                                            : "0 4px 15px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={image.url}
                                        alt={`Uploaded ${index}`}
                                        onClick={() => handleOpen(image)}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "1 / 1",
                                            objectFit: "cover",
                                        }}
                                    />

                                    {image.enhancements?.length > 0 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                width: "100%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 0.5,
                                                p: 1,
                                                bgcolor: "rgba(0,0,0,0.4)",
                                            }}
                                        >
                                            {image.enhancements.map((enh, i) => (
                                                <Typography
                                                    key={i}
                                                    variant="caption"
                                                    sx={{
                                                        color: "#fff",
                                                        borderRadius: 2,
                                                        px: 0.8,
                                                        py: 0.3,
                                                        fontSize: "0.7rem",
                                                    }}
                                                >
                                                    {enhancementLabels[enh] || enh}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}

                                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                                        <Tooltip title="Remove">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleConfirmDelete(image)}
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.7)",
                                                    "&:hover": {
                                                        bgcolor: "rgba(255,0,0,0.9)",
                                                        color: "#fff",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
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

            {/* Modal */}
            <Dialog open={Boolean(selectedImage)} onClose={handleClose} maxWidth="sm" fullWidth>
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                    <Tooltip title="Download">
                        <IconButton
                            onClick={() => handleDownload(selectedImage?.url)}
                            sx={{
                                bgcolor: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
                                color: darkMode ? "#fff" : "#000",
                                "&:hover": {
                                    bgcolor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,1)",
                                },
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                bgcolor: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
                                color: darkMode ? "#fff" : "#000",
                                "&:hover": {
                                    bgcolor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,1)",
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <DialogContent sx={{ p: 2, textAlign: "center" }}>
                    {selectedImage && (
                        <>
                            <img
                                src={selectedImage.url}
                                alt="Selected"
                                style={{
                                    width: "100%",
                                    maxHeight: "70vh",
                                    borderRadius: "8px",
                                    objectFit: "contain",
                                }}
                            />

                            {selectedImage.enhancements?.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                                        ✨ Enhancements Applied:
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                                        {selectedImage.enhancements.map((enh, i) => (
                                            <Typography
                                                key={i}
                                                variant="caption"
                                                sx={{
                                                    bgcolor: darkMode ? "#333" : "#ddd",
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                {enhancementLabels[enh] || enh}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
                <DialogContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h6">Are you sure you want to delete this image?</Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
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
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Gallery;