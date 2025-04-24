const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, username } = req.body;

  try {
    const updateUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, username },
    });

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user information" });
  }
};

exports.checkUserExistence = async (req, res) => {
  const { username, email, userId } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { username },
              { email },
            ],
          },
          {
            id: {
              not: parseInt(userId), 
            },
          },
        ],
      },
    });

    if (user) {
      return res.status(400).json({
        success: false,
        error: "Username or email already exists.",
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Error checking user existence", details: error.message });
  }
};

