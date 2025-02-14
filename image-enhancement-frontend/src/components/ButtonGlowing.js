import React from "react";
import { Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const ButtonGlowing = ({ onClick, text }) => {
    const theme = useTheme();

    return (
        <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
        >
            <Button
                variant="contained"
                size="small"
                sx={{
                    background: "linear-gradient(135deg, #1DE9B6, #1DC4E9)",
                    color: "#000",
                    padding: "10px 24px",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 0 6px rgba(255, 255, 255, 0.7)",
                    position: "relative",
                    overflow: "hidden",
                    marginTop: "10px",
                    animation: "pulseGlow 1s infinite alternate",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "200%",
                        height: "100%",
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
                        animation: "shimmer 1.0s infinite linear",
                    },
                    "@keyframes shimmer": {
                        "0%": { left: "-100%" },
                        "100%": { left: "100%" },
                    },
                    "@keyframes pulseGlow": {
                        "0%": { boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)" },
                        "100%": { boxShadow: "0 0 12px rgba(255, 255, 255, 1)" },
                    },
                    "&:hover": {
                        background: "linear-gradient(135deg, #1DC4E9, #1DE9B6)",
                        transform: "scale(1.05)",
                        boxShadow: "0 0 15px rgba(255, 255, 255, 1)",
                    },
                }}
                onClick={onClick}
            >
                {text}
            </Button>
        </motion.div>
    );
};

export default ButtonGlowing;