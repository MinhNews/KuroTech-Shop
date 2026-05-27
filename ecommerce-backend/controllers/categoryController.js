// controllers/categoryController.js
const Category = require('../models/Category');

const categoryController = {
    // TẠO DANH MỤC MỚI (Chỉ Admin)
    createCategory: async (req, res) => {
        try {
            const newCategory = new Category(req.body);
            const savedCategory = await newCategory.save();
            res.status(201).json({ message: "Tạo danh mục thành công!", data: savedCategory });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // LẤY TẤT CẢ DANH MỤC (Public)
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // CẬP NHẬT DANH MỤC (Chỉ Admin)
    updateCategory: async (req, res) => {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json({ message: "Cập nhật thành công!", data: updatedCategory });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // XÓA DANH MỤC (Chỉ Admin)
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Đã xóa danh mục!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = categoryController;