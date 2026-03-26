import { useQuery } from "@tanstack/react-query";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { getPosts } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import AnnouncementsCard from "../components/Cards/AnnouncementsCard";
import { useLocation } from "react-router-dom";

const Events = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Scroll to anchor if present in URL hash
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // small timeout to ensure element is rendered
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          50,
        );
      }
    } else {
      // if no hash, optionally scroll to top when navigating to About
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const queryEvents = useQuery({
    queryKey: ["events"],
    queryFn: getPosts,
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(queryEvents?.data?.posts);
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
        <section className="flex justify-between p-1 rounded-lg text-white w-full">
          <h1 className="backdrop-blur-md text-xl text-center px-4 py-2 rounded-lg text-blue-900 font-bold font-sans">
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
        <section>
          {queryEvents.isLoading ? (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="mt-5 animate-pulse p-5 gap-5 grid md:grid-cols-[2fr_3fr] rounded-lg bg-gray-200 dark:bg-gray-500 w-full h-80">
                <section className="bg-gray-200 w-full rounded-lg"></section>
                <section className="p-6 gap-3 bg-gray-200 rounded-lg grid grid-rows-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className=""></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className=""></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                </section>
              </div>
              <div className="mt-5 animate-pulse p-5 gap-5 grid md:grid-cols-[2fr_3fr] rounded-lg bg-gray-200 dark:bg-gray-500 w-full h-80">
                <section className="bg-gray-200 w-full rounded-lg"></section>
                <section className="p-6 gap-3 bg-gray-200 rounded-lg grid grid-rows-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className=""></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className=""></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                  <h1 className="bg-gray-200 dark:bg-gray-500 rounded-full"></h1>
                </section>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div>No Events </div>
          ) : (
            <AnnouncementsCard data={filteredEvents} />
          )}
        </section>
      </div>
    </BlogLayout>
  );
};

export default Events;
