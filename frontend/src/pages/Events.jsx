import { useQuery } from "@tanstack/react-query";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { getPosts } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import AnnouncementsCard from "../components/Cards/AnnouncementsCard";

const Events = () => {
  const [search, setSearch] = useState("");

  const queryEvents = useQuery({
    queryKey: ["events"],
    queryFn: getPosts,
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(queryEvents?.data?.posts);
    // console.log(events);
  }, [queryEvents]);

  const filteredEvents = useMemo(() => {
    return [...(events || [])]
      .filter((item) =>
        item.tags?.some(
          (tag) =>
            tag?.toLowerCase() === "events" || tag?.toLowerCase() === "event",
        ),
      )
      .filter((item) => {
        const query = search?.toLowerCase();

        return (
          item.title?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag?.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [events, search]);

  return (
    <BlogLayout>
      <div className="p-5">
        <section className="flex justify-between p-1 rounded-lg text-white w-full sticky top-22">
          <h1 className="bg-blue-50/50 backdrop-blur-md text-center px-4 py-2 rounded-lg text-blue-900 font-bold">
            <p>Events</p>
          </h1>
          <input
            type="text"
            placeholder="Q Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 backdrop-blur-md w-40 md:w-60 outline-none rounded-full px-4 py-2 text-black"
          />
        </section>
        <AnnouncementsCard data={filteredEvents} />
      </div>
    </BlogLayout>
  );
};

export default Events;
