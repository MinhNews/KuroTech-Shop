// routes/order.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAdminOrStaff } = require('../middlewares/verifyToken');


router.post('/checkout', verifyToken, orderController.checkout);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/', verifyTokenAndAdminOrStaff, orderController.getAllOrders);
router.put('/:id/status', verifyTokenAndAdminOrStaff, orderController.updateOrderStatus);

module.exports = router;