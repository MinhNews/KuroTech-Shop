const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, verifyTokenAndAdminOrStaff } = require('../middlewares/verifyToken');
const { uploadReviewMedia } = require('../config/cloudinary');

// Viết đánh giá (Yêu cầu đăng nhập, cho phép upload tối đa 5 file ảnh/video)
router.post('/', verifyToken, uploadReviewMedia.array('media', 5), reviewController.createReview);

// Sửa đánh giá
router.put('/:id', verifyToken, uploadReviewMedia.array('media', 5), reviewController.updateReview);

// Xóa đánh giá
router.delete('/:id', verifyToken, reviewController.deleteReview);

// Admin và Staff phản hồi đánh giá
router.put('/:id/reply', verifyTokenAndAdminOrStaff, reviewController.replyToReview);

// Lấy danh sách đánh giá của 1 sản phẩm (Public)
router.get('/product/:productId', reviewController.getProductReviews);

// Admin và Staff lấy tất cả review
router.get('/all', verifyTokenAndAdminOrStaff, reviewController.getAllReviews);

module.exports = router;