import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🆕 เพิ่ม useLocation
import { Search } from 'lucide-react';
import { IoClose } from 'react-icons/io5';

import MainTabsBar from '../../components/Community/MainTabsBar/MainTabsBar';
import MenuBar from '../../components/MenuBar/MenuBar';
import PostCard from '../../components/Community/PostCard';
import CommentSection from '../../components/Community/CommentSection';
import FriendListItem from '../../components/Community/FriendListItem';

import './FollowingPage.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchAllPosts,
  fetchFriends,
  followUser,
  unfollowUser,
  likePost,
  likeComment,
  addComment,
  deleteComment,
  editComment
} from '../../services/postService';
import { sanitizePost } from '../../utils/sanitize';

export default function FollowingPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const location = useLocation(); // 🆕 เพิ่ม useLocation เพื่อตรวจ state

  const [tab, setTab] = useState('โพสต์ของเพื่อน');
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [visibleComments, setVisibleComments] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef(null);
  const fabRight = '1rem';

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [tab]);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, friendsListRaw] = await Promise.all([
          fetchAllPosts(),
          fetchFriends(userId)
        ]);

        const friendsList = Array.isArray(friendsListRaw.myfriend)
          ? friendsListRaw.myfriend.map(f => f.userId)
          : [];

        setFriends(friendsList);

        const visible = all
          .filter(p => p.userId === userId || friendsList.includes(p.userId))
          .map(p => {
            const sanitized = sanitizePost(p);
            return {
              ...sanitized,
              isLiked: Array.isArray(p.like)
                ? p.like.some(l => l.username === userId)
                : sanitized.isLiked,
              commentsArray: Array.isArray(p.comment)
                ? p.comment.map((c, i) => ({
                  id: c.cid || i,
                  text: c.caption || '',
                  authorId: c.userId || '',
                  user: c.username || 'Unknown',
                  likes: c.like_count || 0,
                  isLikedByCurrentUser: false,
                  replies: []
                }))
                : sanitized.commentsArray,
              comments: Array.isArray(p.comment)
                ? p.comment.length
                : sanitized.comments
            };
          });

        setPosts(visible);
      } catch (e) {
        console.error('โหลดโพสต์หรือเพื่อนล้มเหลว:', e);
        alert('ไม่สามารถโหลดข้อมูลได้');
      }
    };
    if (userId) load();
  }, [userId]);

  // useEffect(() => {
  //   // 🆕 รีโหลดเพื่อนถ้า location.state.refreshFriends ถูกส่งมาจากหน้าอื่น
  //   if (location.state?.refreshFriends) {
  //     (async () => {
  //       try {
  //         const friendsListRaw = await fetchFriends(userId);
  //         const friendsList = Array.isArray(friendsListRaw.myfriend)
  //           ? friendsListRaw.myfriend.map(f => f.userId)
  //           : [];
  //         setFriends(friendsList);
  //       } catch (e) {
  //         console.error('โหลดเพื่อนล้มเหลวหลัง refresh:', e);
  //       }
  //     })();
  //   }
  // }, [location.state, userId]);

  useEffect(() => {
    if (location.state?.refreshFriends) {
      (async () => {
        try {
          const [all, friendsListRaw] = await Promise.all([
            fetchAllPosts(),
            fetchFriends(userId)
          ]);

          const friendsList = Array.isArray(friendsListRaw.myfriend)
            ? friendsListRaw.myfriend.map(f => f.userId)
            : [];

          setFriends(friendsList);

          const visible = all
            .filter(p => p.userId === userId || friendsList.includes(p.userId))
            .map(p => sanitizePost(p));

          setPosts(visible);
        } catch (e) {
          console.error('โหลดโพสต์หรือเพื่อนล้มเหลวหลัง refresh:', e);
        }
      })();
    }
  }, [location.state, userId]);


  const toggleFriend = async (targetId) => {
    try {
      if (friends.includes(targetId)) {
        await unfollowUser(userId, targetId);
      } else {
        await followUser(userId, targetId);
      }

      // 🎯 โหลดใหม่หลังเปลี่ยนสถานะ
      const [all, newFriendsListRaw] = await Promise.all([
        fetchAllPosts(),
        fetchFriends(userId)
      ]);

      const newFriendsList = Array.isArray(newFriendsListRaw.myfriend)
        ? newFriendsListRaw.myfriend.map(f => f.userId)
        : [];

      setFriends(newFriendsList);

      // 🎯 รีเฟรชโพสต์ใหม่หลังเพิ่มเพื่อน
      const visible = all
        .filter(p => p.userId === userId || newFriendsList.includes(p.userId))
        .map(p => sanitizePost(p));

      setPosts(visible);

    } catch (e) {
      console.error('เปลี่ยนสถานะเพื่อนไม่ได้:', e);
      alert('ไม่สามารถเปลี่ยนสถานะเพื่อนได้');
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId, userId);          // ✅ ถูกต้องตาม API path
      setPosts(prev => prev.map(p =>
        p.postId === postId ? {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        } : p
      ));
    } catch (e) {
      console.error('ไลก์โพสต์ล้มเหลว:', e);
    }
  };

  const toggleComment = (postId) => {
    setVisibleComments(visibleComments === postId ? null : postId);
    setReplyingTo(null);
  };

  const onCommentChange = (postId, val) => {
    setCommentInput(prev => ({ ...prev, [postId]: val }));
  };

  const submitComment = async (postId, parentId = null) => {
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      return;
    }

    const text = commentInput[postId]?.trim();
    if (!text) return;

    try {
      const newComment = await addComment(postId, userId, text);  // ✅ ถูกต้องตาม postService.js
      setPosts(prev => prev.map(p => {
        if (p.postId !== postId) return p;

        const addReply = (arr) => arr.map(c =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : { ...c, replies: addReply(c.replies || []) }
        );

        const updatedComments = parentId
          ? addReply(p.commentsArray)
          : [...(p.commentsArray || []), newComment];

        return {
          ...p,
          commentsArray: updatedComments,
          comments: updatedComments.length
        };
      }));
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
      setReplyingTo(null);
    } catch (e) {
      console.error('เพิ่มคอมเมนต์ล้มเหลว:', e);
    }
  };

  const handleDeleteComment = async (postId, commentId, authorId) => {
    if (authorId !== userId) return alert('ไม่สามารถลบความคิดเห็นนี้');
    if (!window.confirm('ลบความคิดเห็นนี้ใช่หรือไม่?')) return;
    try {
      await deleteComment(commentId, postId);
      const remove = (arr) =>
        arr.filter(c => c.id !== commentId)
          .map(c => ({ ...c, replies: remove(c.replies || []) }));

      setPosts(prev => prev.map(p => {
        if (p.postId !== postId) return p;
        const updated = remove(p.commentsArray);
        return { ...p, commentsArray: updated, comments: updated.length };
      }));
    } catch (e) {
      console.error('ลบคอมเมนต์ล้มเหลว:', e);
    }
  };

  const handleEditComment = async (postId, comment) => {
    const newText = prompt('แก้ไขคอมเมนต์:', comment.text);
    if (!newText || newText === comment.text) return;
    try {
      await editComment(comment.id, postId, newText);
      const edit = (arr) => arr.map(c =>
        c.id === comment.id
          ? { ...c, text: newText }
          : { ...c, replies: edit(c.replies || []) }
      );
      setPosts(prev => prev.map(p =>
        p.postId === postId ? { ...p, commentsArray: edit(p.commentsArray) } : p
      ));
    } catch (e) {
      console.error('แก้ไขคอมเมนต์ล้มเหลว:', e);
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      await likeComment(userId, commentId);
      const toggle = (arr) => arr.map(c =>
        c.id === commentId
          ? {
            ...c,
            isLikedByCurrentUser: !c.isLikedByCurrentUser,
            likes: c.isLikedByCurrentUser ? c.likes - 1 : c.likes + 1
          }
          : { ...c, replies: toggle(c.replies || []) }
      );
      setPosts(prev => prev.map(p =>
        p.postId === postId ? { ...p, commentsArray: toggle(p.commentsArray) } : p
      ));
    } catch (e) {
      console.error('ไลก์คอมเมนต์ล้มเหลว:', e);
    }
  };

  const filteredPosts = posts.filter(p => {
    const keyword = search.toLowerCase();
    return (
      !search ||
      p.caption?.toLowerCase().includes(keyword) ||
      p.name?.toLowerCase().includes(keyword) ||
      p.commentsArray?.some(c => c.text?.toLowerCase().includes(keyword))
    );
  });


  return (
    <div className="following-page-wrapper">
      <div className="following-page-container">
        <div ref={headerRef} className="following-fixed-header-wrapper">
          <MainTabsBar />
          <div className="following-inner-tabs-container">
            {['โพสต์ของเพื่อน', 'เพื่อนของคุณ'].map(t => (
              <button
                key={t}
                className={`following-inner-tab-button ${tab === t ? 'active' : 'inactive'}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="following-scrollable-content-area no-scrollbar" style={{ paddingTop: headerHeight }}>
          <div className="search-bar-section">
            <div className="search-input-wrapper">
              <span className="search-icon-prefix"><Search /></span>
              <input
                className="search-input-field"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหา..."
              />
              {search && (
                <button className="clear-search-button" onClick={() => setSearch('')}>
                  <IoClose />
                </button>
              )}
            </div>
          </div>

          {tab === 'โพสต์ของเพื่อน' ? (
            <div className="following-content-padding posts-list">
              {filteredPosts.map(post => (
                <React.Fragment key={post.postId}>
                  <PostCard
                    post={post}
                    currentUserId={userId}
                    isFriend={friends.includes(post.userId)}
                    onToggleLike={() => handleLike(post.postId)}
                    onToggleShowComments={() => toggleComment(post.postId)}
                    onNavigateToEdit={(postId) => navigate(`/community/edit/${postId}`)}
                    onAddFriend={toggleFriend} // 🎯 ส่ง toggleFriend มาจาก props หรือ Context
                    onDeletePost={(postId, authorId) => {
                      if (userId !== authorId) return alert('ไม่มีสิทธิ์ลบโพสต์นี้');
                      if (!window.confirm('ยืนยันการลบโพสต์นี้?')) return;
                      try {
                        deletePost(userId, postId);
                        setPosts(prev => prev.filter(p => p.postId !== postId));
                      } catch (err) {
                        console.error("ลบโพสต์ล้มเหลว:", err);
                        alert("ไม่สามารถลบโพสต์ได้");
                      }
                    }}
                  />
                  {visibleComments === post.postId && (
                    <CommentSection
                      postId={post.postId}
                      commentsArray={post.commentsArray}
                      commentInputText={commentInput[post.postId] || ''}
                      onCommentInputChange={onCommentChange}
                      onAddOrReplyComment={submitComment}
                      replyingToComment={replyingTo}
                      onCancelReply={() => setReplyingTo(null)}
                      currentUserId={userId}
                      onStartReply={(postId, commentId, userName) => {
                        setReplyingTo({ postId, commentId, userName });
                        setCommentInput(prev => ({ ...prev, [postId]: `@${userName} ` }));
                      }}
                      onDeleteComment={handleDeleteComment}
                      onOpenEditComment={handleEditComment}
                      onToggleLikeComment={handleLikeComment}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="friends-section-list-container">
              {friends.map(fid => (
                <FriendListItem
                  key={fid}
                  user={{ id: fid, name: `ผู้ใช้ ${fid}` }}
                  isAlreadyFriend={true}
                  onToggleFriendship={toggleFriend}
                />
              ))}
            </div>
          )}
        </div>

        <button className="create-post-fab" style={{ right: fabRight }} onClick={() => navigate('/community/create')}>+</button>
        <MenuBar />
      </div>
    </div>
  );
}
