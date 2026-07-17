const Notification = require("../models/notification.model");

/**
 * Create a notification for a single user
 */
exports.createNotification = async ({ user_id, title, message }) => {
  return await Notification.create({ user_id, title, message });
};

/**
 * Create notifications for multiple users
 */
exports.createBulkNotifications = async (userIds, { title, message }) => {
  const docs = userIds.map((user_id) => ({ user_id, title, message }));
  return await Notification.insertMany(docs);
};

exports.getUserNotifications = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user_id: userId }).sort({ created_at: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ user_id: userId }),
    Notification.countDocuments({ user_id: userId, is_read: false }),
  ]);
  return { notifications, total, unreadCount };
};

exports.markAllRead = async (userId) => {
  return await Notification.updateMany({ user_id: userId, is_read: false }, { is_read: true });
};
