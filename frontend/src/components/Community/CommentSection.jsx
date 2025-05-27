// src/components/Community/CommentSection.jsx
import React from 'react';
import { Send } from 'lucide-react';
import CommentItem from './CommentItem';
import './CommentSection.css'; // <--- Import ไฟล์ CSS ที่สร้างขึ้น

export default function CommentSection({
    postId,
    commentsArray,
    commentInputText,
    onCommentInputChange,
    onAddOrReplyComment,
    replyingToComment,
    onCancelReply,
    currentUserId,
    onToggleLikeComment,
    onOpenEditComment,
    onDeleteComment,
    onStartReply,
}) {

    const renderRecursiveComment = (comment, isReply = false, parentId = null) => (
        <CommentItem
            comment={comment}
            postId={postId}
            currentUserId={currentUserId}
            onToggleLikeComment={onToggleLikeComment}
            onOpenEditComment={onOpenEditComment}
            onDeleteComment={onDeleteComment}
            onStartReply={onStartReply}
            isReply={isReply}
            renderChildReplies={renderRecursiveComment}
        />
    );

    return (
        <div className="comment-section-container">
            {/* เพิ่ม class "no-scrollbar" ถ้าต้องการซ่อน scrollbar */}
            <div className="comments-list no-scrollbar">
                {(commentsArray && commentsArray.length > 0) ? (
                    commentsArray.map(comment => (
                        <React.Fragment key={comment.id}>
                            {renderRecursiveComment(comment, false, null)}
                        </React.Fragment>
                    ))
                ) : (
                    <p className="no-comments-text">ยังไม่มีความคิดเห็น</p>
                )}
            </div>

            {replyingToComment && replyingToComment.postId === postId && (
                <div className="replying-to-info">
                    <span>ตอบกลับถึง: @{replyingToComment.userName}</span>
                    <button onClick={onCancelReply} className="cancel-reply-button">ยกเลิก</button>
                </div>
            )}

            <div className="comment-input-area">
                <input
                    type="text"
                    value={commentInputText}
                    onChange={(e) => onCommentInputChange(postId, e.target.value)}
                    placeholder={replyingToComment && replyingToComment.postId === postId ? `ตอบกลับ @${replyingToComment.userName}...` : "แสดงความคิดเห็นของคุณ..."}
                    className="comment-input-field"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onAddOrReplyComment(postId, replyingToComment && replyingToComment.postId === postId ? replyingToComment.commentId : null);
                        }
                    }}
                />
                <button
                    onClick={() => onAddOrReplyComment(postId, replyingToComment && replyingToComment.postId === postId ? replyingToComment.commentId : null)}
                    disabled={!commentInputText.trim()}
                    className="send-comment-button"
                    aria-label="ส่งความคิดเห็น"
                >
                    <Send /> {/* ขนาดจะถูกควบคุมโดย CSS */}
                </button>
            </div>
        </div>
    );
}