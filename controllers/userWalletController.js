const asyncHandler = require('express-async-handler');
const UserWallet = require('../models/userWalletModel');

// @desc Add balance to user wallet
// @route POST /api/wallet/add
// @access Private
const addBalance = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const userId = req.user.id;
    console.log(amount, userId)
    const wallet = await UserWallet.findOne({ where: { userId: userId } });
    console.log("here")
    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }
  
    wallet.balance += parseFloat(amount);
    await wallet.save();
  
    res.status(200).json({ balance: wallet.balance, message: 'Balance added successfully' });
  });
  
  // @desc Deduct balance from user wallet
  // @route POST /api/wallet/deduct
  // @access Private
  const deductBalance = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    console.log("deducting user balance")
  
    const wallet = await UserWallet.findOne({ where: { userId } });
  
    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }
  
    if (wallet.balance < amount) {
      res.status(400);
      throw new Error('Insufficient balance');
    }
  
    wallet.balance -= parseFloat(amount);
    await wallet.save();

    console.log("deducting user balance sucesss", wallet)
  
    res.status(200).json({ balance: wallet.balance, message: 'Balance deducted successfully' });
  });
  
  // @desc Get user wallet balance
  // @route GET /api/wallet/balance
  // @access Private
  const getBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("Getting balance")
    const wallet = await UserWallet.findOne({ where: { userId } });
  
    if (!wallet) {
      res.status(404);
      throw new Error('Wallet not found');
    }
  
    res.status(200).json({ balance: wallet.balance });
  });

// @desc Create a new wallet for a user
// @route POST /api/wallet/create
// @access Private
const createWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Check if the user already has a wallet
  const existingWallet = await UserWallet.findOne({ where: { userId } });

  if (existingWallet) {
    res.status(400);
    throw new Error('Wallet already exists for this user');
  }

  // Create a new wallet
  const wallet = await UserWallet.create({ userId });
  res.status(201).json({ wallet, message: 'Wallet created successfully' });
});

// @desc Deactivate the user's wallet
// @route POST /api/wallet/deactivate
// @access Private
const deactivateWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wallet = await UserWallet.findOne({ where: { userId } });

  if (!wallet) {
    res.status(404);
    throw new Error('Wallet not found');
  }

  wallet.isActive = false;
  await wallet.save();

  res.status(200).json({ wallet, message: 'Wallet deactivated successfully' });
});

// @desc Reactivate the user's wallet
// @route POST /api/wallet/reactivate
// @access Private
const reactivateWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wallet = await UserWallet.findOne({ where: { userId } });

  if (!wallet) {
    res.status(404);
    throw new Error('Wallet not found');
  }

  wallet.isActive = true;
  await wallet.save();

  res.status(200).json({ wallet, message: 'Wallet reactivated successfully' });
});

module.exports = {
  createWallet,
  addBalance,
  deductBalance,
  getBalance,
  deactivateWallet,
  reactivateWallet
};