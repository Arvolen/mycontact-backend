const express = require('express');
const validateToken = require('../middleware/validateToken');
const isAdminHandler = require('../middleware/isAdminHandler');
const {
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
} = require('../controllers/chatController');

const router = express.Router();
router.use(validateToken);

// User Routes
router.get('/', getAllChats);
router.get('/:chatId', getChatById);
router.post('/:chatId/messages', sendMessage);
router.get('/:chatId/messages', getMessages);
router.put('/:chatId/messages/:messageId', editMessage);
router.delete('/:chatId/messages/:messageId', deleteMessage);
router.get('/detailed', getAllChatsDetailed);

// Admin Routes
router.use(isAdminHandler);

router.post('/', createChat);
router.put('/:chatId', updateChatDetail);
router.delete('/:chatId', deleteChat);
router.get('/:chatId/users', getAllUsersInChat);

module.exports = router;
