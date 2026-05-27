const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// Endpoint Lấy danh sách thương hiệu (Ai cũng xem được)
router.get('/', brandController.getAllBrands);

// Endpoint Tạo thương hiệu (Bắt buộc là Admin)
router.post('/', verifyTokenAndAdmin, brandController.createBrand);

// Cập nhật thương hiệu
router.put('/:id', verifyTokenAndAdmin, brandController.updateBrand);

// Xóa thương hiệu
router.delete('/:id', verifyTokenAndAdmin, brandController.deleteBrand);

module.exports = router;