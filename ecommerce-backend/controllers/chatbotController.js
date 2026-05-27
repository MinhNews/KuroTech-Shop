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
                .select('name price stock description images')
                .lean();
            
            let productContext = "\n--- DANH SÁCH SẢN PHẨM HIỆN CÓ TẠI CỬA HÀNG ---\n";
            products.forEach(p => {
                const imgUrl = p.images && p.images.length > 0 ? p.images[0] : "";
                productContext += `- ID: ${p._id}. Tên: ${p.name}. Giá: ${p.price?.toLocaleString()} VNĐ. Tồn kho: ${p.stock}. Danh mục: ${p.category?.name || 'Khác'}. Ảnh: ${imgUrl}. Mô tả: ${p.description?.substring(0, 50)}...\n`;
            });

            const systemPrompt = "Bạn là trợ lý ảo bán hàng xuất sắc của cửa hàng điện tử KuroTech. Cửa hàng chuyên bán điện thoại, laptop, phụ kiện chính hãng. " +
                "Nhiệm vụ của bạn là tư vấn cho khách hàng cực kỳ nhiệt tình, chốt sale giỏi, sử dụng thông tin sản phẩm thực tế bên dưới để tư vấn. " +
                "Nếu khách hỏi sản phẩm có sẵn không, hãy kiểm tra 'Tồn kho'. Nếu tồn kho > 0 là còn hàng, = 0 là hết hàng. " +
                "Nếu khách hỏi giá, hãy lấy giá thực tế để báo cho khách. " +
                "Luôn giữ thái độ lịch sự, chuyên nghiệp. Không bịa đặt thông tin sản phẩm không có trong danh sách. " +
                "BẠN PHẢI LUÔN TRẢ VỀ KẾT QUẢ DƯỚI DẠNG ĐỊNH DẠNG JSON hợp lệ. " +
                "Cấu trúc JSON bắt buộc phải là:\n" +
                "{\n" +
                '  "text": "Câu trả lời dạng văn bản của bạn",\n' +
                '  "suggestedProducts": [\n' +
                '    { "_id": "ID sản phẩm", "name": "Tên sản phẩm", "price": 1000000, "image": "URL Ảnh" }\n' +
                "  ]\n" +
                "}\n" +
                "Lưu ý: suggestedProducts là mảng chứa các sản phẩm bạn khuyên dùng lấy TỪ DANH SÁCH BÊN DƯỚI. " +
                "Nếu không có sản phẩm nào phù hợp, hãy trả về mảng rỗng []. " +
                "Tuyệt đối không trả về markdown bao quanh json (ví dụ không có ```json). Chỉ trả về chuỗi JSON thuần túy.\n" +
                "Thông tin cửa hàng: Địa chỉ 120 Yên Lãng, Hà Nội. Hotline 19001234, email: 10a10nguyenducminh@gmail.com." +
                productContext;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: systemPrompt + "\n\nKhách hàng: " + message,
                config: {
                    responseMimeType: "application/json",
                }
            });

            let responseText = response.text;
            // Loại bỏ markdown ```json ... ``` nếu có
            if (responseText.startsWith('```json')) {
                responseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            } else if (responseText.startsWith('```')) {
                responseText = responseText.replace(/^```\n?/, '').replace(/\n?```$/, '');
            }
            
            let jsonResponse;
            try {
                jsonResponse = JSON.parse(responseText);
            } catch (e) {
                console.error("Lỗi parse JSON từ Gemini:", e, responseText);
                // Cố gắng tìm chuỗi JSON bên trong văn bản nếu nó bị bọc bởi text khác
                const match = responseText.match(/\{[\s\S]*\}/);
                if (match) {
                    try {
                        jsonResponse = JSON.parse(match[0]);
                    } catch (e2) {
                        jsonResponse = { text: responseText, suggestedProducts: [] };
                    }
                } else {
                    jsonResponse = { text: responseText, suggestedProducts: [] };
                }
            }

            res.status(200).json({ response: jsonResponse });
        } catch (error) {
            console.error("Lỗi AI:", error);
            res.status(500).json({ message: "Lỗi kết nối AI", error: error.message });
        }
    }
};

module.exports = chatbotController;
