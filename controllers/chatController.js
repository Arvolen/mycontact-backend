// chatController.js

const asyncHandler = require('express-async-handler');
const ChatChannel = require('../models/chatChannel');
const ChatHistory = require('../models/chatHistory');
const User = require('../models/userModel');

// @desc Get all active channels
// @route GET /api/channels
// @access Public
const getAllActiveChannel = asyncHandler(async (req, res) => {
  // const channels = await ChatChannel.findAll({ where: { active: true } });
  const channels = [
    { id: 1, name: 'General', active: true },
    { id: 2, name: 'Random', active: true }
  ];
  res.json(channels);
});

// @desc Get details of a specific channel
// @route GET /api/channels/:channelId
// @access Public
const getChannelData = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // const channel = await ChatChannel.findByPk(channelId);
  const channels = [
    { id: 1, name: 'General', active: true },
    { id: 2, name: 'Random', active: true }
  ];
  const channel = channels.find(channel => channel.id === parseInt(channelId));
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  res.json(channel);
});

// @desc Send a message
// @route POST /api/channels/:channelId/messages
// @access Private
const sendMessage = asyncHandler(async (req, res) => {
  console.log("connected")
  const { channelId } = req.params;
  console.log("channel iD ",channelId)
  const { message } = req.body;
  const userId = req.user.id

  const newMessage = await ChatHistory.create({ channelId, userId, message });
  res.status(201).json(newMessage);
});

// @desc Join a channel
// @route POST /api/channels/:channelId/join
// @access Private
const joinChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.body;

  res.json({ message: 'User joined channel' });
});

// @desc Leave a channel
// @route POST /api/channels/:channelId/leave
// @access Private
const leaveChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.body;


  res.json({ message: 'User left channel' });
});

// @desc Get messages from a channel
// @route GET /api/channels/:channelId/messages
// @access Private
const getMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const messages = await ChatHistory.findAll({ where: { channelId } });
  res.json(messages);
});

// @desc Edit a message
// @route PUT /api/channels/:channelId/messages/:messageId
// @access Private
const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;

  const updatedMessage = await ChatHistory.update({ message }, { where: { id: messageId } });
  res.json(updatedMessage);
});

// @desc Delete a message
// @route DELETE /api/channels/:channelId/messages/:messageId
// @access Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  await ChatHistory.destroy({ where: { id: messageId } });
  res.status(204).end();
});

// @desc Admin: Get all channels
// @route GET /api/channels
// @access Admin
const getAllChannel = asyncHandler(async (req, res) => {
  const channels = await ChatChannel.findAll();
  res.json(channels);
});

// @desc Admin: Create a new channel
// @route POST /api/channels
// @access Admin
const createChannel = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const newChannel = await ChatChannel.create({ name, description });
  res.status(201).json(newChannel);
});

// @desc Admin: Update channel details
// @route PUT /api/channels
// @access Admin
const updateChannelDetail = asyncHandler(async (req, res) => {
  const { id, name, description, active } = req.body;

  const channel = await ChatChannel.findByPk(id);

    console.log("Updating channel")

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  channel.name = name;
  channel.description = description;
  channel.active = active;
  await channel.save();

  res.json(channel);
});

// @desc Admin: Delete a channel
// @route DELETE /api/channels/:channelId
// @access Admin
const deleteChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await ChatChannel.findByPk(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  await channel.destroy();
  res.status(204).end();
});

// @desc Admin: Get all users in a channel
// @route GET /api/channels/:channelId/users
// @access Admin
const getAllUsersInChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // Logic to get all users in the channel
  const users = []; // Replace with actual logic
  res.json(users);
});

module.exports = {
  // User routes
  getAllActiveChannel,
  getChannelData,
  sendMessage,
  joinChannel,
  leaveChannel,
  getMessages,
  editMessage,
  deleteMessage,
  
  // Admin routes
  getAllChannel,
  createChannel,
  updateChannelDetail,
  deleteChannel,
  getAllUsersInChannel,
};
