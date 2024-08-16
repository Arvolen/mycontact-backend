const express = require("express");
const { 
  createWallet, 
  addBalance, 
  deductBalance, 
  getBalance, 
  deactivateWallet, 
  reactivateWallet 
} = require("../controllers/userWalletController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.post("/wallet/create", validateToken, createWallet);

router.post("/wallet/add", validateToken, addBalance);

router.post("/wallet/deduct", validateToken, deductBalance);

router.get("/wallet/balance", validateToken, getBalance);

router.post("/wallet/deactivate", validateToken, deactivateWallet);

router.post("/wallet/reactivate", validateToken, reactivateWallet);

module.exports = router;
