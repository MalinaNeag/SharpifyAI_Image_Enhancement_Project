import React from "react";
import { Box } from "@mui/material";
import { LightMode, NightsStay } from "@mui/icons-material";
import { motion } from "framer-motion";

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    return (
        <Box
            onClick={() => setDarkMode(!darkMode)}
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: darkMode ? "#222" : "#fff",
                padding: { xs: "5px 10px", sm: "6px 12px" },
                borderRadius: "30px",
                boxShadow: darkMode ? "0px 3px 8px rgba(255, 255, 255, 0.1)" : "0px 3px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
            }}
        >
            <motion.div key={darkMode ? "sun" : "moon"} initial={{ rotate: 180 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
                {darkMode ? (
                    <LightMode sx={{ fontSize: { xs: 18, sm: 20 }, color: "#FFD700" }} />
                ) : (
                    <NightsStay sx={{ fontSize: { xs: 18, sm: 20 }, color: "#FFD700" }} />
                )}
            </motion.div>
        </Box>
    );
};

export default DarkModeToggle;