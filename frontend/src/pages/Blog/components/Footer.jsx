import { useNavigate } from "react-router-dom";
import logo from "../../../assets/aclc-logo-ormoc.png";
import {
  CollegeCourseData,
  SeniorHighCourseData,
  TesdaCourseData,
} from "../../../utils/courseData";
import CourseFoorterDisplay from "../../../components/Cards/CourseFoorterDisplay";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-blue-900 text-white">
      <span className="p-4 py-10 grid md:grid-cols-2 lg:grid-cols-[1fr_3fr] gap-5">
        <section className="flex flex-col justify-center items-center">
          <img src={logo} alt="ACLC Logo" className="h-40 aspect-sqaure" />
          <h1 className="font-display font-bold">
            ACLC College of Ormoc City, Inc.
          </h1>
          <h1 className="font-display">
            Brgy. Cogon, Lillia Avenue Ormoc City
          </h1>
        </section>
        <section className="">
          <h1 className="font-diplay font-bold text-lg text-center">
            Courses Offered
          </h1>
          <section className="grid lg:grid-cols-3 gap-2">
            <CourseFoorterDisplay
              title={"College"}
              nav={"/courses-offered/bachelors/"}
              data={CollegeCourseData}
            />
            <CourseFoorterDisplay
              title={"TESDA"}
              nav={"/courses-offered/tesda/"}
              data={TesdaCourseData}
            />
            <CourseFoorterDisplay
              title={"Senior High"}
              nav={"/courses-offered/senior-high/"}
              data={SeniorHighCourseData}
            />
          </section>
        </section>
      </span>
      <span className="text-center text-sm py-2 border-t border-t-gray-500/50">
        © {new Date().getFullYear()} ACLC Connect — All rights reserved.
      </span>
    </div>
  );
};

export default Footer;
