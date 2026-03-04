import { useNavigate, useSearchParams } from "react-router-dom";
import BlogLayout from "../../components/Layouts/BlogLayout/BlogLayout";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import BlogPostSummary from "./components/BlogPostSummary";
import moment from "moment";
import { useToaster } from "react-hot-toast";

const SearchPosts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const query = searchParams.get("query") || "";

  const [searchResults, setSearchResults] = useState([]);

  // Handle Search
  const handleSearch = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });

      if (response.data) {
        setSearchResults(response.data || []);
      }

      console.log(response.data);
      console.log(query);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    if (query.trim() !== "") {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <BlogLayout>
      <div className="p-5">
        <h3 className="text-lg font-medium">
          Showing search results matching "
          <span className="font-semibold">{query.toLowerCase()}</span>"
        </h3>

        {isLoading ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Searching...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <BlogPostSummary
                  key={item._id}
                  title={item.title}
                  coverImageUrl={item.coverImageUrl}
                  description={item.content}
                  tags={item.tags}
                  updatedOn={
                    item.updatedAt
                      ? moment(item.updatedAt).format("Do MMM YYYY")
                      : "-"
                  }
                  authorName={item.author?.name || "Unknown"}
                  authProfileImg={item.author?.profileImageUrl || ""}
                  onClick={() => handleClick(item)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No posts found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default SearchPosts;
