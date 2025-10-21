import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api/api";
import "../styles/global.css";
import "../styles/TodoPage.css";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchUser();
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดรายการได้",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = () => {
    const name = localStorage.getItem("userName") || "ผู้ใช้";
    setUserName(name);
  };

  const handleAdd = async () => {
    if (!text.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อความ",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    try {
      await addTodo({ text });
      setText("");
      fetchTodos();

      Swal.fire({
        icon: "success",
        title: "เพิ่มรายการสำเร็จ!",
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเพิ่มรายการได้",
        text: err.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  /** ✅ ลบรายการ */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบนี้ไม่สามารถย้อนกลับได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteTodo(id);
        fetchTodos();
        Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: err.message,
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleToggle = async (id, done) => {
    try {
      await updateTodo(id, { done: !done });
      fetchTodos();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "อัปเดตไม่สำเร็จ",
        text: err.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "ออกจากระบบหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        Swal.fire({
          icon: "success",
          title: "ออกจากระบบแล้ว",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.href = "/login";
        });
      }
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  return (
    <div className="todo-wrapper">
      <div className="todo-box">
 
        <div className="todo-header">
          <h3 className="user-name">สวัสดีคุณ {userName}</h3>
          <button className="logout-btn" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
        <h2 className="todo-title">รายการสิ่งที่ต้องทำ</h2>
        <div className="todo-input-row">
          <input
            className="todo-input"
            placeholder="เพิ่มสิ่งที่ต้องทำ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="todo-add-btn" onClick={handleAdd}>
            เพิ่ม
          </button>
        </div>

        <div className="todo-filter">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`todo-filter-btn ${filter === type ? "active" : ""}`}
            >
              {type === "all"
                ? "ทั้งหมด"
                : type === "active"
                ? "ยังไม่เสร็จ"
                : "เสร็จสิ้นแล้ว"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="todo-empty">กำลังโหลด...</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.length === 0 ? (
              <p className="todo-empty">ยังไม่มีรายการ</p>
            ) : (
              filteredTodos.map((todo) => (
                <li key={todo._id} className="todo-item">
                  <label className="todo-label">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => handleToggle(todo._id, todo.done)}
                    />
                    <span className={todo.done ? "done" : ""}>{todo.text}</span>
                  </label>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="todo-delete-btn"
                  >
                    ลบ
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
