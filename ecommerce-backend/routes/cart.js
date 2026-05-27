// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/verifyToken'); // Lấy middleware check token thường

// Thêm hàng vào giỏ (Bắt buộc đăng nhập)
router.post('/', verifyToken, cartController.addToCart);

// Lấy thông tin giỏ hàng để hiển thị (Bắt buộc đăng nhập)
router.get('/', verifyToken, cartController.getCart);

router.delete('/:cartItemId', verifyToken, cartController.removeFromCart);
router.put('/:cartItemId', verifyToken, cartController.updateCartItemQuantity);

module.exports = router;