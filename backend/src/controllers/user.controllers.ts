import {Request, Response} from 'express';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { hashNik } from '../utils/nik';

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
        const userNotFound = !user || user.deletedAt !== null;
        if (userNotFound) {
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
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
        const { name, email, password, phone, nik, address, birthDate } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    const data: any = {};

    if (name) data.name = name;
    if (email) data.email = email;
    if (phone) data.phone = phone;
        if (nik) data.nik = hashNik(nik);
        if (address) data.address = address;
        if (birthDate) data.birthDate = new Date(birthDate);
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data,
    });

    res.status(200).json({
      message: 'Data User berhasil diperbarui',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
                nik: updatedUser.nik,
                address: updatedUser.address,
                birthDate: updatedUser.birthDate,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: String(id)
            },
        });
        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
            });
        }
        await prisma.user.update({
            where: {
                id: String(id)
            },
            data: {
                deletedAt: new Date(),
            },
        });
        res.status(200).json({
            message: 'User berhasil dihapus',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}


export const getProfile = async (req: Request, res: Response) => {
    try {
        const { user: authUser } = req as AuthenticatedRequest;
        if (!authUser?.id) {
            return res.status(401).json({
                message: 'Token tidak valid',
            });
        }

        const userId = authUser.id;
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null,
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
