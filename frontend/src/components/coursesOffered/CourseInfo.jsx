import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import BlogLayout from "../Layouts/BlogLayout/BlogLayout.jsx";
import { useEffect } from "react";
import AdmisionRequirements from "./AdmisionRequirements.jsx";

const CourseInfo = ({ data }) => {
  const { slug } = useParams();
  const course = data.find((c) => c.slug === slug);

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

  const location = useLocation();

  useEffect(() => {
    // Scroll to anchor if present in URL hash
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // small timeout to ensure element is rendered
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          50,
        );
      }
    } else {
      // if no hash, optionally scroll to top when navigating to About
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <BlogLayout>
      <div className="md:p-20">
        <div className="mx-5 md:mx-20 bg-white">
          <div className="">
            <img
              src={course.image}
              alt={course.course}
              className="w-full max-h-150 object-top object-scale-down rounded"
            />
          </div>

          <div className="py-5 md:px-10">
            <h1 className="text-2xl font-bold mb-3">{course.course}</h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {course.description}
            </p>
          </div>
          {course.skillsToLearn?.length > 0 ||
          course.careerOpportunities?.length > 0 ? (
            <div className="md:p-10 grid md:grid-cols-2 gap-5 mb-5">
              <section className="border p-5 rounded-lg border-slate-300">
                <h1 className="font-bold text-2xl">Skills To Learn :</h1>
                <h1 className="flex flex-col gap-2 mt-3 text-lg">
                  {course.skillsToLearn?.map((skill, index) => (
                    <ol key={index}>
                      <li>{skill}</li>
                    </ol>
                  ))}
                </h1>
              </section>
              <section className="border p-5 rounded-lg border-slate-300">
                <h1 className="font-bold text-2xl">Career Oppotunities :</h1>
                <h1 className="flex flex-col gap-2 mt-3 text-lg">
                  {course.careerOpportunities?.map((career, index) => (
                    <ol key={index}>
                      <li>{career}</li>
                    </ol>
                  ))}
                </h1>
              </section>
            </div>
          ) : (
            ""
          )}

          <section className="md:mx-10 flex justify-center">
            <AdmisionRequirements />
          </section>
        </div>
      </div>
    </BlogLayout>
  );
};

export default CourseInfo;
