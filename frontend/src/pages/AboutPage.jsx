import React, { useEffect } from "react";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import History from "../components/InfoHub/History";
import Mission from "../components/InfoHub/Mission";
import Vision from "../components/InfoHub/Vision";
import {
  SeniorHighCourseData,
  CollegeCourseData,
} from "../utils/courseData.js";
import { Link, useLocation } from "react-router-dom";

const AboutPage = () => {
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
      <div className="py-12">
        <header className="mb-12 mx-6">
          <h1 className="text-3xl text-center md:text-4xl font-extrabold text-gray-800">
            About ACLC
          </h1>
          <p className="mt-3 text-gray-600 text-justify max-w-2xl mx-auto">
            Learn about our history, mission, and vision — and discover the
            courses we offer for Senior High and beyond.
          </p>
        </header>

        <section className="">
          <div className="">
            <Vision />
          </div>

          <div className="">
            <Mission />
          </div>
          {/* 
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">History</h3>
              <p className="text-gray-600 mb-4">
                A short introduction to our history. Scroll below for the full
                story and leadership highlights.
              </p>
              <a href="#history" className="text-indigo-600 font-medium">
                Read full history →
              </a>
            </div>
          </div> */}
        </section>

        <section id="history" className="mb-5">
          <History />
        </section>

        {/* <section id="courses-college" className="mb-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Courses — College
            </h2>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {CollegeCourseData.map((c, idx) => (
                <Link
                  key={c.slug || `college-${idx}`}
                  to={`/courses/college/${c.slug}`}
                  className="group block"
                >
                  <div className="rounded-lg shadow-sm overflow-hidden transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300 h-full bg-white">
                    <div className="relative">
                      <img
                        src={c.image}
                        alt={c.course}
                        className="w-full h-36 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4">
                      <h4 className="text-gray-800 font-semibold text-sm sm:text-base">
                        {c.course}
                      </h4>
                      <div className="mt-3 flex justify-end">
                        <span className="inline-block bg-indigo-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full">
                          View details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section id="courses-senior-high" className="mb-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Courses — Senior High</h2>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {SeniorHighCourseData.map((c, idx) => (
                <Link key={c.slug || idx} to={`/courses/senior-high/${c.slug}`} className="group block">
                  <div className="rounded-lg shadow-sm overflow-hidden transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300 h-full bg-white">
                    <div className="relative">
                      <img
                        src={c.image}
                        alt={c.course}
                        className="w-full h-36 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4">
                      <h4 className="text-gray-800 font-semibold text-sm sm:text-base">{c.course}</h4>
                      <div className="mt-3 flex justify-end">
                        <span className="inline-block bg-indigo-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full">View details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}
      </div>
    </BlogLayout>
  );
};

export default AboutPage;
