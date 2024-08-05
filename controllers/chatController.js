const asyncHandler = require('express-async-handler');
const { Chat, ChatMessage, ChatParticipant} = require('../models/chatModel');
const User = require('../models/userModel');
const Contact = require('../models/contactModel');

// @desc Get all chats for a user
// @access Private
const getAllChats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userChats = await ChatParticipant.findAll({ 
    where: { userId, active: true }, 
    include: [{ 
      model: Chat, 
      include: [{ model: ChatMessage, as: 'messages' }]
    }]
  });
  res.json(userChats);
});

// @desc Get a specific chat by ID
// @access Private
const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findByPk(chatId, { include: [{ model: ChatMessage, as: 'messages' }] });

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  res.json(chat);
});

// @desc Send a message in a chat
// @access Private
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const senderId = req.user.id;

  const newMessage = await ChatMessage.create({ chatId, message, senderId });
  res.status(201).json(newMessage);
});

// @desc Get messages from a chat
// @access Private
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const messages = await ChatMessage.findAll({ where: { chatId } });
  res.json(messages);
});

// @desc Edit a message
// @access Private
const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;

  const [updated] = await ChatMessage.update({ message }, { where: { id: messageId } });
  if (!updated) {
    res.status(404);
    throw new Error('Message not found');
  }

  const updatedMessage = await ChatMessage.findByPk(messageId);
  res.json(updatedMessage);
});

// @desc Delete a message
// @access Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const deleted = await ChatMessage.destroy({ where: { id: messageId } });
  if (!deleted) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.status(204).end();
});

// @desc Get all users in a chat
// @access Private
const getAllUsersInChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const usersInChat = await ChatParticipant.findAll({ 
    where: { chatId }, 
    include: [{ model: User, attributes: ['id', 'name', 'email'] }] 
  });
  res.json(usersInChat);
});

// @desc Admin: Create a new chat
// @access Admin
const createChat = asyncHandler(async (req, res) => {
  const { userId, unseenMsgs, lastMessage } = req.body;
  const newChat = await Chat.create({ userId, unseenMsgs, lastMessage });
  res.status(201).json(newChat);
});

// @desc Admin: Update chat details
// @access Admin
const updateChatDetail = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { unseenMsgs, lastMessage } = req.body;

  const chat = await Chat.findByPk(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  chat.unseenMsgs = unseenMsgs;
  chat.lastMessage = lastMessage;
  await chat.save();

  res.json(chat);
});

// @desc Admin: Delete a chat
// @access Admin
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  await chat.destroy();
  res.status(204).end();
});

const getAllChatsDetailed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log("Fetching user chats...");

  const userChats = await ChatParticipant.findAll({ 
    where: { userId, active: true }, 
    include: [{
      model: Chat,
      include: [{ model: ChatMessage, as: 'messages' }]
    }]
  });

  console.log('User Chats:', JSON.stringify(userChats, null, 2));

  const contacts = await Contact.findAll({ 
    where: { user_id: userId },  
    attributes: ['id', 'name', 'email', 'phone'] 
  });

  const formattedContacts = contacts.map(contact => ({
    id: contact.id,
    role: "Admin",
    about: "Normal Person",
    fullName: contact.name,
    status: "online"
  }));

  console.log('Contacts:', formattedContacts);

  const chatsContacts = userChats.map(userChat => {
    const chat = userChat.Chat;
    return {
      id: userChat.id,
      role: userChat.role,
      about: userChat.about,
      chat: {
        id: chat.id,
        userId: chat.userId,
        messages: chat.messages.map(message => ({
          message: message.message,
          senderId: message.senderId,
          time: message.time
        })),
        unseenMsgs: chat.unseenMsgs,
        lastMessage: chat.lastMessage ? {
          message: chat.lastMessage.message,
          senderId: chat.lastMessage.senderId,
          time: chat.lastMessage.time
        } : null
      },
      avatar: userChat.avatar,
      fullName: userChat.fullName,
      status: userChat.status,
      avatarColor: userChat.avatarColor
    };
  });

  const payload = {
    chatsContacts,
    contacts: formattedContacts
  };

  res.json(payload);
});


module.exports = {
  getAllChats,
  getChatById,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getAllUsersInChat,
  createChat,
  updateChatDetail,
  deleteChat,
  getAllChatsDetailed
};
