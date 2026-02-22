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
import Announcements from "./pages/Announcements";
import CourseInfo from "./components/coursesOffered/CourseInfo";
import {
  CollegeCourseData,
  SeniorHighCourseData,
  TesdaCourseData,
} from "./utils/courseData";
import Courses from "./pages/Blog/components/courses/Courses";
import Events from "./pages/Events";

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
            <Route path="/events" element={<Events />} />
            <Route
              path="/courses-offered/bachelors/:slug"
              element={<CourseInfo data={CollegeCourseData} />}
            />
            <Route
              path="/courses-offered/seniorhigh/:slug"
              element={<CourseInfo data={SeniorHighCourseData} />}
            />
            <Route
              path="/courses-offered/tesda/:slug"
              element={<CourseInfo data={TesdaCourseData} />}
            />
            <Route path="/tag/:tagName" element={<PostByTags />} />
            <Route path="/search" element={<SearchPosts />} />
            <Route
              path="/courses-offered/bachelors"
              element={
                <Courses
                  title={""}
                  data={CollegeCourseData}
                  side={"Bachelor's"}
                  nav={"/courses-offered/bachelors/"}
                />
              }
            />
            <Route
              path="/courses-offered/tesda"
              element={
                <Courses
                  title={""}
                  data={TesdaCourseData}
                  side={"Tesda"}
                  nav={"/courses-offered/tesda/"}
                />
              }
            />
            <Route
              path="/courses-offered/seniorhigh"
              element={
                <Courses
                  title={""}
                  data={SeniorHighCourseData}
                  side={"Senior High"}
                  nav={"/courses-offered/seniorhigh/"}
                />
              }
            />

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
