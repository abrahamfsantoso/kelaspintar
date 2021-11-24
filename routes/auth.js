const router = require('express').Router();
const User = require('../models/User');
const Student = require('../models/Student');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
  if (req.body.confirmPassword !== req.body.password) {
    return res.status(401).json('Please confirm your password!');
  }

  const newUser = new User({
    userName: req.body.userName,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    profilePicture: req.body.profilePicture,
    role: req.body.role,
    grade: req.body.grade,
  });

  if (newUser.role === '' || newUser.role === 'student') {
    const newStudent = new Student({
      name: newUser.firstName,
      grade: newUser.grade,
    });

    newStudent ? newStudent.save() : '';
  }

  try {
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(401).json('User not found!');
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json('Wrong credentials!');
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );

    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
