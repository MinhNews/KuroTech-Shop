// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/verifyToken');
const { uploadAvatar } = require('../config/cloudinary');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Đăng nhập bằng Google
router.post('/google-login', authController.googleLogin);

router.post('/refresh', authController.requestRefreshToken);

// Các API yêu cầu đăng nhập
router.post('/logout', authController.logout);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/avatar', verifyToken, uploadAvatar.single('avatar'), authController.updateAvatar);
router.put('/change-password', verifyToken, authController.changePassword);

// Xác thực Email (Yêu cầu login)
router.post('/send-verification', verifyToken, authController.sendVerificationEmail);
router.post('/verify-email', verifyToken, authController.verifyEmail);

// Quên mật khẩu (Không yêu cầu login)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;