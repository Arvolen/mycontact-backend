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
  const { message, active } = req.body;
  const announcement = await Announcement.create({ message, active });
  res.status(201).json(announcement);
});

// @desc Update an announcement
// @route PUT /api/announcements/:id
// @access Public
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, active } = req.body;
  const announcement = await Announcement.findByPk(id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  announcement.message = message;
  announcement.active = active;
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
