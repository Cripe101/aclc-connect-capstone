import { useQuery } from "@tanstack/react-query";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { getPosts } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import EventsCard from "../components/Cards/EventsCard";

const Events = () => {
  const queryEvents = useQuery({
    queryKey: ["events"],
    queryFn: getPosts,
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(queryEvents?.data?.posts);
    console.log(events);
  }, [queryEvents]);

  const sortedEvents = useMemo(() => {
    return [...(events || [])]
      .filter(
        (item) =>
          !item.tags?.some(
            (tag) =>
              tag.toLowerCase() === "announcement" ||
              tag.toLowerCase() === "announcements",
          ),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [events]);

  return (
    <BlogLayout>
      <EventsCard data={sortedEvents} />
    </BlogLayout>
  );
};

export default Events;
