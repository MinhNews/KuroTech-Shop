const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/verifyToken');

// Viết đánh giá (Yêu cầu đăng nhập)
router.post('/', verifyToken, reviewController.createReview);

// Lấy danh sách đánh giá của 1 sản phẩm (Public)
router.get('/product/:productId', reviewController.getProductReviews);

module.exports = router;