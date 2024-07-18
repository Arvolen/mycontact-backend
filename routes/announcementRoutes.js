// routes/announcementRoutes.js
const express = require('express');
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementsForUser, likeAnnouncement, claimRewards, deleteAnnouncementForUser } = require('../controllers/announcementController');
const validateToken = require("../middleware/validateToken");
const router = express.Router();


// NOTE: // CRUD routes for announcements by admins, uses isAdminHandler.js middleware

router.get('/', getAnnouncements);
router.post('/', createAnnouncement);
router.put('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);
router.get('/user/:userId', getAnnouncementsForUser);
router.post('/like', likeAnnouncement);
router.post('/claim-rewards', claimRewards);
router.delete('/user/deleteNotification', deleteAnnouncementForUser);

module.exports = router;


