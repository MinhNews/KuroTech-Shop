// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');

const middlewareController = {
    // 1. Xác thực Token (Dành cho User đăng nhập bình thường)
    verifyToken: (req, res, next) => {
        // Lấy token từ header của request (thường có dạng "Bearer <token>")
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
                }
                req.user = user; // Gán thông tin user giải mã được vào request để các API sau dùng
                next(); // Cho phép đi tiếp vào controller
            });
        } else {
            return res.status(401).json({ message: "Bạn chưa xác thực (Không tìm thấy Token)!" });
        }
    },

    // 2. Xác thực Token VÀ kiểm tra quyền Admin (Dành cho chức năng quản trị cao cấp)
    verifyTokenAndAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.role === 'admin') {
                next(); // Đúng là admin thì cho đi tiếp
            } else {
                return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
            }
        });
    },

    // 3. Xác thực Token VÀ kiểm tra quyền Admin HOẶC Staff (Dành cho vận hành hệ thống)
    verifyTokenAndAdminOrStaff: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.role === 'admin' || req.user.role === 'staff') {
                next();
            } else {
                return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
            }
        });
    }
};

module.exports = middlewareController;