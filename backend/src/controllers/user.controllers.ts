import {Request, Response} from 'express';
import prisma from '../config/database';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { 
                deletedAt: null 
            },
        });
        res.status(200).json({
            message: "Berhasil mendapatkan data semua user",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user = await prisma.user.findUnique({
            where:{
                id: String(id)
            },
        });
        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }
        res.status(200).json({
            message: "Berhasil mendapatkan data user",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: String() },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }
        res.status(200).json({
            message: 'Berhasil mendapatkan profil',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}
