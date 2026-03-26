import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { approvePost, getAllPosts, rejectPost } from "../../../utils/api";
import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import Tabs from "../../../components/Tabs";
import BlogPostSummaryCard from "../../../components/Cards/BlogPostSummaryCard";
import Modal from "../../../components/Modal";
import DeleteAlertContent from "../../../components/DeleteAlertContent";
import moment from "moment";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";

const ManagePosts = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient(); // for cache invalidation

  const limit = 5; // posts per page
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all"); // must match backend
  const [tabs, setTabs] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // Get all posts
  const { data, isLoading } = useQuery({
    queryKey: ["posts", filterStatus, page, limit],
    queryFn: () =>
      getAllPosts({
        status: filterStatus,
        page,
        limit,
      }),
    keepPreviousData: true,
  });

  const posts = data?.posts || [];
  const totalPages = Math.ceil((data?.totalCount || 0) / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => setPage(pageNumber);

  // Update tabs whenever counts change
  useEffect(() => {
    if (data?.counts) {
      const newTabs = [
        { label: "All", count: data.counts.all || 0 },
        { label: "Approved", count: data.counts.approved || 0 },
        { label: "Rejected", count: data.counts.rejected || 0 },
        { label: "Pending", count: data.counts.pending || 0 },
      ];

      setTabs((prevTabs) => {
        const isSame =
          prevTabs.length === newTabs.length &&
          prevTabs.every((t, i) => t.count === newTabs[i].count);
        return isSame ? prevTabs : newTabs;
      });
    }
  }, [data?.counts]);

  // Approve post mutation
  const approveMutation = useMutation({
    mutationFn: (postId) => approvePost(postId),
    onSuccess: () => {
      toast.success("Post approved successfully");
      queryClient.invalidateQueries(["posts"]); // refetch posts
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
      queryClient.invalidateQueries(["posts"]); // refetch posts
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject post");
      console.error(error);
    },
  });

  return (
    <DashboardLayout activeMenu="Manage Posts">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Posts</h2>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={filterStatus}
          setActiveTab={setFilterStatus}
        />

        <div className="mt-5">
          {posts.length === 0 ? (
            <div className="flex justify-center mt-20">
              <h1>No Posts Available</h1>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-2">
              {paginatedPosts?.map((post) => (
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
                  author={post.author.name}
                  status={post.status}
                  tags={post.tags}
                  role={user.role}
                  likes={post.likedBy?.length || 0}
                  views={post.views}
                  onClick={() => navigate(`/preview/${post.slug}`)}
                  onApprove={() => approveMutation.mutate(post._id)}
                  isApproving={
                    approveMutation.isLoading &&
                    approveMutation.variables === post._id
                  }
                  onReject={() => rejectMutation.mutate(post._id)}
                />
              ))}
            </section>
          )}

          {data?.totalCount > limit && (
            <div className="flex justify-center gap-2 mt-8 mb-10 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
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
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
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

export default ManagePosts;
