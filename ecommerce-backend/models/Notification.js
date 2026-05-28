const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // null means for all admins
    isAdminNotice: { type: Boolean, default: false }, // if true, this is a notification for admins
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['Order', 'System', 'Payment'], default: 'System' },
    link: { type: String, required: false } // optional link to redirect when clicked
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
