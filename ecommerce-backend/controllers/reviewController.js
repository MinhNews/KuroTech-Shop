const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Product = require('../models/Product');

const isVideo = (url) => {
    return url.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i) !== null;
};

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
                comment: comment,
                images: [],
                videos: []
            });

            // Phân tách file từ multer (Cloudinary)
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (isVideo(file.path)) {
                        newReview.videos.push(file.path);
                    } else {
                        newReview.images.push(file.path);
                    }
                });
            }

            await newReview.save();
            
            // Lấy thêm thông tin user trả về cho Frontend hiển thị luôn
            const populatedReview = await Review.findById(newReview._id).populate('user', 'username avatar');
            
            // Tạo thông báo cho Admin
            try {
                const product = await Product.findById(productId);
                const notif = new Notification({
                    isAdminNotice: true,
                    title: "Đánh giá mới",
                    message: `Khách hàng ${populatedReview.user.username} vừa đánh giá ${rating} sao cho sản phẩm "${product ? product.name : 'Không xác định'}"`,
                    type: 'System',
                    link: '/admin/reviews'
                });
                await notif.save();
            } catch (notifErr) {
                console.error("Lỗi khi tạo thông báo:", notifErr);
            }

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
    },

    // 3. CẬP NHẬT REVIEW (Chỉ User của Review đó mới được)
    updateReview: async (req, res) => {
        try {
            const { id } = req.params;
            const { rating, comment, existingImages, existingVideos } = req.body;
            const userId = req.user.id;

            const review = await Review.findById(id);
            if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

            if (review.user.toString() !== userId && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Không có quyền sửa đánh giá này" });
            }

            review.rating = rating || review.rating;
            review.comment = comment || review.comment;

            // Xử lý giữ lại ảnh/video cũ nếu có gửi lên (Dạng JSON stringify mảng)
            let parsedExistingImages = [];
            let parsedExistingVideos = [];
            if (existingImages) parsedExistingImages = JSON.parse(existingImages);
            if (existingVideos) parsedExistingVideos = JSON.parse(existingVideos);

            review.images = parsedExistingImages;
            review.videos = parsedExistingVideos;

            // Thêm các file mới up
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (isVideo(file.path)) {
                        review.videos.push(file.path);
                    } else {
                        review.images.push(file.path);
                    }
                });
            }

            await review.save();
            const populatedReview = await Review.findById(review._id).populate('user', 'username avatar');
            res.status(200).json({ message: "Cập nhật đánh giá thành công", data: populatedReview });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 4. XÓA REVIEW
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const review = await Review.findById(id);
            if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

            if (review.user.toString() !== userId && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Không có quyền xóa đánh giá này" });
            }

            await Review.findByIdAndDelete(id);
            res.status(200).json({ message: "Xóa đánh giá thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 5. PHẢN HỒI REVIEW (Chỉ Admin/Staff)
    replyToReview: async (req, res) => {
        try {
            const { id } = req.params;
            const { sellerReply } = req.body;

            const review = await Review.findById(id);
            if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

            review.sellerReply = sellerReply;
            await review.save();

            const populatedReview = await Review.findById(review._id).populate('user', 'username avatar');
            res.status(200).json({ message: "Phản hồi đánh giá thành công", data: populatedReview });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 6. LẤY TẤT CẢ REVIEW (Dành cho Admin)
    getAllReviews: async (req, res) => {
        try {
            const reviews = await Review.find({})
                                      .populate('user', 'username avatar email')
                                      .populate('product', 'name images')
                                      .sort({ createdAt: -1 });
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = reviewController;