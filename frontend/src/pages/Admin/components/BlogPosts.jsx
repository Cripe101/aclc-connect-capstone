import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from "react-icons/lu";
import Tabs from "../../../components/Tabs";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import moment from "moment";
import BlogPostSummaryCard from "../../../components/Cards/BlogPostSummaryCard";
import Modal from "../../../components/Modal";
import DeleteAlertContent from "../../../components/DeleteAlertContent";
import toast from "react-hot-toast";

const BlogPosts = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [blogPostList, setBlogPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(blogPostList.length / limit);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // Fetch all posts
  const getAllPosts = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: filterStatus.toLowerCase(),
          page,
          limit,
        },
      });

      const { posts, counts } = response.data;

      setBlogPostList(posts);

      const statusSummary = counts || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Published", count: statusSummary.published || 0 },
        { label: "Draft", count: statusSummary.draft || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postId));

      toast.success("Post deleted successfully");
      setOpenDeleteAlert({ open: false, data: null });
      getAllPosts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setPage(1);
    getAllPosts();

    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Posts">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">My Posts</h2>

          <button
            className="flex items-center gap-2 bg-blue-700 cursor-pointer text-white font-medium py-2 border px-4 rounded-lg hover:border-blue-700 hover:bg-white hover:text-blue-700 hover:font-extrabold active:scale-95 duration-200"
            onClick={() => navigate("/admin/create")}
          >
            <LuPlus />
            <h1 className="flex gap-1">
              <p className="hidden md:block">Create</p>
              <p>Post</p>
            </h1>
          </button>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={filterStatus}
          setActiveTab={setFilterStatus}
        />

        <div className="mt-5">
          <section className="grid grid-cols-1 gap-2">
            {blogPostList
              .slice((page - 1) * limit, page * limit)
              .map((post) => (
                <BlogPostSummaryCard
                  key={post._id}
                  title={post.title}
                  imgUrl={
                    post?.coverImageUrl === ""
                      ? post?.images[0]
                      : post?.coverImageUrl
                  }
                  updatedOn={
                    post.updatedAt
                      ? moment(post.updatedAt).format("Do MMM YYYY")
                      : "-"
                  }
                  tags={post.tags}
                  likes={post.likedBy?.length || 0}
                  views={post.views}
                  onClick={() => navigate(`/admin/edit/${post.slug}`)}
                  onDelete={() =>
                    setOpenDeleteAlert({ open: true, data: post._id })
                  }
                />
              ))}
          </section>

          {blogPostList.length > 0 && (
            <div className="flex justify-center gap-2 mt-8 mb-10 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`py-1 rounded-lg duration-200 ${
                      page === pageNumber
                        ? "bg-blue-700 text-white px-3.5"
                        : "bg-white hover:bg-blue-100 px-2"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[70vw] md:w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this post?"
            onDelete={() => deletePost(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPosts;
