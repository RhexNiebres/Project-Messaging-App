const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversationsController");

router.get("/:id", conversationsController.getConversation);
router.post("/", conversationsController.createConversation);
router.delete("/:id", conversationsController.deleteConversation);

module.exports = router;
