import { useContext, useEffect, useState } from "react";
import { LuDot, LuX } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import moment from "moment";
import MarkdownContent from "./MarkdownContent";
import { sanitizeMarkdown } from "../../../utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdApproval, MdCancel } from "react-icons/md";
import { approvePost, rejectPost } from "../../../utils/api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const PostPreview = () => {
  const { slug } = useParams();
  const { user, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();
  const [blogPostData, setBlogPostData] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [photo, setPhoto] = useState(1);
  const queryClient = useQueryClient();
  // Get Post Data by Slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug),
      );

      if (response.data) {
        const data = response.data;
        setBlogPostData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const approveMutation = useMutation({
    mutationFn: (postId) => approvePost(postId),
    onSuccess: () => {
      toast.success("Post approved successfully");
      navigate(-1);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve post");
      console.error(error);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (postId) => rejectPost(postId),
    onSuccess: () => {
      toast.success("Post rejected");
      navigate(-1);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject post");
      console.error(error);
    },
  });

  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  }, [slug]);

  return (
    <div className="flex flex-col gap-5 p-5 md:px-80 relative">
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
        <section className="flex px-3 md:p-10 items-center">
          {blogPostData?.images?.length === 0 ? (
            <img
              src={blogPostData?.coverImageUrl}
              alt="No Photo"
              className="md:w-full md:h-full rounded-lg"
            />
          ) : (
            <section className="flex md:p-10 items-center justify-center md:gap-3">
              <button
                disabled={
                  blogPostData?.images?.length -
                    blogPostData?.images?.length ===
                  photo - 1
                }
                onClick={() => {
                  photo === 1 ? "" : setPhoto(photo - 1);
                }}
                className="md:p-10 active:text-blue-700 rounded-l-lg disabled:opacity-50 cursor-pointer duration-200"
              >
                <FaArrowLeft size={25} />
              </button>
              {blogPostData?.images?.slice(photo - 1, photo).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="No Photo"
                  className="w-80 md:w-full max-h-180 rounded-lg"
                />
              ))}
              <button
                disabled={blogPostData?.images?.length === photo}
                onClick={() => {
                  photo === blogPostData?.images?.length
                    ? ""
                    : setPhoto(photo + 1);
                }}
                className="md:p-10 disabled:opacity-50 active:text-blue-700 rounded-r-lg cursor-pointer duration-200"
              >
                <FaArrowRight size={25} />
              </button>
            </section>
          )}
        </section>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="border border-blue-800 rounded-lg hover:bg-blue-800 active:scale-90 hover:text-white text-blue-800 cursor-pointer px-2 py-1 duration-200"
        >
          Go Back
        </button>
        {blogPostData?.status === "pending" ? (
          <section className="flex gap-3 flex-wrap">
            <button
              className="flex text-xs bg-green-50 py-1 px-2.5 rounded-lg text-green-600 font-medium border border-green-600 flex-row items-center gap-1 hover:bg-green-700 hover:text-white group-hover:flex cursor-pointer duration-200"
              onClick={(e) => {
                e.stopPropagation();
                approveMutation.mutate(blogPostData?._id);
              }}
            >
              <MdApproval size={15} />
              <span className="hidden md:block">Approve</span>
            </button>
            <button
              className="flex text-xs bg-red-50 py-1 px-2.5 rounded-lg text-red-600 font-medium border border-red-600 flex-row items-center gap-1 hover:bg-red-700 hover:text-white group-hover:flex cursor-pointer duration-200"
              onClick={(e) => {
                e.stopPropagation();
                rejectMutation.mutate(blogPostData._id);
              }}
            >
              <MdCancel size={15} />
              <span className="hidden md:block">Reject</span>
            </button>
          </section>
        ) : (
          ""
        )}
      </div>
      <div className="relative">
        <h1 className="text-lg md:text-3xl w-full justify-center font-extrabold mb-5 text-white bg-blue-800 py-2 md:p-3 pl-5 md:pl-10 rounded-full">
          {blogPostData?.title}
        </h1>

        <div className="grid gap-3">
          <section className="flex items-center">
            <LuDot className="text-xl text-gray-400" />
            <div className="flex flex-wrap gap-3">
              {blogPostData?.tags.slice(0, 3).map((tag, index) => (
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
            {moment(blogPostData?.updatedAt || "").format("Do MMM YYYY")}
          </span>
        </div>
        <section className="mb-6 flex justify-center">
          {blogPostData?.images?.length === 0 && (
            <img
              onClick={() => setShowPhotos(true)}
              src={blogPostData?.coverImageUrl}
              className="w-full max-w-[400px] rounded-lg object-fill"
            />
          )}
          {blogPostData?.images?.length === 1 && (
            <img
              onClick={() => setShowPhotos(true)}
              src={blogPostData?.images[0]}
              className="w-full max-h-[400px] object-cover object-top rounded-lg"
            />
          )}

          {blogPostData?.images?.length === 2 && (
            <div className="grid md:grid-cols-2 gap-2">
              {blogPostData?.images.slice(0, 2).map((img, i) => (
                <img
                  onClick={() => setShowPhotos(true)}
                  key={i}
                  src={img}
                  className="w-full h-[300px] md:h-[400px] border border-slate-300 object-cover object-top rounded-lg"
                />
              ))}
            </div>
          )}

          {blogPostData?.images?.length === 3 && (
            <div className="grid md:grid-cols-2 gap-2">
              <img
                onClick={() => setShowPhotos(true)}
                src={blogPostData?.images[0]}
                className="w-full h-[400px] object-cover object-top rounded-lg col-span-2"
              />
              {blogPostData?.images.slice(1, 3).map((img, i) => (
                <img
                  onClick={() => setShowPhotos(true)}
                  key={i}
                  src={img}
                  className="w-full h-[400px] object-cover object-top rounded-lg"
                />
              ))}
            </div>
          )}

          {blogPostData?.images?.length >= 4 && (
            <div className="grid md:grid-cols-2 gap-2">
              {blogPostData?.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative">
                  <img
                    onClick={() => setShowPhotos(true)}
                    src={img}
                    className="w-full h-[400px] object-cover rounded-lg object-top"
                  />

                  {/* Overlay for extra images */}
                  {i === 3 && blogPostData?.images.length > 4 && (
                    <div
                      onClick={() => setShowPhotos(true)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
                    >
                      <span className="text-white text-xl font-semibold">
                        +{blogPostData?.images.length - 4}
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
      </div>
    </div>
  );
};

export default PostPreview;
