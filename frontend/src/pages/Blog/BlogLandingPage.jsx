import { useEffect, useMemo, useState } from "react";
import BlogLayout from "../../components/Layouts/BlogLayout/BlogLayout";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { LuGalleryVerticalEnd, LuLoaderCircle } from "react-icons/lu";
import FeaturedPosts from "./components/FeaturedPosts";
import BlogPostSummary from "./components/BlogPostSummary";
import TrendingPostsSection from "./components/TrendingPostsSection";
import logo from "../../assets/aclc-logo-text.png";
// import aclcVid from "../../assets/aclc-vid.mp4";
import { getPosts } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";

const BlogLandingPage = () => {
  const navigate = useNavigate();

  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch paginated post
  // const getAllPosts = async (pageNumber = 1) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
  //       params: {
  //         status: "published",
  //         page: pageNumber,
  //       },
  //     });

  //     const { posts, totalPages } = response.data;
  //     // console.log(response.data);
  //     setBlogPostList((prevPosts) =>
  //       pageNumber === 1 ? posts : [...prevPosts, ...posts],
  //     );
  //     setTotalPages(totalPages);
  //     setPage(pageNumber);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Load more posts
  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };
  // console.log(blogPostList);

  const queryGetPosts = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // Initial Load
  useEffect(() => {
    // getAllPosts(1);
    setBlogPostList(queryGetPosts?.data?.posts);
    // console.log(sortedPosts);
    // console.log("rendered");
  }, [queryGetPosts]);

  const sortedPosts = useMemo(() => {
    return [...(blogPostList || [])]
      .filter(
        (item) =>
          !item.tags?.some(
            (tag) =>
              tag.toLowerCase() === "announcement" ||
              tag.toLowerCase() === "announcements",
          ),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [blogPostList]);

  return (
    <BlogLayout>
      <div className="md:mb-5 grid justify-center lg:grid-cols-[1fr_1fr_3fr] gap-3 py-10 px-5 lg:px-20 bg-blue-900">
        <img src={logo} alt="" className="w-60 p-2 bg-white rounded-lg" />
        <p className="text-white text-justify font-serif w-60">
          {" "}
          ACLC College of Ormoc is a member of the AMA Education System.
        </p>
      </div>
      {/* <div className="flex md:px-5 justify-center">
        <video
          src={aclcVid}
          autoPlay={true}
          loop={true}
          className="mt-10 bg-blue-800"
        ></video>
      </div> */}
      <div className="grid md:grid-cols-[5fr_1fr] gap-5 p-5">
        <div className="grid grid-cols-1 p-5">
          {sortedPosts?.length > 0 ? (
            <FeaturedPosts
              title={sortedPosts[0]?.title}
              coverImageUrl={sortedPosts[0]?.coverImageUrl}
              description={sortedPosts[0]?.content}
              tags={sortedPosts[0]?.tags}
              updatedOn={
                sortedPosts[0]?.updatedAt
                  ? moment(sortedPosts[0]?.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              authorName={sortedPosts[0]?.author?.name || "Unknown"}
              authProfileImg={sortedPosts[0]?.author?.profileImageUrl || ""}
              onClick={() => handleClick(sortedPosts[0])}
            />
          ) : (
            <div className="animate-pulse p-5 gap-5 grid grid-cols-[2fr_3fr] rounded-lg bg-gray-200 dark:bg-gray-500 w-full h-96">
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
          )}
          {sortedPosts?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {sortedPosts
                .slice(1)
                .slice(0, 4)
                .map((item) => (
                  <BlogPostSummary
                    key={item._id}
                    title={item.title}
                    coverImageUrl={item.coverImageUrl}
                    description={item.content}
                    tags={item.tags}
                    updatedOn={
                      item.updatedAt
                        ? moment(item.updatedAt).format("Do MMM YYYY")
                        : "-"
                    }
                    authorName={item.author?.name || "Unknown"}
                    authProfileImg={item.author?.profileImageUrl || ""}
                    onClick={() => handleClick(item)}
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 mt-8">
              <span className="animate-pulse grid grid-cols-[1fr_2fr] gap-3 p-3 w-full bg-gray-200 dark:bg-gray-500 rounded-lg h-60">
                <section className="bg-gray-200 rounded-lg"></section>
                <section className="grid grid-rows-[2fr_1fr_1fr_1fr_1fr_1fr] gap-3">
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className=""></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                </section>
              </span>
              <span className="animate-pulse grid grid-cols-[1fr_2fr] gap-3 p-3 w-full bg-gray-200 dark:bg-gray-500 rounded-lg h-60">
                <section className="bg-gray-200 rounded-lg"></section>
                <section className="grid grid-rows-[2fr_1fr_1fr_1fr_1fr_1fr] gap-3">
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className=""></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                  <p className="rounded-full bg-gray-200 w-full"></p>
                </section>
              </span>
            </div>
          )}
          {page < totalPages && (
            <div className="flex items-center justify-center mt-5">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 mt-6 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                disabled={isLoading}
                onClick={handleLoadMore}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}{" "}
                {isLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
        <div className="">
          <TrendingPostsSection />
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
