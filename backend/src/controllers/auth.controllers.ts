import {Request, Response} from 'express';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { normalizeBirthDate } from '../utils/date';
import { normalizeGender } from '../utils/gender';

export const registerController = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, nik, address, birthDate, gender } = req.body;
        const emailExisting = await prisma.user.findUnique({ where: { email } });
        const phoneExisting = phone ? await prisma.user.findUnique({ where: { phone } }) : null;
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
        if (nik) {
            const nikExisting = await prisma.user.findFirst({
                where: { nik },
                select: { id: true },
            });
            if (nikExisting) {
                return res.status(400).json({
                    message: 'NIK sudah terdaftar',
                });
            }
        }
        const normalizedBirthDate = birthDate ? normalizeBirthDate(birthDate) : null;
        if (birthDate && !normalizedBirthDate) {
            return res.status(400).json({
                message: 'Format tanggal lahir tidak valid',
            });
        }
        const normalizedGender = normalizeGender(gender);
        if (normalizedGender === null) {
            return res.status(400).json({
                message: 'Gender tidak valid',
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
                birthDate: normalizedBirthDate ?? undefined,
                gender: normalizedGender ?? undefined,
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
                gender: true,
                role: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });
        const token = generateToken({ 
            id: user.id, 
            email: user.email, 
            role: user.role });
        res.status(201).json({
            message: 'Registrasi User berhasil',
            token,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const userDeleted = await prisma.user.findFirst({
            where: {
                email,
                deletedAt: { not: null },
            },
        });
        if (userDeleted) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }
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

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                nik: true,
                address: true,
                birthDate: true,
                gender: true,
                role: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        const token = generateToken({ 
            id: user.id, 
            email: user.email, 
            role: user.role });
        res.status(200).json({
            message: 'Login User berhasil',
            token,
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                nik: updatedUser.nik,
                address: updatedUser.address,
                birthDate: updatedUser.birthDate,
                gender: updatedUser.gender,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                lastLoginAt: updatedUser.lastLoginAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

