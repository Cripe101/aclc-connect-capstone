import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { LuCircleAlert, LuCornerUpLeft, LuDot, LuX } from "react-icons/lu";
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
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import AuthModel from "../../components/Auth/AuthModel";

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

  // Add views
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

  const [showPhotos, setShowPhotos] = useState(false);
  const [photo, setPhoto] = useState(1);
  return (
    <div>
      {blogPostData ? (
        <div className="p-5 md:p-10 w-full relative">
          <div
            className={`${showPhotos ? "flex" : "hidden"} justify-center fixed z-50 top-0 left-0 w-screen h-screen bg-slate-50/60 backdrop-blur-md`}
          >
            <button
              onClick={() => {
                setShowPhotos(false);
              }}
              className="absolute right-0 md:right-10 top-5 text-black text-lg font-bold cursor-pointer px-3 py-1 rounded-lg hover:text-red-600 active:scale-90 duration-200"
            >
              <LuX size={30} />
            </button>
            <section className="flex px-3 md:p-10 items-center gap-3">
              {blogPostData.images.length === 0 ? (
                <img
                  src={blogPostData.coverImageUrl}
                  alt="No Photo"
                  className="md:w-full md:h-full rounded-lg"
                />
              ) : (
                <section className="flex md:p-10 items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      photo === 1 ? "" : setPhoto(photo - 1);
                    }}
                    className="md:p-10 active:text-blue-700 rounded-l-lg cursor-pointer duration-200"
                  >
                    <FaArrowLeft size={25} />
                  </button>
                  {blogPostData.images.slice(photo - 1, photo).map((img) => (
                    <img
                      src={img}
                      alt="No Photo"
                      className="w-80 md:w-full max-h-180 rounded-lg"
                    />
                  ))}
                  <button
                    onClick={() => {
                      photo === blogPostData.images.length
                        ? ""
                        : setPhoto(photo + 1);
                    }}
                    className="md:p-10 active:text-blue-700 rounded-r-lg cursor-pointer duration-200"
                  >
                    <FaArrowRight size={25} />
                  </button>
                </section>
              )}
            </section>
          </div>
          <title>{blogPostData.title}</title>
          <meta name="description" content={blogPostData.title} />
          <meta property="og:title" content={blogPostData.title} />
          <meta property="og:image" content={blogPostData.coverImageUrl} />
          <meta property="og:type" content="article" />

          {/* Post Data */}
          <section className="p-2">
            <button
              onClick={() => navigate(-1)}
              className="mb-2 border-2 text-xl shadow-md border-blue-600 px-3 py-1.5 font-bold rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white active:text-white active:bg-blue-600 active:scale-90 duration-150"
            >
              <LuCornerUpLeft size={25} />
            </button>
          </section>
          <div className="grid md:p-2 p-0.5 md:grid-cols-[4fr_1fr] md:gap-10 relative">
            <div className="relative">
              <h1 className="bg-linear-to-r from-blue-800 via-blue-600 to-blue-400 text-xl md:text-3xl w-full justify-center font-extrabold mb-5 text-white py-2 md:p-3 pl-5 md:pl-10 rounded-full">
                {blogPostData.title}
              </h1>

              <div className="grid gap-3">
                <section className="flex items-center">
                  <LuDot className="text-xl text-gray-400" />
                  <div className="flex flex-wrap gap-3">
                    {blogPostData.tags.slice(0, 3).map((tag, index) => (
                      <button
                        key={index}
                        className="bg-sky-200 shadow-sm text-blue-800 text-xs md:text-sm font-bold px-3 py-1 rounded-lg text-nowrap cursor-pointer duration-200"
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
                    onClick={() => setShowPhotos(true)}
                    src={blogPostData.coverImageUrl}
                    className="w-full max-w-[500px] rounded-lg object-cover object-top"
                  />
                )}
                {blogPostData.images?.length === 1 && (
                  <img
                    onClick={() => setShowPhotos(true)}
                    src={blogPostData.images[0]}
                    className="w-full max-w-[500px] object-cover object-top rounded-lg"
                  />
                )}

                {blogPostData.images?.length === 2 && (
                  <div className="grid md:grid-cols-2 gap-2">
                    {blogPostData.images.slice(0, 2).map((img, i) => (
                      <img
                        onClick={() => setShowPhotos(true)}
                        key={i}
                        src={img}
                        className="w-full h-[300px] md:max-w-[500px] object-cover object-top rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {blogPostData.images?.length === 3 && (
                  <div className="grid md:grid-rows-2 gap-2">
                    <img
                      onClick={() => setShowPhotos(true)}
                      src={blogPostData.images[0]}
                      className="w-full max-h-[500px] object-cover object-top rounded-lg"
                    />
                    <section className="grid md:grid-cols-2 gap-2">
                      {blogPostData.images.slice(1, 3).map((img, i) => (
                        <img
                          onClick={() => setShowPhotos(true)}
                          key={i}
                          src={img}
                          className="w-full max-w-[500px] object-cover object-top rounded-lg"
                        />
                      ))}
                    </section>
                  </div>
                )}

                {blogPostData.images?.length >= 4 && (
                  <div className="grid md:grid-cols-2 gap-2">
                    {blogPostData.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          onClick={() => setShowPhotos(true)}
                          src={img}
                          className="w-full max-w-[500px] object-cover rounded-lg object-top"
                        />

                        {/* Overlay for extra images */}
                        {i === 3 && blogPostData.images.length > 4 && (
                          <div
                            onClick={() => setShowPhotos(true)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
                          >
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
              <MarkdownContent
                content={sanitizeMarkdown(blogPostData?.content || "")}
              />

              <div className="grid">
                <SharePost title={blogPostData?.title} />

                <div className="bg-gray-50 rounded-lg py-2">
                  <div className="flex items-center justify-between px-3 my-4">
                    <h4 className="text-lg font-semibold">Comments</h4>

                    <button
                      className="flex items-center justify-center gap-3 bg-blue-700 text-sm font-bold shadow-md text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-blue-800 active:bg-blue-800 active:scale-90 duration-200"
                      onClick={() => {
                        if (!user) {
                          setOpenAuthForm(true);
                          return;
                        }
                        setShowReplyForm(!showReplyForm);
                      }}
                    >
                      Add Comment
                    </button>
                  </div>

                  {showReplyForm && (
                    <div className="bg-white rounded-lg mb-4 p-2">
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

                  <section className="bg-white rounded-lg p-1">
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
                  </section>
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
      <AuthModel />
    </div>
  );
};

export default BlogPostView;
