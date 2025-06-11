// src/components/BeforeAfterSlider.jsx
import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";

const BeforeAfterSlider = ({ src, height }) => {
    const containerRef = useRef(null);
    const [sliderX, setSliderX] = useState(50);
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
    };
    const handleMouseMove = (e) => {
        if (!dragging || !containerRef.current) return;
        const { left, width } = containerRef.current.getBoundingClientRect();
        let perc = ((e.clientX - left) / width) * 100;
        perc = Math.max(0, Math.min(100, perc));
        setSliderX(perc);
    };
    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    return (
        <Box
            ref={containerRef}
            onMouseDown={handleMouseDown}
            sx={{
                position: "relative",
                width: "100%",
                height: height,
                overflow: "hidden",
                cursor: "ew-resize",
            }}
        >
            {/* 1) Base layer: CLEAR image (no blur) */}
            <Box
                component="img"
                src={src}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* 2) Overlay: BLURRED image clipped to the LEFT up to sliderX% */}
            <Box
                component="img"
                src={src}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(2px)",  // subtle blur
                    clipPath: `polygon(0 0, ${sliderX}% 0, ${sliderX}% 100%, 0 100%)`,
                }}
            />

            {/* 3) Vertical handle line + knob */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: `${sliderX}%`,
                    transform: "translateX(-50%)",
                    height: "100%",
                    width: "2px",
                    bgcolor: "rgba(255,255,255,0.8)",
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        bgcolor: "rgba(0,0,0,0.6)",
                        border: "2px solid white",
                    }}
                />
            </Box>
        </Box>
    );
};

export default BeforeAfterSlider;