const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Notification = require("../models/notification.model");
const notificationService = require("../services/notification.service");
const { getPagination, paginationMeta } = require("../utils/pagination");

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const { notifications, total, unreadCount } = await notificationService.getUserNotifications(req.user._id, { page, limit });
  res.status(200).json({ ...ApiResponse.paginated(notifications, paginationMeta(total, page, limit)), unreadCount });
});

exports.markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { is_read: true });
  res.status(200).json(ApiResponse.success(null, "Marked as read"));
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  res.status(200).json(ApiResponse.success(null, "All notifications marked as read"));
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
  res.status(200).json(ApiResponse.success(null, "Notification deleted"));
});
