// routes/order.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAdminOrStaff } = require('../middlewares/verifyToken');


router.post('/checkout', verifyToken, orderController.checkout);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.get('/', verifyTokenAndAdminOrStaff, orderController.getAllOrders);
router.put('/:id/status', verifyTokenAndAdminOrStaff, orderController.updateOrderStatus);
router.put('/:id/payment-status', verifyTokenAndAdminOrStaff, orderController.updatePaymentStatus);

module.exports = router;