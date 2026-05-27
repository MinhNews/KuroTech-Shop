const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // VD: "SUMMER20"
    discountPercent: { type: Number, required: true, min: 1, max: 100 }, // Giảm bao nhiêu %
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);