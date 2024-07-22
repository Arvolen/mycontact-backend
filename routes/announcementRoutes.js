const express = require('express');
const validateToken = require("../middleware/validateToken");
const isAdminHandler = require("../middleware/isAdminHandler");
const {
    getAnnouncements, 
    createAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement, 
    getAnnouncementsForUser, 
    likeAnnouncement, 
    claimRewards, 
    deleteAnnouncementForUser,
    announcementSeen
} = require('../controllers/announcementController');

const router = express.Router();

//Admin
router.get('/', validateToken, isAdminHandler, getAnnouncements);
router.post('/', validateToken, isAdminHandler, createAnnouncement);
router.put('/:id', validateToken, isAdminHandler, updateAnnouncement);
router.delete('/:id', validateToken, isAdminHandler, deleteAnnouncement);

//Users in general
router.get('/user/:userId', getAnnouncementsForUser);
router.post('/like', likeAnnouncement);
router.post('/claim-rewards', claimRewards);
router.post('/seen', announcementSeen);
router.delete('/user/deleteNotification', deleteAnnouncementForUser);

module.exports = router;
