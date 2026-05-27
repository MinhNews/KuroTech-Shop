// routes/category.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// Endpoint Lấy danh sách (Không cần token, ai vào web cũng thấy được)
router.get('/', categoryController.getAllCategories);

// Endpoint Tạo danh mục (Gắn middleware verifyTokenAndAdmin để chặn ném đá giấu tay)
router.post('/', verifyTokenAndAdmin, categoryController.createCategory);

// Endpoint Cập nhật danh mục
router.put('/:id', verifyTokenAndAdmin, categoryController.updateCategory);

// Endpoint Xóa danh mục
router.delete('/:id', verifyTokenAndAdmin, categoryController.deleteCategory);

module.exports = router; 