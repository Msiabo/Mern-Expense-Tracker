const express = require('express');
const microCors = require('micro-cors'); // install this if you haven't: npm install micro-cors
const { registerUser, loginUser, getUserInfo, updateUserInfo } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Configure CORS for these routes
const cors = microCors({
  origin: 'https://mern-expense-tracker-wheh.vercel.app',
  allowCredentials: true,
});

// Preflight for all routes
router.options('*', cors);

// Register User
router.post('/register', cors, registerUser);

// Login User
router.post('/login', cors, loginUser);

// Get User Info
router.get('/getUser', cors, protect, getUserInfo);

// Logout
router.post('/logout', cors, (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Update User Info
router.put('/update', cors, protect, updateUserInfo);

// Upload Profile Image (Cloudinary)
router.post(
  '/uploadProfileImage',
  cors,
  protect,
  upload.single('image'),
  (req, res) => {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ imageUrl: req.file.path });
  }
);

module.exports = router;