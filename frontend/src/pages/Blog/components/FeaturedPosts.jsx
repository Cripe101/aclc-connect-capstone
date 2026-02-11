import MarkdownContent from "./MarkdownContent";

const FeaturedPosts = ({
  title,
  coverImageUrl,
  description,
  tags,
  updatedOn,
  authorName,
  authProfileImg,
  onClick,
}) => {
  return (
    <div
      className="grid grid-cols-2 bg-white rounded-sm cursor-pointer border border-slate-200 hover:scale-[101%] active:scale-[99%] duration-200"
      onClick={onClick}
    >
      <img
        src={coverImageUrl}
        alt={title}
        className="w-full max-h-96 h-full object-cover object-center rounded-l-sm"
      />

      <div className="p-6">
        <h2 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">
          {title}
        </h2>
        <div className="text-gray-700 text-[13px] mb-4 line-clamp-3">
          <MarkdownContent content={description} />
        </div>

        <div className="flex items-center flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap"
            >
              # {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center">
          {authProfileImg ? (
            <img
              src={authProfileImg}
              alt={authorName}
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-gray-600 text-sm">{authorName}</p>
            <p className="text-gray-500 text-xs">{updatedOn}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;
