// src/components/Gallery.jsx
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

export default function Gallery({ images, onRemove }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [selected, setSelected] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  // show all passed-in images
  const photos = images;

  const open = (img) => setSelected(img);
  const close = () => setSelected(null);
  const askDel = (img) => setConfirmDel(img);

  const download = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `Enhanced_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ mt: 4, px: { xs: 2, sm: 3, md: 6 } }}>
      {photos.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {photos.map((img, i) => (
            <Grid key={img.key || i} item xs={6} sm={4} md={3}>
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
                    image={img.url}
                    onClick={() => open(img)}
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
                      p: 1,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      bgcolor: "rgba(0,0,0,0.4)",
                    }}
                  >
                    {img.enhancements.map((e, j) => (
                      <Typography
                        key={j}
                        variant="caption"
                        sx={{
                          color: "#fff",
                          borderRadius: 2,
                          px: 0.8,
                          py: 0.3,
                          fontSize: "0.7rem",
                        }}
                      >
                        {enhancementLabels[e] || e}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          askDel(img);
                        }}
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
        <Typography
          variant="body1"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          No images uploaded yet.
        </Typography>
      )}

      {/* IMAGE VIEWER */}
      <Dialog open={!!selected} onClose={close} maxWidth="md" fullWidth>
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
          <Tooltip title="Download">
            <IconButton
              onClick={() => download(selected.url)}
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
              <DownloadIcon />
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
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <DialogContent
          dividers
          sx={{
            p: 2,
            textAlign: "center",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selected && (
            <Box
              component="img"
              src={selected.url}
              alt="Enhanced"
              sx={{
                width: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!confirmDel} onClose={() => setConfirmDel(null)}>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h6">
            Are you sure you want to delete this image?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(confirmDel.url);
                setConfirmDel(null);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setConfirmDel(null)}>Cancel</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}