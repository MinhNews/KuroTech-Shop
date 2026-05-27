const Review = require('../models/Review');

const reviewController = {
    // 1. TẠO REVIEW MỚI (Cần đăng nhập)
    createReview: async (req, res) => {
        try {
            const { productId, rating, comment } = req.body;
            const userId = req.user.id;

            // Kiểm tra xem user này đã đánh giá sản phẩm này chưa (nếu muốn giới hạn 1 user 1 review)
            const existingReview = await Review.findOne({ user: userId, product: productId });
            if (existingReview) {
                return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi!" });
            }

            const newReview = new Review({
                user: userId,
                product: productId,
                rating: rating,
                comment: comment
            });

            await newReview.save();
            
            // Lấy thêm thông tin user trả về cho Frontend hiển thị luôn
            const populatedReview = await Review.findById(newReview._id).populate('user', 'username avatar');
            
            res.status(201).json({ message: "Đánh giá thành công!", data: populatedReview });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 2. LẤY DANH SÁCH REVIEW CỦA 1 SẢN PHẨM (Public)
    getProductReviews: async (req, res) => {
        try {
            const { productId } = req.params;
            const reviews = await Review.find({ product: productId })
                                      .populate('user', 'username avatar')
                                      .sort({ createdAt: -1 }); // Mới nhất lên đầu
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = reviewController;