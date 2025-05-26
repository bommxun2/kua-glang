// src/utils/sanitize.js

import { MOCK_CURRENT_USER_ID, MOCK_CURRENT_USER_AVATAR } from '../data/mockData';

/**
 * ทำความสะอาดข้อมูลคอมเมนต์ที่ได้จาก backend
 */
export const sanitizeComment = (c) => {
  if (!c || typeof c.id === 'undefined') {
    console.warn('[SanitizeUtil] Invalid comment object:', c);
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
    replies: Array.isArray(c.replies)
      ? c.replies.map(sanitizeComment).filter(Boolean)
      : [],
  };
};

/**
 * ทำความสะอาดข้อมูลโพสต์ที่ได้จาก backend
 */
export const sanitizePost = (p) => {
  if (!p || (!p.postId && !p.id)) return null;

  const postId = String(p.postId || p.id || '');
  const userId = String(p.userId || p.authorId || '');

  const commentsArray = Array.isArray(p.comment)
    ? p.comment.map((c) => ({
        id: String(c.cid || c.id),
        text: c.caption || '',
        user: c.username || 'Unknown',
        authorId: c.userId || '',
        likes: c.like_count || 0,
        isLikedByCurrentUser: false,
        replies: [],
      }))
    : [];

  return {
    id: postId,
    postId,
    userId,
    authorId: userId,
    name: p.username || 'Unknown',
    avatar: p.avatar || '/user-avatar-placeholder.png',
    location: p.location || '',
    content: p.caption || '',
    image: p.img_url || null,
    time: p.created_at || '',
    likes: Array.isArray(p.like) ? p.like.length : 0,
    isLiked: Array.isArray(p.like)
      ? p.like.some((l) => l.username === p.username)
      : false,
    commentsArray,
    comments: commentsArray.length,
  };
};
