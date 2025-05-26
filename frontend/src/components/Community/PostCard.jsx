import React from 'react';
import { Heart, MessageCircle, Edit3, Trash2, UserPlus, UserCheck } from 'lucide-react';
import './PostCard.css';

export default function PostCard({
  post,
  currentUserId,
  onToggleLike,
  onToggleShowComments,
  onNavigateToEdit,
  onDeletePost,
  onAddFriend,
  isFriend,
}) {
  if (!post) return null;

  const canEditOrDelete = post.authorId === currentUserId;

  const safeHandleDelete = () => {
    if (typeof onDeletePost === 'function') {
      onDeletePost(post.postId, post.authorId);
    }
  };

  const safeHandleEdit = () => {
    if (typeof onNavigateToEdit === 'function') {
      onNavigateToEdit(post.postId);
    }
  };

  return (
    <div className="post-card-container">
      <div className="post-header">
        <div className="author-info">
          <img
            src={post.avatar || '/user-avatar-placeholder.png'}
            alt={post.name || 'User Avatar'}
            className="author-avatar"
          />
          <div className="author-details">
            <p className="author-name">
              {post.name || 'Unknown'}
              {post.location && <span className="author-location">{post.location}</span>}
            </p>
            <p className="post-time">{post.time || 'สักครู่ก่อน'}</p>
          </div>
        </div>

        {canEditOrDelete ? (
          <div className="post-actions-header">
            <button onClick={safeHandleEdit} className="action-button-header edit" title="แก้ไขโพสต์">
              <Edit3 />
            </button>
            <button onClick={safeHandleDelete} className="action-button-header delete" title="ลบโพสต์">
              <Trash2 />
            </button>
          </div>
        ) : (
          isFriend !== undefined && (
            isFriend ? (
              <span className="friend-status-text">
                <UserCheck /> ติดตามแล้ว
              </span>
            ) : (
              onAddFriend && (
                <button
                  onClick={() =>
                    onAddFriend({ id: post.authorId, name: post.name, avatar: post.avatar })
                  }
                  className="add-friend-button"
                >
                  <UserPlus /> เพิ่มเพื่อน
                </button>
              )
            )
          )
        )}
      </div>

      <p className="post-content-text">{post.content}</p>

      {post.image && (
        <img src={post.image} alt={`โพสต์โดย ${post.name || 'User'}`} className="post-image" />
      )}

      <div className="post-footer-actions">
        <button
          onClick={() => onToggleLike?.(post.postId)}
          className={`footer-action-button like-button ${post.isLiked ? 'is-liked' : ''}`}
        >
          <Heart fill={post.isLiked ? 'currentColor' : 'none'} strokeWidth={post.isLiked ? 0 : 2} />
          {post.likes || 0}
        </button>
        <button
          onClick={() => onToggleShowComments?.(post.postId)}
          className="footer-action-button comment-button"
        >
          <MessageCircle strokeWidth={2} />
          {post.comments || 0}
        </button>
      </div>
    </div>
  );
}
