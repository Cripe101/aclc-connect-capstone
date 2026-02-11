import { LuMessageCircleDashed } from "react-icons/lu";
import { PiHandsClapping } from "react-icons/pi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import clsx from "clsx";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/userContext";

const LikeCommentButton = ({
  postId,
  likes,
  comments,
  onLikesChange,
  onClick,
}) => {
  const [postLikes, setPostLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, setOpenAuthForm } = useContext(UserContext);

  // Update when likes change from parent
  useEffect(() => {
    // Handle both array format (new) and number format (old/legacy)
    if (Array.isArray(likes)) {
      setPostLikes(likes.length);
      setLiked(likes.includes(user?._id) || false);
    } else if (typeof likes === "number") {
      setPostLikes(likes);
      setLiked(false); // Can't determine liked status from number
    } else {
      setPostLikes(0);
      setLiked(false);
    }
  }, [likes, user?._id]);

  const handleClick = async () => {
    if (!postId || !user) return;

    try {
      setIsAnimating(true);
      const response = await axiosInstance.post(API_PATHS.POSTS.LIKE(postId));

      if (response.data) {
        const newLikedState = response.data.liked;
        setLiked(newLikedState);
        setPostLikes((prevState) =>
          newLikedState ? prevState + 1 : prevState - 1,
        );

        // Call parent callback to refresh post data
        if (onLikesChange) {
          onLikesChange();
        }

        // Reset animation after 500ms
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }
    } catch (error) {
      setIsAnimating(false);
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed bottom-8 right-8 px-6 py-3 bg-black text-white rounded-full shadow-lg flex items-center justify-center">
        <button
          className={clsx(
            "flex items-end gap-2 cursor-pointer transition-colors",
            liked && "text-blue-600",
          )}
          onClick={() => {
            if (!user) {
              setOpenAuthForm(true);
              return;
            }
            handleClick();
          }}
        >
          <PiHandsClapping
            className={clsx(
              "text-[22px] transition-transform duration-300",
              isAnimating && "scale-115",
            )}
          />
          <span className="text-base font-medium leading-4">{postLikes}</span>
        </button>

        <div className="h-6 w-px bg-gray-500 mx-5"></div>

        <button className="flex items-end gap-2">
          <LuMessageCircleDashed className="text-[22px]" />
          <span className="text-base font-medium leading-4">{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default LikeCommentButton;
