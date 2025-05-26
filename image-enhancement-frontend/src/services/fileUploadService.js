const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const uploadFile = async (file, email, enhancements = {}) => {
    const form = new FormData();
    form.append("file", file);
    form.append("email", email);
    form.append("face",         enhancements.face    ? "true" : "false");
    form.append("background",   enhancements.background ? "true" : "false");
    form.append("colorization", enhancements.colorization ? "true" : "false");
    form.append("text",         enhancements.text    ? "true" : "false");

    const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Upload failed");
    return json.file_url;
};

export const enhanceImage = async (fileUrl, opts) => {
    // pull out the flags from opts
    const { face, background, text, colorization } = opts;

    const res = await fetch(`${BACKEND_URL}/enhance`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            file_url:     fileUrl,
            face,
            background,
            text,
            colorization,
        }),
    });

    const json = await res.json();
    if (!res.ok) {
        // mirror whatever error your proxy sent
        throw new Error(json.error || json.detail || "Enhancement failed");
    }

    // Gradio proxy returns { data: [ "<uri-or-url>" ] }
    return json.data[0];
};