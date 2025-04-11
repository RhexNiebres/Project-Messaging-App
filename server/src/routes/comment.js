const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/auth"); 


router.get("/comment/:id",verifyToken, commentController.getCommentById); 
router.get("/:postId",verifyToken, commentController.getCommentByPost);
router.post("/:postId",verifyToken, commentController.createComment);
router.put("/:commentId",verifyToken, commentController.updateComment);
router.delete("/:commentId",verifyToken,  commentController.deleteComment);

module.exports = router;
