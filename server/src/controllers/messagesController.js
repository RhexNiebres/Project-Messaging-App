const { PrismaClient } = require("@prisma/client");
const { json } = require("express");
const prisma = new PrismaClient();

exports.getMessageByConversation = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: { messages: true },
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

exports.sendMessage = async (req, res) => {
  const { id } = req.params;
  const { content, senderId } = req.body;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        conversationId: parseInt(id),
      },
    });

    res.status (201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

exports.deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
      const message = await prisma.message.findUnique({
        where: { id: parseInt(id) },
      }); 
  
      if (!message) {
        res.status(404).json({ message: "message not found" });
      }
  
      await prisma.message.delete({
        where:{id:parseInt(id)},
      });
  
      res.status (200).json({message: 'Message deleted successfully'});
    } catch (error) {
      res.status(500).json({ error: "Error deleting message" });
    }
  };