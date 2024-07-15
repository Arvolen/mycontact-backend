// routes/announcementRoutes.js
const express = require("express");
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");
const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", createAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
