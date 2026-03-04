import Footer from "../../../pages/Blog/components/Footer";
import BlogNavbar from "./BlogNavbar";

const BlogLayout = ({ children, activeMenu }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <BlogNavbar activeMenu={activeMenu} />

      <div className="flex-1">{children}</div>

      <footer className="mt-5 border-t border-t-slate-500/50">
        <Footer />
      </footer>
    </div>
  );
};

export default BlogLayout;
