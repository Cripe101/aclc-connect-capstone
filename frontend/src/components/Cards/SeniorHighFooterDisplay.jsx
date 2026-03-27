import { useNavigate } from "react-router-dom";

const SeniorHighFooterDisplay = ({ title, data, nav }) => {
  const navigate = useNavigate();

  const acadFilter = data.filter((course) => course.track === "academic track");
  const techFilter = data.filter(
    (course) => course.track === "technical professional",
  );

  return (
    <div>
      <p className="font-display font-semibold">{title}</p>
      <p className="mt-1 font-semibold">Academic Track</p>
      {acadFilter.map((course) => (
        <button
          onClick={() => navigate(nav + course.slug)}
          key={course.slug}
          className="font-display text-start font-light hover:cursor-pointer active:font-extralight hover:font-medium duration-200"
        >
          {course.course}
        </button>
      ))}

      <p className="mt-1 font-semibold">Technical Professional</p>
      {techFilter.map((course) => (
        <button
          onClick={() => navigate(nav + course.slug)}
          key={course.slug}
          className="font-display text-start font-light hover:cursor-pointer active:font-extralight hover:font-medium duration-200"
        >
          {course.course}
        </button>
      ))}
    </div>
  );
};

export default SeniorHighFooterDisplay;
