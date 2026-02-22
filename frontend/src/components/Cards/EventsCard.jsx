import { useNavigate } from "react-router-dom";

const EventsCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="p-10">
      <section className="grid grid-cols-2 gap-3 p-1">
        {data.map((data) => (
          <section
            key={data._id}
            className="p-3 grid grid-cols-[1fr_5fr] gap-3 group cursor-pointer"
            onClick={() => navigate("/" + data.slug)}
          >
            <img
              src={data.coverImageUrl}
              alt=""
              className="w-full aspect-square object-fit rounded-lg"
            />
            <h1 className="flex flex-col gap-3 group-hover:text-blue-700 duration-200">
              <p>{data.title}</p>
              <p className="line-clamp-2">{data.content}</p>
            </h1>
          </section>
        ))}
      </section>
    </div>
  );
};

export default EventsCard;
