const asyncHandler = require('express-async-handler');
const UserWallet = require('../models/userWalletModel');
const { sequelize } = require('../config/dbConnection'); 


// @desc Add balance to user wallet
// @route POST /api/wallet/add
// @access Private
const addBalance = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
      const wallet = await UserWallet.findOne({ where: { userId }, transaction });

      if (!wallet) {
          await transaction.rollback();
          res.status(404);
          throw new Error('Wallet not found');
      }

      wallet.balance += parseFloat(amount);
      await wallet.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({ balance: wallet.balance, message: 'Balance added successfully' });
  } catch (error) {
      await transaction.rollback();
      console.error('Error occurred while adding balance:', error);
      res.status(500).json({ success: false, message: 'An error occurred while adding balance' });
  }
});

// @desc Deduct balance from user wallet
// @route POST /api/wallet/deduct
// @access Private
const deductBalance = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
      const wallet = await UserWallet.findOne({ where: { userId }, transaction });

      if (!wallet) {
          await transaction.rollback();
          res.status(404);
          throw new Error('Wallet not found');
      }

      if (wallet.balance < amount) {
          await transaction.rollback();
          res.status(400);
          throw new Error('Insufficient balance');
      }

      wallet.balance -= parseFloat(amount);
      await wallet.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({ balance: wallet.balance, message: 'Balance deducted successfully' });
  } catch (error) {
      await transaction.rollback();
      console.error('Error occurred while deducting balance:', error);
      res.status(500).json({ success: false, message: 'An error occurred while deducting balance' });
  }
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