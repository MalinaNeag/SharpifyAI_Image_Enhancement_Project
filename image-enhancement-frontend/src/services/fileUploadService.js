const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

export const uploadFile = async (file, email) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) return data.file_url;
        throw new Error(data.message);
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

export const enhanceImage = async (fileUrl, options) => {
    try {
        const response = await fetch(`${BACKEND_URL}/enhance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_url: fileUrl, ...options }),
        });

        const data = await response.json();
        if (response.ok) return data.enhanced_file_url;
        throw new Error(data.message);
    } catch (error) {
        console.error("Enhancement error:", error);
        throw error;
    }
};