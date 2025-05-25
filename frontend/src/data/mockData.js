// src/data/mockData.js

// ข้อมูลผู้ใช้ปัจจุบัน (จำลอง)
export const MOCK_CURRENT_USER_ID = 'user123'; // ควรเป็น String
export const MOCK_CURRENT_USER_NAME = 'นางสาวสมหมาย (คุณ)';
export const MOCK_CURRENT_USER_AVATAR = '/user-avatar-1.jpg'; // ตรวจสอบ path รูปใน public folder

// ข้อมูลผู้ใช้ทั้งหมดในระบบ (จำลอง)
export const allUsersMock = [
    { id: 'user123', name: 'นางสาวสมหมาย (คุณ)', avatar: '/user-avatar-1.jpg' },
    { id: 'user456', name: 'ปาร์ค มินซยอง', avatar: '/user-avatar-2.jpg' },
    { id: 'user789', name: 'John Doe', avatar: '/user-avatar-placeholder.png' },
    { id: 'userABC', name: 'แพทย์หญิง อังอังอัง', avatar: '/user-avatar-placeholder.png' },
    { id: 'userDEF', name: 'ทุเรียน ทุเรียน', avatar: '/user-avatar-placeholder.png' },
    { id: 'userGHI', name: 'นักเทสซ่า บ้าบ้า007', avatar: '/user-avatar-placeholder.png' },
    { id: 'userJKL', name: 'เบบี้', avatar: '/user-avatar-placeholder.png' },
    // แนะนำสำหรับคุณ
    { id: 'userS1', name: 'คุณวันศุกร์', avatar: '/user-avatar-placeholder.png'},
    { id: 'userS2', name: 'คุณวันเสาร์', avatar: '/user-avatar-placeholder.png'},
    { id: 'userS3', name: 'คุณชายภัทร', avatar: '/user-avatar-placeholder.png'},
];

// ข้อมูลโพสต์เริ่มต้น (Mock Data)
export const initialMockPostsData = [
    {
        id: 1, // Number
        authorId: 'user123', // String
        name: 'นางสาวสมหมาย (คุณ)',
        avatar: '/user-avatar-1.jpg',
        location: 'เกาะสมุย',
        time: '1 วันที่แล้ว',
        content: 'มีเลย์เหลือหลายถุงเลยค่ะ สามารถนำมาทำเมนูอะไรได้บ้างคะ #ขนม #ทำอาหาร',
        image: '/chips.jpg', // ตรวจสอบว่ามีไฟล์นี้ใน public folder
        likes: 519, // Number
        comments: 2, // Number (จะถูกคำนวณใหม่จาก commentsArray.length + replies.length)
        isLiked: false, // boolean
        commentsArray: [ // Array of comment objects
            {
                id: 'c1', // String
                authorId: 'user456', // String
                user: 'ปาร์ค มินซยอง',
                text: 'ลองทำเลย์ผัดไข่เค็มดูครับ อร่อยนะ!',
                likes: 10, // Number
                isLikedByCurrentUser: false, // boolean
                replies: [] // Array of reply objects
            },
            {
                id: 'c2',
                authorId: 'user789',
                user: 'John Doe',
                text: 'น่าสนใจมากค่ะ ไว้จะลองดู',
                likes: 5,
                isLikedByCurrentUser: true,
                replies: []
            }
        ]
    },
    {
        id: 2, // Number
        authorId: 'user456', // String
        name: 'ปาร์ค มินซยอง',
        avatar: '/user-avatar-2.jpg',
        location: 'โคนันคุง',
        time: '3 วันที่แล้ว',
        content: 'ช่วงนี้มีเส้นมาม่าหมดอายุในตู้ อยากเอามาทำเมนูแปลก ๆ มีใครแนะนำเมนูอะไรไหมคะ',
        image: null,
        likes: 305,
        comments: 1,
        isLiked: true,
        commentsArray: [
            {
                id: 'c3',
                authorId: 'user123',
                user: 'นางสาวสมหมาย (คุณ)',
                text: 'เมนูนี้ก็น่าลองทำตามนะคะ! เคยเห็นคนทำมาม่าผัดขี้เมาใส่ไข่ดาว น่าจะอร่อย',
                likes: 15,
                isLikedByCurrentUser: false,
                replies: []
            }
        ]
    },
    {
        id: 3, // Number
        authorId: 'user123', // String
        name: 'นางสาวสมหมาย (คุณ)',
        avatar: '/user-avatar-1.jpg',
        location: 'ชินอิจิ',
        time: '25 วันที่แล้ว',
        content: 'ต้นเดือนนี้มีธุระเร่งด่วนต้องไปทำงานที่ต่างจังหวัด 1 สัปดาห์ แต่ซื้อของสดอย่างเนื้อหมูกับผักสดมาแล้ว ควรทำยังไงดี ช่วยแนะนำเราหน่อยนะคะ',
        image: null,
        likes: 102,
        comments: 0,
        isLiked: false,
        commentsArray: []
    },
    {
        id: 4, // Number
        authorId: 'userABC', // String
        name: 'แพทย์หญิง อังอังอัง',
        avatar: '/user-avatar-placeholder.png',
        location: 'โรงพยาบาล',
        time: '2 วันที่แล้ว',
        content: 'วันนี้ผ่าตัดเคสยากสำเร็จไปด้วยดีค่ะ ภูมิใจมากๆ 😊 #คุณหมอ #ชีวิตดีดี',
        image: null,
        likes: 750,
        comments: 0,
        isLiked: false,
        commentsArray: []
    },
];