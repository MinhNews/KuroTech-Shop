const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// Tất cả API User Manage đều yêu cầu quyền Admin
router.get('/', verifyTokenAndAdmin, userController.getAllUsers);
router.put('/:id/role', verifyTokenAndAdmin, userController.updateRole);
router.delete('/:id', verifyTokenAndAdmin, userController.softDeleteUser);

module.exports = router;
