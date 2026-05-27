// controllers/couponController.js
const Coupon = require('../models/Coupon');

const couponController = {
    // TẠO COUPON MỚI (Chỉ Admin)
    createCoupon: async (req, res) => {
        try {
            const newCoupon = new Coupon(req.body);
            const savedCoupon = await newCoupon.save();
            res.status(201).json({ 
                message: "Tạo phiếu giảm giá thành công!", 
                data: savedCoupon 
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Lỗi server", 
                error: error.message 
            });
        }
    },

    // LẤY TẤT CẢ COUPON (Admin/Staff)
    getAllCoupons: async (req, res) => {
        try {
            const coupons = await Coupon.find({ isDeleted: false });
            res.status(200).json(coupons);
        } catch (error) {
            res.status(500).json({ 
                message: "Lỗi server", 
                error: error.message 
            });
        }
    },

    // KHÁCH HÀNG ÁP DỤNG MÃ GIẢM GIÁ
    applyCoupon: async (req, res) => {
        try {
            const { code } = req.body;
            const coupon = await Coupon.findOne({ code: code.toUpperCase(), isDeleted: false });
            
            if (!coupon) {
                return res.status(404).json({ message: "Mã giảm giá không tồn tại!" });
            }
            if (!coupon.isActive) {
                return res.status(400).json({ message: "Mã giảm giá này đã tạm ngưng hoạt động!" });
            }

            res.status(200).json({ 
                message: "Áp dụng mã thành công!", 
                discountPercent: coupon.discountPercent 
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // BẬT/TẮT MÃ GIẢM GIÁ
    toggleActive: async (req, res) => {
        try {
            const coupon = await Coupon.findById(req.params.id);
            if (!coupon) return res.status(404).json({ message: "Không tìm thấy mã!" });
            
            coupon.isActive = !coupon.isActive;
            await coupon.save();
            res.status(200).json({ message: "Đã cập nhật trạng thái!", data: coupon });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // XÓA MỀM (Soft Delete)
    softDeleteCoupon: async (req, res) => {
        try {
            await Coupon.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.status(200).json({ message: "Đã xóa mã giảm giá!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = couponController;