import {Request, Response} from 'express';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

export const registerController = async (req: Request, res: Response) => {
    try {
        const {name, email, password, phone, nik, address, birthDate} = req.body;
        const emailExisting = await prisma.user.findUnique({ where: { email } });
        const phoneExisting = phone ? await prisma.user.findUnique({ where: { phone } }) : null;
        const nikExisting = nik ? await prisma.user.findUnique({ where: { nik } }) : null;
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
        if (nikExisting) {
            return res.status(400).json({
                message: 'NIK sudah terdaftar',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                nik,
                address,
                birthDate: birthDate ? new Date(birthDate) : undefined,
                role: 'USER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                nik: true,
                address: true,
                birthDate: true,
                role: true,
                createdAt: true,
            },
        });
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.status(201).json({
            message: 'Registrasi User berhasil',
            token,
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
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.status(200).json({
            message: 'Login User berhasil',
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                nik: user.nik,
                address: user.address,
                birthDate: user.birthDate,
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

