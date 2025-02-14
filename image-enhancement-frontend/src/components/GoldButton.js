import React from "react";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const GoldButton = ({ children, onClick }) => {
    return (
        <Button
            endIcon={<ArrowForwardIosIcon />}
            sx={{
                marginTop: 1,
                background: "linear-gradient(135deg, #FFA726, #FFEB3B) !important", // Gold gradient
                color: "#fff",
                padding: "8px 18px",
                fontSize: "14px",
                textTransform: "none",
                borderRadius: "20px",
                transition: "0.3s",
                "&:hover": {
                    background: "linear-gradient(135deg, #FFA726, #FFEB3B) !important", // Keeps same color on hover
                    transform: "scale(1.05)",
                },
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export default GoldButton;