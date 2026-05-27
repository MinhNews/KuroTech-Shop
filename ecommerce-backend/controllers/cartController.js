const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

const cartController = {
    // 1. THÊM SẢN PHẨM VÀO GIỎ HÀNG
    addToCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id; // Lấy ID user từ token (đã qua middleware xác thực)

            // Tìm xem User này đã có giỏ hàng chưa
            let cart = await Cart.findOne({ user: userId });
            
            // Nếu chưa có, tạo cho họ một cái giỏ mới tinh
            if (!cart) {
                cart = new Cart({ user: userId });
                await cart.save();
            }

            // Kiểm tra xem sản phẩm này đã nằm trong giỏ chưa
            let cartItem = await CartItem.findOne({ cart: cart._id, product: productId });

            if (cartItem) {
                // Nếu ĐÃ CÓ: Chỉ cộng dồn số lượng
                cartItem.quantity += Number(quantity);
                await cartItem.save();
            } else {
                // Nếu CHƯA CÓ: Tạo một item mới
                cartItem = new CartItem({
                    cart: cart._id,
                    product: productId,
                    quantity: quantity
                });
                await cartItem.save();
            }

            res.status(200).json({ message: "Đã thêm vào giỏ hàng thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 2. LẤY TOÀN BỘ GIỎ HÀNG CỦA USER
    getCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                return res.status(200).json({ items: [], total: 0 }); // Giỏ hàng trống
            }

            // Lấy tất cả CartItem thuộc về cái Cart này, đồng thời populate luôn thông tin Product
            const items = await CartItem.find({ cart: cart._id })
                                        .populate('product', 'name price images'); // Chỉ lấy tên, giá và ảnh

            // Tính toán tổng tiền ngay tại Backend cho xịn
            let totalAmount = 0;
            items.forEach(item => {
                // Đảm bảo có product để tránh lỗi nếu product bị admin xóa mất
                if(item.product) { 
                    totalAmount += item.product.price * item.quantity;
                }
            });

            res.status(200).json({ 
                cartId: cart._id,
                items: items, 
                totalAmount: totalAmount 
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    // 3. XÓA SẢN PHẨM KHỎI GIỎ HÀNG
    removeFromCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const { cartItemId } = req.params; // Nhận ID của CartItem cần xóa

            const cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng!" });

            await CartItem.findOneAndDelete({ _id: cartItemId, cart: cart._id });
            res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 4. CẬP NHẬT SỐ LƯỢNG
    updateCartItemQuantity: async (req, res) => {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;
            
            if (quantity <= 0) {
                return res.status(400).json({ message: "Số lượng không hợp lệ" });
            }

            const cartItem = await CartItem.findOneAndUpdate(
                { _id: cartItemId },
                { quantity: quantity },
                { new: true }
            );

            if (!cartItem) return res.status(404).json({ message: "Không tìm thấy CartItem" });

            res.status(200).json({ message: "Cập nhật thành công", data: cartItem });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = cartController;