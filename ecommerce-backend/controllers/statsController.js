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
            let revenue = 0;
            
            // Tính doanh thu theo từng tháng (cho biểu đồ)
            const monthlyData = {
                'Tháng 1': 0, 'Tháng 2': 0, 'Tháng 3': 0, 'Tháng 4': 0,
                'Tháng 5': 0, 'Tháng 6': 0, 'Tháng 7': 0, 'Tháng 8': 0,
                'Tháng 9': 0, 'Tháng 10': 0, 'Tháng 11': 0, 'Tháng 12': 0
            };

            orders.forEach(order => {
                if (order.status === 'Delivered') {
                    revenue += order.totalAmount;
                    
                    // Lấy tháng của đơn hàng (1-12)
                    const date = new Date(order.createdAt);
                    const month = `Tháng ${date.getMonth() + 1}`;
                    monthlyData[month] += order.totalAmount;
                }
            });
            
            // Chuyển object thành mảng cho Recharts
            const chartData = Object.keys(monthlyData).map(key => ({
                name: key,
                revenue: monthlyData[key]
            }));

            res.status(200).json({
                products: productCount,
                orders: orderCount,
                users: userCount,
                revenue: revenue,
                chartData: chartData
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = statsController;
