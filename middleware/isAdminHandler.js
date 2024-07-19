// middlewares/isAdminHandler.js
const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');

const isAdminHandler = asyncHandler(async (req, res, next) => {
    // Assuming after token validation, you have user's details stored in req.user
    console.log("Check if its admin")
    
    const user = req.user;

    console.log("This is the user:", user)

    if (!user) {
        res.status(404).json({
            title: "Not found",
            message: "User not found.",
            stackTrace: new Error("User not found.").stack
        });
        return;
    }

    if (user.role !== 'admin') { // Assuming you have 'role' attribute in User model
        res.status(403).json({
            title: "FORBIDDEN",
            message: "Permission denied. You do not have the required privileges.",
            stackTrace: new Error("Permission denied. You do not have the required privileges.").stack
        });
        return;
    }
    console.log("Admin Account")
    next(); // If the user is an admin, continue to the next middlewares or route handler
});

module.exports = isAdminHandler;