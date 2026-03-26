import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../utils/api";
import AnnouncementsCard from "../components/Cards/AnnouncementsCard";

const Announcements = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [annoData, setAnnoData] = useState("");
  const [memo, setMemo] = useState("");

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

  const announcementQuery = useQuery({
    queryKey: ["announcements"],
    queryFn: getPosts,
  });

  const getAnnouncements = () => {
    announcementQuery.data
      ? setAnnoData(announcementQuery.data.posts)
      : "No data";
  };

  const filteredAnnouncements = useMemo(() => {
    return [...(annoData || [])]
      .filter((item) =>
        item?.tags?.some(
          (tag) =>
            tag?.toLowerCase() === "announcement" ||
            tag?.toLowerCase() === "announcements",
        ),
      )
      .filter((item) => {
        if (!memo) return true;

        const query = memo.toLowerCase();

        return item.tags?.some((tag) => tag?.toLowerCase().includes(query));
      })
      .filter((item) => {
        const query = search?.toLowerCase();

        return (
          item.title?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag?.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [annoData, search, memo]);

  useEffect(() => {
    getAnnouncements();
  }, [announcementQuery]);

  return (
    <BlogLayout>
      <div className="p-5 grid">
        <section className="flex justify-between p-1 rounded-lg text-white w-full sticky top-22 z-20">
          <h1 className=" bg-blue-50/50 backdrop-blur-md text-center px-4 py-2 rounded-lg text-blue-900 font-bold">
            <p className="">Announcements</p>
          </h1>
          <section className="flex gap-2 text-black">
            <select
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="rounded-full border-gray-300 px-2 outline-none border"
            >
              <option value="">Select...</option>
              <option value="memorandum">Memorandum</option>
              <option value="college">College</option>
              <option value="seniorhig">Senior High</option>
            </select>
            <input
              type="text"
              placeholder="Q Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 w-40 md:w-60 outline-none rounded-full px-4 py-2 text-black backdrop-blur-md"
            />
          </section>
        </section>
        <section>
          {announcementQuery.isLoading ? (
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
          ) : filteredAnnouncements?.length > 0 ? (
            <AnnouncementsCard data={filteredAnnouncements} />
          ) : (
            <div className="flex justify-center mt-10">
              <h1>No Announcement</h1>
            </div>
          )}
          {}
        </section>

        {/* <span className="border border-slate-300 rounded-sm p-5">
          Promotional Grapics...
        </span> */}
      </div>
    </BlogLayout>
  );
};

export default Announcements;
