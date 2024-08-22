const express = require('express');
const { 
    createAvatar, 
    createAvatarFromPath, 
    getUserAvatar, 
    updateUserAvatar, 
    getAllAvatars, 
    deleteAvatar 
} = require('../controllers/avatarController');
const validateToken = require('../middleware/validateToken');
const isAdminHandler = require('../middleware/isAdminHandler');
const upload = require('../middleware/avatarUpload');
const router = express.Router();

//User
router.use(validateToken)
router.get('/', getUserAvatar);

//Admin
router.use(isAdminHandler)
router.post('/', upload.single('image'), createAvatar);
router.post('/path', upload.single('image'), createAvatarFromPath);
router.get('/all', getAllAvatars);
router.put('/:id', upload.single('image'), updateUserAvatar);
router.delete('/:id', deleteAvatar);

module.exports = router;
