const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const conversationsController = require("../controllers/conversationsController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, usersController.getAllUsers);
router.get("/:id", verifyToken, usersController.getUserById);
router.put("/:id", verifyToken, usersController.updateUser);
router.get(
  "/:id/conversations",
  verifyToken,
  conversationsController.getUserConversations
);
router.post('/check', verifyToken,
    usersController.checkUserExistence);

module.exports = router;
