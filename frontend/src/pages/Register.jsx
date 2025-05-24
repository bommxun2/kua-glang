import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Bookmark, Eye, EyeOff, Camera } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_num: "",
    line_id: "",
    password: "",
    confirmPassword: "",
    profile_url: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: upload or preview logic
      const url = URL.createObjectURL(file);
      setForm({ ...form, profile_url: url });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    const { confirmPassword, ...payload } = form;

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("ลงทะเบียนสำเร็จ");
      navigate("/login");
    } else {
      alert("ลงทะเบียนไม่สำเร็จ");
    }
  };

  return (
    <div className="bg-pink-50 flex items-center justify-center min-h-screen">
      <div className="w-[440px] h-[956px] px-6 py-4">
        <button onClick={() => navigate(-1)} className="text-pink-600 mb-2">
          ←
        </button>
        <h1 className="text-3xl font-bold text-pink-600 mb-6">ลงทะเบียน</h1>

        {/* Profile image uploader */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow">
          <label htmlFor="profileUpload" className="cursor-pointer text-pink-500">
            <Camera />
          </label>
          <input
            type="file"
            id="profileUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input icon={<User />} name="username" placeholder="ชื่อผู้ใช้" value={form.username} onChange={handleChange} />
          <Input icon={<Mail />} name="email" placeholder="อีเมล" value={form.email} onChange={handleChange} />
          <Input icon={<Phone />} name="phone_num" placeholder="เบอร์โทรติดต่อ" value={form.phone_num} onChange={handleChange} />
          <Input icon={<Bookmark />} name="line_id" placeholder="ไอดีไลน์" value={form.line_id} onChange={handleChange} />
          <Input
            icon={<Lock />}
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff /> : <Eye />}</button>
            }
          />
          <Input
            icon={<Lock />}
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="ยืนยันรหัสผ่าน"
            value={form.confirmPassword}
            onChange={handleChange}
            rightIcon={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff /> : <Eye />}</button>
            }
          />

          <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-full">
            ลงทะเบียน
          </button>
        </form>

        <p className="mt-6 text-sm text-pink-300 text-center">
          มีบัญชีอยู่แล้วหรอ?{" "}
          <button onClick={() => navigate("/login")} className="text-pink-600 font-semibold">
            เข้าสู่ระบบได้ที่นี่เลย
          </button>
        </p>
      </div>
    </div>
  );
}

function Input({ icon, rightIcon, ...props }) {
  return (
    <div className="flex items-center bg-pink-200 rounded-full px-4 py-3">
      <div className="text-pink-600 mr-2">{icon}</div>
      <input
        className="bg-transparent outline-none w-full placeholder:text-pink-600"
        {...props}
      />
      {rightIcon && <div className="ml-2 text-pink-600">{rightIcon}</div>}
    </div>
  );
}
