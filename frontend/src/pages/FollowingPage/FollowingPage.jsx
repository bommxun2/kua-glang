// src/pages/FollowingPage/FollowingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react'; // Icons for PostCard, CommentSection, FriendListItem are in those components
import { IoClose } from "react-icons/io5";

// Import Components
import MainTabsBar from '../../components/Community/MainTabsBar/MainTabsBar';
import MenuBar from '../../components/MenuBar/MenuBar';
import PostCard from '../../components/Community/PostCard';
import CommentSection from '../../components/Community/CommentSection';
import FriendListItem from '../../components/Community/FriendListItem';
import { sanitizePost } from '../../utils/sanitize'; // 

// Import Utilities and Data
import { getPostsFromStorage, savePostsToStorage, getFriendIdsFromStorage, saveFriendIdsToStorage } from '../../utils/storage';
import { initialMockPostsData, allUsersMock, MOCK_CURRENT_USER_ID, MOCK_CURRENT_USER_AVATAR, MOCK_CURRENT_USER_NAME } from '../../data/mockData';

// Import CSS
import './FollowingPage.css';
// ถ้า Search Bar และ FAB ใช้ CSS จาก CommunityPage และคุณต้องการให้มันแยกขาด
// คุณจะต้อง copy CSS rules เหล่านั้นมาใส่ใน FollowingPage.css หรือสร้าง CSS เฉพาะ
// import '../CommunityPage/CommunityPage.css'; // Optional: if sharing some common page styles

