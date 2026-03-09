import React from "react";
import { LuEye, LuHeart, LuTrash2 } from "react-icons/lu";

const BlogPostSummaryCard = ({
  title,
  imgUrl,
  updatedOn,
  tags,
  likes,
  views,
  onClick,
  onDelete,
}) => {
  return (
    <div
      className="flex items-start gap-4 bg-white p-3 mb-5 rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      <img src={imgUrl} alt={title} className="w-16 h-16 rounded-lg" />

      <div className="flex-1">
        <h3 className="text-[13px] md:text-[15px] text-black font-medium">
          {title}
        </h3>

        <div className="flex items-center gap-2.5 mt-2 flex-wrap">
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
      <button
        className="md:hidden block text-xs bg-red-50 py-1 px-2.5 rounded-lg text-red-600 font-medium border border-red-600 flex-row items-center gap-1 hover:bg-red-600 hover:text-white group-hover:flex cursor-pointer duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <LuTrash2 /> <span className="hidden md:block">Delete</span>
      </button>
    </div>
  );
};

export default BlogPostSummaryCard;
