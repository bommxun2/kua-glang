import API_BASE_URL from '../config';
// src/services/postService.js

const BASE_URL = `${API_BASE_URL}`;

// 1. สร้างโพสต์ใหม่
export const createPost = async (userId, postData) => {
  const res = await fetch(`${BASE_URL}/post/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "สร้างโพสต์ล้มเหลว");
  }

  return await res.json();
};

// 2. แก้ไขโพสต์
export const updatePost = async (userId, postId, data) => {
  const res = await fetch(`${BASE_URL}/post/${userId}/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("ไม่สามารถแก้ไขโพสต์ได้");
  }

  return await res.json();
};

// 3. ลบโพสต์
export const deletePost = async (userId, postId) => {
  const res = await fetch(`${BASE_URL}/post/${userId}/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("ไม่สามารถลบโพสต์ได้");
  }
};

// 4. ดึงโพสต์ทั้งหมด (รวมทุกคน)
export const fetchAllPosts = async () => {
  const res = await fetch(`${BASE_URL}/post`);

  if (!res.ok) {
    throw new Error("โหลดโพสต์ทั้งหมดล้มเหลว");
  }

  return await res.json();
};

// 5. ดึงโพสต์ของผู้ใช้ที่ติดตาม
export const fetchUserPosts = async (userId) => {
  const res = await fetch(`${BASE_URL}/post/${userId}`);

  if (!res.ok) {
    throw new Error("โหลดโพสต์ของผู้ใช้ล้มเหลว");
  }

  return await res.json();
};

// ✅ 6. ไลก์โพสต์
export async function likePost(postId, userId) {
  const res = await fetch(`${BASE_URL}/post/like/${userId}/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("ไม่สามารถไลก์โพสต์ได้");
  }

  return await res.json();
}


// 7. ไลก์คอมเมนต์
export const likeComment = async (userId, cId) => {
  const res = await fetch(`${BASE_URL}/post/like/${userId}/comment/${cId}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("ไม่สามารถไลก์คอมเมนต์ได้");
  }
};


// ✅ 8. คอมเมนต์โพสต์
export async function addComment(postId, userId, caption, parentCommentId = null) {
  const res = await fetch(`${BASE_URL}/post/comment-by/${userId}/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, parentCommentId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || 'ไม่สามารถเพิ่มคอมเมนต์ได้');
  }

  return await res.json();
}

// 9. ลบคอมเมนต์
export const deleteComment = async (cId, postId) => {
  const res = await fetch(`${BASE_URL}/post/comment/${cId}/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("ลบคอมเมนต์ล้มเหลว");
  }
};

// 10. แก้ไขคอมเมนต์
export const editComment = async (cId, postId, newText) => {
  const res = await fetch(`${BASE_URL}/post/comment/${cId}/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: newText }),
  });

  if (!res.ok) {
    throw new Error("ไม่สามารถแก้ไขคอมเมนต์ได้");
  }
};

// 11. ดึงรายชื่อเพื่อนและคำแนะนำ
export const fetchFriends = async (userId) => {
  const res = await fetch(`${BASE_URL}/post/friend/${userId}`);

  if (!res.ok) {
    throw new Error("โหลดเพื่อนล้มเหลว");
  }

  return await res.json();
};

// 12. ติดตามผู้ใช้
export const followUser = async (userId, followId) => {
  const res = await fetch(`${BASE_URL}/post/friend/${userId}/${followId}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("ติดตามผู้ใช้ล้มเหลว");
  }
};

// 13. เลิกติดตามผู้ใช้
export const unfollowUser = async (userId, followId) => {
  const res = await fetch(`${BASE_URL}/post/friend/${userId}/${followId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("เลิกติดตามผู้ใช้ล้มเหลว");
  }
};
