const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getConversation = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: { message: true, chatMembers: true },
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversation" });
  }
};

exports.createConversation = async (req, res) => {
  const { chatMembers } = req.body;
  try {
    if (!chatMembers || chatMembers.length < 2) {
      return res.status(400).json({ error: "at least 2 members are required" });
    }
    const conversation = await prisma.create({
      data: {
        chatMembers: { connect: chatMembers.map((userId) => ({ id: userId })), 
        },
      },
    });
    res.status(200).json(conversation);
  } catch(error) {
    res.status(500).json({ error: "Error Creating conversation" });
  }
};
