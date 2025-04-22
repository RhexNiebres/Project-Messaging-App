const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { generateToken } = require("../middlewares/auth");
require("dotenv").config({ path: "../../.env" });

exports.postSignUp = async (req, res, next) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !password || !email || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }
    
    const [existingUserByUsername, existingUserByEmail] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.user.findUnique({ where: { email } }),
    ]);

    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        gender,
      },
    });

    const token = generateToken(newUser);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        gender: true,
      },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid username or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password." });

    const token = generateToken(user);

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Logout successful" });
};
