const Notification = require('../models/Notification');

const notificationController = {
    // Get notifications for current user (or admin)
    getNotifications: async (req, res) => {
        try {
            const isAdmin = req.user.role === 'admin';
            let query = {};
            
            if (isAdmin) {
                // Admins see their own notifications AND all isAdminNotice notifications
                query = {
                    $or: [
                        { user: req.user.id },
                        { isAdminNotice: true }
                    ]
                };
            } else {
                // Regular users only see their own
                query = { user: req.user.id };
            }

            const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Mark a notification as read
    markAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Mark all as read
    markAllAsRead: async (req, res) => {
        try {
            const isAdmin = req.user.role === 'admin';
            let query = {};
            
            if (isAdmin) {
                query = {
                    $or: [
                        { user: req.user.id },
                        { isAdminNotice: true }
                    ],
                    isRead: false
                };
            } else {
                query = { user: req.user.id, isRead: false };
            }

            await Notification.updateMany(query, { isRead: true });
            res.status(200).json({ message: "Đã đánh dấu tất cả là đã đọc" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = notificationController;
