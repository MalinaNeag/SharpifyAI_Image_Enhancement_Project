import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, useTheme } from "@mui/material";

export const GallerySlider = ({ before, after }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const containerRef = useRef(null);
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";

    // Stable function to handle cursor/touch position
    const handleMove = useCallback((clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setSliderValue(percent);
    }, []);

    // Stable event handlers — no dynamic deps so useEffect won't complain
    const handleMouseMove = useCallback((e) => handleMove(e.clientX), [handleMove]);
    const handleMouseUp = useCallback(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);
    const handleMouseDown = (e) => {
        handleMove(e.clientX);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
    }, [handleMove]);
    const handleTouchEnd = useCallback(() => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
    }, [handleTouchMove]);
    const handleTouchStart = (e) => {
        handleMove(e.touches[0].clientX);
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                touchAction: "none",
            }}
        >
            {/* Left side: original image */}
            <Box
                component="img"
                src={before}
                alt="Original"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    zIndex: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />
            {/* Right side: enhanced image clipped to slider */}
            <Box
                component="img"
                src={after}
                alt="Enhanced"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    clipPath: `polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%)`,
                    zIndex: 2,
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />
            {/* Slider drag handle */}
            <Box
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: `${sliderValue}%`,
                    width: "4px",
                    height: "100%",
                    bgcolor: darkMode ? "#ff5252" : "#3f51b5",
                    zIndex: 3,
                    transform: "translateX(-2px)",
                    cursor: "ew-resize",
                    "&:before": {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        bgcolor: darkMode ? "#ff5252" : "#3f51b5",
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    },
                }}
            />
            {/* Labels */}
            <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 3,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                }}
            >
                <Typography variant="caption">Original</Typography>
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 3,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                }}
            >
                <Typography variant="caption">Enhanced</Typography>
            </Box>
        </Box>
    );
};