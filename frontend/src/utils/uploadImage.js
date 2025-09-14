import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.UPLOAD_IMAGE.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Assuming the server responds with the uploaded image URL or relevant data
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
export default uploadImage;