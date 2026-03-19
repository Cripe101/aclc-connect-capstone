import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getPosts } from "../utils/api";
import { Section, SpaceIcon } from "lucide-react";
import AnnouncementsCard from "../components/Cards/AnnouncementsCard";

const Announcements = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [annoData, setAnnoData] = useState("");

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
        const query = search?.toLowerCase();

        return (
          item.title?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag?.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [annoData, search]);

  useEffect(() => {
    getAnnouncements();
    console.log(announcementQuery.data);
    console.log(annoData);
  }, [announcementQuery]);

  return (
    <BlogLayout>
      <div className="p-5 grid">
        <section className="flex justify-between p-1 rounded-lg text-white w-full sticky top-22">
          <h1 className=" bg-blue-50/50 backdrop-blur-md text-center px-4 py-2 rounded-lg text-blue-900 font-bold">
            <p className="">Announcements</p>
          </h1>
          <input
            type="text"
            placeholder="Q Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 w-40 md:w-60 outline-none rounded-full px-4 py-2 text-black backdrop-blur-md"
          />
        </section>
        <section>
          {filteredAnnouncements?.length > 0 ? (
            <AnnouncementsCard data={filteredAnnouncements} />
          ) : (
            <div>No Announcement</div>
          )}
        </section>

        {/* <span className="border border-slate-300 rounded-sm p-5">
          Promotional Grapics...
        </span> */}
      </div>
    </BlogLayout>
  );
};

export default Announcements;
