import { useNavigate } from "react-router-dom";
import MarkdownContent from "../../pages/Blog/components/MarkdownContent";

const AnnouncementsCard = ({ data }) => {
  console.log(data);
  const navigate = useNavigate();
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {data.map((anno) => (
        <section
          key={anno._id}
          className="border border-slate-300 rounded p-3 grid md:grid-cols-[1fr_2fr] gap-3 cursor-pointer hover:scale-[101%] active:scale-[99%] duration-200"
          onClick={() => navigate("/" + anno.slug)}
        >
          <img
            src={
              anno?.coverImageUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ32isJCX6lH9OJwOJvk4Xrt7kF2I06nDqm4Q&s"
            }
            className="border border-slate-400/70 rounded w-full h-60 md:h-48 object-cover"
          />
          <section className="w-full font-display py-1 px-5">
            <h1 className="text-xl font-bold text-red-800">{anno.title}</h1>
            <h1 className="flex gap-2 text-sm font-light">
              <p>Posted on</p>
              <p className="font-medium text-blue-700">
                {new Date(anno.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </h1>
            <h1 className="flex gap-2 text-sm font-light">
              <p>Posted By:</p>
              <p className="font-medium">{anno.author.name}</p>
            </h1>
            <MarkdownContent content={anno.content || ""} />
          </section>
        </section>
      ))}
    </div>
  );
};

export default AnnouncementsCard;
