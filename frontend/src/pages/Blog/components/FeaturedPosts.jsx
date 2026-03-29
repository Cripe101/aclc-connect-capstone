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
  images,
}) => {
  return (
    <div
      className="grid md:grid-cols-[2fr_3fr] md:max-h-100 rounded-lg cursor-pointer hover:scale-101 active:scale-98 duration-200"
      onClick={onClick}
    >
      <img
        src={coverImageUrl === "" ? images[0] : coverImageUrl}
        alt={title}
        className="w-full max-h-100 object-cover object-top rounded-t-lg md:rounded-l-lg md:rounded-t-none"
      />

      <div className="p-6 bg-linear-to-b md:bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 rounded-b-lg md:rounded-r-lg md:rounded-l-none">
        <h2 className="text-xl md:text-2xl text-white font-bold mb-2 line-clamp-3">
          {title}
        </h2>
        <div className="text-gray-300 text-sm mb-4 line-clamp-3">
          <MarkdownContent content={description} />
        </div>

        <div className="flex items-center flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-sky-200 text-blue-700 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap"
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
              className="w-8 h-8 object-cover object-center rounded-full mr-3"
            />
          ) : (
            <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-gray-200">{authorName}</p>
            <p className="text-gray-400 md:text-gray-300 text-xs">
              {updatedOn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;
