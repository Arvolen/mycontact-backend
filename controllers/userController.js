const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
//@desc Register a user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");

    }
    const userAvaiable = await User.findOne({ email });
    if (userAvaiable) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username, 
        email, 
        password: hashedPassword,
    });

    console.log('User created ', user)

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email});
    }
    else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Register a user
//@route POST /api/users
//@access public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request:', { email, password });

    if (!email || !password) {
        res.status(400);
        console.error('Login failed: All fields are mandatory');
        throw new Error("All fields are mandatory");
    }

    // Mock user data
    const mockUser = {
        username: "john_doe",
        email: "john_doe@example.com",
        id: "1",
        password: "password123" // Mock password (for demonstration purposes only)
    };

    // Mock password check
    if (email === mockUser.email && password === mockUser.password) {
        console.log('Login successful for user:', mockUser);

        const accessToken = jwt.sign(
            {
                user: {
                    username: mockUser.username,
                    email: mockUser.email,
                    id: mockUser.id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        console.log('Generated access token:', accessToken);

        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        console.error('Login failed: Email or password not valid');
        throw new Error("Email or password not valid");
    }
});

//@desc Current user info
//@route POST /api/users
//@access private

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});


module.exports = {registerUser, loginUser, currentUser};