// Get the backend URL from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Warn during development if the backend URL is missing
if (!BACKEND_URL) {
    console.warn("REACT_APP_BACKEND_URL not set");
}

/**
 * Uploads an image file and enhancement options to the backend.
 * Triggers the enhancement pipeline after upload.
 *
 * @param {File}   file - Image file to upload.
 * @param {string} email - User email (used for S3 path and auth).
 * @param {Object} opts - Enhancement flags (face, background, text, colorization).
 * @returns {Promise<{ originalUrl: string, enhancedUrl: string, runId: string, plots: string[] }>}
 */
export async function uploadAndEnhance(file, email, opts = {}) {
    console.log("uploadAndEnhance()", { file, email, opts });

    // Step 1: Upload the original image file to the backend
    const form = new FormData();
    form.append("file", file);
    form.append("email", email);
    form.append("face", opts.face ? "true" : "false");
    form.append("background", opts.background ? "true" : "false");
    form.append("text", opts.text ? "true" : "false");
    form.append("colorization", opts.colorization ? "true" : "false");

    const uploadRes = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: form,
    });

    // Parse the response from the upload step
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) {
        console.error("Upload error:", uploadJson);
        throw new Error(uploadJson.error || uploadJson.message || "Upload failed");
    }

    const fileUrl = uploadJson.file_url;
    if (!fileUrl) {
        throw new Error("No file_url returned from upload");
    }

    // Step 2: Call the enhancement endpoint with the uploaded image URL and options
    const enhanceRes = await fetch(`${BACKEND_URL}/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            file_url: fileUrl,
            email,
            run_id: uploadJson.run_id, // Use the same run_id to keep enhancement linked to upload
            face: opts.face,
            background: opts.background,
            text: opts.text,
            colorization: opts.colorization
        }),
    });

    // Try to parse JSON response from the enhancement endpoint
    let enhanceJson;
    try {
        enhanceJson = await enhanceRes.json();
    } catch (err) {
        console.error("Invalid JSON from /enhance:", err);
        throw new Error("Server returned non-JSON");
    }

    if (!enhanceRes.ok) {
        console.error("Enhance error:", enhanceJson);
        throw new Error(enhanceJson.error || "Enhancement failed");
    }

    // Extract expected values from the enhancement response
    const enhancedUrl = enhanceJson?.data?.enhanced_url;
    const originalUrl = enhanceJson?.data?.original_url;
    const runId       = enhanceJson?.data?.run_id;
    const plots       = Array.isArray(enhanceJson.plots) ? enhanceJson.plots : [];

    // Validate response completeness
    if (!enhancedUrl || !originalUrl || !runId) {
        throw new Error("Missing enhancement data from server");
    }

    console.log("uploadAndEnhance →", { originalUrl, enhancedUrl, runId, plots });

    // Return URLs and metadata to the frontend
    return {
        originalUrl,
        enhancedUrl,
        runId,
        plots
    };
}