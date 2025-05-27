import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import MainTabsBar from '../../components/Community/MainTabsBar/MainTabsBar';
import MenuBar from '../../components/MenuBar/MenuBar';
import PostCard from '../../components/Community/PostCard';
import CommentSection from '../../components/Community/CommentSection';
import { sanitizePost } from '../../utils/sanitize';
import './CommunityPage.css';

import { useAuth } from '../../contexts/AuthContext';
import {
  fetchAllPosts,
  fetchFriends,       // ✅ เพิ่ม
  followUser,         // ✅ เพิ่ม
  deletePost,
  likePost,
  likeComment,
  addComment,
  deleteComment,
  editComment
} from '../../services/postService';

export default function CommunityPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]); // ✅ เพิ่ม
  const [showCommentsForPostId, setShowCommentsForPostId] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [replyingToComment, setReplyingToComment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [fabRight, setFabRight] = useState('1rem');

  // ✅ โหลดเพื่อนของ user
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await fetchFriends(userId);
        const ids = Array.isArray(data.myfriend) ? data.myfriend.map(f => f.userId) : [];
        setFriends(ids);
      } catch (err) {
        console.error("โหลดเพื่อนล้มเหลว:", err);
      }
    };
    if (userId) loadFriends();
  }, [userId]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetchAllPosts();
        if (!Array.isArray(res)) {
          console.error('ผลลัพธ์ไม่ถูกต้องจาก fetchAllPosts:', res);
          return;
        }
        const posts = res.map(p => sanitizePost(p)).filter(Boolean);
        setPosts(posts);
      } catch (err) {
        console.error("โหลดโพสต์ล้มเหลว:", err);
        alert("ไม่สามารถโหลดโพสต์ได้");
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    const calcFab = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const width = window.innerWidth > 440 ? (window.innerWidth - 440) / 2 + rem * 1 : rem;
      setFabRight(`${width}px`);
    };
    calcFab();
    window.addEventListener('resize', calcFab);
    return () => window.removeEventListener('resize', calcFab);
  }, []);

  const handleAddFriend = async (targetUser) => {
    try {
      await followUser(userId, targetUser.id);
      alert(`ติดตาม ${targetUser.name} แล้ว`);
      navigate('/community/following', { state: { refreshFriends: true } }); // ✅ เพิ่มบรรทัดนี้

    } catch (err) {
      console.error("เพิ่มเพื่อนล้มเหลว:", err);
      alert("ไม่สามารถเพิ่มเพื่อนได้");
    }
  };

  const handleDeletePost = async (postId, authorId) => {
    if (authorId !== userId) return alert('ไม่มีสิทธิ์ลบโพสต์นี้');
    if (!window.confirm('ยืนยันการลบโพสต์?')) return;
    try {
      await deletePost(userId, postId);
      setPosts(prev => prev.filter(p => p.postId !== postId));
    } catch (err) {
      console.error("ลบโพสต์ล้มเหลว:", err);
      alert("ไม่สามารถลบโพสต์ได้");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId, userId);          // ✅ ถูกต้องตาม API path
      setPosts(prev => prev.map(p =>
        p.postId === postId ? {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        } : p
      ));
    } catch (err) {
      console.error("ไลก์โพสต์ล้มเหลว:", err);
    }
  };

  const handleToggleShowComments = (postId) => {
    setShowCommentsForPostId(prev => prev === postId ? null : postId);
    setReplyingToComment(null);
  };

  const handleCommentInputChange = (postId, text) => {
    setCommentInput(prev => ({ ...prev, [postId]: text }));
  };

  const handleAddOrReplyComment = async (postId, parentId = null) => {
    const text = commentInput[postId]?.trim();
    if (!text || !postId || !userId) {
      alert("กรุณาเข้าสู่ระบบหรือใส่ข้อความให้ครบก่อนส่งคอมเมนต์");
      return;
    }
    try {
      const comment = await addComment(userId, postId, text, parentId);
      setPosts(prev => prev.map(post => {
        if (post.postId !== postId) return post;
        const newArr = [...(post.commentsArray || [])];
        if (parentId) {
          const recur = (arr) => arr.map(c =>
            c.id === parentId ? { ...c, replies: [...(c.replies || []), comment] } : {
              ...c, replies: recur(c.replies || [])
            });
          return { ...post, commentsArray: recur(newArr), comments: post.comments + 1 };
        }
        return { ...post, commentsArray: [...newArr, comment], comments: post.comments + 1 };
      }));
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
      setReplyingToComment(null);
    } catch (err) {
      console.error("เพิ่มคอมเมนต์ล้มเหลว:", err);
      alert("ไม่สามารถเพิ่มคอมเมนต์ได้");
    }
  };

  const handleDeleteComment = async (postId, commentId, authorId) => {
    if (authorId !== userId) return alert('ไม่มีสิทธิ์ลบ');
    if (!window.confirm('ลบคอมเมนต์นี้?')) return;
    try {
      await deleteComment(commentId, postId);
      const del = (arr) => arr.filter(c => c.id !== commentId).map(c => ({ ...c, replies: del(c.replies || []) }));
      setPosts(prev => prev.map(post => post.postId === postId ? {
        ...post,
        commentsArray: del(post.commentsArray),
        comments: post.comments - 1
      } : post));
    } catch (err) {
      console.error("ลบคอมเมนต์ล้มเหลว:", err);
      alert("ลบคอมเมนต์ไม่สำเร็จ");
    }
  };

  const handleEditComment = async (postId, comment) => {
    const newText = prompt('แก้ไขความคิดเห็น', comment.text);
    if (!newText || newText === comment.text) return;
    try {
      await editComment(comment.id, postId, newText);
      const update = (arr) => arr.map(c => c.id === comment.id ? { ...c, text: newText } : { ...c, replies: update(c.replies || []) });
      setPosts(prev => prev.map(post => post.postId === postId ? {
        ...post,
        commentsArray: update(post.commentsArray)
      } : post));
    } catch (err) {
      console.error("แก้ไขคอมเมนต์ล้มเหลว:", err);
      alert("ไม่สามารถแก้ไขคอมเมนต์ได้");
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      await likeComment(userId, commentId);
      const toggle = (arr) => arr.map(c => c.id === commentId ? {
        ...c,
        isLikedByCurrentUser: !c.isLikedByCurrentUser,
        likes: c.isLikedByCurrentUser ? c.likes - 1 : c.likes + 1
      } : { ...c, replies: toggle(c.replies || []) });
      setPosts(prev => prev.map(post => post.postId === postId ? {
        ...post,
        commentsArray: toggle(post.commentsArray)
      } : post));
    } catch (err) {
      console.error("ไลก์คอมเมนต์ล้มเหลว:", err);
    }
  };

  const filteredPosts = posts.filter(p => {
    const keyword = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      p.caption?.toLowerCase().includes(keyword) ||
      p.name?.toLowerCase().includes(keyword) ||
      p.commentsArray?.some(c => c.text?.toLowerCase().includes(keyword))
    );
  });

  return (
    <div className="community-page-wrapper">
      <div className="community-page-container">
        <div ref={headerRef} className="fixed-header-wrapper">
          <MainTabsBar />
        </div>
        <div className="scrollable-content-area no-scrollbar" style={{ paddingTop: `${headerHeight}px` }}>
          <div className="search-bar-section">
            <div className="search-input-wrapper">
              <span className="search-icon-prefix"><IoSearch /></span>
              <input
                type="text"
                className="search-input-field"
                placeholder="ค้นหาในชุมชน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <button onClick={() => setSearchTerm('')} className="clear-search-button"><IoClose /></button>}
            </div>
          </div>

          <div className="posts-list-section">
            {filteredPosts.map(post => (
              <React.Fragment key={post.postId}>
                <PostCard
                  post={post}
                  currentUserId={userId}
                  isFriend={friends.includes(post.userId)} // ✅ ส่ง isFriend
                  onAddFriend={handleAddFriend}            // ✅ ส่งฟังก์ชันเพิ่มเพื่อน
                  onToggleLike={() => handleLikePost(post.postId)}
                  onToggleShowComments={() => handleToggleShowComments(post.postId)}
                  onNavigateToEdit={() => navigate(`/community/edit/${post.postId}`)}
                  onDeletePost={() => handleDeletePost(post.postId, post.userId)}
                />
                {showCommentsForPostId === post.postId && (
                  <CommentSection
                    postId={post.postId}
                    commentsArray={post.commentsArray || []}
                    commentInputText={commentInput[post.postId] || ''}
                    onCommentInputChange={handleCommentInputChange}
                    onAddOrReplyComment={handleAddOrReplyComment}
                    replyingToComment={replyingToComment}
                    onCancelReply={() => setReplyingToComment(null)}
                    onOpenEditComment={handleEditComment}
                    onToggleLikeComment={handleLikeComment}
                    onDeleteComment={handleDeleteComment}
                    onStartReply={(postId, cId, u) => {
                      setReplyingToComment({ postId, commentId: cId, userName: u });
                      setCommentInput(prev => ({ ...prev, [postId]: `@${u} ` }));
                    }}
                    currentUserId={userId}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate('/community/create')}
          className="create-post-fab"
          style={{ right: fabRight }}
          aria-label="สร้างโพสต์ใหม่"
        >+</button>
        <MenuBar />
      </div>
    </div>
  );
}
