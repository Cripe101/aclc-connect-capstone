import { useParams, Link, useNavigate } from "react-router-dom";
import BlogLayout from "../Layouts/BlogLayout/BlogLayout.jsx";
import { useEffect } from "react";

const CourseInfo = ({ data }) => {
  const { slug } = useParams();
  const course = data.find((c) => c.slug === slug);
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="py-20 container mx-auto px-4">
        <p className="text-center text-gray-600">Course not found.</p>
        <div className="text-center mt-4">
          <Link to="/courses-offered" className="text-indigo-600">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // ensure we are at the top when opening course details
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <BlogLayout>
      <div className="py-12">
        <div className="mx-5 md:mx-20 bg-white">
          <div className="">
            <img
              src={course.image}
              alt={course.course}
              className="w-full max-h-96 object-cover object-center rounded"
            />
          </div>

          <div className="py-5">
            <h1 className="text-2xl font-bold mb-3">{course.course}</h1>
            <p className="text-gray-700 leading-relaxed mb-4">
              {course.description}
            </p>

            <div className="mt-6">
              <button
                onClick={() => navigate("/courses-offered")}
                className="text-blue-700 font-display active:font-light hover:font-medium hover:cursor-pointer duration-200"
              >
                ← Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default CourseInfo;
