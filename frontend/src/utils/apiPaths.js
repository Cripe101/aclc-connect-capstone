export const BASE_URL = "https://aclc-connect-capstone.onrender.com/api";
// http://localhost:4000
// https://aclc-connect-capstone.onrender.com

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GET_PROFILE: "/auth/profile",
    GET_ALL_USERS: "/auth/users",
    DELETE_USER: (id) => `/auth/users/${id}`,
    UPDATE_USER: (id) => `/auth/users/${id}`,
    CHANGE_PASSWORD: "/auth/change-password",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/auth/upload-image",
  },

  DASHBOARD: {
    GET_DASHBOARD_DATA: "/dashboard-summary",
  },

  AI: {
    GENERATE_BLOG_POST: "/ai/generate",
    GENERATE_BLOG_POST_IDEAS: "/ai/generate-ideas",
    GENERATE_COMMENT_REPLY: "/ai/generate-reply",
    GENERATE_POST_SUMMARY: "/ai/generate-summary",
  },

  POSTS: {
    APPROVE_POST: `/posts/approve`,
    CREATE: "/posts",
    GET_ALL: "/posts",
    GET_MY: "/posts/me",
    GET_TRENDING_POSTS: "/posts/trending",
    GET_BY_SLUG: (slug) => `/posts/slug/${slug}`,
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
    GET_BY_TAG: (tag) => `/posts/tag/${tag}`,
    SEARCH: "/posts/search",
    INCREMENT_VIEW: (id) => `/posts/${id}/view`,
    LIKE: (id) => `/posts/${id}/like`,
  },

  COMMENTS: {
    ADD: (postId) => `/comments/${postId}`,
    GET_ALL: "/comments",
    GET_ALL_BY_POST: (postId) => `/comments/${postId}`,
    DELETE: (commentId) => `/comments/${commentId}`,
  },
};
