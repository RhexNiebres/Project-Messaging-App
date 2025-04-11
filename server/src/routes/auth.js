const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sign-up", authController.postSignUp);
router.post("/log-in", authController.postLogin);
router.post("/log-out", authController.logout);

module.exports = router;