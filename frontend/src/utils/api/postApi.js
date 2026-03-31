import { API_PATHS } from "../apiPaths";
import axiosInstance from "../axiosInstance";

export const getPostBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_BY_SLUG(slug));

    return response.data;
  } catch (error) {
    throw error;
  }
};
