const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messagesController');

router.get('/:id/messages', messageController.getMessages);
router.post('/:id/messages', messageController.sendMessage);
router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;