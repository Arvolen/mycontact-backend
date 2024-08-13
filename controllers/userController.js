//controllers/userController

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../utils/encryptionUtil");
const { validateRegisterInput, validateLoginInput } = require("../utils/validationUtil");

//@desc Register a user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    validateRegisterInput(req.body);

    const { name, username, email, password } = req.body;
    const userAvailable = await User.findOne({ where: { email } });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        level: 1
    });

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
    validateLoginInput(req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && await comparePasswords(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    name: user.name,
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
    console.log("current user")
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
