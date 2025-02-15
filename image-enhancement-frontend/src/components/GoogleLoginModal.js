import React from "react";
import { Box, Button, Typography, IconButton, Modal, Backdrop, Fade } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { FcGoogle } from "react-icons/fc";
import { Close } from "@mui/icons-material";

// Styled Google Login Button
const GoogleButton = styled(Button)({
    backgroundColor: "#fff",
    color: "#3c4043",
    textTransform: "none",
    fontSize: "17px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 22px",
    borderRadius: "50px",
    border: "1px solid #dadce0",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
        backgroundColor: "#f8f9fa",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    },
});

const GoogleLoginModal = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 300 }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: "400px" },
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: 24,
                        p: { xs: 4, sm: 5 },
                        borderRadius: "16px",
                        textAlign: "center",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{ position: "absolute", top: 10, right: 10, color: "#5f6368" }}
                    >
                        <Close fontSize="medium" />
                    </IconButton>

                    {/* Title */}
                    <Typography sx={{ fontSize: { xs: "20px", sm: "22px" }, fontWeight: "bold", color: "#202124", mb: 2 }}>
                        Sign in to unlock AI-powered tools
                    </Typography>

                    {/* Subtitle */}
                    <Typography sx={{ fontSize: { xs: "14px", sm: "15px" }, color: "#5f6368", mb: 3 }}>
                        Log in for multi-device access and advanced enhancements.
                    </Typography>

                    {/* Google Sign-in Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                        <GoogleButton
                            fullWidth
                            startIcon={<FcGoogle size={24} />}
                            onClick={() => (window.location.href = "http://127.0.0.1:5000/login")}
                        >
                            Sign in with Google
                        </GoogleButton>
                    </motion.div>

                    {/* Terms of Service */}
                    <Typography sx={{ fontSize: "12px", color: "#80868b", mt: 3 }}>
                        By continuing, you accept our{" "}
                        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span> &{" "}
                        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default GoogleLoginModal;