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
  createdAt,
}) => {
  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <LuLoaderCircle size={50} />
      </div>
    );
  return (
    <div
      className="flex items-start gap-2 md:gap-3 shadow-md bg-linear-to-r from-blue-300 via-blue-200 to-blue-300 p-3 rounded-xl cursor-pointer group"
      onClick={onClick}
    >
      <section className="flex flex-col gap-2 items-center justify-between h-full">
        <img
          src={imgUrl}
          alt={title}
          className="w-20 h-20 object-cover object-top rounded-xl"
        />
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-blue-800 font-extrabold bg-blue-50 px-2 py-1 rounded-xl">
            <LuEye /> {views}
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-800 font-extrabold bg-blue-50 px-2 py-1 rounded-xl">
            <LuHeart /> {likes}
          </span>
        </div>
      </section>

      <div className="w-full flex flex-col justify-between gap-2">
        <section className="w-full flex gap-5 items-center justify-between">
          <h3 className="text-sm md:text-base text-gray-800 font-meduim line-clamp-1">
            {title}
          </h3>
          <h3
            className={`${status === "pending" ? "text-blue-700" : status === "approved" ? "text-green-600" : "text-red-600"} bg-white text-xs font-bold rounded-xl px-2 py-1`}
          >
            {status}
          </h3>
        </section>

        <span className="">
          <section className="flex">
            <div
              className={`${role === "admin" ? "" : "hidden"} text-xs text-blue-900 font-meduim bg-blue-50 px-2.5 py-1 rounded-xl`}
            >
              Posted by: {author}
            </div>
          </section>

          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
            <div
              className={`${updatedOn === "" ? "hidden" : ""} text-xs text-blue-900 font-meduim bg-blue-50 px-2.5 py-1 rounded-xl`}
            >
              Updated: {updatedOn}
            </div>
          </div>
        </span>
        <div className="flex items-center flex-wrap gap-2">
          {tags.slice(0, 2).map((tag, index) => (
            <div
              key={`tag_${index}`}
              className="text-xs text-blue-800 font-medium bg-blue-50 px-2.5 py-1 rounded-xl"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      {status === "pending" && role === "admin"
        ? ""
        : // <section className="flex gap-1 flex-wrap md:gap-3">
          //   <button
          //     className="md:hidden block text-xs bg-green-50 py-1 px-2.5 rounded-xl text-green-600 font-medium border border-green-600 flex-row items-center gap-1 hover:bg-green-700 hover:text-white group-hover:flex cursor-pointer duration-200"
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       onApprove();
          //     }}
          //   >
          //     <MdApproval size={15} />
          //     <span className="hidden md:block">Approve</span>
          //   </button>
          //   <button
          //     className="md:hidden block text-xs bg-red-50 py-1 px-2.5 rounded-xl text-red-600 font-medium border border-red-600 flex-row items-center gap-1 hover:bg-red-700 hover:text-white group-hover:flex cursor-pointer duration-200"
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       onReject();
          //     }}
          //   >
          //     <MdCancel size={15} />
          //     <span className="hidden md:block">Reject</span>
          //   </button>
          // </section>
          ""}
    </div>
  );
};

export default BlogPostSummaryCard;
