const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
if (!BACKEND_URL) {
    console.warn("REACT_APP_BACKEND_URL not set");
}

/**
 * Uploads file to backend + triggers enhancement.
 * Backend returns: original_url, enhanced_url, run_id.
 *
 * @param {File}   file
 * @param {string} email
 * @param {Object} opts   { face, background, text, colorization }
 * @returns {Promise<{ originalUrl: string, enhancedUrl: string, runId: string, plots: string[] }>}
 */
export async function uploadAndEnhance(file, email, opts = {}) {
    console.log("uploadAndEnhance()", { file, email, opts });

    // Step 1: Upload original file
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

    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) {
        console.error("Upload error:", uploadJson);
        throw new Error(uploadJson.error || uploadJson.message || "Upload failed");
    }

    const fileUrl = uploadJson.file_url;
    if (!fileUrl) {
        throw new Error("No file_url returned from upload");
    }

    // Step 2: Trigger enhancement (UPDATED)
    const enhanceRes = await fetch(`${BACKEND_URL}/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            file_url: fileUrl,
            email,
            run_id: uploadJson.run_id,  // ✅ Pass run_id from /upload
            face: opts.face,
            background: opts.background,
            text: opts.text,
            colorization: opts.colorization
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

    // Expecting: { data: { original_url, enhanced_url, run_id }, plots: [...] }
    const enhancedUrl = enhanceJson?.data?.enhanced_url;
    const originalUrl = enhanceJson?.data?.original_url;
    const runId       = enhanceJson?.data?.run_id;
    const plots       = Array.isArray(enhanceJson.plots) ? enhanceJson.plots : [];

    if (!enhancedUrl || !originalUrl || !runId) {
        throw new Error("Missing enhancement data from server");
    }

    console.log("uploadAndEnhance →", { originalUrl, enhancedUrl, runId, plots });

    return {
        originalUrl,
        enhancedUrl,
        runId,
        plots
    };
}