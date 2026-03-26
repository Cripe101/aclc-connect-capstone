const Comment = require("../models/commentModel.js");
const BlogPost = require("../models/blogPostModel.js");

// Add comment to a Blog Post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    // Ensure blog exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });

    await comment.populate("author", "name profileImageUrl");
    res.status(201).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// Get all comments
// const getAllComments = async (req, res) => {
//   try {
//     const comments = await Comment.find()
//       .populate("author", "name profileImageUrl")
//       .populate("post", "title coverImageUrl")
//       .sort({ createdAt: -1 });

//     // Create a map for commentId
//     const commentMap = {};
//     comments.forEach((comment) => {
//       comment = comment.toObject();
//       comment.replies = [];
//       commentMap[comment._id] = comment;
//     });

//     // Nested replies under their parent
//     const nestedComments = [];
//     comments.forEach((comment) => {
//       if (comment.parentComment) {
//         const parent = commentMap[comment.parentComment];
//         if (parent) {
//           parent.replies.push(commentMap[comment._id]);
//         }
//       } else {
//         nestedComments.push(commentMap[comment._id]);
//       }
//     });
//     res.json(nestedComments);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch all comments", error: error.message });
//   }
// };

// GET /api/comments/user/:userId
const getCommentsOnUserPosts = async (req, res) => {
  try {
    const userId = req.user._id; // assuming you're using auth middleware

    // Step 1: Get all posts created by the logged-in user
    const userPosts = await BlogPost.find({ author: userId }).select("_id");

    const postIds = userPosts.map((post) => post._id);

    // Step 2: Get all comments on those posts
    const comments = await Comment.find({
      post: { $in: postIds },
    })
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments on user's posts",
      error: error.message,
    });
  }
};

// Get comments by post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: -1 });

    // Create a map for commentId
    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject();
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    // Nested replies under their parent
    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        nestedComments.push(commentMap[comment._id]);
      }
    });
    res.json(nestedComments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch a comment", error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId });

    // Delete all replies to this comment (one level of nesting only)
    await Comment.deleteMany({ parentComment: commentId });

    res.json({ message: "Comment and any replies deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete a comment", error: error.message });
  }
};

module.exports = {
  addComment,
  //   getAllComments,
  getCommentsOnUserPosts,
  getCommentsByPost,
  deleteComment,
};
