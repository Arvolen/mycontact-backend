const express = require('express');
const { 
    createAvatar, 
    getUserAvatar, 
    updateAvatar, 
    getAllAvatars, 
    createAvatarUser,
    deleteAvatar,
    updateAvatarUser
} = require('../controllers/avatarController');
const validateToken = require('../middleware/validateToken');
const isAdminHandler = require('../middleware/isAdminHandler');
const upload = require('../middleware/avatarUpload');
const router = express.Router();

//User
router.use(validateToken)
router.get('/', getUserAvatar);
router.post('/user/profile', upload.single('image'), createAvatarUser);
router.put('/user/:id', upload.single('image'), updateAvatarUser);

//Admin
router.use(isAdminHandler)
router.post('/', upload.single('image'), createAvatar);
router.get('/all', getAllAvatars);
router.put('/:id', upload.single('image'), updateAvatar);
router.delete('/:id', deleteAvatar);

module.exports = router;
