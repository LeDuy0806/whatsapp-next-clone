import getPrismaInstance from '../utils/PrismaClient.js';

export const checkUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.json({ msg: 'Email is required.', status: false });
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.json({ msg: 'User not found.', status: false });
        } else {
            return res.json({ msg: 'User found', status: true, data: user });
        }
    } catch (err) {
        next(err);
    }
};

export const onboardUser = async (req, res, next) => {
    try {
        const { name, email, about, image: profilePicture } = req.body;
        if (!name || !email || !profilePicture) {
            return res.json({
                msg: 'Email, Name and Image is required.',
                status: false,
            });
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.create({
            data: { name, email, about, profilePicture },
        });
        return res.json({ msg: 'User created', status: true, data: user });
    } catch (error) {
        console.log(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
                about: true,
            },
        });
        const usersGroupbyInitialLetter = {};
        users.forEach((user) => {
            const inittialLetter = user.name.charAt(0).toUpperCase();
            if (!usersGroupbyInitialLetter[inittialLetter]) {
                usersGroupbyInitialLetter[inittialLetter] = [];
            }
            usersGroupbyInitialLetter[inittialLetter].push(user);
        });
        return res.status(200).send({ users: usersGroupbyInitialLetter });
    } catch (error) {
        console.log(error);
    }
};
