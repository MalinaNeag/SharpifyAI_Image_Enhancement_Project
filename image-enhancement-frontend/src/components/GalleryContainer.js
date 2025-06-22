import React, { useState, useEffect } from "react";
import Gallery from "../components/Gallery";
import { fetchGallery, deleteGalleryImage } from "../services/galleryService";

export default function GalleryContainer({ user }) {
    const [images, setImages] = useState([]);
    const [error, setError]     = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetchGallery(user.email)
                .then(setImages)
                .catch(e => setError(e.message));
        }
    }, [user]);

    const handleRemove = (url) => {
        const img = images.find(i => i.url === url);
        if (!img) return;
        deleteGalleryImage(user.email, img.key)
            .then(setImages)
            .catch(e => setError(e.message));
    };

    if (error) {
        return <div style={{ color: "red", textAlign:"center", marginTop:20 }}>{error}</div>;
    }

    return <Gallery images={images} onRemove={handleRemove} />;
}