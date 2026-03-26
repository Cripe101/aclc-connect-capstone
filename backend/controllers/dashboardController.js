const BlogPost = require("../models/blogPostModel.js");
const Comment = require("../models/commentModel.js");

const getDashboardSummary = async (req, res) => {
  try {
    const [totalPosts, published, pending, drafts, totalComments, aiGenerated] =
      await Promise.all([
        BlogPost.countDocuments(),

        // ✅ Only approved = published
        BlogPost.countDocuments({ status: "approved" }),
        BlogPost.countDocuments({ status: "pending" }),

        // ✅ Draft = actual draft + rejected
        BlogPost.countDocuments({
          status: { $in: ["draft", "rejected"] },
        }),

        Comment.countDocuments(),

        // ✅ AI generated posts
        BlogPost.countDocuments({ generatedByAI: true }),
      ]);

    const User = require("../models/userModel.js");
    const totalUsers = await User.countDocuments();

    // Views
    const totalViewsAgg = await BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);

    // Likes
    const totalLikesAgg = await BlogPost.aggregate([
      {
        $project: {
          likeCount: {
            $size: { $ifNull: ["$likedBy", []] },
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$likeCount" } } },
    ]);

    const totalViews = totalViewsAgg[0]?.total || 0;
    const totalLikes = totalLikesAgg[0]?.total || 0;

    // ✅ Top Performing Posts (ONLY approved)
    const topPosts = await BlogPost.aggregate([
      { $match: { status: "approved" } },
      {
        $addFields: {
          likes: {
            $size: { $ifNull: ["$likedBy", []] },
          },
        },
      },
      {
        $project: {
          title: 1,
          coverImageUrl: 1,
          views: 1,
          likes: 1,
          _id: 1,
        },
      },
      { $sort: { views: -1, likes: -1 } },
      { $limit: 5 },
    ]);

    // Recent comments
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl");

    // Tag usage (only approved posts for cleaner analytics)
    const tagUsage = await BlogPost.aggregate([
      { $match: { status: "approved" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      stats: {
        totalPosts,
        published,
        drafts, // includes rejected
        pending,
        totalViews,
        totalLikes,
        totalComments,
        aiGenerated,
        totalUsers,
      },
      topPosts,
      recentComments,
      tagUsage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = { getDashboardSummary };
