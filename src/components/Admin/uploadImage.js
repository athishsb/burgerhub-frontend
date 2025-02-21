export const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "food-order-app");
    formData.append("cloud_name", `${import.meta.env.VITE_CLOUD_NAME}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    return data.secure_url; // Return image URL
};
