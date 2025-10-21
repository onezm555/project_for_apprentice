import React, { useState } from "react";
import { login, register } from "../api/api";
import Swal from "sweetalert2";
import "../styles/global.css";
import "../styles/AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ userId: "", name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ถ้าเป็นการสมัครสมาชิก ต้องส่ง name ด้วย
      const dataToSend = isLogin
        ? { userId: form.userId, password: form.password }
        : { userId: form.userId, name: form.name, password: form.password };

      const res = isLogin ? await login(dataToSend) : await register(dataToSend);

      localStorage.setItem("token", res.data.token);
      if (res.data?.user?.name) {
        localStorage.setItem("userName", res.data.user.name);
      }

      Swal.fire({
        icon: "success",
        title: isLogin ? "เข้าสู่ระบบสำเร็จ!" : "สมัครสมาชิกสำเร็จ!",
        text: "ยินดีต้อนรับ",
        timer: 1500,
        showConfirmButton: false,
      });
      onLogin();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถดำเนินการได้",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>{isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="ชื่อผู้ใช้"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
          />
          {!isLogin && (
            <input
              placeholder="ชื่อเล่นหรือชื่อจริง"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading
              ? "กำลังดำเนินการ..."
              : isLogin
              ? "เข้าสู่ระบบ"
              : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? (
            <>
              ยังไม่มีบัญชี?{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setIsLogin(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setIsLogin(false);
                }}
                style={{ color: "#2922ffff", fontWeight: 700, cursor: "pointer" }}
              >
                สมัครที่นี่
              </span>
            </>
          ) : (
            <>
              มีบัญชีแล้ว?{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setIsLogin(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setIsLogin(true);
                }}
                style={{ color: "#2922ffff", fontWeight: 700, cursor: "pointer" }}
              >
                เข้าสู่ระบบ
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
