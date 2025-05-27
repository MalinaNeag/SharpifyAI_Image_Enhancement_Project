const BACKEND = process.env.REACT_APP_BACKEND_URL;

export async function fetchGallery(email) {
    const res = await fetch(`${BACKEND}/gallery?email=${encodeURIComponent(email)}`);
    const j   = await res.json();
    if (!res.ok) throw new Error(j.error||"Failed to fetch gallery");
    return j.images;  // [{url, key, enhancements}, …]
}

export async function deleteGalleryImage(email, key) {
    const res = await fetch(`${BACKEND}/gallery`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, key })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error||"Failed to delete image");
    return j.images;
}