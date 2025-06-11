// src/services/fileUploadService.js

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
if (!BACKEND_URL) {
    console.warn("REACT_APP_BACKEND_URL not set");
}

/**
 * 1) Uploads the raw file to your Flask `/upload` endpoint
 *    (which pushes it to S3 and returns a publicly-readable URL).
 * 2) Calls Flask’s `/enhance` proxy (which invokes Gradio + S3)
 *    and returns both the final enhanced image URL and any analysis plot URLs.
 *
 * @param {File}   file    The File object to upload
 * @param {string} email   The user’s email (used server-side for S3 keying)
 * @param {Object} opts    { face, background, text }
 * @returns {Promise<{ enhancedUrl: string, plots: string[] }>}
 */
export async function uploadAndEnhance(file, email, opts = {}) {
    console.log("uploadAndEnhance()", { file, email, opts });

    // Step 1: upload to Flask → S3
    const form = new FormData();
    form.append("file", file);
    form.append("email", email);
    form.append("face", opts.face ? "true" : "false");
    form.append("background", opts.background ? "true" : "false");
    form.append("text", opts.text ? "true" : "false");

    const uploadRes = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: form,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) {
        console.error("Upload error:", uploadJson);
        throw new Error(uploadJson.error || uploadJson.message || "Upload failed");
    }
    const fileUrl = uploadJson.file_url;
    if (!fileUrl) {
        throw new Error("No file_url returned from upload");
    }

    // Step 2: call the Gradio proxy via Flask `/enhance`
    const enhanceRes = await fetch(`${BACKEND_URL}/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            file_url: fileUrl,
            email,
            face: opts.face,
            background: opts.background,
            text: opts.text,
        }),
    });

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

    // Expecting { data: [ enhancedUrl ], plots: [ ... ] }
    const enhancedUrl = Array.isArray(enhanceJson.data) && enhanceJson.data[0];
    const plots = Array.isArray(enhanceJson.plots) ? enhanceJson.plots : [];

    if (!enhancedUrl) {
        throw new Error("No enhanced URL returned");
    }

    console.log("uploadAndEnhance →", { enhancedUrl, plots });
    return { enhancedUrl, plots };
}