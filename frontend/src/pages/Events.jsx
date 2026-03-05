import { useQuery } from "@tanstack/react-query";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { getPosts } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import EventsCard from "../components/Cards/EventsCard";

const Events = () => {
  const [search, setSearch] = useState();

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
            tag.toLowerCase() === "events" || tag.toLowerCase() === "event",
        ),
      )
      .filter((item) => {
        const query = search.toLowerCase();

        return (
          item.title?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [events, search]);

  return (
    <BlogLayout>
      <div className="p-5">
        <section className="flex justify-between bg-blue-900 p-3 rounded-lg text-white sticky w-full">
          <h1 className="text-lg font-bold">Events</h1>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white w-40 md:w-60 outline-none rounded-lg px-2 py-1 text-black"
          />
        </section>
        <EventsCard data={filteredEvents} />
      </div>
    </BlogLayout>
  );
};

export default Events;
