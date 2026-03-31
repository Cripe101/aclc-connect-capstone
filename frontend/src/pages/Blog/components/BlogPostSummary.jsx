import { useNavigate } from "react-router-dom";
import MarkdownContent from "./MarkdownContent";

const BlogPostSummary = ({
  title,
  coverImageUrl,
  description,
  tags,
  updatedOn,
  authorName,
  authProfileImg,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="grid md:grid-cols-[2fr_3fr] overflow-hidden cursor-pointer hover:scale-101 active:scale-98 duration-200"
      onClick={onClick}
    >
      <section>
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-60 rounded-t-xl md:rounded-l-xl md:rounded-r-none object-top object-cover"
        />
      </section>

      <div className="p-4 md:p-6 bg-linear-to-b md:bg-linear-to-r from-blue-600 via-blue-500 to-blue-400 rounded-b-xl md:rounded-r-xl md:rounded-l-none">
        <h2 className="text-white text-xl md:text-2xl font-bold mb-2 line-clamp-1">
          {title}
        </h2>
        <span className="text-gray-300 text-xs mb-4 line-clamp-2">
          <MarkdownContent content={description} />
        </span>

        <span className="flex items-center flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              className="bg-sky-200 text-blue-700 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tag/${tag}`);
              }}
            >
              # {tag}
            </button>
          ))}
        </span>

        <span className="flex items-center">
          {authProfileImg ? (
            <img
              src={authProfileImg}
              alt={authorName}
              className="w-8 h-8 rounded-full object-top object-cover mr-3"
            />
          ) : (
            <section className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              {authorName.charAt(0).toUpperCase()}
            </section>
          )}
          <section>
            <p className="text-gray-200 text-sm">{authorName}</p>
            <p className="text-gray-300 text-xs">{updatedOn}</p>
          </section>
        </span>
      </div>
    </div>
  );
};

export default BlogPostSummary;
