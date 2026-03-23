import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  LuLoaderCircle,
  LuReply,
  LuSend,
  LuWandSparkles,
} from "react-icons/lu";
import Input from "./Input";

const CommentReplyInput = ({
  user,
  authorName,
  replyText,
  setReplyText,
  handleAddReply,
  isLoading,
  handleCancelReply,
  type = "reply",
}) => {
  return (
    <div className="mt-2 ml-10 relative">
      <div className="flex items-start gap-3">
        <img
          src={user.profileImageUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1">
          <Input
            value={replyText}
            onChange={({ target }) => setReplyText(target.value)}
            label={type == "new" ? authorName : `Reply to ${authorName}`}
            placeholder={type == "new" ? "Message" : "Add a reply"}
            type="text"
          />

          <div className="flex items-center justify-end gap-4">
            <button
              className="flex items-center gap-1.5 text-[14px] font-medium text-white bg-red-700 px-4 py-0.5 rounded-full hover:bg-red-800 hover:text-white cursor-pointer"
              disabled={isLoading}
              onClick={handleCancelReply}
            >
              Cancel
            </button>

            <button
              className={`flex items-center gap-1.5 text-[14px] font-medium px-4 py-0.5 rounded-full text-sky-600 bg-sky-50 hover:bg-sky-500 hover:text-white cursor-pointer disabled:opacity-50`}
              disabled={replyText?.length == 0 || isLoading}
              onClick={handleAddReply}
            >
              {type == "new" ? (
                <LuSend className="text-[13px]" />
              ) : (
                <LuReply className="text-[18px]" />
              )}{" "}
              {type == "new" ? "Add" : "Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReplyInput;
