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
      className="grid grid-cols-[2fr_3fr] bg-blue-50 rounded-lg overflow-hidden cursor-pointer hover:scale-[100.5%] active:scale-[99%] duration-200"
      onClick={onClick}
    >
      <section>
        <img
          src={coverImageUrl}
          alt={title}
          className="max-w-80 w-full h-full max-h-80 object-cover"
        />
      </section>

      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-lg font-bold mb-2 line-clamp-2">
          {title}
        </h2>
        <span className="text-gray-700 text-xs mb-4 line-clamp-2">
          <MarkdownContent content={description} />
        </span>

        <span className="flex items-center flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer"
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
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <section className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              {authorName.charAt(0).toUpperCase()}
            </section>
          )}
          <section>
            <p className="text-gray-600 text-sm">{authorName}</p>
            <p className="text-gray-500 text-xs">{updatedOn}</p>
          </section>
        </span>
      </div>
    </div>
  );
};

export default BlogPostSummary;
