// controllers/userController.js

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const UserWallet = require("../models/userWalletModel"); 
const { hashPassword, comparePasswords } = require("../utils/encryptionUtil");
const { validateRegisterInput, validateLoginInput } = require("../utils/validationUtil");

//@desc Register a user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    validateRegisterInput(req.body);

    const { firstName, lastName, username, email, password } = req.body;
    const userAvailable = await User.findOne({ where: { email } });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        firstName, 
        lastName,
        username,
        email,
        password: hashedPassword,
        level: 1
    });

    console.log("User created");

    // Create a wallet for the user
    const wallet = await UserWallet.create({ userId: user.id });
    console.log("Wallet created: ", wallet);

    if (user) {
        const token = jwt.sign(
            { user },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_EXPIRATION }
        );

        res.status(201).json({
            _id: user.id,
            email: user.email,
            token: `Bearer ${token}`,
            wallet: wallet // Include the wallet in the response
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    validateLoginInput(req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && await comparePasswords(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                    level: user.level
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password not valid");
    }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
    console.log("Current user");
});

//@desc Update user level
//@route PATCH /api/users/level
//@access private
const updateUserLevel = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.level < 5) {
        user.level += 1;
        await user.save();
        res.status(200).json({ level: user.level });
    } else {
        res.status(400);
        throw new Error("User has already reached the maximum level");
    }
});

//@desc Update user profile
//@route PUT /api/users
//@access private
const updateUser = asyncHandler(async (req, res) => {
    console.log("Updating");
    const userId = req.user.id;
    const { firstName, lastName, username, country, contact, accountStatus, email } = req.body;

    if (!firstName && !lastName && !username && !country && !contact && !accountStatus && !email) {
        res.status(400);
        throw new Error('No valid fields provided for update');
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    console.log("Here");
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (country) user.country = country;
    if (contact) user.contact = contact;
    if (accountStatus) user.accountStatus = accountStatus;
    if (email) user.email = email;

    await user.save();

    res.status(200).json(user);
});

//@desc Get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    updateUserLevel,
    updateUser,
    getUserProfile,
};
