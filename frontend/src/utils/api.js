import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const getPosts = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL);

    return response.data;
  } catch (error) {
    throw error;
  }
};
