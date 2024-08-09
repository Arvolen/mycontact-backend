const asyncHandler = require('express-async-handler');
const {sanitizeMessage}  = require('../services/chatService')
const { checkAndCountViolations } = require('../services/chatViolation');
const { Chat, ChatMessage, ChatParticipant} = require('../models/chatModel');
const User = require('../models/userModel');
const Contact = require('../models/contactModel');

// @desc Admin: Create a new channel or chat
// @access Admin
const createChat = asyncHandler(async (req, res) => {
  const { fullName, unseenMsgs, lastMessage, chatType, about } = req.body;
  const newChat = await Chat.create({ name: fullName, unseenMsgs, lastMessage });
  const chatId = newChat.id
  const userId = req.user.id
  console.log(newChat)
  if(chatType == 'channel'){
    const newChannel = await ChatParticipant.create({
      role: chatType,
      about: about,
      chatId: chatId,
      userId: userId,
      fullName: fullName,
      active: true ,
      chatType: chatType
    });

  res.status(201).json(newChannel);

  }
  if(chatType == 'chat'){
    const newChannelChat = await ChatParticipant.create({
      role: chatType,
      about,
      chatId,
      userId: userId,
      avatar,
      fullName: fullName,
      avatarColor,
      active: true ,
      chatType: chatType
    });

  res.status(201).json(newChannelChat);
}
});
// @desc Get all chats for a user
// @access Private
const getAllChats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log("Getting all chats");

  // Fetch chat participants with their related chats and messages
  const chatsContacts = await ChatParticipant.findAll({
    where: { chatType: "channel", active: true },
    include: [{
      model: Chat,
      include: [{ model: ChatMessage, as: 'messages' }],
    }],
  });

  // Fetch contacts related to the user
  const contacts = await Contact.findAll({
    where: { user_id: userId },
    attributes: ['id', 'name', 'email', 'phone'],
  });

  // Format contacts for response
  const formattedContacts = contacts.map(contact => ({
    id: contact.id,
    role: "Admin",
    about: "Normal Person",
    fullName: contact.name,
    status: "online",
  }));

  // Format chat participants and sanitize their messages
  const formattedChatsContacts = await Promise.all(chatsContacts.map(async chatContact => {
    const chat = chatContact.Chat;
    const lastMessage = await ChatMessage.findByPk(chat.lastMessageId);

    // Sanitize all messages directly replacing the message field
    const sanitizedMessages = chat.messages.map(message => {
      message.message = sanitizeMessage(message.message); // Replace the message content with the sanitized version
      return message.toJSON(); // Convert message instance to plain object
    });

    console.log("Messages sanitized");

    return {
      id: chatContact.id,
      chatId: chat.id,
      userId: chatContact.userId,
      role: chatContact.role,
      about: chatContact.about,
      avatar: chatContact.avatar,
      fullName: chatContact.fullName,
      status: chatContact.status,
      avatarColor: chatContact.avatarColor,
      active: chatContact.active,
      chat: {
        id: chat.id,
        unseenMsgs: chat.unseenMsgs,
        lastMessage: lastMessage ? {
          ...lastMessage.toJSON(),
          message: sanitizeMessage(lastMessage.message), // Replace the last message content with the sanitized version
        } : null,
        messages: sanitizedMessages, // Include sanitized messages
      },
    };
  }));

  // Prepare the response payload
  const payload = {
    chatsContacts: formattedChatsContacts,
    contacts: formattedContacts,
  };

  // Send the response
  res.json(payload);
});

