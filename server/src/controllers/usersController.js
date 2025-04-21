const { PrismaClient } =require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllUsers = async(req,res) => {
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    }catch (error){
        res.status(500).json({error: "Error fetching users"})
    }
};

