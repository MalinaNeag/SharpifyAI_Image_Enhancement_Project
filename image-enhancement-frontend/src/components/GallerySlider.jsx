// src/components/GallerySlider.jsx
import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";

export const GallerySlider = ({ before, after }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const containerRef = useRef(null);
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";

    const handleMove = (clientX) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeX = clientX - containerRect.left;
        const percentage = Math.min(Math.max((relativeX / containerRect.width) * 100, 0), 100);
        setSliderValue(percentage);
    };

    const handleMouseDown = (e) => {
        handleMove(e.clientX);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientX);
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e) => {
        handleMove(e.touches[0].clientX);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

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
                touchAction: 'none'
            }}
        >
            {/* Original Image (left side) */}
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
                    userSelect: 'none',
                    pointerEvents: 'none'
                }}
            />

            {/* Enhanced Image (right side) */}
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
                    userSelect: 'none',
                    pointerEvents: 'none'
                }}
            />

            {/* Slider Handle - Only drag control */}
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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