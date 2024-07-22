const asyncHandler = require('express-async-handler');
const Avatar = require('../models/avatarModel');
const User = require('../models/userModel');

// @desc Create an avatar
// @route POST /api/avatars
// @access Private
const createAvatar = asyncHandler(async (req, res) => {
  const { image, level } = req.body;
  const userId = req.user.id;

  if (!image || !level) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const avatar = await Avatar.create({
    userId,
    image,
    level
  });

  res.status(201).json(avatar);
});

// @desc Get user's avatar
// @route GET /api/avatars
// @access Private
const getUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const avatar = await Avatar.findOne({ where: { userId } });

  if (avatar) {
    res.json(avatar);
  } else {
    res.status(404);
    throw new Error('Avatar not found');
  }
});

// @desc Update user's avatar
// @route PUT /api/avatars
// @access Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { image, level } = req.body;

  const avatar = await Avatar.findOne({ where: { userId } });

  if (avatar) {
    avatar.image = image || avatar.image;
    avatar.level = level || avatar.level;

    await avatar.save();
    res.json(avatar);
  } else {
    res.status(404);
    throw new Error('Avatar not found');
  }
});

module.exports = {
  createAvatar,
  getUserAvatar,
  updateUserAvatar
};
