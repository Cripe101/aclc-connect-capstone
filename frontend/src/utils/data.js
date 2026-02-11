import {
  LuLayoutDashboard,
  LuGalleryVerticalEnd,
  LuMessageSquareQuote,
  LuLayoutTemplate,
  LuTag,
  LuBookA,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },

  {
    id: "02",
    label: "Posts",
    icon: LuGalleryVerticalEnd,
    path: "/admin/posts",
  },

  {
    id: "03",
    label: "Comments",
    icon: LuMessageSquareQuote,
    path: "/admin/comments",
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
    icon: LuTag,
    path: "/courses-offered",
  },

  {
    id: "03",
    label: "Announcements",
    icon: LuTag,
    path: "/announcements",
  },
  // {
  //   id: "04",
  //   label: "Programs",
  //   icon: LuBookA,
  //   path: "/programs",
  // },

  {
    id: "05",
    label: "About",
    icon: LuBookA,
    path: "/about",
  },
];
