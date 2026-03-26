import {
  LuAppWindow,
  LuEye,
  LuHeart,
  LuLoaderCircle,
  LuTrash2,
} from "react-icons/lu";
import { MdApproval, MdCancel } from "react-icons/md";

const BlogPostSummaryCard = ({
  title,
  status,
  imgUrl,
  updatedOn,
  tags,
  likes,
  role,
  views,
  onClick,
  onApprove,
  onReject,
  isLoading,
  author,
}) => {
  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <LuLoaderCircle size={50} />
      </div>
    );
  return (
    <div
      className="flex items-start gap-4 bg-white p-3 rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      <img src={imgUrl} alt={title} className="w-16 h-16 rounded-lg" />
      <div className="flex-1">
        <section className="flex gap-5 items-center ">
          <h3 className="text-[13px] md:text-[15px] text-black font-medium">
            {title}
          </h3>
          <h3
            className={`${status === "pending" ? "text-blue-700 bg-blue-100" : status === "approved" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"} text-xs font-medium rounded-full px-1.5 py-0.5`}
          >
            {status}
          </h3>
        </section>

        <div className="flex items-center gap-2.5 mt-2 flex-wrap">
          <div className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
            {author}
          </div>
          <div className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
            Updated: {updatedOn}
          </div>

          <div className="h-6 w-px bg-gray-300/70" />

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              <LuEye className="text-[16px] text-blue-800" /> {views}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              <LuHeart className="text-[16px] text-blue-800" /> {likes}
            </span>
          </div>

          <div className="h-6 w-px bg-gray-300/70" />

          <div className="flex items-center gap-2">
            {tags.map((tag, index) => (
              <div
                key={`tag_${index}`}
                className="text-xs text-blue-800 font-medium bg-blue-50 px-2.5 py-1 rounded-lg"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      {status === "pending" && role === "admin" ? (
        <section className="flex gap-1 flex-wrap md:gap-3">
          <button
            className="md:hidden block text-xs bg-green-50 py-1 px-2.5 rounded-lg text-green-600 font-medium border border-green-600 flex-row items-center gap-1 hover:bg-green-700 hover:text-white group-hover:flex cursor-pointer duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
          >
            <MdApproval size={15} />
            <span className="hidden md:block">Approve</span>
          </button>
          <button
            className="md:hidden block text-xs bg-red-50 py-1 px-2.5 rounded-lg text-red-600 font-medium border border-red-600 flex-row items-center gap-1 hover:bg-red-700 hover:text-white group-hover:flex cursor-pointer duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onReject();
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
  );
};

export default BlogPostSummaryCard;
