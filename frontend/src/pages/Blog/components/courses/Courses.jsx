import { useNavigate } from "react-router-dom";
import BlogLayout from "../../../../components/Layouts/BlogLayout/BlogLayout";
const Courses = ({ title, data, side, nav }) => {
  const navigate = useNavigate();
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
              className="bg-white grid md:grid-rows-[3fr_1fr] max-w-[1200px] border border-slate-200 rounded hover:cursor:pointer hover:scale-[101%] active:scale-[99%] hover:cursor-pointer duration-200"
            >
              <img
                src={course.image}
                alt=""
                className="object-cover rounded-t"
              />
              <h1 className="p-4 flex flex-col gap-2 font-display">
                <p>{course.course}</p>
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
