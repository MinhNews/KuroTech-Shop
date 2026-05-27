const Brand = require('../models/Brand');

const brandController = {
    // TẠO THƯƠNG HIỆU MỚI (Chỉ Admin)
    createBrand: async (req, res) => {
        try {
            const newBrand = new Brand(req.body);
            const savedBrand = await newBrand.save();
            res.status(201).json({ message: "Tạo thương hiệu thành công!", data: savedBrand });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // LẤY TẤT CẢ THƯƠNG HIỆU (Public)
    getAllBrands: async (req, res) => {
        try {
            const brands = await Brand.find({ isDeleted: { $ne: true } });
            res.status(200).json(brands);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // CẬP NHẬT THƯƠNG HIỆU (Chỉ Admin)
    updateBrand: async (req, res) => {
        try {
            const updatedBrand = await Brand.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.status(200).json({ message: "Cập nhật thành công!", data: updatedBrand });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // XÓA MỀM THƯƠNG HIỆU (Chỉ Admin)
    deleteBrand: async (req, res) => {
        try {
            await Brand.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.status(200).json({ message: "Xóa mềm thương hiệu thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = brandController;