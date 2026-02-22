import { API_PATHS } from "./apiPaths.js";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFiles) => {
  const formData = new FormData();

  // If multiple files (array)
  if (Array.isArray(imageFiles)) {
    imageFiles.forEach((file) => {
      formData.append("images", file); // same key name
    });
  }
  // If single file
  else {
    formData.append("images", imageFiles);
  }

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading image(s):", error);
    throw error;
  }
};

export default uploadImage;
