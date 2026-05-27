// controllers/productController.js
const Product = require('../models/Product');

const productController = {
    // 1. TẠO SẢN PHẨM MỚI (Chỉ Admin)
    createProduct: async (req, res) => {
        try {
            const productData = req.body;
            
            // Nếu có file ảnh được upload lên, Multer sẽ tự động đẩy thông tin vào req.files
            if (req.files && req.files.length > 0) {
                // Lấy ra mảng các đường link URL của ảnh trên Cloudinary
                productData.images = req.files.map(file => file.path);
            }
            const newProduct = new Product(productData);
            const savedProduct = await newProduct.save();
            res.status(201).json({ message: "Tạo sản phẩm thành công!", data: savedProduct });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 2. LẤY TẤT CẢ SẢN PHẨM (Ai cũng xem được)
    getAllProducts: async (req, res) => {
        try {
            // Dùng .populate('category') và 'brand' để lấy chi tiết bảng đính kèm
            const products = await Product.find({ isDeleted: { $ne: true } })
                .populate('category', 'name')
                .populate('brand', 'name');
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 3. LẤY CHI TIẾT 1 SẢN PHẨM (Ai cũng xem được)
    getProductById: async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
                .populate('category', 'name description')
                .populate('brand', 'name description');
            if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa!" });
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 4. CẬP NHẬT SẢN PHẨM (Chỉ Admin)
    updateProduct: async (req, res) => {
        try {
            const updateData = { ...req.body };
            
            // Nếu có ảnh mới upload
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => file.path);
                // Nếu client gửi 'images' cũ dạng string (url), ta gộp với ảnh mới, hoặc thay thế
                // Tùy theo logic frontend, ta tạm thời thay thế bằng ảnh mới nếu có
                updateData.images = newImages;
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true } // Trả về data mới sau khi update
            );
            res.status(200).json({ message: "Cập nhật thành công!", data: updatedProduct });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 5. XÓA SẢN PHẨM (Chỉ Admin)
    deleteProduct: async (req, res) => {
        try {
            // Đổi từ findByIdAndDelete sang cập nhật isDeleted = true (Soft Delete)
            await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.status(200).json({ message: "Đã xóa sản phẩm (Soft Delete)!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = productController;