const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path as necessary
const { findConfigFile } = require("typescript");

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
        level: 1
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

    // Mock user data
    const mockUser = {
        id: 1,
        name: "abcd",
        username: 'abcd1234',
        email: 'aa@qq.com',
        password: await bcrypt.hash('11111', 10),
        role: 'member',
        level: 3,
    };

    if (email === mockUser.email && await bcrypt.compare(password, mockUser.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: mockUser.username,
                    email: mockUser.email,
                    id: mockUser.id,
                    role: 'member'
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );
        console.log("accessToken", accessToken);
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
    const mockUser = {
        id: 1,
        username: 'abcd1234',
        email: 'aa@qq.com',
        role: 'admin',
        level: 3,
    };

    // Add headers to disable caching
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.json(mockUser);
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

const updateUser = asyncHandler(async (req, res) => {
    console.log("Updating")
    const userId = req.user.id; // Assuming user ID is passed as a URL parameter
    const { name, username, country, contact, accountStatus, email } = req.body;

    // Validate request body
    if (!name && !username && !country && !contact && !accountStatus && !email) {
        res.status(400);
        throw new Error('No valid fields provided for update');
    }
    console.log(userId)
    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update user fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (country) user.country = country;
    if (contact) user.contact = contact;
    if (accountStatus) user.accountStatus = accountStatus;
    if (email) user.email = email;

    // Save updated user
    await user.save();

    res.status(200).json(user);
});

  const getUserProfile = asyncHandler(async (req,res) =>{
    const{userId} = req.body
    const response = await User.findByPk(userId)

    res.json(response);


  })


module.exports = {
    registerUser,
    loginUser,
    currentUser,
    updateUserLevel,
    getUserProfile,
    updateUser,
    
};
