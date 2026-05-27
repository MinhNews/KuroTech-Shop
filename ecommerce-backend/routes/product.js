// routes/product.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const uploadCloud = require('../config/cloudinary');
// API Public (Không cần token)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// API Protected (Bắt buộc phải là Admin)
// Có nghĩa là: Nhận tối đa 5 file ảnh ở trường dữ liệu tên là 'images'
router.post('/', verifyTokenAndAdmin, uploadCloud.array('images', 5), productController.createProduct);
router.put('/:id', verifyTokenAndAdmin, uploadCloud.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyTokenAndAdmin, productController.deleteProduct);

module.exports = router;