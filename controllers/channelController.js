// chatController.js

const asyncHandler = require('express-async-handler');
const ChatChannel = require('../models/chatChannel');
const ChatHistory = require('../models/chatHistory');
const User = require('../models/userModel');
const Contact = require('../models/contactModel')

// @desc Get all active channels
// @access Public
const getAllActiveChannel = asyncHandler(async (req, res) => {
  const channels = await ChatChannel.findAll({ where: { active: true } });
  res.json(channels);
});

// @desc Get details of a specific channel
// @access Public
const getChannelData = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const channel = await ChatChannel.findByPk(channelId);

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  res.json(channel);
});

// @desc Send a message
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
// @access Private
const joinChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.body;

  res.json({ message: 'User joined channel' });
});

// @desc Leave a channel
// @access Private
const leaveChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.body;


  res.json({ message: 'User left channel' });
});

// @desc Get messages from a channel
// @access Private
const getMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const messages = await ChatHistory.findAll({ where: { channelId } });
  res.json(messages);
});

// @desc Edit a message
// @access Private
const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;

  const updatedMessage = await ChatHistory.update({ message }, { where: { id: messageId } });
  res.json(updatedMessage);
});

// @desc Delete a message
// @access Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  await ChatHistory.destroy({ where: { id: messageId } });
  res.status(204).end();
});

// @desc Admin: Get all channels
// @access Admin
const getAllChannel = asyncHandler(async (req, res) => {
  const channels = await ChatChannel.findAll();
  res.json(channels);
});

// @desc Admin: Create a new channel
// @access Admin
const createChannel = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const newChannel = await ChatChannel.create({ name, description });
  res.status(201).json(newChannel);
});

// @desc Admin: Update channel details
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
// @access Admin
const getAllUsersInChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // Logic to get all users in the channel
  const users = []; // Replace with actual logic
  res.json(users);
});

const getAllActiveChannelContact = asyncHandler(async (req, res) => {
  console.log('Getting channels and contacts');

  // Fetch active channels and user's contacts
  const chatsContactsPull = await ChatChannel.findAll({ where: { active: true } });
  const contactsPull = await Contact.findAll({ 
    where: { user_id: req.user.id },  
    attributes: ['id', 'name', 'email', 'phone'] 
  });
  console.log(contactsPull)
  let contacts  = {
    id : contactsPull.id,
    role: "Admin",
    about: "Normal Person",
    fullName: contactsPull.name,
    status: "online"
  }
  console.log(contacts)

  let chatsContacts = {

    id: chatsContactsPull.id,
    role: req.user.role,
    about: chatsContactsPull.description,
    chat: ChatsObj,
    fullName: req,
    status: "online"
  }


  // Package the data into a payload object
  const payload = {
    chatsContacts,
    contacts
  };
  console.log( payload)

  // Send the payload as a JSON response
  res.json(payload);
});


module.exports = {
  // User routes
  getAllActiveChannelContact,
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
