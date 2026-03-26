import {
  LuLayoutDashboard,
  LuGalleryVerticalEnd,
  LuMessageSquareQuote,
  LuLayoutTemplate,
  LuBookA,
  LuUser,
  LuCalendar,
  LuBookImage,
  LuBookX,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
    roles: ["offices", "admin"],
  },
  {
    id: "04",
    label: "Users",
    icon: LuUser,
    path: "/admin/users",
    roles: ["admin"],
  },

  {
    id: "02",
    label: "Posts",
    icon: LuGalleryVerticalEnd,
    path: "/admin/posts",
    roles: ["offices", "admin"],
  },
  {
    id: "05",
    label: "Manage Posts",
    icon: LuGalleryVerticalEnd,
    path: "/admin/manage-posts",
    roles: ["admin"],
  },

  {
    id: "03",
    label: "Comments",
    icon: LuMessageSquareQuote,
    path: "/admin/comments",
    roles: ["offices", "admin"],
  },
];

export const BLOG_NAVBAR_DATA = [
  {
    id: "01",
    label: "Home",
    icon: LuLayoutTemplate,
    path: "/",
  },

  {
    id: "02",
    label: "Courses Offered",
    icon: LuBookImage,
    path: "/courses-offered",
  },

  {
    id: "03",
    label: "Announcements",
    icon: LuCalendar,
    path: "/announcements",
  },
  {
    id: "04",
    label: "Events",
    icon: LuBookX,
    path: "/events",
  },

  {
    id: "05",
    label: "About",
    icon: LuBookA,
    path: "/about",
  },
];
