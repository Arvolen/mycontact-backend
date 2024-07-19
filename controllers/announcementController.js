// controllers/announcementController.js
const asyncHandler = require('express-async-handler');
const Announcement = require('../models/announcementModel');
const User = require('../models/userModel');
const UserAnnouncementInteraction = require('../models/anounceAction');

// @desc Get all active announcements
// @route GET /api/announcements
// @access Public
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.findAll({ where: { active: true } });
  res.json(announcements);
});

// @desc Get announcements for a specific user
// @route GET /api/announcements/user/:userId
// @access Private
const getAnnouncementsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userAnnouncements = await UserAnnouncementInteraction.findAll({
    where: { userId },
    include: [Announcement]
  });
  const announcements = userAnnouncements.map(ua => ua.Announcement);
  res.json(announcements);
});

module.exports = { getAnnouncementsForUser };

// @desc Create a new announcement
// @route POST /api/announcements
// @access Public
const createAnnouncement = asyncHandler(async (req, res) => {
  const { message, title, subtitle, rewards } = req.body;
  console.log("Creating a new announcment")
  // Create the new announcement
  const announcement = await Announcement.create({ message, title, subtitle, rewards });

  // Fetch all users
  const users = await User.findAll();

  // Create UserAnnouncementInteraction entries for each user
  const userAnnouncementInteractions = users.map(user => ({
    announcementId: announcement.id,
    userId: user.id,
    seen: false,
    rewardsClaimed: false,
    liked: false
  }));

  await UserAnnouncementInteraction.bulkCreate(userAnnouncementInteractions);
  console.log("Success")
  res.status(201).json(announcement);
});

// @desc Update an announcement
// @route PUT /api/announcements/:id
// @access Public
const updateAnnouncement = asyncHandler(async (req, res) => {
  
  const { id } = req.params;
  const { message,  title,  subtitle, rewards } = req.body;
  const announcement = await Announcement.findByPk(id);

console.log("Updating data!")

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  announcement.message = message;
  announcement.title = title;
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
  console.log("Trying to delete announcement with ID:", id);

  // Find the announcement
  const announcement = await Announcement.findByPk(id);
  console.log("Found announcement:", announcement);

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  // Find user interactions
  const interactions = await UserAnnouncementInteraction.findAll({ where: { announcementId: id } });
  console.log("Found interactions:", interactions);

  if (interactions.length > 0) {
    // Delete all interactions
    await Promise.all(interactions.map(interaction => interaction.destroy()));
    console.log("Deleted all interactions for the announcement");
  }

  // Delete the announcement
  await announcement.destroy();
  console.log("Deleted announcement");

  res.status(204).end();
});


const likeAnnouncement = asyncHandler(async (req, res) => {
  try {
    const { userId, announcementId } = req.body; // Assuming user ID is available from authentication middleware
    
    console.log('Received request:', { userId, announcementId });
    
    if (!userId || !announcementId) {
      res.status(400);
      throw new Error('Missing userId or announcementId');
    }

    const interaction = await UserAnnouncementInteraction.findOne({ where: { announcementId, userId } });
    console.log(interaction)
    if (interaction) {
      console.log('Interaction found:', interaction);

      interaction.liked = true;
      await interaction.save();

      res.json(interaction);
    } else {
      res.status(404);
      throw new Error('User interaction not found');
    }
  } catch (error) {
    console.error('Error in likeAnnouncement:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc Claim rewards for an announcement
// @route POST /api/announcements/:announcementId/claim-rewards
// @access Private
const claimRewards = asyncHandler(async (req, res) => {
  const { userId, announcementId } = req.body;

  const interaction = await UserAnnouncementInteraction.findOne({ where: { announcementId, userId } });
  if (interaction) {
    interaction.rewardsClaimed = true;
    await interaction.save();
    res.json(interaction);
  } else {
    res.status(404);
    throw new Error('User interaction not found');
  }
});

// @desc Delete an announcement for a user
// @route DELETE /api/announcements/:announcementId/user
// @access Private
const deleteAnnouncementForUser = asyncHandler(async (req, res) => {
  const { userId, announcementId } = req.body;
  console.log("Delete now")
  const interaction = await UserAnnouncementInteraction.findOne({ where: { announcementId, userId } });
  if (interaction) {
    await interaction.destroy();
    res.status(204).end();
    console.log("Deleted")
  } else {
    res.status(404);
    throw new Error('User interaction not found');
  }
});

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementsForUser, likeAnnouncement, claimRewards, deleteAnnouncementForUser };

