import API_BASE_URL from '../../config';
import React, { useEffect, useState } from "react";
import PostCard from "../Community/PostCard"; // ✅ ปรับ path ตามจริง

export default function MyPostSection() {
  const userId = localStorage.getItem("userId") || "RPZ3";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile/${userId}/post`)
      .then((res) => {
        if (!res.ok) throw new Error("โหลดโพสต์ไม่สำเร็จ");
        return res.json();
      })
      .then((data) => {
        const formattedPosts = data.map((post) => ({
          id: post.postId,
          name: post.username,
          avatar: post.avatar || "/user-avatar-placeholder.png", // ใช้ default ถ้าไม่มี
          content: post.caption,
          image: post.img_url,
          time: new Date(post.created_at).toLocaleString(),
          likes: post.like.length,
          comments: post.comment.length,
          isLiked: post.like.some((like) => like.username === userId),
          authorId: post.username,
        }));
        setPosts(formattedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ ดึงโพสต์ล้มเหลว:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div style={{ textAlign: "center" }}>กำลังโหลดโพสต์...</div>;
  if (posts.length === 0) return <div style={{ textAlign: "center" }}>ยังไม่มีโพสต์</div>;

  return (
    <div className="my-post-section">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={userId}
          onToggleLike={() => {}}
          onToggleShowComments={() => {}}
          onNavigateToEdit={() => {}}
          onDeletePost={() => {}}
        />
      ))}
    </div>
  );
}
