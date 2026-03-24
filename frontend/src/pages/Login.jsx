import API_BASE_URL from '../config';
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/home";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      login(data.userId);
      navigate(from, { replace: true });
    } else {
      alert("เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="bg-pink-50 flex items-center justify-center min-h-screen">
      <div className="w-[440px] max-w-[90%] h-auto md:h-[956px] px-6 py-10 md:py-0 flex flex-col justify-center rounded-lg md:rounded-none shadow-lg md:shadow-none bg-white md:bg-transparent"> {/* ปรับปรุง responsive และ background เล็กน้อย */}
        <h1 className="text-3xl font-bold text-pink-600 mb-10 text-center">ยินดีต้อนรับ</h1>

        <form onSubmit={handleSubmit} className="space-y-6"> {/* เพิ่ม space-y */}
          {/* Username Input */}
          <div className="flex items-center bg-pink-100 md:bg-pink-200 rounded-full px-4 py-3"> {/* ปรับสีพื้นหลัง input สำหรับ mobile */}
            <User className="text-pink-600 mr-3" /> {/* เพิ่ม margin */}
            <input
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้"
              value={form.username}
              onChange={handleChange}
              className="bg-transparent outline-none w-full placeholder:text-pink-400 md:placeholder:text-pink-600 text-pink-700" // ปรับสี placeholder
              required // เพิ่ม required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center bg-pink-100 md:bg-pink-200 rounded-full px-4 py-3"> {/* ปรับสีพื้นหลัง input สำหรับ mobile */}
            <Lock className="text-pink-600 mr-3" /> {/* เพิ่ม margin */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              className="bg-transparent outline-none w-full placeholder:text-pink-400 md:placeholder:text-pink-600 text-pink-700" // ปรับสี placeholder
              required // เพิ่ม required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              // เพิ่มคลาสเหล่านี้เข้าไป
              className="ml-2 bg-transparent border-none p-0 focus:outline-none text-pink-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right text-sm text-pink-600">
            {/* หากมีหน้าลืมรหัสผ่านจริง ควรใช้ navigate */}
            <button type="button" onClick={() => alert("ฟังก์ชันลืมรหัสผ่านยังไม่พร้อมใช้งาน")} className="hover:underline bg-transparent border-none p-0 focus:outline-none">
              ลืมรหัสผ่าน?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-full hover:bg-pink-700 transition duration-150"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Register Prompt */}
        <p className="mt-10 text-sm text-pink-400 md:text-pink-300 text-center"> {/* ปรับสีข้อความ */}
          ยังไม่มีบัญชีหรือ?{" "}
          <button
            onClick={() => navigate("/register")}
            // เพิ่มคลาสเหล่านี้เข้าไป
            className="bg-transparent border-none p-0 focus:outline-none text-pink-600 font-semibold hover:underline"
          >
            ลงทะเบียนได้ที่นี่เลย
          </button>
        </p>
      </div>
    </div>
  );
}