export default function FollowingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [innerActiveTab, setInnerActiveTab] = useState('โพสต์ของเพื่อน');
    const [allPosts, setAllPosts] = useState([]);
    const [myFriendIds, setMyFriendIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fixedHeaderAndTabsRef = useRef(null);
    const [totalFixedHeaderHeight, setTotalFixedHeaderHeight] = useState(0);
    const [fabRightPosition, setFabRightPosition] = useState('1rem');

    // Comment related states
    const [showCommentsForPostId, setShowCommentsForPostId] = useState(null);
    const [commentInput, setCommentInput] = useState({});
    const [replyingToComment, setReplyingToComment] = useState(null);

    useEffect(() => {
        if (fixedHeaderAndTabsRef.current) {
            setTotalFixedHeaderHeight(fixedHeaderAndTabsRef.current.offsetHeight);
        }
    }, [innerActiveTab]);

    useEffect(() => {
        // Load Posts
        const postsFromStorage = getPostsFromStorage();
        if (postsFromStorage && postsFromStorage.length > 0) {
            setAllPosts(postsFromStorage.map(sanitizePost).filter(p => p !== null));
        } else {
            const initialData = initialMockPostsData.map(sanitizePost).filter(p => p !== null);
            setAllPosts(initialData);
            savePostsToStorage(initialData);
        }
        // Load Friend IDs
        const friendIds = getFriendIdsFromStorage();
        if (friendIds && friendIds.length > 0) {
            setMyFriendIds(friendIds.map(String)); // Ensure IDs are strings
        } else {
            const initialFriendIds = allUsersMock
                .filter(u => u.id !== MOCK_CURRENT_USER_ID && ['user456', 'userABC', 'userGHI'].includes(u.id))
                .map(f => String(f.id));
            setMyFriendIds(initialFriendIds);
            saveFriendIdsToStorage(initialFriendIds);
        }
    }, [location.key, location.state]); // Re-fetch on navigation or state change

    useEffect(() => { saveFriendIdsToStorage(myFriendIds); }, [myFriendIds]);
    useEffect(() => { if (allPosts.length > 0 || localStorage.getItem('communityPosts')) savePostsToStorage(allPosts); }, [allPosts]);

    // FAB Positioning
    useEffect(() => {
        const calculateFabPosition = () => {
            const appMaxWidth = 440;
            const fabRightEdgeOffsetRem = 1;
            const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
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


    // Derived States
    const followedPosts = allPosts.filter(post =>
        myFriendIds.includes(String(post.authorId)) || String(post.authorId) === MOCK_CURRENT_USER_ID
    ).sort((a, b) => Number(b.id) - Number(a.id));

    const myFriendDetails = allUsersMock.filter(user => myFriendIds.includes(String(user.id)));
    const usersForSuggestion = allUsersMock
        .filter(user => String(user.id) !== MOCK_CURRENT_USER_ID && !myFriendIds.includes(String(user.id)))
        .slice(0, 6);

    // --- Friend Management ---
    const handleToggleFriendship = (userToToggleId) => {
        const userIdStr = String(userToToggleId);
        const userObject = allUsersMock.find(u => String(u.id) === userIdStr);
        if (!userObject) return;
        setMyFriendIds(prevIds => {
            if (prevIds.includes(userIdStr)) {
                alert(`เลิกติดตาม ${userObject.name} แล้ว`);
                return prevIds.filter(id => id !== userIdStr);
            } else {
                alert(`ติดตาม ${userObject.name} แล้ว`);
                return [...prevIds, userIdStr];
            }
        });
    };

    // --- Post & Comment Actions (Adapted for setAllPosts) ---
    const handleNavigateToEditPost = (postId) => navigate(`/community/edit/${postId}`);

    const handleDeletePost = (postId, authorIdOfPost) => {
        if (authorIdOfPost !== MOCK_CURRENT_USER_ID) { alert('คุณไม่มีสิทธิ์ลบโพสต์นี้'); return; }
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?')) {
            setAllPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        }
    };

    const handleToggleLike = (postId) => {
        setAllPosts(prevPosts =>
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
        const newCommentData = { id: `c${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, authorId: MOCK_CURRENT_USER_ID, user: MOCK_CURRENT_USER_NAME, text: currentCommentText, likes: 0, isLikedByCurrentUser: false, replies: [], timestamp: new Date().toISOString() };
        setAllPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    let updatedCommentsArray;
                    if (parentCommentId) {
                        const addReplyRecursive = (comments) => comments.map(c => c.id === parentCommentId ? { ...c, replies: [...(c.replies || []), newCommentData] } : (c.replies && c.replies.length > 0 ? { ...c, replies: addReplyRecursive(c.replies) } : c));
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
        setAllPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    const toggle = (arr) => arr.map(c => {
                        if (c.id === commentId) {
                            const newIsLiked = !c.isLikedByCurrentUser;
                            const newLikes = newIsLiked ? (c.likes || 0) - 1 : (c.likes || 0) + 1; // Corrected logic
                            return { ...c, isLikedByCurrentUser: newIsLiked, likes: Math.max(0, newLikes) };
                        }
                        return c.replies && c.replies.length > 0 ? { ...c, replies: toggle(c.replies) } : c;
                    });
                    return { ...post, commentsArray: toggle(post.commentsArray || []) };
                }
                return post;
            })
        );
    };

    const handleOpenEditComment = (postId, commentToEdit) => {
        if (commentToEdit.authorId !== MOCK_CURRENT_USER_ID) { alert('คุณไม่มีสิทธิ์แก้ไขความคิดเห็นนี้'); return; }
        const newText = prompt("แก้ไขความคิดเห็น:", commentToEdit.text);
        if (newText !== null && newText.trim() !== "" && newText.trim() !== commentToEdit.text.trim()) {
            handleSaveEditComment(postId, commentToEdit.id, newText.trim());
        }
    };

    const handleSaveEditComment = (postId, commentId, newText) => {
        setAllPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    const edit = (arr) => arr.map(c => c.id === commentId ? { ...c, text: newText } : (c.replies && c.replies.length > 0 ? { ...c, replies: edit(c.replies) } : c));
                    return { ...post, commentsArray: edit(post.commentsArray || []) };
                }
                return post;
            })
        );
    };

    const handleDeleteComment = (postId, commentId, commentAuthorId) => {
        if (commentAuthorId !== MOCK_CURRENT_USER_ID) { alert('คุณไม่มีสิทธิ์ลบความคิดเห็นนี้'); return; }
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบความคิดเห็นนี้?')) {
            setAllPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const filterDel = (arr) => arr.filter(c => c.id !== commentId).map(c => (c.replies && c.replies.length > 0 ? { ...c, replies: filterDel(c.replies) } : c));
                        const newArr = filterDel(post.commentsArray || []);
                        const totalComments = newArr.reduce((sum,c) => sum + 1 + (c.replies || []).length, 0);
                        return { ...post, commentsArray: newArr, comments: totalComments };
                    }
                    return post;
                })
            );
        }
    };

    const startReplyToComment = (postId, commentId, userName) => {
        setReplyingToComment({ postId, commentId, userName });
        setShowCommentsForPostId(postId); // Ensure comment section is open
        setCommentInput(prev => ({ ...prev, [postId]: `@${userName} ` })); // Pre-fill with @username
    };
    // --- End Post & Comment Actions ---

    const handleClearSearch = () => setSearchTerm('');

    const filteredFollowedPosts = followedPosts.filter(post => {
        const term = searchTerm.toLowerCase();
        if (!term && innerActiveTab === 'โพสต์ของเพื่อน') return true;
        if (!term) return false; // No search term but not on "โพสต์ของเพื่อน" tab
        return (
            (post.name && post.name.toLowerCase().includes(term)) ||
            (post.content && post.content.toLowerCase().includes(term))
        );
    });
    const filteredMyFriendDetails = myFriendDetails.filter(friend =>
        searchTerm ? friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );
    const filteredUsersForSuggestion = usersForSuggestion.filter(user =>
        searchTerm ? user.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

    const commentSectionProps = {
        onToggleLikeComment: handleToggleLikeComment,
        onOpenEditComment: handleOpenEditComment,
        onDeleteComment: handleDeleteComment,
        onStartReply: startReplyToComment,
        currentUserId: MOCK_CURRENT_USER_ID,
    };


    return (
        <div className="following-page-wrapper">
            <div className="following-page-container">
                <div ref={fixedHeaderAndTabsRef} className="following-fixed-header-wrapper">
                    <MainTabsBar /> {/* MainTabsBar handles its own active tab based on location.pathname */}
                    <div className="following-inner-tabs-container">
                        {['โพสต์ของเพื่อน', 'เพื่อนของคุณ'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setInnerActiveTab(tab); setSearchTerm(''); }} // Clear search on tab change
                                className={`following-inner-tab-button ${innerActiveTab === tab ? 'active' : 'inactive'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="following-scrollable-content-area no-scrollbar" style={{ paddingTop: `${totalFixedHeaderHeight}px` }}>
                    {/* Search Bar (Assuming shared CSS with CommunityPage or defined in FollowingPage.css) */}
                    <div className="search-bar-section"> {/* Using class from CommunityPage as example */}
                        <div className="search-input-wrapper">
                            <span className="search-icon-prefix"><Search /></span>
                            <input
                                type="text"
                                placeholder={innerActiveTab === 'โพสต์ของเพื่อน' ? "ค้นหาโพสต์ของเพื่อน..." : "ค้นหารายชื่อเพื่อน..."}
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

                    {innerActiveTab === 'โพสต์ของเพื่อน' && (
                        <div className="following-content-padding posts-list">
                            {filteredFollowedPosts.length > 0 ? (
                                filteredFollowedPosts.map(post => (
                                    <React.Fragment key={`post-frag-following-${post.id}`}>
                                        <PostCard
                                            post={post}
                                            currentUserId={MOCK_CURRENT_USER_ID}
                                            isFriend={myFriendIds.includes(String(post.authorId))} // Check if author is a friend
                                            onToggleLike={handleToggleLike}
                                            onToggleShowComments={handleToggleShowComments}
                                            onNavigateToEdit={handleNavigateToEditPost}
                                            onDeletePost={handleDeletePost}
                                            // onAddFriend is not typically for posts by friends, but for suggestions on other pages
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
                                                {...commentSectionProps}
                                            />
                                        )}
                                    </React.Fragment>
                                ))
                            ) : ( <p className="status-message-text">{searchTerm ? `ไม่พบโพสต์ที่ตรงกับ "${searchTerm}"` : "ยังไม่มีโพสต์จากคนที่คุณติดตาม หรือคุณอาจจะยังไม่ได้ติดตามใคร"}</p> )}
                        </div>
                    )}
                    {innerActiveTab === 'เพื่อนของคุณ' && (
                        <div className="following-content-padding">
                             <div style={{ marginBottom: '1.5rem' }}>
                                <h2 className="friends-section-title">เพื่อนทั้งหมด ({filteredMyFriendDetails.length})</h2>
                                {filteredMyFriendDetails.length > 0 ? (
                                    <div className="friends-section-list-container">
                                        {filteredMyFriendDetails.map(friend => <FriendListItem key={friend.id} user={friend} isAlreadyFriend={true} onToggleFriendship={handleToggleFriendship} />)}
                                    </div>
                                ) : ( <p className="status-message-text" style={{ fontSize: '0.875rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>{searchTerm ? `ไม่พบเพื่อนที่ชื่อ "${searchTerm}"` : "คุณยังไม่ได้ติดตามใคร"}</p> )}
                            </div>
                            <div>
                                <h2 className="friends-section-title">แนะนำสำหรับคุณ</h2>
                                {filteredUsersForSuggestion.length > 0 ? (
                                    <div className="friends-section-list-container">
                                        {filteredUsersForSuggestion.map(user => <FriendListItem key={user.id} user={user} isAlreadyFriend={false} isSuggestion={true} onToggleFriendship={handleToggleFriendship}/>)}
                                    </div>
                                ) : ( <p className="status-message-text" style={{ fontSize: '0.875rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>{searchTerm ? `ไม่พบผู้ใช้ที่ชื่อ "${searchTerm}"`: "ไม่มีคำแนะนำเพื่อนในขณะนี้"}</p> )}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={() => navigate('/community/create')} className="create-post-fab" style={{ right: fabRightPosition }} aria-label="สร้างโพสต์ใหม่" >+</button>
                <MenuBar />
            </div>
        </div>
    );
}