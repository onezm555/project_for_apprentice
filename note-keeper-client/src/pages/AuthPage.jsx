import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { login, register } from "../api/noteApi";
import "../styles/global.css";
import "../styles/AuthPage.css";

const MySwal = withReactContent(Swal);

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ userId: "", name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = isLogin
        ? { userId: form.userId, password: form.password }
        : { userId: form.userId, name: form.name, password: form.password };

      const res = isLogin ? await login(payload) : await register(payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userId", res.data.user.id);


      await MySwal.fire({
        icon: "success",
        title: isLogin ? "เข้าสู่ระบบสำเร็จ!" : "สมัครสมาชิกสำเร็จ!",
        html: isLogin
          ? `<p style="font-size:16px;color:#4b5563">ยินดีต้อนรับกลับ, <b>${res.data.user.name}</b> </p>`
          : `<p style="font-size:16px;color:#4b5563">ยินดีต้อนรับสู่ระบบ, <b>${res.data.user.name}</b> </p>`,
        showConfirmButton: false,
        timer: 1800,
        background: "#ffffff",
        color: "#1f2937",
        backdrop: `
          rgba(0,0,0,0.1)
          left top
          no-repeat
        `,
        customClass: {
          popup: "swal-popup-rounded",
        },
        didOpen: () => {
          const popup = document.querySelector(".swal2-popup");
          if (popup) popup.style.borderRadius = "20px";
        },
      });

      onLogin();
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด ",
        text: err.response?.data?.message || "ไม่สามารถดำเนินการได้",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
        background: "#fff",
        color: "#1f2937",
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
              placeholder="ชื่อเล่น"
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
                style={{
                  color: "#3b82f6",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
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
                style={{
                  color: "#3b82f6",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
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
