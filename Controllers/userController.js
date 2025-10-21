const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// สมัครสมาชิก
exports.register = async (req, res) => {
  try {
    const { userId, name, password } = req.body;

    if (!userId || !name || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'userId นี้มีอยู่แล้ว' });
    }

    const newUser = new User({ userId, name, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, userId: newUser.userId },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: {
        id: newUser._id,
        userId: newUser.userId,
        name: newUser.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

// เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: 'กรุณากรอก userId และ password' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(
      { id: user._id, userId: user.userId },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};
