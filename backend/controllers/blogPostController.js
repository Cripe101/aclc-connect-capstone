const BlogPost = require("../models/blogPostModel.js");
const User = require("../models/userModel.js");
const Notification = require("../models/notificationModel.js");

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

    const isAdmin = req.user.role?.toLowerCase() === "admin";

    const findAdmin = await User.findOne({ role: "admin" });

    await Notification.create({
      userId: findAdmin._id,
      postSlug: slug,
      message: "New post need approval",
    });

    const newPost = new BlogPost({
      title,
      slug,
      content,
      coverImageUrl,
      images,
      tags,
      generatedByAI,
      author: req.user._id,
      status: isAdmin ? "approved" : "pending",
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
    // 1️⃣ Find the post by ID
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // 2️⃣ Check authorization
    const isAuthor = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.toLowerCase() === "admin";

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    let updatedData = { ...req.body };

    // 3️⃣ Set status
    if (isAdmin) {
      updatedData.status = "approved";
    } else {
      updatedData.status = "pending";
    }

    let slug;

    // 4️⃣ Handle slug generation safely
    if (updatedData.title && updatedData.title !== post.title) {
      let slugBase = updatedData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      slug = slugBase;
      let count = 1;

      // Check for duplicates in other posts
      while (await BlogPost.findOne({ slug, _id: { $ne: req.params.id } })) {
        slug = `${slugBase}-${count++}`;
      }

      updatedData.slug = slug;
    }

    const finalSlug = slug || post.slug;

    const findAdmin = await User.findOne({ role: "admin" });

    await Notification.create({
      userId: findAdmin._id,
      postSlug: finalSlug,
      message: "New post need approval",
    });

    // 5️⃣ Update the post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true },
    );

    res.json(updatedPost);
  } catch (error) {
    // 6️⃣ Handle duplicate slug error gracefully (just in case)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slug already exists" });
    }
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
    const status = req.query.status || "approved"; // default = approved

    let filter = {};

    // ✅ Status filter
    if (status === "approved") filter.status = "approved";
    else if (status === "draft") filter.status = "draft";
    else if (status === "pending") filter.status = "pending";
    else if (status === "rejected") filter.status = "rejected";
    // else "all" → no status filter

    // ✅ Role-based filter
    if (req.user?.role === "faculty") {
      filter.tags = "faculty";
      // or: filter.tags = { $in: ["faculty"] }
    }

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
    const tag = req.params.tag;

    const posts = await BlogPost.find({
      tags: { $regex: `^${tag}$`, $options: "i" },
      status: "approved",
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

const getTopPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({
      tags: { $nin: ["memorandum", "faculty"] },
      status: "approved",
    })
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
    // Notify the user
    await Notification.create({
      userId: post.author,
      postSlug: post.slug,
      message: "Your post was approved",
    });

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

    // Notify the user
    await Notification.create({
      userId: post.author,
      message: "Your post was rejected",
      postSlug: post.slug,
    });

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
