import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from "react-icons/lu";
import Tabs from "../../../components/Tabs";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import moment from "moment";
import BlogPostSummaryCard from "../../../components/Cards/BlogPostSummaryCard";
import Modal from "../../../components/Modal";
import DeleteAlertContent from "../../../components/DeleteAlertContent";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getMyPosts } from "../../../utils/api";
import { UserContext } from "../../../context/userContext";

const BlogPosts = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const limit = 6;
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all"); // must match backend
  const [tabs, setTabs] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // get all post
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["posts", filterStatus, page, limit],
    queryFn: () =>
      getMyPosts({
        status: filterStatus,
        page,
        limit,
      }),
    keepPreviousData: true,
  });

  const posts = data?.posts || [];
  // const counts = data?.counts || {};
  const totalPages = Math.ceil((data?.totalCount || 0) / limit);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postId));

      toast.success("Post deleted successfully");
      setOpenDeleteAlert({ open: false, data: null });

      refetch();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (data?.counts) {
      const newTabs = [
        { label: "All", count: data.counts.all || 0 },
        { label: "Approved", count: data.counts.approved || 0 },
        { label: "Rejected", count: data.counts.rejected || 0 },
        { label: "Pending", count: data.counts.pending || 0 },
      ];

      // Only update if tabs actually changed
      setTabs((prevTabs) => {
        const isSame =
          prevTabs.length === newTabs.length &&
          prevTabs.every((t, i) => t.count === newTabs[i].count);
        return isSame ? prevTabs : newTabs;
      });
    }
  }, [data?.counts]); // track counts safely

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPosts = posts.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Posts">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-3">My Posts</h2>

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

        <div className="mt-3">
          {posts?.length === 0 ? (
            <div className="flex justify-center mt-20">
              <h1>No Posts Available</h1>
            </div>
          ) : (
            <section className="grid md:grid-cols-2 gap-2">
              {paginatedPosts?.map((post) => (
                <BlogPostSummaryCard
                  key={post._id}
                  title={post.title}
                  imgUrl={
                    post?.coverImageUrl === ""
                      ? post?.images[0]
                      : post?.coverImageUrl
                  }
                  createdAt={
                    post.createdAt
                      ? moment(post?.createdAt).format("Do MMM YYYY, h:mm A")
                      : ""
                  }
                  updatedOn={
                    post.updatedAt
                      ? moment(post?.updatedAt).format("Do MMM YYYY, h:mm A")
                      : ""
                  }
                  isLoading={isLoading}
                  role={user.role}
                  status={post.status}
                  tags={post.tags}
                  likes={post.likedBy?.length || 0}
                  views={post.views}
                  onClick={() => navigate(`/admin/edit/${post.slug}`)}
                />
              ))}
            </section>
          )}

          {posts?.length > limit && (
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
