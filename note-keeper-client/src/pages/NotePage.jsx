import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  togglePin,
} from "../api/noteApi";
import "../styles/global.css";
import "../styles/NotePage.css";
import "../styles/sweetalert.css";

const MySwal = withReactContent(Swal);

export default function NotePage() {
  const [notes, setNotes] = useState([]);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userId) window.location.href = "/login";
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes(userId);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถโหลดข้อมูลได้: ${err.message}`,
        "error"
      );
    }
  };

  const handleAddNote = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "เพิ่มสิ่งที่ต้องทำใหม่",
      html: `
      <input id="swal-title" class="swal2-input note-input" placeholder="หัวข้อ">
      <textarea id="swal-content" class="swal2-textarea note-textarea" placeholder="รายละเอียด..."></textarea>
      <input id="swal-tags" class="swal2-input note-input" placeholder="แท็ก (เช่น งาน , ส่วนตัว)">
    `,
      confirmButtonText: "บันทึก",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      focusConfirm: false,
      width: "600px", // ✅ กำหนดขนาด popup
      customClass: {
        popup: "note-popup", // ใช้ class เพื่อควบคุม style
      },
      didOpen: () => {
        const textarea = document.getElementById("swal-content");
        textarea.style.resize = "none";
        textarea.style.height = "90px";
        textarea.style.maxHeight = "120px";
        textarea.style.overflowY = "auto";
      },
      preConfirm: () => {
        const title = document.getElementById("swal-title").value.trim();
        const content = document.getElementById("swal-content").value.trim();
        const tags = document.getElementById("swal-tags").value.trim();
        if (!title || !content) {
          Swal.showValidationMessage("กรุณากรอกหัวข้อและรายละเอียด");
          return false;
        }
        return { title, content, tags: tags ? tags.split(",") : [] };
      },
    });

    if (formValues) {
      try {
        await addNote({ userId, ...formValues });
        Swal.fire("สำเร็จ", "เพิ่มสิ่งที่ต้องทำแล้ว!", "success");
        fetchNotes();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.message, "error");
      }
    }
  };

  //แก้ไข Note
  const handleEditNote = async (note) => {
    const { value: formValues } = await MySwal.fire({
      title: "แก้ไข Note",
      html: `
      <input id="swal-title" class="swal2-input note-input" placeholder="หัวข้อ" value="${
        note.title
      }">
      <textarea id="swal-content" class="swal2-textarea note-textarea" placeholder="รายละเอียด">${
        note.content
      }</textarea>
      <input id="swal-tags" class="swal2-input note-input" placeholder="แท็ก (คั่นด้วย ,)" value="${note.tags.join(
        ","
      )}">
    `,
      confirmButtonText: "บันทึก",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      focusConfirm: false,
      width: "600px",
      customClass: {
        popup: "note-popup",
      },
      didOpen: () => {
        const textarea = document.getElementById("swal-content");
        textarea.style.resize = "none";
        textarea.style.height = "120px";
      },
      preConfirm: () => {
        const title = document.getElementById("swal-title").value.trim();
        const content = document.getElementById("swal-content").value.trim();
        const tags = document.getElementById("swal-tags").value.trim();
        if (!title || !content) {
          Swal.showValidationMessage("กรุณากรอกหัวข้อและรายละเอียด");
          return false;
        }
        return { title, content, tags: tags ? tags.split(",") : [] };
      },
    });

    if (formValues) {
      try {
        await updateNote(note._id, formValues);
        Swal.fire("อัปเดตสำเร็จ", "", "success");
        fetchNotes();
      } catch (err) {
        Swal.fire("แก้ไขไม่สำเร็จ", err.message, "error");
      }
    }
  };

  //ลบ Note
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteNote(id);
        fetchNotes();
        Swal.fire("ลบสำเร็จ!", "", "success");
      } catch (err) {
        Swal.fire("ผิดพลาด", err.message, "error");
      }
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      await togglePin(noteId);

      setNotes((prevNotes) => {
        const updated = prevNotes.map((n) =>
          n._id === noteId ? { ...n, isPinned: !n.isPinned } : n
        );

        return [...updated].sort((a, b) => {
          if (b.isPinned !== a.isPinned) return b.isPinned - a.isPinned;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      });
    } catch (err) {
      console.error("Error toggling pin:", err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถปักหมุดได้", "error");
    }
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-box" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div className="todo-header">
          <h3>สวัสดี {userName}</h3>
          <button
            className="logout-btn"
            onClick={async () => {
              const result = await Swal.fire({
                title: "ออกจากระบบ?",
                text: "คุณต้องการออกจากระบบใช่ไหม?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "ออกจากระบบ",
                cancelButtonText: "ยกเลิก",
                confirmButtonColor: "#3b82f6",
                cancelButtonColor: "#9ca3af",
              });

              if (result.isConfirmed) {
                localStorage.clear();
                Swal.fire({
                  icon: "success",
                  title: "ออกจากระบบสำเร็จ!",
                  showConfirmButton: false,
                  timer: 1000,
                });
                setTimeout(() => {
                  window.location.href = "/login";
                }, 1000);
              }
            }}
          >
            ออกจากระบบ
          </button>
        </div>

        <div
          className="header-row"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            className="todo-title"
            style={{
              fontSize: "1.8rem",
              marginBottom: "16px",
              color: "var(--color-primary)",
            }}
          >
            บันทึกของคุณ
          </h2>

          {/* 🔍 ช่องค้นหา */}
          <input
            type="text"
            placeholder="ค้นหาจากหัวข้อหรือแท็ก..."
            onChange={(e) => {
              const keyword = e.target.value.toLowerCase();
              if (!keyword) {
                fetchNotes();
              } else {
                setNotes((prev) =>
                  prev.filter(
                    (note) =>
                      note.title.toLowerCase().includes(keyword) ||
                      note.tags.some((tag) =>
                        tag.toLowerCase().includes(keyword)
                      )
                  )
                );
              }
            }}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1.5px solid var(--color-border)",
              marginBottom: "20px",
              fontSize: "16px",
              background: "var(--color-card)",
              color: "var(--color-text)",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-primary)")
            }
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />

          {/* ปุ่มเพิ่ม Note */}
          <button
            className="todo-add-btn"
            onClick={handleAddNote}
            style={{
              marginTop: "8px",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "10px",
            }}
          >
            เพิ่มสิ่งที่ต้องทำ
          </button>
        </div>

        {/* Note Grid */}
        <div className="note-grid">
          {notes.length === 0 ? (
            <p className="todo-empty">ยังพบการบันทึกของคุณ</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="note-card"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "14px",
                  padding: "16px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ color: "var(--color-primary)" }}>
                    {note.title}
                  </h4>
                  <button
                    onClick={() => handleTogglePin(note._id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "18px",
                      transition: "transform 0.2s ease",
                    }}
                    title={note.isPinned ? "ถอนหมุด" : "ปักหมุด"}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  >
                    {note.isPinned ? "📌" : "📍"}
                  </button>
                </div>
                <p style={{ margin: "10px 0", whiteSpace: "pre-line" }}>
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                    แท็ก: {note.tags.join(", ")}
                  </div>
                )}
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => handleEditNote(note)}
                    className="todo-add-btn"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="todo-delete-btn"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
