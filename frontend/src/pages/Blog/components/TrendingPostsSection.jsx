import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const TrendingPostsSection = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);

  // Fetch trending posts
  const getTrendingPosts = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_TRENDING_POSTS,
      );

      setPostList(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    getTrendingPosts();
    console.log(postList);
    return () => {};
  }, []);

  return (
    <div>
      <h4 className="text-base text-black font-medium mb-3">Recent Posts</h4>

      {postList.length > 0 ? (
        postList
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item) => (
            <PostCard
              key={item._id}
              title={item.title}
              coverImageUrl={item.coverImageUrl}
              tags={item.tags}
              onClick={() => handleClick(item)}
            />
          ))
      ) : (
        <div className="w-full h-full animate-pulse">
          <section className="p-2 grid grid-cols-[1fr_2fr] gap-3 bg-gray-200 dark:bg-gray-500 h-20 rounded-lg">
            <h1 className="bg-gray-200 rounded-lg"></h1>
            <h1 className="grid grid-rows-[1fr_1fr_1fr_1fr] gap-1">
              <p className="bg-gray-200 rounded-full"></p>
              <p className=""></p>
              <p className="bg-gray-200 rounded-full"></p>
              <p className="bg-gray-200 rounded-full"></p>
            </h1>
          </section>
        </div>
      )}
    </div>
  );
};

export default TrendingPostsSection;

const PostCard = ({ title, coverImageUrl, tags, onClick }) => {
  return (
    <div className="cursor-pointer mb-3" onClick={onClick}>
      <h6 className="text-[10px] font-semibold text-sky-500">
        {(tags[0] || "POST").toUpperCase()}
      </h6>

      <div className="flex items-start gap-4 mt-2">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-14 h-14 object-cover rounded"
        />

        <h2 className="text-sm md:text-sm font-medium mb-2 line-clamp-3">
          {title}
        </h2>
      </div>
    </div>
  );
};
