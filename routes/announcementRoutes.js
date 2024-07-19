// routes/announcementRoutes.js
const express = require('express');
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementsForUser, likeAnnouncement, claimRewards, deleteAnnouncementForUser } = require('../controllers/announcementController');
const validateToken = require("../middleware/validateToken");
const router = express.Router();
const isAdminHandler = require("../middleware/isAdminHandler");

// NOTE: // CRUD routes for announcements by admins, uses isAdminHandler.js middleware



router.get('/', validateToken, isAdminHandler, getAnnouncements);
router.post('/', validateToken, isAdminHandler, createAnnouncement);
router.put('/:id', validateToken, isAdminHandler, updateAnnouncement);
router.delete('/:id',validateToken, isAdminHandler, deleteAnnouncement);
router.get('/user/:userId', getAnnouncementsForUser);
router.post('/like', likeAnnouncement);
router.post('/claim-rewards', claimRewards);
router.delete('/user/deleteNotification', deleteAnnouncementForUser);

module.exports = router;


