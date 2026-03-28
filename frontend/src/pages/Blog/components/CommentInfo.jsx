import { useContext, useState } from "react";
import moment from "moment";
import { LuChevronDown, LuDot, LuReply, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";
import CommentReplyInput from "../../../components/Inputs/CommentReplyInput";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";

const CommentInfo = ({
  commentId,
  authorName,
  authorPhoto,
  content,
  updatedOn,
  post,
  replies,
  getAllComments,
  onDelete,
  isSubReply,
}) => {
  const { user, setOpenAuthForm } = useContext(UserContext);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showSubReplies, setShowSubReplies] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handles cancelling a reply
  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  // Add reply
  const handleAddReply = async () => {
    try {
      // console.log("post", post);
      setLoading(true);

      const response = await axiosInstance.post(
        API_PATHS.COMMENTS.ADD(post._id),
        {
          content: replyText,
          parentComment: commentId,
        },
      );
      toast.success("Replied successfully!");
      setReplyText("");
      setShowReplyForm(false);
      getAllComments();
      return response.data;
    } catch (error) {
      console.error("Error replying to comment.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-3 py-2 cursor-pointer group">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-8 order-2 md:order-1">
          <div className="flex items-start gap-3">
            <img
              src={authorPhoto}
              alt={authorName}
              className="w-10 h-10 object-cover object-center rounded-full"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs text-gray-500 font-medium">
                  @{authorName}
                </h3>
                <LuDot className="text-gray-500" />
                <span className="text-xs text-gray-500 font-medium">
                  {updatedOn}
                </span>
              </div>

              <p className="text-sm text-black font-medium py-2">{content}</p>

              <div className="flex items-center gap-3 mt-1.5">
                {!isSubReply && (
                  <>
                    <button
                      className="flex items-center gap-2 text-xs disabled:opacity-50 shadow-sm font-medium text-blue-600 bg-blue-100 px-4 py-1 rounded-lg hover:bg-blue-500 hover:text-white active:scale-90 active:bg-blue-500 active:text-white cursor-pointer duration-200"
                      onClick={() => {
                        if (!user) {
                          // console.log("USER", user);
                          setOpenAuthForm(true);
                          return;
                        }
                        setShowReplyForm((prevState) => !prevState);
                      }}
                    >
                      <LuReply /> Reply
                    </button>
                    <button
                      className="flex items-center gap-2 text-xs disabled:opacity-50 shadow-sm font-medium text-blue-600 bg-blue-100 px-4 py-1 rounded-lg hover:bg-blue-500 hover:text-white active:scale-90 active:bg-blue-500 active:text-white cursor-pointer duration-200"
                      onClick={() =>
                        setShowSubReplies((prevState) => !prevState)
                      }
                    >
                      {replies?.length || 0}{" "}
                      {replies?.length == 0 || replies?.length == 1
                        ? "reply"
                        : "replies"}{" "}
                      <LuChevronDown
                        className={`${showSubReplies ? "rotate-180" : ""}`}
                      />
                    </button>{" "}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isSubReply && showReplyForm && (
        <CommentReplyInput
          user={user}
          authorName={authorName}
          content={content}
          replyText={replyText}
          setReplyText={setReplyText}
          handleAddReply={handleAddReply}
          handleCancelReply={handleCancelReply}
          isLoading={loading}
          disableAutoGen
        />
      )}

      {showSubReplies &&
        replies?.length > 0 &&
        replies.map((comment, index) => (
          <div key={comment._id} className={`ml-3 ${index == 0 ? "mt-5" : ""}`}>
            <CommentInfo
              authorName={comment.author?.name || "Unknown"}
              authorPhoto={comment.author?.profileImageUrl || ""}
              content={comment.content}
              post={comment.post}
              replies={comment.replies || []}
              isSubReply
              updatedOn={
                comment.updatedAt
                  ? moment(comment.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              onDelete={() => onDelete(comment._id)}
            />
          </div>
        ))}
    </div>
  );
};

export default CommentInfo;
