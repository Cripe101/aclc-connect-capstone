import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { LuCircleAlert, LuDot } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import CommentReplyInput from "../../components/Inputs/CommentReplyInput";
import toast from "react-hot-toast";
import TrendingPostsSection from "./components/TrendingPostsSection";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import BlogLayout from "../../components/Layouts/BlogLayout/BlogLayout";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownContent from "./components/MarkdownContent";
import SharePost from "./components/SharePost";
import { sanitizeMarkdown } from "../../utils/helper";
import CommentInfo from "./components/CommentInfo";
import Drawer from "../../components/Drawer";
import LikeCommentButton from "./components/LikeCommentButton";

const BlogPostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState(null);

  const { user, setOpenAuthForm } = useContext(UserContext);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get Post Data by Slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug),
      );

      if (response.data) {
        const data = response.data;
        setBlogPostData(data);
        fetchCommentByPostId(data._id);
        incrementViews(data._id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Get Comment by Post Id
  const fetchCommentByPostId = async (postId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(postId),
      );

      if (response.data) {
        const data = response.data;
        setComments(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate Post Summary
  // const generatePostSummary = async () => {
  //   try {
  //     setErrorMsg("");
  //     setSummaryContent(null);

  //     console.log("blogPostData:", blogPostData);
  //     console.log("blogPostData.content:", blogPostData.content);
  //     console.log("Type of content:", typeof blogPostData.content);

  //     setIsLoading(true);
  //     setOpenSummarizeDrawer(true);

  //     const response = await axiosInstance.post(
  //       API_PATHS.AI.GENERATE_POST_SUMMARY,
  //       {
  //         content: blogPostData.content || "",
  //       },
  //     );

  //     if (response.data) {
  //       setSummaryContent(response.data);
  //     }
  //   } catch (error) {
  //     setSummaryContent(null);
  //     setErrorMsg("Failed to generate summary. Try again later.");
  //     console.log("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Increment views
  const incrementViews = async (postId) => {
    if (!postId) return;

    try {
      const response = await axiosInstance.post(
        API_PATHS.POSTS.INCREMENT_VIEW(postId),
      );

      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handles cancel reply
  const handleCancelReply = async () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  // Add Reply
  const handleAddReply = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        API_PATHS.COMMENTS.ADD(blogPostData._id),
        {
          content: replyText,
          parentComment: "",
        },
      );
      toast.success("Replied successfully!");
      setReplyText("");
      setShowReplyForm(false);
      fetchCommentByPostId(blogPostData._id);
      return response.data;
    } catch (error) {
      console.error("Error replying to comment.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  }, [slug]);

  return (
    <BlogLayout>
      {blogPostData ? (
        <div className="p-5 md:p-10 w-full">
          <title>{blogPostData.title}</title>
          <meta name="description" content={blogPostData.title} />
          <meta property="og:title" content={blogPostData.title} />
          <meta property="og:image" content={blogPostData.coverImageUrl} />
          <meta property="og:type" content="article" />

          <div className="grid md:p-2 p-0.5 md:grid-cols-[4fr_1fr] md:gap-10 relative">
            <div className="relative">
              <h1 className="text-lg md:text-3xl w-full justify-center font-extrabold mb-5 text-white bg-blue-800 py-2 md:p-3 pl-5 md:pl-10 rounded-full">
                {blogPostData.title}
              </h1>

              <div className="grid gap-3">
                <section className="flex items-center">
                  <LuDot className="text-xl text-gray-400" />
                  <div className="flex flex-wrap gap-3">
                    {blogPostData.tags.slice(0, 3).map((tag, index) => (
                      <button
                        key={index}
                        className="bg-blue-300/50 text-blue-800 text-xs md:text-sm font-medium px-3 py-1 rounded-full text-nowrap cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tag/${tag}`);
                        }}
                      >
                        # {tag}
                      </button>
                    ))}
                  </div>
                  <LuDot className="text-xl text-gray-400" />
                </section>

                <span className="text-[13px] text-gray-500 font-medium pl-5 mb-2">
                  {moment(blogPostData.updatedAt || "").format("Do MMM YYYY")}
                </span>
              </div>
              <section className="mb-6 flex justify-center">
                {blogPostData.images?.length === 0 && (
                  <img
                    src={blogPostData.coverImageUrl}
                    className="w-full max-w-[400px] rounded-lg object-fill"
                  />
                )}
                {blogPostData.images?.length === 1 && (
                  <img
                    src={blogPostData.images[0]}
                    className="w-full max-h-[400px] object-cover object-top rounded-lg"
                  />
                )}

                {blogPostData.images?.length === 2 && (
                  <div className="grid md:grid-cols-2 gap-2">
                    {blogPostData.images.slice(0, 2).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-full h-[300px] md:h-[400px] border border-slate-300 object-cover object-top rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {blogPostData.images?.length === 3 && (
                  <div className="grid md:grid-cols-2 gap-2">
                    <img
                      src={blogPostData.images[0]}
                      className="w-full h-[400px] object-cover object-top rounded-lg col-span-2"
                    />
                    {blogPostData.images.slice(1, 3).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-full h-[400px] object-cover object-top rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {blogPostData.images?.length >= 4 && (
                  <div className="grid md:grid-cols-2 gap-2">
                    {blogPostData.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          className="w-full h-[400px] object-cover rounded-lg object-top"
                        />

                        {/* Overlay for extra images */}
                        {i === 3 && blogPostData.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xl font-semibold">
                              +{blogPostData.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="grid">
                <MarkdownContent
                  content={sanitizeMarkdown(blogPostData?.content || "")}
                />

                <SharePost title={blogPostData.title} />

                <div className="bg-gray-50 rounded-lg py-2 px-4">
                  <div className="flex items-center justify-between px-3 my-4">
                    <h4 className="text-lg font-semibold">Comments</h4>

                    <button
                      className="flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-blue-500 text-xs font-semibold text-white px-5 py-2 rounded-full hover:to-blue-700 cursor-pointer"
                      onClick={() => {
                        if (!user) {
                          setOpenAuthForm(true);
                          return;
                        }
                        setShowReplyForm(true);
                      }}
                    >
                      Add Comment
                    </button>
                  </div>

                  {showReplyForm && (
                    <div className="bg-white rounded-lg mb-8 p-2">
                      <CommentReplyInput
                        user={user}
                        authorName={user.name}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleAddReply={handleAddReply}
                        handleCancelReply={handleCancelReply}
                        disableAutoGen
                        isLoading={isLoading}
                        type="new"
                      />
                    </div>
                  )}

                  {comments?.length > 0 &&
                    comments.map((comment) => (
                      <CommentInfo
                        key={comment._id}
                        commentId={comment._id || null}
                        authorName={comment.author.name}
                        authorPhoto={comment.author.profileImageUrl}
                        content={comment.content}
                        updatedOn={
                          comment.updatedAt
                            ? moment(comment.updatedAt).format("Do MMM YYYY")
                            : "-"
                        }
                        post={comment.post}
                        replies={comment.replies || []}
                        getAllComments={() =>
                          fetchCommentByPostId(blogPostData._id)
                        }
                        onDelete={(commentId) =>
                          setOpenDeleteAlert({
                            open: true,
                            data: commentId || comment._id,
                          })
                        }
                      />
                    ))}
                </div>
              </div>

              <LikeCommentButton
                postId={blogPostData._id || ""}
                likes={blogPostData.likedBy || []}
                comments={comments?.length || 0}
                onLikesChange={fetchPostDetailsBySlug}
                onClick
              />
            </div>

            <div className="mt-10 md:mt-0">
              <TrendingPostsSection />
            </div>
          </div>

          <Drawer
            isOpen={openSummarizeDrawer}
            onClose={() => setOpenSummarizeDrawer(false)}
            title={!isLoading && summaryContent?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && summaryContent && (
              <MarkdownContent content={summaryContent?.summary || ""} />
            )}
          </Drawer>
        </div>
      ) : (
        <div className="grid p-5 md:grid-cols-[4fr_1fr] md:gap-10">
          <SkeletonLoader />
          <span className="p-5 animate-pulse flex flex-col gap-5">
            <section className="grid grid-cols-[1fr_2fr] bg-gray-200 rounded dark:bg-gray-700 p-2 gap-3">
              <div className="bg-gray-300 rounded-sm h-20"></div>
              <div className="grid gap-3">
                <h1 className="bg-gray-300 w-full h-5 rounded"></h1>
                <h1 className="bg-gray-300 w-full h-2 rounded"></h1>
                <h1 className="bg-gray-300 w-full h-2 rounded"></h1>
              </div>
            </section>
            <section className="grid grid-cols-[1fr_2fr] bg-gray-200 rounded dark:bg-gray-700 p-2 gap-3">
              <div className="bg-gray-300 rounded-sm h-20"></div>
              <div className="grid gap-3">
                <h1 className="bg-gray-300 w-full h-5 rounded"></h1>
                <h1 className="bg-gray-300 w-full h-2 rounded"></h1>
                <h1 className="bg-gray-300 w-full h-2 rounded"></h1>
              </div>
            </section>
            <section className="grid grid-cols-[1fr_2fr] bg-gray-200 rounded dark:bg-gray-700 p-2 gap-3">
              <div className="bg-gray-300 rounded-sm h-20"></div>
              <div className="grid gap-3">
                <h1 className="bg-gray-300 w-full h-5 rounded"></h1>
                <h1 className="bg-gray-300 w-full h-2 rounded"></h1>
                <h1 className="bg-gray-300 w-full h-2 rounded"></h1>
              </div>
            </section>
          </span>
        </div>
      )}
    </BlogLayout>
  );
};

export default BlogPostView;
