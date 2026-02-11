import { useNavigate } from "react-router-dom";

const CourseFoorterDisplay = ({ title, data, nav }) => {
  const navigate = useNavigate();
  return (
    <div>
      <p className="font-display font-semibold">{title}</p>
      {data.map((course) => (
        <button
          onClick={() => navigate(nav + course.slug)}
          key={course.slug}
          className="font-display text-justify font-light hover:cursor-pointer active:font-extralight hover:font-medium duration-200"
        >
          {course.course}
        </button>
      ))}
    </div>
  );
};

export default CourseFoorterDisplay;
