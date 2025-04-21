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

