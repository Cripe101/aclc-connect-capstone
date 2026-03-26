const BlogPost = require("../models/blogPostModel.js");

// Create a new blog post
const createPost = async (req, res) => {
  try {
    const { title, content, coverImageUrl, images, tags, generatedByAI } =
      req.body;

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await BlogPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newPost = new BlogPost({
      title,
      slug,
      content,
      coverImageUrl,
      images,
      tags,
      generatedByAI,
      author: req.user._id,
      status: "pending",
      rejectionReason: "",
    });

    await newPost.save();

    res.status(201).json({
      message: "Post submitted for approval",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post.",
      error: error.message,
    });
  }
};

// Update an existing blog post
const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAuthor = post.author.toString() === req.user._id.toString();

    if (!isAuthor) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    let updatedData = { ...req.body };

    // 🔥 If post was rejected, set it back to pending
    if (post.status === "rejected") {
      updatedData.status = "pending";
    }

    // Update slug if title changes
    if (updatedData.title) {
      updatedData.slug = updatedData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a blog post
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAuthor = post.author.toString() === req.user._id.toString();

    if (!isAuthor) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    } else await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get post for author only
const getMyPosts = async (req, res) => {
  try {
    const status = req.query.status || "";

    let filter = {
      author: req.user._id,
    };

    if (status === "approved") filter.status = "approved";
    else if (status === "draft") filter.status = "draft";
    else if (status === "pending") filter.status = "pending";
    else if (status === "rejected") filter.status = "rejected";

    const posts = await BlogPost.find(filter)
      .populate("author", "name profileImageUrl")
      .sort({ updatedAt: -1 });

    // ✅ Correct counts (ONLY for current user)
    const [
      totalCount,
      allCount,
      approvedCount,
      draftCount,
      pendingCount,
      rejectedCount,
    ] = await Promise.all([
      BlogPost.countDocuments(filter), // filtered (for pagination)
      BlogPost.countDocuments({ author: req.user._id }),
      BlogPost.countDocuments({ author: req.user._id, status: "approved" }),
      BlogPost.countDocuments({ author: req.user._id, status: "draft" }),
      BlogPost.countDocuments({ author: req.user._id, status: "pending" }),
      BlogPost.countDocuments({ author: req.user._id, status: "rejected" }),
    ]);

    res.json({
      posts,
      totalCount,
      counts: {
        all: allCount,
        approved: approvedCount,
        draft: draftCount,
        pending: pendingCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get blog posts by status (all, published, draft) include counts
const getAllPosts = async (req, res) => {
  try {
    const status = req.query.status || "approved"; // default = published

    let filter = {};

    if (status === "approved") filter.status = "approved";
    else if (status === "draft") filter.status = "draft";
    else if (status === "pending") filter.status = "pending";
    else if (status === "rejected") filter.status = "rejected";
    // else "all" → no filter

    const posts = await BlogPost.find(filter)
      .populate("author", "name profileImageUrl")
      .sort({ updatedAt: -1 });

    // Counts
    const [
      totalCount,
      allCount,
      approvedCount,
      draftCount,
      pendingCount,
      rejectedCount,
    ] = await Promise.all([
      BlogPost.countDocuments(filter),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: "approved" }),
      BlogPost.countDocuments({ status: "draft" }),
      BlogPost.countDocuments({ status: "pending" }),
      BlogPost.countDocuments({ status: "rejected" }),
    ]);

    res.json({
      posts,
      totalCount,
      counts: {
        all: allCount,
        approved: approvedCount,
        draft: draftCount,
        pending: pendingCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single blog post by slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
    }).populate("author", "name profileImageUrl");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get blog posts by tag
const getPostsByTag = async (req, res) => {
  try {
    const posts = await BlogPost.find({
      tags: req.params.tag,
      isDraft: false,
    }).populate("author", "name profileImageUrl");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Search blog posts by title or content
const searchPosts = async (req, res) => {
  try {
    const q = req.query.q;
    const posts = await BlogPost.find({
      isDraft: false,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }).populate("author", "name profileImageUrl");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Increment post view count
const incrementView = async (req, res) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: "View count incremented" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Like/Unlike a blog post
const likePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike the post
      await BlogPost.findByIdAndUpdate(
        req.params.id,
        { $pull: { likedBy: userId } },
        { new: true },
      );
      res.json({ message: "Like removed", liked: false });
    } else {
      // Like the post
      await BlogPost.findByIdAndUpdate(
        req.params.id,
        { $push: { likedBy: userId } },
        { new: true },
      );
      res.json({ message: "Like added", liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get top trending posts
// Get top trending posts
const getTopPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ isDraft: false })
      .populate("author", "name profileImageUrl")
      .sort({ views: -1, createdAt: -1 })
      .limit(5);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const approvePost = async (req, res) => {
  try {
    // ✅ Admin check (optional if using middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const postId = req.params.id;

    // ⚡ Update post atomically if not already approved
    const post = await BlogPost.findOneAndUpdate(
      { _id: postId, status: { $ne: "approved" } },
      { status: "approved", rejectionReason: "" },
      { new: true },
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or already approved" });
    }

    res.json({
      message: "Post approved successfully",
      post,
    });
  } catch (error) {
    console.error("Error approving post:", error);
    res.status(500).json({
      message: "Failed to approve post",
      error: error.message,
    });
  }
};

const rejectPost = async (req, res) => {
  try {
    // ✅ Admin check (optional if using middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const postId = req.params.id;

    // ⚡ Update post atomically if not already approved
    const post = await BlogPost.findOneAndUpdate(
      { _id: postId, status: { $ne: "rejected" } },
      { status: "rejected", rejectionReason: "" },
      { new: true },
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or already rejected" });
    }

    res.json({
      message: "Post rejected",
      post,
    });
  } catch (error) {
    console.error("Error rejecting post:", error);
    res.status(500).json({
      message: "Failed to reject post",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  searchPosts,
  incrementView,
  likePost,
  getTopPosts,
  approvePost,
  rejectPost,
};
