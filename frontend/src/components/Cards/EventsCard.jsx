import { useNavigate } from "react-router-dom";

const EventsCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-10">
        {data.map((data) => (
          <section
            key={data._id}
            className="flex flex-col md:flex-row gap-3 border border-blue-50 bg-blue-50 cursor-pointer rounded-lg hover:scale-101 active:scale-99 duration-200"
            onClick={() => navigate("/" + data.slug)}
          >
            <img
              src={data.coverImageUrl}
              alt=""
              className="md:max-w-40 object-fit rounded-lg bg-white"
            />
            <h1 className="flex flex-col gap-3 p-5">
              <p className="font-bold text-blue-800">{data.title}</p>
              <p className="line-clamp-2">{data.content}</p>
            </h1>
          </section>
        ))}
      </section>
    </div>
  );
};

export default EventsCard;
