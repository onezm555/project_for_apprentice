const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//สมัครสมาชิก
exports.register = async (req, res) => {
  try {
    const { userId, name, password } = req.body;

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!userId || !name || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ตรวจสอบว่ามี userId ซ้ำหรือไม่
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'userId นี้มีอยู่แล้ว' });
    }

    // สร้างผู้ใช้ใหม่ (password จะถูก hash โดย schema อัตโนมัติ)
    const newUser = new User({ userId, name, password });
    await newUser.save();

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

//เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // ตรวจสอบข้อมูล
    if (!userId || !password) {
      return res.status(400).json({ message: 'กรุณากรอก userId และ password' });
    }

    // ค้นหาผู้ใช้
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง JWT Token (ใช้ secret key ของคุณเอง)
    const token = jwt.sign(
      { id: user._id, userId: user.userId },
      process.env.JWT_SECRET || 'secretKey', // ใช้ .env จะดีที่สุด
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