import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createOfficialNote = async (req: Request, res: Response) => {
  try {
    const reportId = req.params.reportId as string;
    const { content } = req.body;
    const user = (req as AuthenticatedRequest).user;

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    const officialNote = await prisma.officialNote.create({
      data: {
        content,
        reportId,
        authorId: user.id,
      },
    });

    return res.status(201).json({
      message: 'Tanggapan resmi berhasil ditambahkan',
      data: officialNote,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal menambahkan tanggapan resmi',
      error: error.message,
    });
  }
};

export const getOfficialNotesByReport = async (req: Request, res: Response) => {
  try {
    const reportId = req.params.reportId as string;

    const notes = await prisma.officialNote.findMany({
      where: { reportId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      message: 'Berhasil mengambil data tanggapan resmi',
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal mengambil data tanggapan resmi',
      error: error.message,
    });
  }
};

export const updateOfficialNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const user = (req as AuthenticatedRequest).user;

    const existingNote = await prisma.officialNote.findUnique({ where: { id } });
    if (!existingNote) {
      return res.status(404).json({ message: 'Tanggapan resmi tidak ditemukan' });
    }

    // Only the author or SUPERADMIN can update the note
    if (existingNote.authorId !== user.id && user.role !== 'SUPERADMIN') {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk memperbarui tanggapan ini' });
    }

    const updatedNote = await prisma.officialNote.update({
      where: { id },
      data: { content },
    });

    return res.status(200).json({
      message: 'Tanggapan resmi berhasil diperbarui',
      data: updatedNote,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal memperbarui tanggapan resmi',
      error: error.message,
    });
  }
};

export const deleteOfficialNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = (req as AuthenticatedRequest).user;

    const existingNote = await prisma.officialNote.findUnique({ where: { id } });
    if (!existingNote) {
      return res.status(404).json({ message: 'Tanggapan resmi tidak ditemukan' });
    }

    // Only the author or SUPERADMIN can delete the note
    if (existingNote.authorId !== user.id && user.role !== 'SUPERADMIN') {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus tanggapan ini' });
    }

    await prisma.officialNote.delete({ where: { id } });

    return res.status(200).json({
      message: 'Tanggapan resmi berhasil dihapus',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal menghapus tanggapan resmi',
      error: error.message,
    });
  }
};
