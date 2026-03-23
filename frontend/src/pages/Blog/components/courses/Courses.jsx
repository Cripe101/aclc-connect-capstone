import { useLocation, useNavigate } from "react-router-dom";
import BlogLayout from "../../../../components/Layouts/BlogLayout/BlogLayout";
import { useEffect } from "react";
const Courses = ({ title, data, side, nav }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          50,
        );
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);
  return (
    <BlogLayout>
      <div className="p-10 grid justify-center">
        <h1 className="mb-5 font-display font-bold text-xl text-start">
          {title}
        </h1>
        <h1 className="mb-2 font-display font-semibold text-lg text-start">
          {" "}
          {side}
        </h1>
        <span className="grid md:grid-cols-3 gap-10 md:gap-5">
          {data.slice(0, 6).map((course) => (
            <section
              onClick={() => navigate(nav + course.slug)}
              key={course.course}
              className="grid md:grid-rows-[3fr_1fr] md:w-[400px] max-w-[1200px] bg-blue-50 rounded-lg hover:cursor:pointer hover:scale-[101%] active:scale-[99%] hover:cursor-pointer duration-200"
            >
              <img
                src={course.image}
                alt=""
                className="max-h-60 w-full object-cover object-top rounded-t"
              />
              <h1 className="p-4 flex flex-col gap-2 font-display">
                <p className="font-medium">{course.course}</p>
                <p className="text-xs font-semibold text-blue-950">
                  Click for more details
                </p>
              </h1>
            </section>
          ))}
        </span>
      </div>
    </BlogLayout>
  );
};

export default Courses;
