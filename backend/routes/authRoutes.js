const express = require('express');
const { registerUser, loginUser, getUserInfo, updateUserInfo } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get User Info
router.get('/getUser', protect, getUserInfo);

// Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Update User Info
router.put('/update', protect, updateUserInfo);

// Upload Profile Image
router.post('/uploadProfileImage', protect, upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
