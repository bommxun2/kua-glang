import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      navigate("..");
      alert("เข้าสู่ระบบสำเร็จ");
    } else {
      alert("เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="bg-pink-50 flex items-center justify-center min-h-screen">
      <div className="w-[440px] h-[956px] px-6 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-10">ยินดีต้อนรับ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center bg-pink-200 rounded-full px-4 py-3">
            <Mail className="text-pink-600 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้"
              value={form.username}
              onChange={handleChange}
              className="bg-transparent outline-none w-full placeholder:text-pink-600"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center bg-pink-200 rounded-full px-4 py-3">
            <Lock className="text-pink-600 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              className="bg-transparent outline-none w-full placeholder:text-pink-600"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-pink-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-right text-sm text-pink-600">
            <a href="#" className="hover:underline">ลืมรหัสผ่าน?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-full"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Register Prompt */}
        <p className="mt-10 text-sm text-pink-300 text-center">
          ยังไม่มีบัญชีหรือ?{" "}
          <button onClick={() => navigate("/register")} className="text-pink-600 font-semibold">
            ลงทะเบียนได้ที่นี่เลย
          </button>
        </p>
      </div>
    </div>
  );
}
