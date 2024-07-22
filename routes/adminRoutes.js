// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, currentAdminStatus, getAllUsers, getUser } = require("../controllers/adminController");
const validateToken = require("../middleware/validateToken");
const isAdminHandler = require("../middleware/isAdminHandler");

// Registration and Login routes
router.post('/register', adminRegister);
router.post('/login',  adminLogin);
// router.post('/refreshToken', refreshToken);
router.use(validateToken, isAdminHandler);


// post-login
router.get('/current', currentAdminStatus);


// User related routes
router.get('/users', getAllUsers);
router.get('/users/:username', getUser);

module.exports = router;