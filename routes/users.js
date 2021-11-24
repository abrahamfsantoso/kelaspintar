const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');

const router = require('express').Router();

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(401).json('User not found!');
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(401).json('User not found!');
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json('User has been deleted...');
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET USER
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(401).json('User not found!');
    }

    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL USER
router.get('/', verifyToken, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
