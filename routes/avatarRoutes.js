const express = require('express');
const { createAvatar, getUserAvatar, updateUserAvatar } = require('../controllers/avatarController');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

router.post('/', validateToken, createAvatar);
router.get('/', validateToken, getUserAvatar);
router.put('/', validateToken, updateUserAvatar);

module.exports = router;
