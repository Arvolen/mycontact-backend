const express = require("express");
const { 
  createWallet, 
  addBalance, 
  deductBalance, 
  getBalance, 
  deactivateWallet, 
  reactivateWallet 
} = require("../controllers/userWalletController");
const isAdminHandler = require("../middleware/isAdminHandler");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.use(validateToken)

router.get("/wallet/balance", getBalance);
router.post("/wallet/deduct", deductBalance);

router.use(isAdminHandler)
 
router.post("/wallet/create", createWallet);

router.post("/wallet/add", addBalance);

router.post("/wallet/deactivate", deactivateWallet);

router.post("/wallet/reactivate", reactivateWallet);

module.exports = router;
