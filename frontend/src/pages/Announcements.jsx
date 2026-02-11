import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogLayout from "../components/Layouts/BlogLayout/BlogLayout";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getPosts } from "../utils/api";
import { Section, SpaceIcon } from "lucide-react";
import AnnouncementsCard from "../components/Cards/AnnouncementsCard";

const Announcements = () => {
  const location = useLocation();
  const [annoData, setAnnoData] = useState();

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

  const sortedAnnouncements = useMemo(() => {
    return [...(annoData || [])]
      .filter((item) =>
        item.tags?.some(
          (tag) =>
            tag.toLowerCase() === "announcement" ||
            tag.toLowerCase() === "announcements",
        ),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [annoData]);

  useEffect(() => {
    getAnnouncements();
    console.log(sortedAnnouncements);
  }, [announcementQuery]);

  return (
    <BlogLayout>
      <div className="p-5 md:p-10 grid md:grid-cols-[4fr_1fr] gap-5">
        {sortedAnnouncements?.length > 0 ? (
          <AnnouncementsCard data={sortedAnnouncements} />
        ) : (
          <div>Data is loading...</div>
        )}

        <span className="border border-slate-300 rounded-sm p-5">
          Promotional Grapics...
        </span>
      </div>
    </BlogLayout>
  );
};

export default Announcements;
