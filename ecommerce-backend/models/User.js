// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
    avatar: { type: String, default: '' },
    refreshTokens: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Middleware tự động mã hóa password trước khi lưu vào DB
userSchema.pre('save', async function () { // <-- 1. XÓA tham số 'next'
    if (!this.isModified('password')) return; // <-- 2. XÓA 'next()', chỉ để lại 'return'
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

module.exports = mongoose.model('User', userSchema);