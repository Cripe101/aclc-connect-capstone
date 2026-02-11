const BlogPost = require("../models/blogPostModel.js")
const mongoose = require("mongoose")

// Create a new blog post
const createPost = async (req, res) => {
    try {
        const { title, content, coverImageUrl, tags, isDraft, generatedByAI } = req.body

        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")

        const newPost = new BlogPost({
            title,
            slug,
            content,
            coverImageUrl,
            tags,
            author: req.user._id,
            isDraft,
            generatedByAI,
        })
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ message: "Failed to create post.", error: error.message })
    }
}

// Update an existing blog post
const updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
        if (!post) return res.status(404).json({ message: "Post not found" })
        if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to update this post" })
        }

        const updatedData = req.body
        if (updatedData.title) {
            updatedData.slug = updatedData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, updatedData, { new: true })
        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Delete a blog post
const deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
        if (!post) return res.status(404).json({ message: "Post not found" })

        await post.deleteOne()
        res.json({ message: "Post deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Get blog posts by status (all, published, draft) include counts
const getAllPosts = async (req, res) => {
    try {
        const status = req.query.status || "published"
        const page = parseInt(req.query.page) || 1
        const limit = 5
        const skip = (page - 1) * limit

        // Determine filter for main posts response
        let filter = {}
        if (status === "published") filter.isDraft = false
        else if (status === "draft") filter.isDraft = true

        // Fetch paginated posts
        const posts = await BlogPost.find(filter)
            .populate("author", "name profileImageUrl")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)

        // Count totals for pagination and tab counts
        const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
            BlogPost.countDocuments(filter),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({ isDraft: false }),
            BlogPost.countDocuments({ isDraft: true }),
        ])

        res.json({
            posts,
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            counts: {
                all: allCount,
                published: publishedCount,
                draft: draftCount,
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Get a single blog post by slug
const getPostBySlug = async (req, res) => {
    try {
        const post = await BlogPost.findOne({
            slug: req.params.slug
        }).populate("author", "name profileImageUrl")
        if (!post) return res.status(404).json({ message: "Post not found" })
        res.json(post)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Get blog posts by tag
const getPostsByTag = async (req, res) => {
    try {
        const posts = await BlogPost.find({
            tags: req.params.tag,
            isDraft: false,
        }).populate("author", "name profileImageUrl")
        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Search blog posts by title or content
const searchPosts = async (req, res) => {
    try {
        const q = req.query.q
        const posts = await BlogPost.find({
            isDraft: false,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
            ],
        }).populate("author", "name profileImageUrl")
        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Increment post view count
const incrementView = async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
        res.json({ message: "View count incremented" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Like/Unlike a blog post
const likePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
        if (!post) return res.status(404).json({ message: "Post not found" })

        const userId = req.user._id
        const hasLiked = post.likedBy.includes(userId)

        if (hasLiked) {
            // Unlike the post
            await BlogPost.findByIdAndUpdate(
                req.params.id,
                { $pull: { likedBy: userId } },
                { new: true }
            )
            res.json({ message: "Like removed", liked: false })
        } else {
            // Like the post
            await BlogPost.findByIdAndUpdate(
                req.params.id,
                { $push: { likedBy: userId } },
                { new: true }
            )
            res.json({ message: "Like added", liked: true })
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// Get top trending posts
// Get top trending posts
const getTopPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({ isDraft: false })
            .populate("author", "name profileImageUrl")
            .sort({ views: -1, createdAt: -1 })
            .limit(5)

        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    getPostsByTag,
    searchPosts,
    incrementView,
    likePost,
    getTopPosts,
}