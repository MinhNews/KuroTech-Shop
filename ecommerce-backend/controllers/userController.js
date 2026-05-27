const User = require('../models/User');

const userController = {
    // 1. LẤY DANH SÁCH NGƯỜI DÙNG (Không lấy người bị xóa)
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({ isDeleted: false }).select('-password -refreshTokens');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 2. CẬP NHẬT ROLE (Chỉ Admin)
    updateRole: async (req, res) => {
        try {
            const { role } = req.body;
            if (!['customer', 'staff', 'admin'].includes(role)) {
                return res.status(400).json({ message: "Role không hợp lệ!" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { role: role },
                { new: true }
            ).select('-password');
            
            res.status(200).json({ message: "Cập nhật quyền thành công!", data: updatedUser });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 3. SOFT DELETE TÀI KHOẢN (Chỉ Admin)
    softDeleteUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.status(200).json({ message: "Đã xóa (Khóa) tài khoản thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = userController;
