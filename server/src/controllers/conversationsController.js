const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getConversation = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: { sender: true },
        },
        chatMembers: true,
      },
    });
    const maskedConversation = {
      ...conversation,
      messages: conversation.messages.map((msg) => ({
        ...msg,
        content: msg.isDeleted ? "This message was deleted" : msg.content,
      })),
    };

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(maskedConversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching conversation" });
  }
};

exports.getUserConversations = async (req, res) => {
  const { id } = req.params;
  const currentUserId = parseInt(id);
  const recipientUserId = req.query.recipientUserId
    ? parseInt(req.query.recipientUserId)
    : null;

  try {
    const conversations = await prisma.conversation.findMany({
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
        chatMembers: {
          select: {
            id: true,
            username: true,
            email: true,
            gender: true,
          },
        },
      },
    });
    res.json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching user's conversations" });
  }
};

exports.createConversation = async (req, res) => {
  const { recipientId, message, senderId } = req.body;
  try {
    if (!recipientId) {
      return res
        .status(400)
        .json({ message: "A recipient is required to create conversation" });
    }

    const chatMembers = [parseInt(senderId), parseInt(recipientId)];

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        chatMembers: {
          every: {
            id: { in: chatMembers }, //contains all members
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
          connect: chatMembers.map((id) => ({ id })),
        },
        messages: {
          create: {
            content: message,
            senderId: parseInt(senderId),
          },
        },
      },
      include: {
        chatMembers: true,
      },
    });
    return res.status(201).json({ conversation: newConversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Error creating conversation" });
  }
};
