// middleware/announcementMiddleware.js
const Announcement = require("../models/announcementModel");

const announcementMiddleware = async (req, res, next) => {
  const announcements = await Announcement.findAll({ where: { active: true } });
  res.locals.announcements = announcements;
  next();
};

module.exports = announcementMiddleware;
