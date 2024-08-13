// controllers/adminController.js

const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const { hashPassword, comparePasswords } = require("../utils/encryptionUtil");
const { validateRegisterInput, validateLoginInput } = require("../utils/validationUtil");

//@access public
const adminRegister = asyncHandler(async (req, res) => {
    validateRegisterInput(req.body);

    const { name, username, email, password } = req.body;
    const existingAdmin = await User.findOne({ where: { email } });

    if (existingAdmin) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
        role: "admin",
        level: 1
    });

    const token = jwt.sign(
        { id: newAdmin.id, email: newAdmin.email, username: newAdmin.username, role: newAdmin.role, level: newAdmin.level },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRATION }
    );

    res.status(201).json({
        _id: newAdmin.id,
        email: newAdmin.email,
        token: `Bearer ${token}`
    });
});
//@access public
const adminLogin = asyncHandler(async (req, res) => {
    validateLoginInput(req.body);

    const { email, password } = req.body;
    const admin = await User.findOne({ where: { email, role: "admin" } });

    if (admin && await comparePasswords(password, admin.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    name: admin.name,
                    username: admin.username,
                    email: admin.email,
                    id: admin.id,
                    role: admin.role,
                    level: admin.level
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_EXPIRATION }
        );
        res.status(200).json({
            accessToken: "Bearer " + accessToken,
            message: "Admin login successful",
        });
    } else {
        throw new Error("Invalid credentials");
    }
});

//@access private (admin)
const currentAdminStatus = asyncHandler(async (req, res) => {
    const adminId = req.user.id;
    const admin = await User.findByPk(adminId);

    if (!admin || admin.role !== "admin") {
        throw new CustomError("Admin not found", 404);
    }

    res.status(200).json({
        id: admin.id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        level: admin.level
    });
});

//@access private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
    // Extract query parameters from the request
    const { limit = 10, sortBy = 'createdAt', order = 'DESC', search = "", role, accountStatus, packageId } = req.query;

    // Create a where condition for search (assuming you're searching by username)
    let whereCondition = {};

    if (search) {
        whereCondition = {
            [Op.or]: [
                { username: { [Op.like]: `%${search}%` } },
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
            ]
        };
    }

    if (role) {
        whereCondition.role = role;
    }

    // Add status condition
    if (accountStatus) {
        whereCondition.accountStatus = accountStatus; // Assuming 'status' is stored in 'accountStatus' field
    }

    // Add plan condition
    if (packageId) {
        whereCondition.packageId = packageId;
    }

    try {
        const users = await User.findAll({
            where: whereCondition,
            order: [[sortBy, order]],
            limit: parseInt(limit, 10)
        });

        res.json(users);
    } catch (error) {
        // If there's an error in querying the database
        if (error instanceof CustomError) {
            // Pass the error through your error-handling middlewares
            throw error;
        } else {
            // For unexpected errors, you can throw a generic error or log it
            console.error('Unexpected error when fetching users:', error);
            throw new CustomError('An unexpected error occurred', 500);
        }
    }
});


//@access private (admin)
const getUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
        throw new CustomError('Username parameter is required.', 400);
    }

    const user = await User.findOne({
        where: { username: username },
        include: [{
            model: Package,
            as: 'package'
        }]
    });

    if (!user) {
        throw new CustomError('User not found.', 404);
    }

    const cryptoBalances = await CryptoBalance.findAll({ where: { userId: user.id } });
    const eWalletProfiles = await EwalletProfile.findAll({
        where: { userId: user.id },
        include: [{
            model: EwalletCoin,
            attributes: ['name', 'symbol']
        }]
    });

    const { password, ...userDetails } = user.toJSON();

    const userData = {
        userDetails,
        cryptoBalances,
        eWalletProfiles
    };

    res.json(userData);
});



module.exports = { 
    adminRegister, 
    adminLogin, 
    currentAdminStatus, 
    getAllUsers, 
    getUser };
