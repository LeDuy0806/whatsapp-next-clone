import getPrismaInstance from '../utils/PrismaClient.js';
import { renameSync } from 'fs';

export const addMessage = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const { message, from, to } = req.body;
        const getUser = onlineUsers.get(to);
        if (message && from && to) {
            const newMessage = await prisma.messages.create({
                data: {
                    message,
                    sender: { connect: { id: from } },
                    receiver: { connect: { id: to } },
                    messageStatus: getUser ? 'delivered' : 'sent',
                },
                include: { sender: true, receiver: true },
            });
            return res.status(201).send({ message: newMessage });
        }
        return res.status(400).send('From, to and Message is required');
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const { from, to } = req.params;
        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    {
                        senderId: from,
                        receiverId: to,
                    },
                    {
                        senderId: to,
                        receiverId: from,
                    },
                ],
            },
            orderBy: {
                id: 'asc',
            },
        });

        const unreadMessages = [];

        messages.forEach((message, index) => {
            if (
                message.messageStatus !== 'read' &&
                message.senderId.toString() === to
            ) {
                messages[index].messageStatus = 'read';
                unreadMessages.push(message.id.toString());
            }
        });
        await prisma.messages.updateMany({
            where: {
                id: { in: unreadMessages },
            },
            data: {
                messageStatus: 'read',
            },
        });
        res.status(200).json({ messages });
    } catch (error) {
        next(error);
    }
};

export const addImageMessage = async (req, res, next) => {
    try {
        if (req.file) {
            const date = Date.now();
            let fileName = 'uploads/images/' + date + req.file.originalname;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance();
            const { from, to } = req.query;
            const getUser = onlineUsers.get(to);
            if (from && to) {
                const message = await prisma.messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: from } },
                        receiver: { connect: { id: to } },
                        type: 'image',
                        messageStatus: getUser ? 'delivered' : 'sent',
                    },
                });
                return res.status(201).json({ message: message });
            }
            return res.status(400).send('From, to is required');
        }
        return res.status(400).send('Image is required.');
    } catch (error) {
        next(error);
    }
};

export const getInitialContactWithMessages = async (req, res, next) => {
    try {
        const userId = req.params.from;
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                sentMessages: {
                    include: {
                        receiver: true,
                        sender: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                receiverMessages: {
                    include: {
                        receiver: true,
                        sender: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        const messages = [...user.sentMessages, ...user.receiverMessages];
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const users = new Map();
        const messageStatusChange = [];
        messages.forEach((messageI) => {
            const isSender = messageI.senderId === userId;
            const caculatedId = isSender
                ? messageI.receiverId
                : messageI.senderId;
            if (messageI.messageStatus === 'sent') {
                messageStatusChange.push(messageI.id);
            }

            if (!users.get(caculatedId)) {
                const {
                    id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId,
                } = messageI;
                let user = {
                    messageId: id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId,
                };
                if (isSender) {
                    user = {
                        ...user,
                        ...messageI.receiver,
                        totalUnreadMessages: 0,
                    };
                } else {
                    user = {
                        ...user,
                        ...messageI.sender,
                        totalUnreadMessages: messageStatus !== 'read' ? 1 : 0,
                    };
                }
                users.set(caculatedId, { ...user });
            } else if (messageI.messageStatus !== 'read' && !isSender) {
                const user = users.get(caculatedId);
                users.set(caculatedId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1,
                });
            }
        });
        if (messageStatusChange.length) {
            await prisma.messages.updateMany({
                where: {
                    id: { in: messageStatusChange },
                },
                data: {
                    messageStatus: 'delivered',
                },
            });
        }
        return res.status(200).json({
            users: Array.from(users.values()),
            onlineUsers: Array.from(onlineUsers.keys()),
        });
    } catch (error) {
        next(error);
    }
};
