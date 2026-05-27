// controllers/orderController.js
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const orderController = {
    // CHỐT ĐƠN HÀNG (Checkout)
    checkout: async (req, res) => {
        try {
            const userId = req.user.id;
            const { shippingAddress, paymentMethod, couponCode } = req.body;

            // 1. Tìm giỏ hàng của User
            const cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(400).json({ message: "Giỏ hàng trống!" });

            // 2. Lấy tất cả CartItems kèm giá Product hiện tại
            const cartItems = await CartItem.find({ cart: cart._id }).populate('product');
            if (cartItems.length === 0) return res.status(400).json({ message: "Không có sản phẩm để thanh toán!" });

            // 3. Tính tổng tiền và kiểm tra Tồn kho (Stock)
            let totalAmount = 0;
            for (let item of cartItems) {
                if (item.product.stock < item.quantity) {
                    return res.status(400).json({ message: `Sản phẩm ${item.product.name} không đủ số lượng tồn kho!` });
                }
                totalAmount += item.product.price * item.quantity;
            }

            // XỬ LÝ MÃ GIẢM GIÁ 
            let discountValue = 0;
            if (couponCode) {
                const validCoupon = await Coupon.findOne({ code: couponCode, isActive: true, isDeleted: false });
                if (validCoupon) {
                    // Tính số tiền được giảm
                    discountValue = (totalAmount * validCoupon.discountPercent) / 100;
                    totalAmount = totalAmount - discountValue;
                } else {
                    return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" });
                }
            }

            // 4. Tạo Đơn hàng chính (Order)
            const newOrder = new Order({
                user: userId,
                totalAmount: totalAmount, 
                shippingAddress,
                paymentMethod
            });
            const savedOrder = await newOrder.save();

            // 5. Chuyển dữ liệu sang OrderDetail & Trừ số lượng tồn kho
            for (let item of cartItems) {
                // Tạo chi tiết đơn hàng (LƯU CỨNG GIÁ)
                const orderDetail = new OrderDetail({
                    order: savedOrder._id,
                    product: item.product._id,
                    quantity: item.quantity,
                    priceAtPurchase: item.product.price 
                });
                await orderDetail.save(); 

                // Trừ tồn kho trong bảng Product
                await Product.findByIdAndUpdate(item.product._id, {
                    $inc: { stock: -item.quantity } // Giảm số lượng (- quantity)
                });
            }

            // 6. Xóa toàn bộ CartItem (Dọn dẹp giỏ hàng)
            await CartItem.deleteMany({ cart: cart._id });

            res.status(201).json({ message: "Đặt hàng thành công!", orderId: savedOrder._id, discountApplied: discountValue });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // LẤY LỊCH SỬ ĐƠN HÀNG CỦA USER
    getUserOrders: async (req, res) => {
        try {
            // Sort { createdAt: -1 } để đơn hàng mới nhất lên đầu
            const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Chỉ Admin)
    updateOrderStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const orderId = req.params.id;

            const currentOrder = await Order.findById(orderId);
            if (!currentOrder) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

            // 1. Chặn nếu đơn hàng đã ở trạng thái cuối (Delivered hoặc Cancelled)
            if (currentOrder.status === 'Delivered' || currentOrder.status === 'Cancelled') {
                return res.status(400).json({ message: "Không thể thay đổi trạng thái của đơn hàng đã Giao hoặc Đã Hủy!" });
            }

            // 2. Nếu chuyển sang Hủy (Cancelled), hoàn lại số lượng tồn kho
            if (status === 'Cancelled') {
                const orderDetails = await OrderDetail.find({ order: orderId });
                for (let detail of orderDetails) {
                    await Product.findByIdAndUpdate(detail.product, {
                        $inc: { stock: detail.quantity } // Trả lại số lượng (+ quantity)
                    });
                }
            }

            // 3. Cập nhật trạng thái
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: status },
                { new: true }
            );
            
            res.status(200).json({ message: "Cập nhật trạng thái thành công!", data: updatedOrder });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // LẤY TẤT CẢ ĐƠN HÀNG (Chỉ Admin)
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = orderController;