const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true } // Lưu cứng giá tại thời điểm mua
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);