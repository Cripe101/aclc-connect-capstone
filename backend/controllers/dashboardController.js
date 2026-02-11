const BlogPost = require("../models/blogPostModel.js")
const Comment = require("../models/commentModel.js")

// Dashboard Summary
const getDashboardSummary = async (req, res) => {
    try {
        // Basic counts
        const [totalPosts, drafts, published, totalCommments, aiGenerated] = 
            await Promise.all([
                BlogPost.countDocuments(),
                BlogPost.countDocuments({ isDraft: true }),
                BlogPost.countDocuments({ isDraft: false }),
                BlogPost.countDocuments(),
                BlogPost.countDocuments({ generatedByAI: true }), 
            ])

            const totalViewsAgg = await BlogPost.aggregate([
                {$group: {_id: null, total: {$sum: "$views"}}}
            ])
            const totalLikesAgg = await BlogPost.aggregate([
                {$project: {
                    likeCount: {
                        $size: {$ifNull: ["$likedBy", []]}
                    }
                }},
                {$group: {_id: null, total: {$sum: "$likeCount"}}}
            ])
            const totalViews = totalViewsAgg[0]?.total || 0
            const totalLikes = totalLikesAgg[0]?.total || 0

            // Top Performing Posts
            const topPosts = await BlogPost.aggregate([
                {$match: {isDraft: false}},
                {$addFields: {
                    likes: {
                        $size: {$ifNull: ["$likedBy", []]}
                    }
                }},
                {$project: {
                    title: 1,
                    coverImageUrl: 1,
                    views: 1,
                    likes: 1,
                    _id: 1
                }},
                {$sort: {views: -1, likes: -1}},
                {$limit: 5}
            ])

            // Recent comments
            const recentComments = await Comment.find()
                .sort({createdAt: -1})
                .limit(5)
                .populate("author", "name profileImageUrl")
                .populate("post", "title coverImageUrl")

            // Tag usage aggregation
            const tagUsage = await BlogPost.aggregate([
                {$unwind: "$tags"},
                {$group: {_id: "$tags", count: {$sum: 1}}},
                {$project: {tag: "$_id", count: 1, _id: 0}},
                {$sort: {count: -1}}
            ])
            
            res.json({
                stats: {
                    totalPosts,
                    drafts,
                    published,
                    totalViews,
                    totalLikes,
                    totalCommments,
                    aiGenerated,
                },
                topPosts,
                recentComments,
                tagUsage,
            })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard summary", error: error.message })
    }
}

module.exports = {getDashboardSummary}