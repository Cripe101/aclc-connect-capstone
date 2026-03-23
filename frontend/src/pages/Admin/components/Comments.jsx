import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import moment from "moment";
import CommentInfoCard from "../../../components/Cards/CommentInfoCard";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import DeleteAlertContent from "../../../components/DeleteAlertContent";

const Comments = () => {
  const [comments, setComments] = useState([]);

  const limit = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // Get all comments
  const getAllComments = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_ALL);

      const data = response.data || [];

      setComments(data);

      // compute total pages
      setTotalPages(Math.ceil(data.length / limit));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Delete a comment
  const deleteComment = async () => {
    try {
      await axiosInstance.delete(
        API_PATHS.COMMENTS.DELETE(openDeleteAlert.data),
      );

      toast.success("Comment deleted.");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });

      getAllComments();
    } catch (error) {
      console.error("Error deleting comment.", error);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

  // pagination logic
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const currentComments = comments.slice(startIndex, endIndex);

  return (
    <DashboardLayout activeMenu="Comments">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <h2 className="text-2xl font-semibold mt-5 mb-5">Comments</h2>

        {currentComments.map((comment) => (
          <CommentInfoCard
            key={comment._id}
            commentId={comment._id || null}
            authorName={comment.author?.name || "Unknown"}
            authorPhoto={comment.author?.profileImageUrl || ""}
            content={comment.content}
            updatedOn={
              comment.updatedAt
                ? moment(comment.updatedAt).format("Do MMM YYYY")
                : "-"
            }
            post={comment.post}
            replies={comment.replies || []}
            getAllComments={getAllComments}
            onDelete={(commentId) =>
              setOpenDeleteAlert({ open: true, data: commentId || comment._id })
            }
          />
        ))}
      </div>

      {/* Pagination */}
      {comments.length > limit && (
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded-md border transition ${
                  page === pageNumber
                    ? "bg-blue-700 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this comment?"
            onDelete={deleteComment}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Comments;
