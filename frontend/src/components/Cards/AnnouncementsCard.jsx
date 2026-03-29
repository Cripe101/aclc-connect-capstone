import { useNavigate } from "react-router-dom";
import BlogPostSummary from "../../pages/Blog/components/BlogPostSummary";
import moment from "moment";

const AnnouncementsCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="grid lg:grid-cols-2 gap-5 mt-5 p-2">
      {data.map((item) => (
        <BlogPostSummary
          key={item._id}
          title={item.title}
          coverImageUrl={
            item.coverImageUrl === "" ? item.images[0] : item.coverImageUrl
          }
          description={item.content}
          tags={item.tags}
          updatedOn={
            item?.updatedAt
              ? moment(item?.updatedAt).format("Do MMM YYYY, h:mm A")
              : "-"
          }
          authorName={item.author?.name || "Unknown"}
          authProfileImg={item.author?.profileImageUrl || ""}
          onClick={() => navigate(`/${item.slug}`)}
        />
      ))}
    </div>
  );
};

export default AnnouncementsCard;
