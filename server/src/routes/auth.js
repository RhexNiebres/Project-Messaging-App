const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sign-up", authController.postSignUp);
router.post("/log-in", authController.postLogin);

module.exports = router;
