const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

router.get('/dashboard', verifyTokenAndAdmin, statsController.getDashboardStats);

module.exports = router;
