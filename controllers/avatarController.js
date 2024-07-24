const asyncHandler = require('express-async-handler');
const Avatar = require('../models/avatarModel');
const User = require('../models/userModel');
const fs = require('fs');

// @desc Create an avatar
// @route POST /api/avatars
// @access Private
const createAvatar = asyncHandler(async (req, res) => {
  const { image, level } = req.body;

  if (!image || level === undefined) {
    res.status(400);
    throw new Error('Image and level are mandatory');
  }

  const newAvatar = await Avatar.create({
    image: Buffer.from(image, 'base64'), // Assume image data is sent in base64 encoding
    level
  });

  res.status(201).json(newAvatar);
});


// @desc Create an avatar
// @route POST /api/avatars
// @access Private
const createAvatarFromPath = asyncHandler(async (req, res) => {
  const { imagePath, level } = req.body;

  if (!imagePath || level === undefined) {
    res.status(400);
    throw new Error('Image and level are mandatory');
  }

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const newAvatar = await Avatar.create({
      image: imageBuffer,
      level
    });
    console.log("Success")
    res.status(201).json(newAvatar);
  } catch (err) {
    console.error('Error reading the image file:', err);
    res.status(500).json({ message: 'Error reading the image file' });
  }
});

// @desc Get user's avatar
// @route GET /api/avatars
// @access Private
const getUserAvatar = asyncHandler(async (req, res) => {
  const level = req.user.level;

  const avatar = await Avatar.findOne({ where: { level } });

  if (avatar) {
    const base64Image = avatar.image.toString('base64');
    res.json({ image: base64Image });
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
  createAvatarFromPath,
  getUserAvatar,
  updateUserAvatar
};
