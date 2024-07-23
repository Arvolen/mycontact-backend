const express = require('express');
const { createAvatar, createAvatarFromPath, getUserAvatar, updateUserAvatar } = require('../controllers/avatarController');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

router.post('/', validateToken, createAvatar);
router.post('/path', validateToken, createAvatarFromPath);
router.get('/', validateToken, getUserAvatar);
router.put('/', validateToken, updateUserAvatar);

module.exports = router;
