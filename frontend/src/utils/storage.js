// src/utils/storage.js

/**
 * ดึงข้อมูลจาก localStorage และ parse เป็น JSON
 * @param {string} key - Key ของข้อมูลที่ต้องการดึง
 * @param {any} defaultValue - ค่าเริ่มต้นที่จะ return ถ้าไม่พบข้อมูลหรือเกิด error (default คือ array ว่าง)
 * @returns {any} ข้อมูลที่ parse แล้ว หรือ defaultValue
 */
const getLocalStorageItem = (key, defaultValue = []) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedItem = localStorage.getItem(key);
        try {
            const parsed = storedItem ? JSON.parse(storedItem) : defaultValue;

            // Sanitize Post IDs to be numbers and Comment/Reply IDs to be strings
            if (key === 'communityPosts' && Array.isArray(parsed)) {
                return parsed.map(post => ({
                    ...post,
                    id: Number(post.id), // Ensure post ID is a number
                    commentsArray: (Array.isArray(post.commentsArray) ? post.commentsArray : []).map(comment => ({
                        ...comment,
                        id: String(comment.id), // Ensure comment ID is a string
                        authorId: String(comment.authorId), // Ensure authorId in comment is a string
                        likes: Number(comment.likes) || 0,
                        isLikedByCurrentUser: !!comment.isLikedByCurrentUser,
                        replies: Array.isArray(comment.replies)
                            ? comment.replies.map(reply => ({
                                ...reply,
                                id: String(reply.id), // Ensure reply ID is a string
                                authorId: String(reply.authorId),
                                likes: Number(reply.likes) || 0,
                                isLikedByCurrentUser: !!reply.isLikedByCurrentUser,
                            }))
                            : []
                    }))
                }));
            }

            // Ensure Friend IDs are strings
            if (key === 'myFriendIds' && Array.isArray(parsed)) {
                return parsed.map(id => String(id));
            }

            return parsed; // Return as is for other keys or if not an array for specific keys
        } catch (error) {
            console.error(`Error parsing '${key}' from localStorage:`, error);
            localStorage.removeItem(key); // Attempt to clear corrupted data
            return defaultValue;
        }
    }
    return defaultValue; // Return default if localStorage is not available (e.g., SSR)
};

/**
 * บันทึกข้อมูลลง localStorage (จะถูก JSON.stringify)
 * @param {string} key - Key ของข้อมูลที่ต้องการบันทึก
 * @param {any} value - ค่าที่ต้องการบันทึก
 */
const setLocalStorageItem = (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving '${key}' to localStorage:`, error);
        }
    }
};

// ฟังก์ชันเฉพาะสำหรับจัดการ Posts
export const getPostsFromStorage = () => getLocalStorageItem('communityPosts', []);
export const savePostsToStorage = (posts) => setLocalStorageItem('communityPosts', posts);

// ฟังก์ชันเฉพาะสำหรับจัดการ Friend IDs (เก็บเป็น array ของ string ID)
export const getFriendIdsFromStorage = () => getLocalStorageItem('myFriendIds', []);
export const saveFriendIdsToStorage = (friendIds) => setLocalStorageItem('myFriendIds', friendIds.map(id => String(id))); // Ensure IDs are saved as strings