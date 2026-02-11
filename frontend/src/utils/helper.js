
export const getInitials = (title) => {
    if (!title) return "";

    const words = title.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

export const validatePassword = (password) => {
    const errors = []
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long')
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number')
    }
    if (!/[!@#$%^&*(),.?"':{}|<>\[\]\\/;`~\-_=+]/.test(password)) {
        errors.push('Password must contain at least one special character')
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}

export const getToastMessageByType = (type) => {
    switch (type) {
        case "edit":
            return "Post updated successfully!"
        case "draft":
            return "Post saved as draft!"
        case "published":
            return "Post published successfully!"

        default:
            return "Post published successfully!"
    }
}

export const sanitizeMarkdown = (content) => {
    const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/
    const match = content.match(markdownBlockRegex)
    return match ? match[1] : content
}