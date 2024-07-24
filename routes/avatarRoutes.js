const express = require('express');
const { createAvatar, createAvatarFromPath, getUserAvatar, updateUserAvatar, getAllAvatar, deleteAvatar } = require('../controllers/avatarController');
const validateToken = require('../middleware/validateToken');
const { adminLogin } = require('../controllers/adminController');
const isAdminHandler = require('../middleware/isAdminHandler');

const router = express.Router();


router.post('/', validateToken, isAdminHandler, createAvatar);
router.get('/all', validateToken, isAdminHandler, getAllAvatar);
router.post('/path', validateToken, isAdminHandler, createAvatarFromPath);
router.get('/', validateToken, getUserAvatar);
router.put('/:id', validateToken, isAdminHandler, updateUserAvatar);
router.delete('/:id', validateToken, isAdminHandler, deleteAvatar);

module.exports = router;
