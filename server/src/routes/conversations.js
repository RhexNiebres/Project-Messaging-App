const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversationsController");
const { verifyToken } = require("../middlewares/auth");

router.get("/:id", verifyToken, conversationsController.getConversation);
router.post("/", verifyToken, conversationsController.createConversation);
router.get(
  "/:id/conversations",
  verifyToken,
  conversationsController.getUserConversations
);

module.exports = router;
