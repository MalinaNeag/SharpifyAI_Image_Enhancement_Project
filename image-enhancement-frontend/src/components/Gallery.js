// src/components/Gallery.jsx
import React, { useState, useEffect } from "react";
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
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CompareIcon from "@mui/icons-material/Compare";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { GallerySlider } from "./GallerySlider";

const enhancementLabels = {
    face: "😊 Face",
    background: "🏞️ Background",
    text: "📝 Text",
    colorization: "🎨 Colorization",
};

export default function Gallery({ images, onRemove }) {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);
    const [compareMode, setCompareMode] = useState(false);
    const [pairedImages, setPairedImages] = useState([]);

    // Group original and enhanced images
    useEffect(() => {
        const pairs = {};

        images.forEach(img => {
            const urlParts = img.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const match = filename.match(/^(original|enhanced)_([a-f0-9]+)\./);

            if (!match) return;

            const type = match[1];
            const runId = match[2];

            if (!pairs[runId]) {
                pairs[runId] = {};
            }

            pairs[runId][type] = img;
            pairs[runId].runId = runId;
        });

        setPairedImages(Object.values(pairs).filter(pair => pair.original && pair.enhanced));
    }, [images]);

    const open = (index) => setSelectedIndex(index);
    const close = () => {
        setSelectedIndex(null);
        setCompareMode(false);
    };

    const navigate = (direction) => {
        if (direction === 'prev') {
            setSelectedIndex(prev => (prev === 0 ? pairedImages.length - 1 : prev - 1));
        } else {
            setSelectedIndex(prev => (prev === pairedImages.length - 1 ? 0 : prev + 1));
        }
    };

    const askDel = (img) => setConfirmDel(img);

    const download = (url) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `enhanced_${pairedImages[selectedIndex].runId}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            })
            .catch(() => {
                // Fallback if fetch fails
                const a = document.createElement("a");
                a.href = url;
                a.download = `enhanced_${pairedImages[selectedIndex]?.runId || Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    };

    return (
        <Box sx={{ mt: 4, px: { xs: 1, sm: 3, md: 6 } }}>
            {pairedImages.length > 0 ? (
                <Grid container spacing={isSmallScreen ? 1 : 2} justifyContent="center">
                    {pairedImages.map((pair, i) => (
                        <Grid key={pair.runId || i} item xs={6} sm={4} md={3}>
                            <motion.div whileHover={{ scale: isSmallScreen ? 1 : 1.03 }}>
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
                                        image={pair.enhanced.url}
                                        onClick={() => open(i)}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "1/1",
                                            objectFit: "cover",
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            p: 0.5,
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.3,
                                            bgcolor: "rgba(0,0,0,0.4)",
                                        }}
                                    >
                                        {pair.enhanced.enhancements?.map((e, j) => (
                                            <Typography
                                                key={j}
                                                variant="caption"
                                                sx={{
                                                    color: "#fff",
                                                    borderRadius: 2,
                                                    px: 0.6,
                                                    py: 0.1,
                                                    fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
                                                }}
                                            >
                                                {enhancementLabels[e] || e}
                                            </Typography>
                                        ))}
                                    </Box>

                                    <Box sx={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 0.5 }}>
                                        <Tooltip title="Compare with original">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    open(i);
                                                    setCompareMode(true);
                                                }}
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.7)",
                                                    "&:hover": {
                                                        bgcolor: "rgba(29, 233, 182, 0.9)",
                                                        color: "#fff",
                                                    },
                                                }}
                                            >
                                                <CompareIcon fontSize={isSmallScreen ? "small" : "medium"} />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    askDel(pair.enhanced);
                                                }}
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.7)",
                                                    "&:hover": {
                                                        bgcolor: "rgba(255,0,0,0.9)",
                                                        color: "#fff",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography
                    variant="body1"
                    sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
                >
                    No enhanced images available yet.
                </Typography>
            )}

            <Dialog
                open={selectedIndex !== null}
                onClose={close}
                maxWidth="md"
                fullWidth
                fullScreen={isSmallScreen}
                sx={{
                    '& .MuiDialog-paper': {
                        bgcolor: darkMode ? 'background.default' : 'background.paper',
                        borderRadius: isSmallScreen ? 0 : 4,
                        overflow: 'hidden',
                        maxHeight: isSmallScreen ? '100vh' : '90vh'
                    }
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                        zIndex: 10,
                    }}
                >
                    <Tooltip title="Download enhanced">
                        <IconButton
                            onClick={() => download(pairedImages[selectedIndex]?.enhanced.url)}
                            sx={{
                                bgcolor: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
                                color: darkMode ? "#fff" : "#000",
                                "&:hover": {
                                    bgcolor: darkMode
                                        ? "rgba(0,0,0,0.8)"
                                        : "rgba(255,255,255,1)",
                                },
                            }}
                        >
                            <DownloadIcon fontSize={isSmallScreen ? "small" : "medium"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={compareMode ? "Exit compare mode" : "Compare with original"}>
                        <IconButton
                            onClick={() => setCompareMode(!compareMode)}
                            sx={{
                                bgcolor: compareMode
                                    ? darkMode ? "rgba(29, 233, 182, 0.9)" : "rgba(29, 196, 233, 0.9)"
                                    : darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
                                color: compareMode ? "#fff" : darkMode ? "#fff" : "#000",
                                "&:hover": {
                                    bgcolor: compareMode
                                        ? darkMode ? "rgba(29, 233, 182, 0.7)" : "rgba(29, 196, 233, 0.7)"
                                        : darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,1)",
                                },
                            }}
                        >
                            <CompareIcon fontSize={isSmallScreen ? "small" : "medium"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={close}
                            sx={{
                                bgcolor: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
                                color: darkMode ? "#fff" : "#000",
                                "&:hover": {
                                    bgcolor: darkMode
                                        ? "rgba(0,0,0,0.8)"
                                        : "rgba(255,255,255,1)",
                                },
                            }}
                        >
                            <CloseIcon fontSize={isSmallScreen ? "small" : "medium"} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Navigation Arrows */}
                {pairedImages.length > 1 && (
                    <>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('prev');
                            }}
                            sx={{
                                position: "absolute",
                                left: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                bgcolor: "rgba(0,0,0,0.4)",
                                color: "#fff",
                                "&:hover": {
                                    bgcolor: "rgba(0,0,0,0.7)",
                                },
                                ...(isSmallScreen && {
                                    left: 4,
                                    padding: 0.5
                                })
                            }}
                        >
                            <ArrowBackIosIcon fontSize={isSmallScreen ? "small" : "medium"} />
                        </IconButton>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('next');
                            }}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                bgcolor: "rgba(0,0,0,0.4)",
                                color: "#fff",
                                "&:hover": {
                                    bgcolor: "rgba(0,0,0,0.7)",
                                },
                                ...(isSmallScreen && {
                                    right: 4,
                                    padding: 0.5
                                })
                            }}
                        >
                            <ArrowForwardIosIcon fontSize={isSmallScreen ? "small" : "medium"} />
                        </IconButton>
                    </>
                )}

                <DialogContent
                    sx={{
                        p: 0,
                        textAlign: "center",
                        height: isSmallScreen ? "calc(100vh - 56px)" : "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: darkMode ? 'background.default' : 'background.paper'
                    }}
                >
                    {selectedIndex !== null && pairedImages[selectedIndex] && (
                        compareMode ? (
                            <GallerySlider
                                before={pairedImages[selectedIndex].original.url}
                                after={pairedImages[selectedIndex].enhanced.url}
                                isMobile={isSmallScreen}
                            />
                        ) : (
                            <Box
                                component="img"
                                src={pairedImages[selectedIndex].enhanced.url}
                                alt="Enhanced"
                                sx={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        )
                    )}
                </DialogContent>

                {/* Image Counter */}
                {pairedImages.length > 1 && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 16,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 10,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2">
                            {selectedIndex + 1} / {pairedImages.length}
                        </Typography>
                    </Box>
                )}
            </Dialog>

            <Dialog
                open={!!confirmDel}
                onClose={() => setConfirmDel(null)}
                fullScreen={isSmallScreen}
            >
                <DialogContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant={isSmallScreen ? "h6" : "h6"}>
                        Are you sure you want to delete this image?
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        This will remove both the original and enhanced versions.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mt: 3,
                        flexDirection: isSmallScreen ? 'column' : 'row'
                    }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();
                                const pair = pairedImages.find(p => p.enhanced.url === confirmDel.url);
                                if (pair) {
                                    onRemove(pair.original.url);
                                    onRemove(pair.enhanced.url);
                                }
                                setConfirmDel(null);
                                if (selectedIndex !== null) {
                                    close();
                                }
                            }}
                            sx={{ px: 3 }}
                            fullWidth={isSmallScreen}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => setConfirmDel(null)}
                            variant="outlined"
                            sx={{ px: 3 }}
                            fullWidth={isSmallScreen}
                        >
                            Cancel
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}