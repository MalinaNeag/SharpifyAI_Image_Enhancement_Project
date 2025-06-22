// Base URL for Flask backend, loaded from environment variable
const BACKEND = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch the user's enhanced image gallery from the backend.
 * @param {string} email - User's email address.
 * @returns {Promise<Array>} List of image objects: [{ url, key, enhancements }, ...]
 */
export async function fetchGallery(email) {
    // Make GET request to the gallery endpoint with the user's email
    const res = await fetch(`${BACKEND}/gallery?email=${encodeURIComponent(email)}`);
    const j   = await res.json();

    // Throw error if request failed
    if (!res.ok) throw new Error(j.error || "Failed to fetch gallery");

    // Return image metadata array
    return j.images;
}

/**
 * Delete a specific image from the user's gallery.
 * @param {string} email - User's email address.
 * @param {string} key - S3 object key of the image to delete.
 * @returns {Promise<Array>} Updated list of images after deletion.
 */
export async function deleteGalleryImage(email, key) {
    // Make DELETE request with email and image key in the body
    const res = await fetch(`${BACKEND}/gallery`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, key })
    });
    const j = await res.json();

    // Throw error if deletion failed
    if (!res.ok) throw new Error(j.error || "Failed to delete image");

    // Return updated image list
    return j.images;
}