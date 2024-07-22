const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path as necessary

//@desc Register a user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({ where: { email } });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
    });

    console.log('User created', user);

    if (user) {
        const token = jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRATION }
    );

    res.status(201).json({
        _id: user.id,
        email: user.email,
        token: `Bearer ${token}`
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
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role,
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
    console.log("current user")
});

module.exports = { 
    registerUser, 
    loginUser, 
    currentUser 
};
