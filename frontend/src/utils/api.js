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

export const getAllPosts = async ({ status, page, limit }) => {
  try {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
      params: {
        status: status?.toLowerCase(),
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyPosts = async ({ status, page, limit } = {}) => {
  try {
    const params = {};

    if (status && status !== "all") {
      params.status = status.toLowerCase();
    }

    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axiosInstance.get(API_PATHS.POSTS.GET_MY, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch posts:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const approvePost = async (id) => {
  try {
    const response = await axiosInstance.patch(`/posts/approve/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error approving post:", error);
    throw error;
  }
};
