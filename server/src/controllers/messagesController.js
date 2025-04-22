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
