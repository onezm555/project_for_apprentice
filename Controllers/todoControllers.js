const Todo = require("../Models/todo");

// ✅ ดึง todo ของ user คนนั้นเท่านั้น
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }); // ✅ ใช้ _id
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ เพิ่ม todo ผูกกับ user
exports.addTodo = async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      done: false,
      userId: req.user._id, // ✅ ใช้ _id จาก token
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ อัปเดต todo ของ user นั้น
exports.updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedTodo)
      return res.status(404).json({ message: "ไม่พบข้อมูลที่จะอัปเดต" });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ ลบ todo ของ user นั้น
exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted)
      return res.status(404).json({ message: "ไม่พบข้อมูลที่จะลบ" });
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
