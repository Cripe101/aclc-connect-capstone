const { GoogleGenAI } = require("@google/genai")
const {
    blogPostIdeasPrompt,
    generateReplyPrompt,
    blogSummaryPrompt,
} = require("../utils/prompts.js")

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Generate blog content from title
const generateBlogPost = async (req, res) => {
    try {
        const { title, tone } = req.body

        if (!title || !tone) {
            return res.status(400).json({ message: "Missing required fields." })
        }

        const prompt = `Write a markdown-formatted blog post titled "${title}". Use a ${tone} tone. Include introduction, subheadings, code examples if relevant, and a conclusion.`
        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL,
            contents: prompt,
        })

        let rawText = response.text
        res.status(200).json(rawText)
    } catch (error) {
        res.status(500).json({ message: "Failed to generate blog post", error: error.message })
    }
}

// Generate blog post ideas from title
const generateBlogPostIdeas = async (req, res) => {
    try {
        const { topics } = req.body

        if (!topics) {
            return res.status(400).json({ message: "Missing required fields." })
        }

        const prompt = blogPostIdeasPrompt(topics)

        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL,
            contents: prompt,
        })

        let rawText = response.text
        const cleanedText = rawText
            .replace(/^```json\s*/, "") //remove starting ```json
            .replace(/```$/, "") //remove ending ```
            .trim() //remove extra spaces

        const data = JSON.parse(cleanedText)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to generate blog post ideas", error: error.message })
    }
}

// Generate comment reply
const generateCommentReply = async (req, res) => {
    try {
        const { author, content } = req.body

        if (!content) {
            return res.status(400).json({ message: "Missing required fields." })
        }

        const prompt = generateReplyPrompt({ author, content })

        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL,
            contents: prompt,
        })

        let rawText = response.text
        res.status(200).json(rawText)
    } catch (error) {
        res.status(500).json({ message: "Failed to generate post comment", error: error.message })
    }
}

// Generate post summary
const generatePostSummary = async (req, res) => {
    try {
        const { content } = req.body

        if (!content) {
            return res.status(400).json({ message: "Missing required fields." })
        }

        const prompt = blogSummaryPrompt({ content })

        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL,
            contents: prompt,
        })

        let rawText = response.text
        const cleanedText = rawText
            .replace(/^```json\s*/, "") //remove starting ```json
            .replace(/```$/, "") //remove ending ```
            .trim() //remove extra spaces

        const data = JSON.parse(cleanedText)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to generate blog post summary", error: error.message })
    }
}

module.exports = {
    generateBlogPost,
    generateBlogPostIdeas,
    generateCommentReply,
    generatePostSummary,
}