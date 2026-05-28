const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// Load biến môi trường
dotenv.config();

// Khởi tạo Express app
const app = express();

// Kết nối tới MongoDB
connectDB();

// Cài đặt Middleware cơ bản
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request body
app.use(cors({ 
    origin: function(origin, callback) {
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    credentials: true 
})); 
app.use(cookieParser()); // Cho phép Express đọc HttpOnly Cookie

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product'); 
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const couponRoutes = require('./routes/coupon');
const brandRoutes = require('./routes/brand');
const statsRoutes = require('./routes/stats');
const chatbotRoutes = require('./routes/chatbot');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notification');

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Route test thử
app.get('/', (req, res) => {
    res.send('E-commerce API đang hoạt động ngon lành!');
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy ở port ${PORT}`);
});