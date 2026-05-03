import {Request, Response} from 'express';
import prisma from '../config/database';
import bcrypt from 'bcrypt';

export const registerController = async (req: Request, res: Response) => {
    try {
        const {name, email, password, phone} = req.body;
        const emailExisting = await prisma.user.findUnique({ where: { email } });
        const phoneExisting = await prisma.user.findUnique({ where: { phone } });
        if (emailExisting) {
            return res.status(400).json({
                message: 'Email sudah terdaftar',
            });
        }
        if (phoneExisting) {
            return res.status(400).json({
                message: 'Nomor telepon sudah terdaftar',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: 'USER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        res.status(201).json({
            message: 'Registrasi User berhasil',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Password salah',
            });
        }
        res.status(200).json({
            message: 'Login berhasil',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

