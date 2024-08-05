const express = require("express"); 
const { 
    registerUser, 
    loginUser, 
    currentUser, 
    updateUser, 
    getUserProfile,
    updateUserLevel} = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.get("/profile", validateToken, getUserProfile)

router.put("/update", validateToken, updateUser)

router.put("/update/level", validateToken, updateUserLevel)

module.exports = router;