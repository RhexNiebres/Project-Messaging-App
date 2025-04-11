const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    const { published } = req.query;

    const posts = await prisma.post.findMany({
      where: published === "true" ? { published: true } : {}, // Show only published 
      include: {
        author: { select: { username: true } },
        comments: { include: { author: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not Found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Server error while fetching post" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: "Title, content and user are required" });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error while creating post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        published,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error while updating post" });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    await prisma.comment.deleteMany({
      where: { postId: parseInt(id) },
    });

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error while deleting post" });
  }
};
