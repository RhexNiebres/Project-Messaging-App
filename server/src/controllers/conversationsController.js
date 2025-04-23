const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getConversation = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: { messages: true, chatMembers: true },
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversation" });
  }
};


exports.getUserConversations = async (req, res) => {
  const { id } = req.params;
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        chatMembers: {
          some: {
            id: parseInt(id), 
          },
        },
      },
      include: {
        chatMembers: true,
      },
    });

    res.json(conversations); 
  } catch (error) {
    res.status(500).json({ error: "Error fetching user's conversations" });
  }
};

exports.createConversation = async (req, res) => {
  const { chatMembers } = req.body;
  try {
    if (!chatMembers || chatMembers.length < 2) {
      return res
        .status(400)
        .json({ message: "at least 2 members are required" });
    }
    const conversation = await prisma.conversation.create({
      data: {
        chatMembers: { connect: chatMembers.map((userId) => ({ id: userId })) },
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error Creating conversation" });
  }
};

exports.deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    await prisma.conversation.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting conversation" });
  }
};
