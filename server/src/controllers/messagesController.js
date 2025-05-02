const { PrismaClient } = require("../generated/prisma");
const { json } = require("express");
const prisma = new PrismaClient();

exports.sendMessage = async (req, res) => {
  const { id } = req.params;
  const { content, senderId } = req.body;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        conversationId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        conversationId: true,
        createdAt: true,
        sender: { select: { id: true, username: true } },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.log(error);
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
      return res.status(404).json({ message: "Message not found" });
    }

    const deletedMessage = await prisma.message.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
      },
      include: {
        sender: {
          select: {
            username: true,
            email: true,
            id: true,
          },
        },
      },
    });

    deletedMessage.content = "This message was deleted";

    res
      .status(200)
      .json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    res.status(500).json({ error: "Error deleting message" });
  }
};
