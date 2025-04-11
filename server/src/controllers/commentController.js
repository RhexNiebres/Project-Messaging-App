const { PrismaClient } =require("@prisma/client");
const prisma = new PrismaClient();

exports.getCommentByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error fetching comments" });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: {id: parseInt(id) },
    });
    if (!comment) {
      return res.status(404).json({error:"Error comment does not exist"});
    }
    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment', error)
    res.status(500).json({error:'Server error while fetching comment'})
  }
};

exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = parseInt(req.user.id, 10); 

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: userId, 
    },
  });

  if (!userExists) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId, 10), 
        authorId: userId,
      },
      include: {
        author: true, 
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

exports.updateComment = async(req,res) =>{
    try{
        const { commentId }=req.params;
        const { content }=req.body;
        const existingComment = await prisma.comment.findUnique({
            where: {id: parseInt(commentId)}
        });
        if(!existingComment){
            return res.status(404).json({error:'Comment does not exist'})
        }
        const updateComment= await prisma.comment.update({
            where:{id: parseInt(commentId)},
            data:{
                content:content || existingComment.content,
            },
        });
        res.json(updateComment);
    }catch (error){
        console.log('Error updating comment', error);
        res.status(500).json({error: 'Server error while updating comment'})
    }
};

exports.deleteComment = async(req,res) =>{
    try{
        const { commentId }=req.params;
        const existingComment = await prisma.comment.findUnique({
            where: {id: parseInt(commentId)}
        });
        if(!existingComment){
            return res.status(404).json({error:'Comment does not exist'})
        }
         await prisma.comment.delete({
            where:{id: parseInt(commentId)},
        });
        res.json({message:'comment successfully deleted'});
    }catch (error){
        console.log('Error deleting comment', error);
        res.status(500).json({error: 'Server error while deleting comment'})
    }
} 