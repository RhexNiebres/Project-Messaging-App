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
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversation" });
  }
};

exports.getUserConversations = async (req, res) => {
  const { id } = req.params;
  const currentUserId = parseInt(id);
  const recipientUserId = req.query.recipientUserId
    ? parseInt(req.query.recipientUserId)
    : null;

  console.log("Current User ID:", currentUserId);
  console.log("Recipient User ID:", recipientUserId);

  try {
    const conversation = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            chatMembers: {
              some: { id: currentUserId },
            },
          },
          recipientUserId && {
            chatMembers: {
              some: { id: recipientUserId },
            },
          },
        ].filter(Boolean),
      },
      include: {
        chatMembers: true,
      },
    });
    res.json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching user's conversations" });
  }
};

exports.createConversation = async (req, res) => {
  const { chatMembers } = req.body;
  try {
    if (!chatMembers || chatMembers.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 2 members are required" });
    }

    const sortedMembers = chatMembers
      .map((id) => parseInt(id))
      .sort((a, b) => a - b);//sort asc order

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        chatMembers: {
          every: {
            id: { in: sortedMembers }, //contains all members
          },
        },
      },
      include: {
        chatMembers: true,
      },
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }
    const newConversation = await prisma.conversation.create({
      data: {
        chatMembers: {
          connect: sortedMembers.map((id) => ({ id })),
        },
      },
      include: {
        chatMembers: true,
      },
    });
    return res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: "Error creating conversation" });
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
