import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLogin from "./pages/Admin/components/AdminLogin";
import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogPostView from "./pages/Blog/BlogPostView";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/components/Dashboard";
import BlogPosts from "./pages/Admin/components/BlogPosts";
import BlogPostEditor from "./pages/Admin/components/BlogPostEditor";
import Comments from "./pages/Admin/components/Comments";
import UserProvider from "./context/userContext";
import AboutPage from "./pages/AboutPage";
import ScrollToTop from "./components/ScrollToTop";
import CoursesPage from "./pages/CoursesPage";
import Announcements from "./pages/Announcements";
import CourseInfo from "./components/coursesOffered/CourseInfo";
import {
  CollegeCourseData,
  SeniorHighCourseData,
  TesdaCourseData,
} from "./utils/courseData";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<BlogLandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route
              path="/courses-offered/college/bachelor/:slug"
              element={<CourseInfo data={CollegeCourseData} />}
            />
            <Route
              path="/courses-offered/senior-high/:slug"
              element={<CourseInfo data={SeniorHighCourseData} />}
            />
            <Route
              path="/courses-offered/college/tesda/:slug"
              element={<CourseInfo data={TesdaCourseData} />}
            />
            <Route path="/tag/:tagName" element={<PostByTags />} />
            <Route path="/search" element={<SearchPosts />} />
            <Route path="/courses-offered" element={<CoursesPage />} />

            {/* Admin Auth Route - Not protected (for login/signup) */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Routes - Protected */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/posts" element={<BlogPosts />} />
              <Route path="/admin/create" element={<BlogPostEditor />} />
              <Route
                path="/admin/edit/:postSlug"
                element={<BlogPostEditor isEdit={true} />}
              />
              <Route path="/admin/comments" element={<Comments />} />
            </Route>

            {/* Blog Post View - Must be last as it uses generic :slug */}
            <Route path="/:slug" element={<BlogPostView />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
