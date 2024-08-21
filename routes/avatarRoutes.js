const express = require('express');
const { createAvatar, createAvatarFromPath, getUserAvatar, updateUserAvatar, getAllAvatars, deleteAvatar } = require('../controllers/avatarController');
const validateToken = require('../middleware/validateToken');
const isAdminHandler = require('../middleware/isAdminHandler');
const upload = require('../middleware/avatarUpload');
const router = express.Router();



router.post('/', validateToken, isAdminHandler, upload.single('image'), createAvatar);
router.post('/path', validateToken, isAdminHandler, upload.single('image'), createAvatarFromPath);
router.get('/all', validateToken, isAdminHandler, getAllAvatars);
router.get('/', validateToken, getUserAvatar);
router.put('/:id', validateToken, isAdminHandler, upload.single('image'), updateUserAvatar);
router.delete('/:id', validateToken, isAdminHandler, deleteAvatar);

module.exports = router;
