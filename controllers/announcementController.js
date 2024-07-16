// controllers/announcementController.js
const asyncHandler = require("express-async-handler");
const Announcement = require("../models/announcementModel");

// @desc Get all active announcements
// @route GET /api/announcements
// @access Public
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.findAll({ where: { active: true } });
  res.json(announcements);
});

// @desc Create a new announcement
// @route POST /api/announcements
// @access Public
const createAnnouncement = asyncHandler(async (req, res) => {
  const { message, meta, title, subtitle, rewards } = req.body;
  const announcement = await Announcement.create({ message, meta, title, subtitle, rewards });
  res.status(201).json(announcement);
});

// @desc Update an announcement
// @route PUT /api/announcements/:id
// @access Public
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, active, meta, avatarAlt, title, avatarImg, subtitle, rewards } = req.body;
  const announcement = await Announcement.findByPk(id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  announcement.message = message;
  announcement.active = active;
  announcement.meta = meta;
  announcement.avatarAlt = avatarAlt;
  announcement.title = title;
  announcement.avatarImg = avatarImg;
  announcement.subtitle = subtitle;
  announcement.rewards = rewards;
  await announcement.save();
  res.json(announcement);
});

// @desc Delete an announcement
// @route DELETE /api/announcements/:id
// @access Public
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await Announcement.findByPk(id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  await announcement.destroy();
  res.status(204).end();
});

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