// @desc Get a specific chat by ID
// @access Private
const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;

  console.log("Getting chat by ID");

  // Fetch the chat participant with related chat and messages
  const chatsContacts = await ChatParticipant.findOne({
    where: { id: chatId },
    include: [{
      model: Chat,
      include: [{ model: ChatMessage, as: 'messages' }],
    }],
  });

  if (!chatsContacts) {
    res.status(404);
    throw new Error('Chat not found');
  }

  const chat = await Chat.findByPk(chatsContacts.chatId, {
    include: [{ model: ChatMessage, as: 'messages' }]
  });

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Find the last message based on the ID and sanitize it
  const lastMessage = chat.messages.find(message => message.id === chat.lastMessageId);

  const formattedChat = {
    id: chat.id,
    unseenMsgs: chat.unseenMsgs,
    lastMessage: lastMessage ? {
      ...lastMessage.toJSON(),
      message: sanitizeMessage(lastMessage.message), // Replace the last message content with the sanitized version
    } : null,
    chat: chat.messages.map(message => {
      message.message = sanitizeMessage(message.message); // Replace the message content with the sanitized version
      return message.toJSON(); // Convert message instance to plain object
    }),
  };

  // Prepare the response payload
  const payload = {
    chat: formattedChat,
    contact: chatsContacts,
  };

  // Send the response
  res.json(payload);
});
// @desc Send a message in a chat
// @access Private

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId, message } = req.body.data.obj;
    const senderId = req.user.id;
    const senderName = req.user.username;


    // Create a new message
    const newMessage = await ChatMessage.create({ chatId, message, senderId, senderName });

    await checkAndCountViolations(message, senderId);

    // Update the lastMessageId in the Chat model
    await updateLastMessage(chatId, newMessage.id);

    const chatsContacts = await ChatParticipant.findOne({
      where: { chatId },
      include: [{
        model: Chat,
        include: [{ model: ChatMessage, as: 'messages' }],
      }],
    });
    const id = chatsContacts.id;

    // Emit the new message event
    const io = req.app.get('io');
    io.emit('newMessage', { id, message: newMessage });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "An error occurred while sending the message" });
  }
});

const sendMessageManual = asyncHandler(async (req, res) => {
  const { message, chatId } = req.body;

  const senderId = req.user.id;
  const senderName = req.user.username;

  console.log("Message Data:" , chatId, message, senderId, senderName  )

  // Create a new message
  const newMessage = await ChatMessage.create({ chatId, message, senderId, senderName });


  console.log("Message Added")

  // Update the lastMessageId in the Chat model
  await updateLastMessage(chatId, newMessage.id);

  const chatsContacts = await ChatParticipant.findOne({
    where: { chatId: chatId },
    include: [{
      model: Chat,
      include: [{ model: ChatMessage, as: 'messages' }],
    }],
  });
  const id= chatsContacts.id


  const io = req.app.get('io');
  io.emit('newMessage', { id, message: newMessage });

  console.log("Connection Updated Added");

  res.status(201).json(newMessage);
});

// @desc manually update last message
// @access Private
const updateLastMessage = async (chatId, messageId) => {
  const chat = await Chat.findByPk(chatId);
  if (chat) {
    chat.lastMessageId = messageId;
    await chat.save();
  }
};


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

// @desc Get all ChatParticipants
// @access Private
const getAllUserChats = asyncHandler(async (req, res) => {
  console.log("getting all user chat")
  const userChats = await ChatParticipant.findAll({
    include: [
      { model: User, attributes: ['id', 'name', 'email'] }, // Include related User information
      { model: Chat, attributes: ['id', 'unseenMsgs', 'lastMessageId'] } // Include related Chat information
    ]
  });
  res.json(userChats);
});

// @desc Admin: Update chat details
// @access Admin
const updateChatDetail = asyncHandler(async (req, res) => {
  const { chatId, fullName, active, about } = req.body;

  const chatParticipant = await ChatParticipant.findOne({
    where: { chatId },
  });

  const updatedChatParticipant = await chatParticipant.update({
    fullName,
    active,
    about,
  });

  res.status(201).json(updatedChatParticipant);

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



const getUserNameById = asyncHandler(async (req, res) => {
  const userId = req.params

  const user = await User.findByPk(userId);

  if (!user) {
      res.status(404);
      throw new Error("User not found");
  }

  res.status(200).json(user);
});


module.exports = {
  getAllChats,
  getChatById,
  sendMessage,
  sendMessageManual,
  updateLastMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getAllUsersInChat,
  createChat,
  updateChatDetail,
  deleteChat,
  getAllUserChats,
  getUserNameById
};
