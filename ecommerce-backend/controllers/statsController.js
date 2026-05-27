const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const statsController = {
    getDashboardStats: async (req, res) => {
        try {
            // Đếm tổng số sản phẩm
            const productCount = await Product.countDocuments();
            
            // Đếm tổng số người dùng
            const userCount = await User.countDocuments();
            
            // Lấy tất cả đơn hàng để tính toán
            const orders = await Order.find();
            const orderCount = orders.length;
            
            // Tính tổng doanh thu (Chỉ tính những đơn đã giao thành công)
            const revenue = orders.reduce((total, order) => {
                if (order.status === 'Delivered') {
                    return total + order.totalAmount;
                }
                return total;
            }, 0);

            res.status(200).json({
                products: productCount,
                orders: orderCount,
                users: userCount,
                revenue: revenue
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = statsController;
