import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createAgency = async (req: Request, res: Response) => {
  try {
    const { name, description, email, phone, address, photoUrl, photoSource } = req.body;

    const newAgency = await prisma.agency.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        photoUrl,
        photoSource,
      },
    });

    return res.status(201).json({
      message: 'Instansi berhasil ditambahkan',
      data: newAgency,
    });
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ message: 'Email instansi sudah terdaftar' });
    }
    return res.status(500).json({
      message: 'Gagal menambahkan instansi',
      error: error.message,
    });
  }
};

export const getAgencies = async (req: Request, res: Response) => {
  try {
    const agencies = await prisma.agency.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      message: 'Berhasil mengambil data instansi',
      data: agencies,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal mengambil data instansi',
      error: error.message,
    });
  }
};

export const updateAgency = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, email, phone, address, photoUrl, photoSource, isActive } = req.body;

    const existingAgency = await prisma.agency.findUnique({ where: { id } });
    if (!existingAgency) {
      return res.status(404).json({ message: 'Instansi tidak ditemukan' });
    }

    const updatedAgency = await prisma.agency.update({
      where: { id },
      data: {
        name,
        description,
        email,
        phone,
        address,
        photoUrl,
        photoSource,
        isActive,
      },
    });

    return res.status(200).json({
      message: 'Instansi berhasil diperbarui',
      data: updatedAgency,
    });
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ message: 'Email instansi sudah digunakan oleh instansi lain' });
    }
    return res.status(500).json({
      message: 'Gagal memperbarui instansi',
      error: error.message,
    });
  }
};

export const deleteAgency = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingAgency = await prisma.agency.findUnique({ where: { id } });
    if (!existingAgency) {
      return res.status(404).json({ message: 'Instansi tidak ditemukan' });
    }

    await prisma.agency.delete({ where: { id } });

    return res.status(200).json({
      message: 'Instansi berhasil dihapus',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal menghapus instansi',
      error: error.message,
    });
  }
};
