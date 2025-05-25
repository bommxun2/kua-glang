// src/utils/sanitize.js
import { MOCK_CURRENT_USER_ID, MOCK_CURRENT_USER_AVATAR } from '../data/mockData'; // Adjust path if needed

export const sanitizeComment = (c) => {
    if (!c || typeof c.id === 'undefined') {
        console.warn('[SanitizeUtil] Sanitizing invalid comment object:', c);
        return null;
    }
    return {
        id: String(c.id),
        authorId: String(c.authorId || MOCK_CURRENT_USER_ID),
        user: c.user || 'Anonymous',
        text: c.text || '',
        likes: Number(c.likes) || 0,
        isLikedByCurrentUser: !!c.isLikedByCurrentUser,
        timestamp: c.timestamp || new Date().toISOString(),
        replies: Array.isArray(c.replies) ? c.replies.map(sanitizeComment).filter(r => r !== null) : []
    };
};

export const sanitizePost = (p) => {
    if (!p || typeof p.id === 'undefined') {
        console.warn('[SanitizeUtil] Sanitizing invalid post object:', p);
        return null;
    }
    const commentsArray = Array.isArray(p.commentsArray)
        ? p.commentsArray.map(sanitizeComment).filter(c => c !== null)
        : [];

    const totalComments = commentsArray.reduce((sum, cItem) => {
        let count = 1;
        if (cItem.replies && Array.isArray(cItem.replies)) {
            count += cItem.replies.length;
        }
        return sum + count;
    }, 0);

    return {
        id: Number(p.id),
        authorId: String(p.authorId || MOCK_CURRENT_USER_ID),
        name: p.name || 'Anonymous',
        avatar: p.avatar || MOCK_CURRENT_USER_AVATAR,
        location: p.location || '',
        content: p.content || '',
        image: p.image || null,
        time: p.time || 'Sometime ago',
        likes: Number(p.likes) || 0,
        isLiked: !!p.isLiked,
        commentsArray: commentsArray,
        comments: totalComments,
    };
};