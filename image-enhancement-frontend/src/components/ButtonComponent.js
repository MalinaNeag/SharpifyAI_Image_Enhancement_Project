import React from "react";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ButtonComponent = ({ children, onClick }) => {
    return (
        <Button
            endIcon={<ArrowForwardIosIcon />}
            sx={{
                marginTop: 1,
                background: "#FFFFFF",
                color: "#000",
                padding: "8px 18px",
                fontSize: "14px",
                textTransform: "none",
                borderRadius: "20px",
                transition: "0.3s",
                "&:hover": {
                    background: "linear-gradient(135deg, #1DE9B6, #1DC4E9)",
                    color: "#fff",
                    transform: "scale(1.05)",
                },
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export default ButtonComponent;