import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import {
  CollegeCourseData,
  SeniorHighCourseData,
  TesdaCourseData,
} from "../utils/courseData";
import Courses from "./Blog/components/courses/Courses";

const CoursesPage = () => {
  return (
    <BlogLayout>
      <div className="">
        <Courses
          title={"College"}
          data={CollegeCourseData}
          side={"Bachelor's"}
          nav={"/courses-offered/college/bachelor/"}
        />
        <Courses
          title={""}
          data={TesdaCourseData}
          side={"TESDA"}
          nav={"/courses-offered/college/tesda/"}
        />
        <Courses
          title={"Senior High"}
          data={SeniorHighCourseData}
          side={"Strand"}
          nav={"/courses-offered/senior-high/"}
        />
        {/* <CollegeCourses /> */}
        {/* <TesdaCourses /> */}
        {/* <SeniorHighStrand /> */}
      </div>
    </BlogLayout>
  );
};

export default CoursesPage;
