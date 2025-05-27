import { createContext, useContext, useEffect, useState } from "react";

// สร้าง context
const AuthContext = createContext();

// AuthProvider ครอบแอป
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);           // รหัสผู้ใช้
  const [isAuthReady, setIsAuthReady] = useState(false); // บอกว่าโหลด userId จาก localStorage เสร็จหรือยัง

  // โหลด userId จาก localStorage เมื่อแอปเริ่มต้น
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    }
    setIsAuthReady(true); // ✅ แสดงว่าโหลดเสร็จแล้ว ไม่ว่ามี user หรือไม่
  }, []);

  // login: set ค่าเข้า localStorage + state
  const login = (id) => {
    localStorage.setItem("userId", id);
    setUserId(id);
  };

  // logout: clear ค่า
  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook สำหรับใช้ใน component ต่าง ๆ
export const useAuth = () => useContext(AuthContext);
