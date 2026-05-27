const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');
const Category = require('../models/Category');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatbotController = {
    chat: async (req, res) => {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ message: "Vui lòng nhập tin nhắn!" });
            }

            // Lấy thông tin từ Database để nạp vào não AI
            const products = await Product.find({ isDeleted: false })
                .populate('category', 'name')
                .select('name price stock description')
                .lean();
            
            let productContext = "\n--- DANH SÁCH SẢN PHẨM HIỆN CÓ TẠI CỬA HÀNG ---\n";
            products.forEach(p => {
                productContext += `- Tên: ${p.name}. Giá: ${p.price?.toLocaleString()} VNĐ. Tồn kho: ${p.stock}. Danh mục: ${p.category?.name || 'Khác'}. Mô tả: ${p.description?.substring(0, 50)}...\n`;
            });

            const systemPrompt = "Bạn là trợ lý ảo bán hàng xuất sắc của cửa hàng điện tử KuroTech. Cửa hàng chuyên bán điện thoại, laptop, phụ kiện chính hãng. " +
                "Nhiệm vụ của bạn là tư vấn cho khách hàng cực kỳ nhiệt tình, chốt sale giỏi, sử dụng thông tin sản phẩm thực tế bên dưới để tư vấn. " +
                "Nếu khách hỏi sản phẩm có sẵn không, hãy kiểm tra 'Tồn kho'. Nếu tồn kho > 0 là còn hàng, = 0 là hết hàng. " +
                "Nếu khách hỏi giá, hãy lấy giá thực tế để báo cho khách. " +
                "Luôn giữ thái độ lịch sự, chuyên nghiệp. Không bịa đặt thông tin sản phẩm không có trong danh sách. " +
                "Thông tin cửa hàng: Địa chỉ 120 Yên Lãng, Hà Nội. Hotline 19001234, email: 10a10nguyenducminh@gmail.com." +
                productContext;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: systemPrompt + "\n\nKhách hàng: " + message,
            });

            res.status(200).json({ response: response.text });
        } catch (error) {
            console.error("Lỗi AI:", error);
            res.status(500).json({ message: "Lỗi kết nối AI", error: error.message });
        }
    }
};

module.exports = chatbotController;
