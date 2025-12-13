/**
 * Uploads a file to Cloudinary.
 * @param {File} file - The file object to upload.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (file) => {
    const cloudName = "dl2fsglzv";
    const uploadPreset = "Rent-Return";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
