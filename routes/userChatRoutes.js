const express = require('express');
const { 
  createUserChat, 
  getAllUserChats, 
  getUserChatById, 
  updateUserChat, 
  deleteUserChat 
} = require('../controllers/userChatController');
const validateToken = require('../middleware/validateToken');
const router = express.Router();

router.use(validateToken); // Ensure the user is authenticated

// UserChat Routes
router.post('/', createUserChat);
router.get('/', getAllUserChats);
router.get('/:id', getUserChatById);
router.put('/:id', updateUserChat);
router.delete('/:id', deleteUserChat);

module.exports = router;
