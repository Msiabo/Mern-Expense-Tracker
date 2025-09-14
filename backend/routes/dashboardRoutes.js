const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

//Get Dashboard Data
router.get('/', protect, getDashboardData);

module.exports = router;