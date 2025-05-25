// src/components/Community/CommentItem.jsx
import React from 'react';
import { Heart, CornerDownRight, Edit3, Trash2 } from 'lucide-react'; // ยังคงใช้ icons จาก lucide
import './CommentItem.css'; // <--- Import ไฟล์ CSS ที่สร้างขึ้น

export default function CommentItem({
    comment,
    postId,
    currentUserId,
    onToggleLikeComment,
    onOpenEditComment,
    onDeleteComment,
    onStartReply,
    isReply = false,
    renderChildReplies
}) {
    if (!comment) return null;

    const canEditOrDeleteComment = comment.authorId === currentUserId;

    // สร้าง className แบบ dynamic สำหรับ container หลัก
    const containerClasses = `comment-item-container ${isReply ? 'is-reply' : ''}`;

    return (
        <div className={containerClasses}>
            <div className="comment-header">
                <p className="comment-author">{comment.user || 'Anonymous'}:</p>
                {canEditOrDeleteComment && (
                    <div className="comment-actions">
                        <button
                            onClick={() => onOpenEditComment(postId, comment)}
                            className="comment-action-button edit"
                        >
                            <Edit3 size={12} style={{ marginRight: '2px' }} /> แก้ไข
                        </button>
                        <button
                            onClick={() => onDeleteComment(postId, comment.id, comment.authorId)}
                            className="comment-action-button delete"
                        >
                            <Trash2 size={12} style={{ marginRight: '2px' }} /> ลบ
                        </button>
                    </div>
                )}
            </div>
            <p className="comment-text">{comment.text}</p>
            <div className="comment-footer">
                <button
                    onClick={() => onToggleLikeComment(postId, comment.id)}
                    className={`comment-footer-button like-button ${comment.isLikedByCurrentUser ? 'is-liked' : ''}`}
                >
                    <Heart
                        // ถ้า isLikedByCurrentUser ให้ icon ถูก fill, ถ้าไม่ให้มีแค่ stroke
                        fill={comment.isLikedByCurrentUser ? 'currentColor' : 'none'}
                        strokeWidth={comment.isLikedByCurrentUser ? 0 : 2}
                    />
                    {comment.likes || 0}
                </button>
                {!isReply && (
                    <button
                        onClick={() => onStartReply(postId, comment.id, comment.user)}
                        className="comment-footer-button reply-button"
                    >
                        <CornerDownRight /> ตอบกลับ
                    </button>
                )}
                {comment.replies && comment.replies.length > 0 && (
                    <span className="reply-count">{comment.replies.length} การตอบกลับ</span>
                )}
            </div>
            {/* ส่วนแสดง Replies (Recursive) */}
            {comment.replies && comment.replies.length > 0 && renderChildReplies && (
                 <div className="child-replies-container">
                    {comment.replies.map(reply => renderChildReplies(reply, postId, true, comment.id))}
                </div>
            )}
        </div>
    );
}