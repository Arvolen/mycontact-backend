
const express = require('express');
const validateToken = require('../middleware/validateToken');
const isAdminHandler = require('../middleware/isAdminHandler');
const {    
    getAllActiveChannel,
    getChannelData,
    getAllActiveChannelContact,
    sendMessage,
    joinChannel,
    leaveChannel,
    getMessages,
    editMessage,
    deleteMessage,
    getAllChannel,
    createChannel,
    updateChannelDetail,
    deleteChannel,
    getAllUsersInChannel,   
} = require('../controllers/channelController')

const router = express.Router();
router.use(validateToken);

// User Routes
router.get('/channel', getAllActiveChannel);
router.get('/channelContact', getAllActiveChannelContact);
router.get('/:channelId', getChannelData);
router.post('/:channelId/post', sendMessage);
// router.post('/channel/join/:channelId', joinChannel);
// router.post('/channel/leave/:channelId', leaveChannel);
router.get('/:channelId/messages', getMessages);
router.put('/:channelId/message/:messageId', editMessage);
router.delete('/:channelId/message/:messageId', deleteMessage);

// Admin Routes
router.use(isAdminHandler);

router.get('/', getAllChannel);
router.post('/', createChannel);
router.put('/', updateChannelDetail);
router.delete('/:channelId', deleteChannel);
router.get('/:channelId/users', getAllUsersInChannel);

module.exports = router;
