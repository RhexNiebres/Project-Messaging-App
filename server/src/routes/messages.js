const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController");

router.get("/:id/messages", messageController.getMessageByConversation);
router.post("/:id/messages", messageController.sendMessage);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;