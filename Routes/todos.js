const express = require("express");
const router = express.Router();
const {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} = require("../Controllers/todoControllers");
const { authMiddleware } = require("../Middleware/auth");


router.get("/", authMiddleware, getTodos);
router.post("/", authMiddleware, addTodo);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;
