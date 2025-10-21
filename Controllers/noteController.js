const Note = require("../Models/Note");

// ✅ เพิ่ม Note ใหม่
exports.createNote = async (req, res) => {
  try {
    const { userId, title, content, tags } = req.body;
    const note = await Note.create({ userId, title, content, tags });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ดึง Note ทั้งหมดของผู้ใช้ (เรียงจาก pinned > ใหม่สุด)
exports.getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ค้นหาจากคำใน title หรือ content
exports.searchNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { q } = req.query;
    const notes = await Note.find({
      userId,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ แก้ไข Note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ลบ Note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ปักหมุด / ถอนหมุด
exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
