const asyncHandler = require('express-async-handler');
const { ChatParticipant, Chat } = require('../models/chatModel'); // Adjust the path as necessary
const User = require('../models/userModel'); // Assuming a User model exists

// @desc Create a new ChatParticipant association
// @access Private
const createUserChat = asyncHandler(async (req, res) => {
  const { role, about, chatId, userId, avatar, fullName, status, avatarColor } = req.body;

  // Validate user and chat existence
  const user = await User.findByPk(userId);
  const chat = await Chat.findByPk(chatId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Create a new ChatParticipant record
  const newUserChat = await ChatParticipant.create({
    role,
    about,
    chatId,
    userId,
    avatar,
    fullName,
    status,
    avatarColor,
    active: true // Ensure the active field is set to true
  });

  res.status(201).json(newUserChat);
});

// @desc To create a channel that could be accessed by all users
// @access Private
const createChatForAllUser = asyncHandler(async (req, res) => {
  const { role, about, chatId, avatar, fullName, status, avatarColor } = req.body;

  // Validate chat existence
  const chat = await Chat.findByPk(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Fetch all users
  const users = await User.findAll();

  if (!users || users.length === 0) {
    res.status(404);
    throw new Error('No users found');
  }

  // Create ChatParticipant records for each user
  const chatParticipants = await Promise.all(users.map(async (user) => {
    return await ChatParticipant.create({
      role,
      about,
      chatId,
      userId: user.id,
      avatar,
      fullName,
      status,
      avatarColor,
      active: true // Ensure the active field is set to true
    });
  }));

  res.status(201).json(chatParticipants);
});


// @desc Get all ChatParticipants
// @access Private
const getAllUserChats = asyncHandler(async (req, res) => {
  const userChats = await ChatParticipant.findAll({
    include: [
      { model: User, attributes: ['id', 'name', 'email'] }, // Include related User information
      { model: Chat, attributes: ['id', 'unseenMsgs', 'lastMessageId'] } // Include related Chat information
    ]
  });
  res.json(userChats);
});

// @desc Get ChatParticipant by ID
// @access Private
const getUserChatById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userChat = await ChatParticipant.findByPk(id, {
    include: [
      { model: User, attributes: ['id', 'name', 'email'] }, // Include related User information
      { model: Chat, attributes: ['id', 'unseenMsgs', 'lastMessageId'] } // Include related Chat information
    ]
  });

  if (!userChat) {
    res.status(404);
    throw new Error('UserChat not found');
  }

  res.json(userChat);
});

// @desc Update ChatParticipant details
// @access Private
const updateUserChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, about, avatar, fullName, status, avatarColor } = req.body;

  const userChat = await ChatParticipant.findByPk(id);

  if (!userChat) {
    res.status(404);
    throw new Error('UserChat not found');
  }

  userChat.role = role || userChat.role;
  userChat.about = about || userChat.about;
  userChat.avatar = avatar || userChat.avatar;
  userChat.fullName = fullName || userChat.fullName;
  userChat.status = status || userChat.status;
  userChat.avatarColor = avatarColor || userChat.avatarColor;

  await userChat.save();
  res.json(userChat);
});

// @desc Delete a ChatParticipant
// @access Private
const deleteUserChat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userChat = await ChatParticipant.findByPk(id);
  if (!userChat) {
    res.status(404);
    throw new Error('UserChat not found');
  }

  await userChat.destroy();
  res.status(204).end();
});

module.exports = {
  createChatForAllUser,
  createUserChat,
  getAllUserChats,
  getUserChatById,
  updateUserChat,
  deleteUserChat
};
