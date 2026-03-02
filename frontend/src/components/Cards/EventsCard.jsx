import { useNavigate } from "react-router-dom";

const EventsCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="p-10">
      <section className="grid grid-cols-2 gap-5 p-5">
        {data.map((data) => (
          <section
            key={data._id}
            className="grid grid-cols-[1fr_5fr] gap-3 cursor-pointer bg-blue-50 rounded-lg hover:scale-[101%] active:scale-[99%] duration-200"
            onClick={() => navigate("/" + data.slug)}
          >
            <img
              src={data.coverImageUrl}
              alt=""
              className="w-full aspect-square object-fit rounded-l-lg border border-blue-50 bg-white"
            />
            <h1 className="flex flex-col gap-3 p-2">
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
