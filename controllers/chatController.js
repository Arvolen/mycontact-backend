const asyncHandler = require('express-async-handler');
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

  // Find all chat participants for the user
  const chatsContacts = await ChatParticipant.findAll({
    where: { chatType: "channel", active: true },
    include: [{
      model: Chat,
      include: [{ model: ChatMessage, as: 'messages' }],
    }],
  });

  // Find all contacts for the user
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

  // Map chats to include last message data
  const formattedChatsContacts = await Promise.all(chatsContacts.map(async chatContact => {
    const chat = chatContact.Chat;
    const lastMessage = await ChatMessage.findByPk(chat.lastMessageId);

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
        lastMessage: lastMessage, // Include full last message data
        chat: chat.messages,
      },
    };
  }));

  // Create payload for response
  const payload = {
    chatsContacts: formattedChatsContacts,
    contacts: formattedContacts,
  };

  // Send response
  res.json(payload);
});
  

// @desc Get a specific chat by ID
// @access Private
const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  console.log("chatId: ", chatId)
  const userId = req.user.id;
  console.log("Getting chat by id")



  const chatsContacts = await ChatParticipant.findOne({
    where: { id: chatId },
    include: [{
      model: Chat,
      include: [{ model: ChatMessage, as: 'messages' }],
    }],
  });
  console.log(chatsContacts)
  const id= chatsContacts.chatId

  
  // Fetch the chat with its messages
  const chat = await Chat.findByPk(id, {
    include: [{ model: ChatMessage, as: 'messages' }]
  });

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Find the last message based on the ID
  const lastMessage = chat.messages.find(message => message.id === chat.lastMessageId);
  
  const formattedChat = {
    id: chat.id,
    unseenMsgs: chat.unseenMsgs,
    lastMessage, // Include full last message data
    chat: chat.messages,
  };


  const payload = {
    chat: formattedChat,
    contact: chatsContacts,
  };
  
  console.log("Success")
  res.json(payload);
});

// @desc Send a message in a chat
// @access Private
const sendMessage = asyncHandler(async (req, res) => {
  try {
    console.log("Chat data:", req.body.data.obj);
    const { chatId, message } = req.body.data.obj;
    const senderId = req.user.id;

    console.log("Message Data:", chatId, message, senderId);

    // Create a new message
    const newMessage = await ChatMessage.create({ chatId, message, senderId });

    console.log("Message Added");

    // Update the lastMessageId in the Chat model
    await updateLastMessage(chatId, newMessage.id);
    console.log("updateLastMessage Added");

    const chatsContacts = await ChatParticipant.findOne({
      where: { chatId: chatId },
      include: [{
        model: Chat,
        include: [{ model: ChatMessage, as: 'messages' }],
      }],
    });
    const id= chatsContacts.id

    // Emit the new message event
    const io = req.app.get('io');
    io.emit('newMessage', { id, message: newMessage });

    console.log("Connection Updated Added");

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "An error occurred while sending the message" });
  }
});

const sendMessageManual = asyncHandler(async (req, res) => {
  console.log("Chat data:",req.body)
  const { message, chatId } = req.body;

  const senderId = req.user.id;

  console.log("Message Data:" , chatId, message, senderId  )

  // Create a new message
  const newMessage = await ChatMessage.create({ chatId, message, senderId });

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




// @desc get all chat detailed including the contacts
// @access Admin
const getAllChatsDetailed = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userChats = await ChatParticipant.findAll({ 
    where: { userId, active: true }, 
    include: [{ 
      model: Chat, 
      include: [
        { model: ChatMessage, as: 'messages' },
        { model: ChatMessage, as: 'lastMessage', where: { id: Chat.lastMessageId }, required: false },
      ],
    }]
  });

  // Process userChats to include the last message
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
  sendMessageManual,
  updateLastMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getAllUsersInChat,
  createChat,
  updateChatDetail,
  deleteChat,
  getAllChatsDetailed,
  getAllUserChats
};
