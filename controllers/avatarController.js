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
  
  // Convert the Base64 string back to Buffer if needed
  const imageBuffer = Buffer.from(image, 'base64');

  try {
    const newAvatar = await Avatar.create({
      image: imageBuffer, // Store as Buffer
      level
    });
    
    res.status(201).json(newAvatar);
  } catch (err) {
    console.error('Error creating avatar:', err);
    res.status(500).json({ message: 'Error creating avatar' });
  }
});


// @desc Create an avatar
// @route POST /api/avatars/path
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

// @desc Get all avatar
// @route GET /api/avatars/all
// @access Private
const getAllAvatar = asyncHandler(async (req, res) => {
  try {
    const avatars = await Avatar.findAll();

    if (avatars && avatars.length > 0) {
      const avatarsWithBase64Images = avatars.map(avatar => {
        return {
          ...avatar.dataValues, // Spread the existing avatar properties
          image: avatar.image.toString('base64') // Convert image to Base64
        };
      })
      ;
      
      res.json({ data: avatarsWithBase64Images });
    } else {
      res.status(404).json({ message: 'No avatars found' });
    }

    console.log("Fetched all avatars with Base64 images");
  } catch (error) {
    res.status(500).json({ message: 'Error fetching avatars', error: error.message });
    console.error("Error fetching avatars:", error);
  }
});

// @desc Update user's avatar
// @route PUT /api/avatars
// @access Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  const id = req.params;
  const { image, level } = req.body;

  const avatar = await Avatar.findOne({ where: { id } });

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

// @desc DELETE AVATAR
// @route DELETE /api/avatars
// @access Private
const deleteAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const avatar = await Avatar.findOne({ where: { id } });

  if (avatar) {


    await avatar.destroy();
    console.log("Avatar Deleted")
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
  updateUserAvatar,
  getAllAvatar,
  deleteAvatar
};
