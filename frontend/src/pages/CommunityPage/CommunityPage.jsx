// src/pages/CommunityPage/CommunityPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoSearch, IoClose } from "react-icons/io5";

import MainTabsBar from '../../components/Community/MainTabsBar/MainTabsBar';
import MenuBar from '../../components/MenuBar/MenuBar';
import PostCard from '../../components/Community/PostCard';
import CommentSection from '../../components/Community/CommentSection';
import { sanitizePost } from '../../utils/sanitize';

import { getPostsFromStorage, savePostsToStorage } from '../../utils/storage';
import { getFriendIdsFromStorage, saveFriendIdsToStorage } from '../../utils/storage';
import { initialMockPostsData, MOCK_CURRENT_USER_ID, MOCK_CURRENT_USER_NAME } from '../../data/mockData';

import './CommunityPage.css'; // <--- Import CSS for this page

export default function CommunityPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [posts, setPosts] = useState([]);
    const fixedHeaderAndTabsRef = useRef(null);
    const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
    const [fabRightPosition, setFabRightPosition] = useState('1rem'); // For FAB positioning

    const [showCommentsForPostId, setShowCommentsForPostId] = useState(null);
    const [commentInput, setCommentInput] = useState({});
    const [replyingToComment, setReplyingToComment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- useEffect for fixedHeaderHeight (same as before) ---
    useEffect(() => {
        const calculateHeaderHeight = () => {
            if (fixedHeaderAndTabsRef.current) {
                setFixedHeaderHeight(fixedHeaderAndTabsRef.current.offsetHeight);
            }
        };
        calculateHeaderHeight();
        // Consider a ResizeObserver for more robust height changes
        // if (fixedHeaderAndTabsRef.current) {
        //     const resizeObserver = new ResizeObserver(calculateHeaderHeight);
        //     resizeObserver.observe(fixedHeaderAndTabsRef.current);
        //     return () => resizeObserver.disconnect();
        // }
    }, []);


    // --- useEffect for FAB positioning ---
    useEffect(() => {
        const calculateFabPosition = () => {
            const appMaxWidth = 440; // Should match CSS var --app-max-width or be dynamic
            const fabRightEdgeOffsetRem = 1; // Should match CSS var --fab-right-edge-offset
            const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize); // Get current rem size in px

            if (window.innerWidth > appMaxWidth) {
                const spaceOutsideApp = (window.innerWidth - appMaxWidth) / 2;
                setFabRightPosition(`${spaceOutsideApp + (fabRightEdgeOffsetRem * remInPx)}px`);
            } else {
                setFabRightPosition(`${fabRightEdgeOffsetRem * remInPx}px`);
            }
        };
        calculateFabPosition();
        window.addEventListener('resize', calculateFabPosition);
        return () => window.removeEventListener('resize', calculateFabPosition);
    }, []);


    const processedTimestampRef = useRef(null); // ใช้เก็บ timestamp ที่ประมวลผลไปแล้ว

    useEffect(() => {
        console.log('[CommunityPage] useEffect for posts triggered. Location Key:', location.key, 'Location State:', location.state);

        const loadAndSetPosts = () => {
            const storedPosts = getPostsFromStorage();
            console.log('[CommunityPage] Raw posts from storage:', storedPosts);

            if (storedPosts && storedPosts.length > 0) {
                const sanitized = storedPosts
                    .map(sanitizePost)
                    .filter(p => p !== null)
                    .sort((a, b) => Number(b.id) - Number(a.id));
                setPosts(sanitized);
                console.log('[CommunityPage] Set posts from storage.');
            } else {
                // โหลด mock data เฉพาะเมื่อ storage ว่างเปล่าจริงๆ และยังไม่เคยโหลด mock มาก่อนใน session นี้
                // หรือถ้าเป็นการ refresh จาก create/edit แล้ว storage กลายเป็นว่าง (ซึ่งไม่ควรเกิด)
                console.log('[CommunityPage] No posts in storage, loading initial mock data.');
                const initialData = initialMockPostsData
                    .map(sanitizePost)
                    .filter(p => p !== null)
                    .sort((a, b) => Number(b.id) - Number(a.id));
                setPosts(initialData);
                savePostsToStorage(initialData); // Save mock data only if truly initializing
                console.log('[CommunityPage] Loaded and saved initial mock data.');
            }
        };

        // ตรวจสอบว่า state มีการ refresh และ timestamp ยังไม่เคยถูกประมวลผล
        if (location.state?.refresh && location.state.timestamp !== processedTimestampRef.current) {
            console.log('[CommunityPage] Refreshing due to new location state timestamp.');
            loadAndSetPosts();
            processedTimestampRef.current = location.state.timestamp; // บันทึก timestamp ที่ประมวลผลแล้ว
        } else if (!location.state && processedTimestampRef.current === null) {
            // โหลดครั้งแรก (ไม่มี state และยังไม่เคยประมวลผล timestamp ใดๆ)
            console.log('[CommunityPage] Initial page load (no state).');
            loadAndSetPosts();
            processedTimestampRef.current = 'initialLoadDone'; // ตั้งค่าว่าโหลดครั้งแรกเสร็จแล้ว
        } else {
            console.log('[CommunityPage] useEffect triggered but no action taken (state already processed or no refresh needed).');
        }

    }, [location.key, location.state]); // Dependency array ยังคงเดิม

    useEffect(() => {
        // Only save if posts state is not empty or if there was something in localStorage initially
        if (posts.length > 0 || (posts.length === 0 && localStorage.getItem('communityPosts'))) {
            savePostsToStorage(posts);
        }
    }, [posts]);

    
    const [myFriendIds, setMyFriendIds] = useState([]); // <--- State สำหรับเก็บ ID เพื่อน

    // useEffect สำหรับโหลด friend IDs (คล้ายๆ กับการโหลด posts)
    useEffect(() => {
        const friendIds = getFriendIdsFromStorage();
        setMyFriendIds(friendIds.map(String)); // เก็บเป็น string array เพื่อให้เปรียบเทียบง่าย
        console.log('[CommunityPage] Loaded friend IDs:', friendIds.map(String));
    }, [location.key, location.state]); // อาจจะ re-fetch เมื่อ location เปลี่ยน (ถ้าจำเป็น)

    // Handler สำหรับการเพิ่ม/เลิกติดตามเพื่อน
    const handleAddFriend = (userToFollow) => {
        const userIdStr = String(userToFollow.id);
        if (userIdStr === MOCK_CURRENT_USER_ID) return; // ไม่ควรเพิ่มตัวเองเป็นเพื่อน

        setMyFriendIds(prevIds => {
            let updatedFriendIds;
            if (prevIds.includes(userIdStr)) {
                updatedFriendIds = prevIds.filter(id => id !== userIdStr);
                alert(`เลิกติดตาม ${userToFollow.name} แล้ว (จำลอง)`);
            } else {
                updatedFriendIds = [...prevIds, userIdStr];
                alert(`กำลังติดตาม ${userToFollow.name} (จำลอง)`);
            }
            saveFriendIdsToStorage(updatedFriendIds);
            return updatedFriendIds;
        });
    };


    // --- Handlers (mostly same as before) ---
    const handleNavigateToCreatePost = () => navigate('/community/create');
    const handleNavigateToEditPost = (postId) => navigate(`/community/edit/${postId}`);

    const handleDeletePost = (postId, authorIdOfPost) => {
        if (authorIdOfPost !== MOCK_CURRENT_USER_ID) { alert('คุณไม่มีสิทธิ์ลบโพสต์นี้'); return; }
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?')) {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        }
    };
    const handleToggleLike = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1 }
                    : post
            )
        );
    };

    const handleToggleShowComments = (postId) => {
        if (showCommentsForPostId === postId) {
            setShowCommentsForPostId(null);
            setReplyingToComment(null);
        } else {
            setShowCommentsForPostId(postId);
            setCommentInput(prev => ({ ...prev, [postId]: '' }));
            setReplyingToComment(null);
        }
    };

    const handleCommentInputChange = (postId, text) => {
        setCommentInput(prev => ({ ...prev, [postId]: text }));
    };

    const handleAddOrReplyComment = (postId, parentCommentId = null) => {
        const currentCommentText = (commentInput[postId] || '').trim();
        if (!currentCommentText) return;

        const newCommentData = {
            id: `c${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            authorId: MOCK_CURRENT_USER_ID,
            user: MOCK_CURRENT_USER_NAME,
            text: currentCommentText,
            likes: 0,
            isLikedByCurrentUser: false,
            replies: [],
            timestamp: new Date().toISOString(),
        };

        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    let updatedCommentsArray;
                    if (parentCommentId) {
                        const addReplyRecursive = (comments) => comments.map(comment => {
                            if (comment.id === parentCommentId) {
                                return { ...comment, replies: [...(comment.replies || []), newCommentData] };
                            }
                            if (comment.replies && comment.replies.length > 0) {
                                return { ...comment, replies: addReplyRecursive(comment.replies) };
                            }
                            return comment;
                        });
                        updatedCommentsArray = addReplyRecursive(post.commentsArray || []);
                    } else {
                        updatedCommentsArray = [...(post.commentsArray || []), newCommentData];
                    }
                    const totalComments = updatedCommentsArray.reduce((sum,c) => sum + 1 + (c.replies || []).length, 0);
                    return { ...post, commentsArray: updatedCommentsArray, comments: totalComments };
                }
                return post;
            })
        );
        setCommentInput(prev => ({ ...prev, [postId]: '' }));
        setReplyingToComment(null);
    };

    const handleToggleLikeComment = (postId, commentId) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    const findAndToggleLike = (comments) => comments.map(comment => {
                        if (comment.id === commentId) {
                            const newIsLiked = !comment.isLikedByCurrentUser;
                            const newLikes = newIsLiked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1;
                            return { ...comment, isLikedByCurrentUser: newIsLiked, likes: newLikes < 0 ? 0 : newLikes };
                        }
                        if (comment.replies && comment.replies.length > 0) {
                            return { ...comment, replies: findAndToggleLike(comment.replies) };
                        }
                        return comment;
                    });
                    return { ...post, commentsArray: findAndToggleLike(post.commentsArray || []) };
                }
                return post;
            })
        );
    };

    const handleOpenEditComment = (postId, commentToEdit) => {
        if (commentToEdit.authorId !== MOCK_CURRENT_USER_ID) {
            alert('คุณไม่มีสิทธิ์แก้ไขความคิดเห็นนี้');
            return;
        }
        const newText = prompt("แก้ไขความคิดเห็น:", commentToEdit.text);
        if (newText !== null && newText.trim() !== "" && newText.trim() !== commentToEdit.text.trim()) {
            handleSaveEditComment(postId, commentToEdit.id, newText.trim());
        }
    };

    const handleSaveEditComment = (postId, commentId, newText) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    const findAndEdit = (comments) => comments.map(comment => {
                        if (comment.id === commentId) {
                            return { ...comment, text: newText };
                        }
                        if (comment.replies && comment.replies.length > 0) {
                            return { ...comment, replies: findAndEdit(comment.replies) };
                        }
                        return comment;
                    });
                    return { ...post, commentsArray: findAndEdit(post.commentsArray || []) };
                }
                return post;
            })
        );
    };

    const handleDeleteComment = (postId, commentId, commentAuthorId) => {
        if (commentAuthorId !== MOCK_CURRENT_USER_ID) {
            alert('คุณไม่มีสิทธิ์ลบความคิดเห็นนี้');
            return;
        }
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบความคิดเห็นนี้?')) {
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const filterAndDelete = (comments) => {
                            let filtered = comments.filter(c => c.id !== commentId);
                            return filtered.map(c => (c.replies && c.replies.length > 0) ? { ...c, replies: filterAndDelete(c.replies) } : c);
                        };
                        const updatedCommentsArray = filterAndDelete(post.commentsArray || []);
                        const totalComments = updatedCommentsArray.reduce((sum,c) => sum + 1 + (c.replies || []).length, 0);
                        return { ...post, commentsArray: updatedCommentsArray, comments: totalComments };
                    }
                    return post;
                })
            );
        }
    };

    const startReplyToComment = (postId, commentId, userName) => {
        setReplyingToComment({ postId, commentId, userName });
        setShowCommentsForPostId(postId);
        setCommentInput(prev => ({ ...prev, [postId]: `@${userName} ` }));
    };

    const handleClearSearch = () => setSearchTerm('');
    const filteredPosts = posts.filter(post => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        return (
            (post.name && post.name.toLowerCase().includes(term)) ||
            (post.content && post.content.toLowerCase().includes(term)) ||
            (post.location && post.location.toLowerCase().includes(term)) ||
            (post.commentsArray && post.commentsArray.some(comment =>
                (comment.text && comment.text.toLowerCase().includes(term)) ||
                (comment.replies && comment.replies.some(reply => reply.text && reply.text.toLowerCase().includes(term)))
            ))
        );
    });


    // --- Re-assigning handlers to CommentSection for clarity ---
    const commentSectionProps = {
        onToggleLikeComment: handleToggleLikeComment,
        onOpenEditComment: handleOpenEditComment,
        onDeleteComment: handleDeleteComment,
        onStartReply: startReplyToComment,
        currentUserId: MOCK_CURRENT_USER_ID,
    };

    return (
        <div className="community-page-wrapper">
            <div className="community-page-container">
                <div ref={fixedHeaderAndTabsRef} className="fixed-header-wrapper">
                    <MainTabsBar /> {/* Assuming MainTabsBar manages its own active state via useLocation */}
                </div>

                {/* Add "no-scrollbar" class if needed */}
                <div className="scrollable-content-area no-scrollbar" style={{ paddingTop: `${fixedHeaderHeight}px` }}>
                    <div className="search-bar-section">
                        <div className="search-input-wrapper">
                            <span className="search-icon-prefix"><IoSearch /></span>
                            <input
                                type="text"
                                placeholder="ค้นหาในชุมชน..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input-field"
                            />
                            {searchTerm && (
                                <button onClick={handleClearSearch} className="clear-search-button" aria-label="ล้างการค้นหา">
                                    <IoClose />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="posts-list-section">
                        {filteredPosts.map((post) => (
                            <React.Fragment key={`post-fragment-${post.id}`}>
                                <PostCard
                                    post={post}
                                    currentUserId={MOCK_CURRENT_USER_ID}
                                    onToggleLike={handleToggleLike}
                                    onToggleShowComments={handleToggleShowComments}
                                    onNavigateToEdit={handleNavigateToEditPost}
                                    onDeletePost={handleDeletePost}
                                    onAddFriend={handleAddFriend}
                                    isFriend={myFriendIds.includes(String(post.authorId))}
                                />
                                {showCommentsForPostId === post.id && (
                                    <CommentSection
                                        postId={post.id}
                                        commentsArray={post.commentsArray || []}
                                        commentInputText={commentInput[post.id] || ''}
                                        onCommentInputChange={handleCommentInputChange}
                                        onAddOrReplyComment={handleAddOrReplyComment}
                                        replyingToComment={replyingToComment}
                                        onCancelReply={() => setReplyingToComment(null)}
                                        {...commentSectionProps} // Spread common props
                                    />
                                )}
                            </React.Fragment>
                        ))}
                        {filteredPosts.length === 0 && searchTerm && (<p className="status-message-text">ไม่พบผลลัพธ์สำหรับ "{searchTerm}"</p>)}
                        {posts.length === 0 && !searchTerm && (<p className="status-message-text">ยังไม่มีโพสต์ในชุมชน ลองสร้างโพสต์แรกของคุณดูสิ!</p>)}
                    </div>
                </div>

                <button
                    onClick={handleNavigateToCreatePost}
                    className="create-post-fab"
                    style={{ right: fabRightPosition }} // Use dynamic right position
                    aria-label="สร้างโพสต์ใหม่"
                > + </button>

                <MenuBar /> {/* Assuming MenuBar has its own CSS and positioning logic */}
            </div>
        </div>
    );
}