const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // Mỗi User chỉ có 1 giỏ hàng duy nhất (unique: true)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);