import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../utils/api";
import AnnouncementsCard from "../components/Cards/AnnouncementsCard";
import { UserContext } from "../context/userContext";

const Announcements = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [annoData, setAnnoData] = useState("");
  const [memo, setMemo] = useState("");
  const { user } = useContext(UserContext);

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
    const fac = user?.role?.toLowerCase() === "faculty";

    return [...(annoData || [])]
      .filter((item) => {
        const tags = item?.tags?.map((tag) => tag?.toLowerCase()) || [];
        const isFacultyPost = tags.includes("faculty");

        // Block faculty posts if not faculty
        if (!fac && isFacultyPost) return false;

        // Allow announcements
        return (
          tags.includes("announcement") ||
          tags.includes("announcements") ||
          (fac && isFacultyPost)
        );
      })
      .filter((item) => {
        if (!memo) return true;

        const query = memo.toLowerCase();

        return item.tags?.some((tag) => tag?.toLowerCase().includes(query));
      })
      .filter((item) => {
        if (!search) return true;

        const query = search.toLowerCase();

        return (
          item.title?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag?.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [annoData, search, memo, user]);

  useEffect(() => {
    getAnnouncements();
  }, [announcementQuery]);

  return (
    <BlogLayout>
      <div className="p-2 md:p-5 grid">
        <section className="flex flex-col md:flex-row justify-between items-center p-1 rounded-lg text-white w-full">
          <h1 className=" backdrop-blur-md text-xl text-center md:px-4 py-2 rounded-lg text-black font-bold font-sans">
            <p className="text-center md:text-start">Announcements</p>
          </h1>
          <section className="flex justify-center gap-2 text-black">
            <select
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="rounded-full border-gray-300 px-2 py-2 outline-none border"
            >
              <option value="">All</option>
              <option value="faculty">Faculty</option>
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
