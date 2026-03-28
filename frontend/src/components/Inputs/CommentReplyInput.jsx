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
    <div className="mt-2 p-1 relative">
      <div className="flex items-start gap-3">
        <img
          src={user.profileImageUrl}
          alt={user.name}
          className="w-10 h-10 object-cover object-center rounded-full"
        />

        <div className="grid w-full">
          <Input
            value={replyText}
            onChange={({ target }) => setReplyText(target.value)}
            label={type == "new" ? authorName : `Reply to ${authorName}`}
            placeholder={type == "new" ? "Message" : "Add a reply"}
            type="text"
          />

          <div className="flex items-center justify-end gap-4">
            <button
              className="flex font-bold items-center gap-1.5 shadow-md text-sm text-white bg-red-600 px-4 py-1 rounded-lg cursor-pointer hover:bg-red-800 active:bg-red-800 active:scale-90 duraton-200"
              disabled={isLoading}
              onClick={handleCancelReply}
            >
              Cancel
            </button>

            <button
              className={`flex items-center gap-1.5 shadow-md text-sm font-bold px-4 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-700 active:scale-90 active:bg-blue-700 cursor-pointer disabled:opacity-50 duration-200`}
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
