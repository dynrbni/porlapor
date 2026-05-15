import { Request, Response } from 'express';
import { Prisma, ReportStatus } from '@prisma/client';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import crypto from 'crypto';

function parseNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function reporterSelect() {
  return {
    id: true,
    name: true,
    email: true,
    phone: true,
    nik: true,
    birthDate: true,
    createdAt: true,
  };
}

function categorySelect() {
  return {
    id: true,
    name: true,
    description: true,
    isActive: true,
    createdAt: true,
  };
}

export const createReport = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    if (!user?.id) {
      return res.status(401).json({
        message: 'Token tidak valid',
      });
    }

    const { title, description, latitude, longitude, address, imageUrl, categoryId, agencyId } = req.body;
    const lat = parseNumber(latitude);
    const lng = parseNumber(longitude);

    if (!title || !description || !categoryId) {
      return res.status(400).json({
        message: 'Judul, deskripsi, dan kategori wajib diisi',
      });
    }

    if (lat === null || lng === null) {
      return res.status(400).json({
        message: 'Koordinat latitude dan longitude tidak valid',
      });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return res.status(400).json({
        message: `Kategori dengan ID ${categoryId} tidak ditemukan. Silakan gunakan ID kategori yang valid.`
      });
    }

    // Generate 8-digit numeric ID (e.g., 84739210)
    let trackingId = '';
    for (let i = 0; i < 8; i++) {
      trackingId += Math.floor(Math.random() * 10).toString();
    }

    // Assign ke default agency kategori jika user tidak memilih instansi
    let targetAgencyId = agencyId;
    if (!targetAgencyId && categoryExists.agencyId) {
      targetAgencyId = categoryExists.agencyId;
    }

    const report = await prisma.report.create({
      data: {
        id: trackingId,
        title,
        description,
        latitude: lat,
        longitude: lng,
        address,
        imageUrl,
        categoryId,
        agencyId: targetAgencyId,
        userId: user.id,
      },
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
      },
    });

    res.status(201).json({
      message: 'Laporan berhasil dibuat',
      data: report,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    // Build where clause
    const where: Prisma.ReportWhereInput = {};
    if (userId) {
      where.userId = String(userId);
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
        officialNotes: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
                photoUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },

        comments: {
          include: {
            author: { select: { id: true, name: true, role: true, photoUrl: true } }
          },
          orderBy: { createdAt: 'asc' }
        },

      },
    });

    res.status(200).json({
      message: 'Berhasil mendapatkan data laporan',
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
      where: { id: String(id) },
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
        officialNotes: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
                photoUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!report) {
      return res.status(404).json({
        message: 'Laporan tidak ditemukan',
      });
    }

    const { user } = req as AuthenticatedRequest;
    if (user && user.role === 'USER' && report.userId !== user.id) {
      return res.status(403).json({
        message: 'Akses ditolak: Anda tidak memiliki akses ke laporan ini',
      });
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan data laporan',
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, address, imageUrl, status, categoryId, agencyId } = req.body;

    const data: Prisma.ReportUpdateInput = {};

    if (title) data.title = title;
    if (description) data.description = description;
    if (address !== undefined) data.address = address;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (agencyId !== undefined) {
      data.agency = agencyId ? { connect: { id: agencyId } } : { disconnect: true };
    }
    if (status) {
      if (!Object.values(ReportStatus).includes(status)) {
        return res.status(400).json({
          message: 'Status laporan tidak valid',
        });
      }
      data.status = status as ReportStatus;
    }
    if (categoryId) {
      data.category = {
        connect: { id: categoryId },
      };
    }

    if (latitude !== undefined) {
      const lat = parseNumber(latitude);
      if (lat === null) {
        return res.status(400).json({
          message: 'Latitude tidak valid',
        });
      }
      data.latitude = lat;
    }

    if (longitude !== undefined) {
      const lng = parseNumber(longitude);
      if (lng === null) {
        return res.status(400).json({
          message: 'Longitude tidak valid',
        });
      }
      data.longitude = lng;
    }

    const report = await prisma.report.update({
      where: { id: String(id) },
      data,
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
      },
    });

    res.status(200).json({
      message: 'Laporan berhasil diperbarui',
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.report.delete({
      where: { id: String(id) },
    });

    res.status(200).json({
      message: 'Laporan berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { user } = req as AuthenticatedRequest;

    if (!user?.id) return res.status(401).json({ message: 'Token tidak valid' });
    if (!content) return res.status(400).json({ message: 'Konten komentar tidak boleh kosong' });

    const report = await prisma.report.findUnique({
      where: { id: String(id) },
      select: { userId: true }
    });

    if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    // Cek apakah user yang comment adalah pemilik laporan (Jika role dia USER)
    if (user.role === 'USER' && report.userId !== user.id) {
      return res.status(403).json({ message: 'Akses ditolak: Anda hanya dapat mengomentari laporan Anda sendiri' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        reportId: String(id),
        authorId: user.id
      },
      include: {
        author: { select: { id: true, name: true, role: true, photoUrl: true } }
      }
    });

    res.status(201).json({
      message: 'Komentar berhasil ditambahkan',
      data: comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
