const asyncHandler = require('express-async-handler');
const Avatar = require('../models/avatarModel');
const fs = require('fs');
const path = require('path');

// @desc Create an avatar
// @route POST /api/avatars
// @access Private
const createAvatar = asyncHandler(async (req, res) => {
  console.log("Creating avatar")
  const { level } = req.body;
  console.log("Creating avatar")
  if (!req.file || level === undefined) {
    res.status(400);
    throw new Error('Image and level are mandatory');
  }

  // Save the file path
  const imagePath = path.join('uploads', req.file.filename);

  try {
    const newAvatar = await Avatar.create({
      imageUrl: imagePath, // Store the file path
      level
    });

    res.status(201).json(newAvatar);
  } catch (err) {
    console.error('Error creating avatar:', err);
    res.status(500).json({ message: 'Error creating avatar' });
  }
});

// @desc Create an avatar from a file path
// @route POST /api/avatars/path
// @access Private
const createAvatarFromPath = asyncHandler(async (req, res) => {
  const { imagePath, level } = req.body;

  if (!imagePath || level === undefined) {
    res.status(400);
    throw new Error('Image path and level are mandatory');
  }

  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error('Image file does not exist');
    }

    const newAvatar = await Avatar.create({
      imageUrl: imagePath,
      level
    });

    res.status(201).json(newAvatar);
  } catch (err) {
    console.error('Error creating avatar:', err);
    res.status(500).json({ message: 'Error creating avatar' });
  }
});

// @desc Get user's avatar
// @route GET /api/avatars
// @access Private
const getUserAvatar = asyncHandler(async (req, res) => {
  const level = req.user.level;

  try {
    const avatar = await Avatar.findOne({ where: { level } });

    if (!avatar) {
      res.status(404);
      throw new Error('Avatar not found');
    }

    res.json({ imageUrl: avatar.imageUrl });
  } catch (err) {
    console.error('Error fetching avatar:', err);
    res.status(500).json({ message: 'Error fetching avatar' });
  }
});

// @desc Get all avatars
// @route GET /api/avatars/all
// @access Private
const getAllAvatars = asyncHandler(async (req, res) => {
  try {
    const avatars = await Avatar.findAll();

    if (!avatars || avatars.length === 0) {
      res.status(404).json({ message: 'No avatars found' });
      return;
    }

    res.json({ data: avatars });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching avatars', error: error.message });
    console.error('Error fetching avatars:', error);
  }
});

// @desc Update user's avatar
// @route PUT /api/avatars/:id
// @access Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { level } = req.body;

  try {
    const avatar = await Avatar.findOne({ where: { id } });

    if (!avatar) {
      res.status(404);
      throw new Error('Avatar not found');
    }

    if (req.file) {
      // Update image path if a new file is uploaded
      avatar.imageUrl = path.join('uploads', req.file.filename);
    }

    avatar.level = level !== undefined ? level : avatar.level;

    await avatar.save();
    res.json(avatar);
  } catch (err) {
    console.error('Error updating avatar:', err);
    res.status(500).json({ message: 'Error updating avatar' });
  }
});

// @desc Delete an avatar
// @route DELETE /api/avatars/:id
// @access Private
const deleteAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const avatar = await Avatar.findOne({ where: { id } });

    if (!avatar) {
      res.status(404);
      throw new Error('Avatar not found');
    }

    const imagePath = avatar.imageUrl;

    await avatar.destroy();

    // Optionally, remove the file from the filesystem
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Avatar deleted successfully' });
  } catch (err) {
    console.error('Error deleting avatar:', err);
    res.status(500).json({ message: 'Error deleting avatar' });
  }
});

module.exports = {
  createAvatar,
  createAvatarFromPath,
  getUserAvatar,
  updateUserAvatar,
  getAllAvatars,
  deleteAvatar
};
