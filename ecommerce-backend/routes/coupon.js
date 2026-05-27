// routes/coupon.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAdminOrStaff } = require('../middlewares/verifyToken');

// Endpoint Lấy danh sách coupon (Admin & Staff)
router.get('/', verifyTokenAndAdminOrStaff, couponController.getAllCoupons);

// Endpoint Tạo coupon (Admin & Staff)
router.post('/', verifyTokenAndAdminOrStaff, couponController.createCoupon);

// Bật tắt coupon (Admin & Staff)
router.put('/:id/toggle', verifyTokenAndAdminOrStaff, couponController.toggleActive);

// Xóa mềm coupon (Admin & Staff)
router.delete('/:id', verifyTokenAndAdminOrStaff, couponController.softDeleteCoupon);

// Khách hàng apply coupon (Yêu cầu đăng nhập)
router.post('/apply', verifyToken, couponController.applyCoupon);

module.exports = router;