const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversationsController");
const { verifyToken } = require("../middlewares/auth");

router.get("/:id", verifyToken, conversationsController.getConversation);
router.post("/", verifyToken, conversationsController.createConversation);
router.delete("/:id", verifyToken, conversationsController.deleteConversation);

module.exports = router;
