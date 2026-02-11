import Footer from "../../../pages/Blog/components/Footer";
import BlogNavbar from "./BlogNavbar";

const BlogLayout = ({ children, activeMenu }) => {
  return (
    <div className="bg-white">
      <BlogNavbar activeMenu={activeMenu} />

      <div className="">{children}</div>

      <footer className="mt-10 border-t border-t-slate-500/50">
        <Footer />
      </footer>
    </div>
  );
};

export default BlogLayout;
