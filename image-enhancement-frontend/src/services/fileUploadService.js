const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

// Upload File to Backend + AWS S3 with metadata
export const uploadFile = async (file, email, enhancements = {}) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", email);

        // Append enhancement flags as strings
        formData.append("face", enhancements.face ? "true" : "false");
        formData.append("background", enhancements.background ? "true" : "false");
        formData.append("colorization", enhancements.colorization ? "true" : "false");
        formData.append("text", enhancements.text ? "true" : "false");

        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Upload failed.");
        }

        return data.file_url;
    } catch (err) {
        console.error("Upload error:", err);
        return null;
    }
};

export const enhanceImage = async (fileUrl, options) => {
    try {
        const response = await fetch(`${BACKEND_URL}/enhance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                file_url: fileUrl,
                ...options,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Enhancement failed.");
        }

        return data.enhanced_file_url;
    } catch (error) {
        console.error("Enhancement error:", error);
        throw error;
    }
};