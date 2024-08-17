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
  updateLastMessage,
  userViolationCount,
  getAllUsersInChat,
  createChat,
  updateChatDetail,
  sendMessageManual,
  deleteChat,
  getAllUserChats,
  getUserNameById
} = require('../controllers/chatController');

const router = express.Router();
router.use(validateToken);

// User Routes
router.get('/', getAllChats);
router.get('/:chatId', getChatById);
router.post('/messages', sendMessage);
router.post('/messages/manual', sendMessageManual);
router.get('/:chatId/messages', getMessages);
router.put('/:chatId/messages/:messageId', editMessage);
router.delete('/:chatId/messages/:messageId', deleteMessage);
router.get('/user/violation/count', userViolationCount)

// Admin Routes
router.use(isAdminHandler);

router.get('/allChannel/get', getAllUserChats);
router.post('/', createChat);
router.put('/', updateChatDetail);
router.delete('/:chatId', deleteChat);
router.get('/:chatId/users', getAllUsersInChat);

module.exports = router;
