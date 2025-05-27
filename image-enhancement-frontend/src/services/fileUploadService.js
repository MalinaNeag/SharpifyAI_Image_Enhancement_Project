// src/services/fileUploadService.js

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
if (!BACKEND_URL) {
    console.warn("[fileUploadService] ⚠️ REACT_APP_BACKEND_URL not set");
}

/**
 * Upload your file to the Flask backend (which pushes to S3)
 * and then proxy-enhance via Gradio → finally returns the S3 URL.
 *
 * @param {File}   file    The File object to upload
 * @param {string} email   The user’s email (used server-side for S3 keying)
 * @param {Object} opts    { face, background, text, colorization }
 * @returns {Promise<string>}  URL of the enhanced image in S3
 */
export async function uploadAndEnhance(file, email, opts = {}) {
    console.log("[fileUploadService] uploadAndEnhance()", { file, email, opts });

    const form = new FormData();
    form.append("file", file);
    form.append("email", email);
    form.append("face", opts.face ? "true" : "false");
    form.append("background", opts.background ? "true" : "false");
    form.append("text", opts.text ? "true" : "false");
    form.append("colorization", opts.colorization ? "true" : "false");

    const res = await fetch(`${BACKEND_URL}/enhance-file`, {
        method: "POST",
        body: form,
    });

    let json;
    try {
        json = await res.json();
    } catch (err) {
        console.error("[fileUploadService] invalid JSON response:", err);
        throw new Error("Server returned non-JSON");
    }

    if (!res.ok) {
        console.error("[fileUploadService] error response:", json);
        throw new Error(json.error || json.message || "Enhancement failed");
    }
    if (!json.enhanced_url) {
        console.error("[fileUploadService] missing `enhanced_url` in:", json);
        throw new Error("Malformed server response");
    }

    console.log("[fileUploadService] success →", json.enhanced_url);
    return json.enhanced_url;
}