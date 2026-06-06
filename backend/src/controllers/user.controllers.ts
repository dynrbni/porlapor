import {Request, Response} from 'express';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { normalizeBirthDate } from '../utils/date';
import { normalizeGender } from '../utils/gender';

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
        const { name, email, password, phone, nik, address, birthDate, gender } = req.body;

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
        if (nik) {
            const nikExisting = await prisma.user.findFirst({
                where: {
                    nik,
                    id: { not: String(id) },
                },
                select: { id: true },
            });
            if (nikExisting) {
                return res.status(400).json({
                    message: 'NIK sudah terdaftar',
                });
            }
            data.nik = nik;
        }
        if (address) data.address = address;
        if (birthDate) {
            const normalizedBirthDate = normalizeBirthDate(birthDate);
            if (!normalizedBirthDate) {
                return res.status(400).json({
                    message: 'Format tanggal lahir tidak valid',
                });
            }
            data.birthDate = normalizedBirthDate;
        }
        const normalizedGender = normalizeGender(gender);
        if (normalizedGender === null) {
            return res.status(400).json({
                message: 'Gender tidak valid',
            });
        }
        if (normalizedGender !== undefined) {
            data.gender = normalizedGender;
        }
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
                gender: updatedUser.gender,
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
                gender: true,
                role: true,
                photoUrl: true,
                photoSource: true,
                createdAt: true,
                lastLoginAt: true,
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { user: authUser } = req as AuthenticatedRequest;
    if (!authUser?.id) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    const userId = authUser.id;
    const { name, email, phone, nik, address, birthDate, gender, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const data: any = {};

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (nik !== undefined) {
      const nikExisting = await prisma.user.findFirst({
        where: { nik, id: { not: userId } },
        select: { id: true },
      });
      if (nikExisting) {
        return res.status(400).json({ message: 'NIK sudah terdaftar' });
      }
      data.nik = nik;
    }
    if (address !== undefined) data.address = address;
    if (birthDate !== undefined) {
      const normalized = normalizeBirthDate(birthDate);
      if (!normalized) {
        return res.status(400).json({ message: 'Format tanggal lahir tidak valid' });
      }
      data.birthDate = normalized;
    }
    if (gender !== undefined) {
      const normalized = normalizeGender(gender);
      if (normalized === null) {
        return res.status(400).json({ message: 'Gender tidak valid' });
      }
      if (normalized !== undefined) data.gender = normalized;
    }
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      data.photoUrl = `/uploads/profiles/${req.file.filename}`;
      data.photoSource = 'LOCAL';
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.status(200).json({
      message: 'Profil berhasil diperbarui',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        nik: updated.nik,
        address: updated.address,
        birthDate: updated.birthDate,
        gender: updated.gender,
        role: updated.role,
        photoUrl: updated.photoUrl,
        photoSource: updated.photoSource,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
