const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController");
const { verifyToken } = require("../middlewares/auth");

router.post("/:id/messages", verifyToken, messageController.sendMessage);
router.delete("/:id", verifyToken, messageController.deleteMessage);

module.exports = router; 