import { API_PATHS } from "../apiPaths";
import axiosInstance from "../axiosInstance";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_ALL_USERS);

    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};
