import { Request, Response } from 'express';
import { Prisma, ReportStatus } from '@prisma/client';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { createNotification } from './notification.controllers';
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
    photoUrl: true,
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

    const { title, description, latitude, longitude, address, categoryId, agencyId } = req.body;
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

    // Jika ada file yang diupload, simpan pathnya
    let photoUrl = req.body.imageUrl;
    if (req.file) {
      photoUrl = `/uploads/reports/${req.file.filename}`;
    }

    const report = await prisma.report.create({
      data: {
        id: trackingId,
        title,
        description,
        latitude: lat,
        longitude: lng,
        address,
        imageUrl: photoUrl,
        categoryId,
        agencyId: targetAgencyId,
        userId: user.id,
      },
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
      },
    });

    // Notify all ADMIN, SUPERADMIN, and AGENCY users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPERADMIN'] },
        isActive: true,
      },
      select: { id: true },
    });
    const agencyUsers = targetAgencyId
      ? await prisma.user.findMany({
          where: { agencyId: targetAgencyId, isActive: true },
          select: { id: true },
        })
      : [];
    const notifyUserIds = new Set([
      ...adminUsers.map((u) => u.id),
      ...agencyUsers.map((u) => u.id),
    ]);
    for (const uid of notifyUserIds) {
      await createNotification(
        uid,
        'new_report',
        `Laporan baru: "${title.substring(0, 60)}"`,
        report.id,
      );
    }

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
        _count: {
          select: { likes: true }
        },
        likes: {
          select: { userId: true }
        },
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
        _count: {
          select: { likes: true }
        },
        likes: {
          select: { userId: true }
        },
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
        }
      },
    });

    if (!report) {
      return res.status(404).json({
        message: 'Laporan tidak ditemukan',
      });
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan data laporan',
      data: report,
    });
  } catch (error) {
    console.error('getReportById error:', error);
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

    const oldReport = await prisma.report.findUnique({
      where: { id: String(id) },
      select: { userId: true, status: true, title: true },
    });

    const report = await prisma.report.update({
      where: { id: String(id) },
      data,
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
      },
    });

    // Notify report author if status changed
    if (oldReport && status && status !== oldReport.status) {
      const statusLabels: Record<string, string> = {
        PENDING: 'Menunggu',
        IN_REVIEW: 'Ditinjau',
        IN_PROGRESS: 'Diproses',
        RESOLVED: 'Selesai',
        REJECTED: 'Ditolak',
      };
      const newLabel = statusLabels[status as string] || status;
      await createNotification(
        oldReport.userId,
        'status_change',
        `Status laporanmu "${oldReport.title.substring(0, 50)}" berubah menjadi ${newLabel}`,
        String(id),
      );
    }

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
    console.error('deleteReport error:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getReportStats = async (req: Request, res: Response) => {
  try {
    const [
      totalReports,
      totalAgencies,
      totalUsers,
      reportsByStatus,
      reportsByAgency,
      recentReports,
    ] = await Promise.all([
      prisma.report.count(),
      prisma.agency.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.report.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.report.groupBy({
        by: ['agencyId'],
        _count: { id: true },
        where: { agencyId: { not: null } },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: reporterSelect() },
          category: { select: categorySelect() },
          _count: { select: { likes: true } },
        },
      }),
    ]);

    // Fetch agency names for reportsByAgency
    const agencyIds = reportsByAgency.map((r) => r.agencyId).filter(Boolean) as string[];
    const agencies = agencyIds.length > 0
      ? await prisma.agency.findMany({
          where: { id: { in: agencyIds } },
          select: { id: true, name: true },
        })
      : [];
    const agencyMap = new Map(agencies.map((a) => [a.id, a.name]));

    const reportsByAgencyWithNames = reportsByAgency.map((r) => ({
      agencyId: r.agencyId,
      agencyName: agencyMap.get(r.agencyId ?? '') || 'Unknown',
      count: r._count.id,
    }));

    // Daily report counts for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyReportsRaw = await prisma.report.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, number>();
    dailyReportsRaw.forEach((r) => {
      const dateKey = r.createdAt.toISOString().split('T')[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
    });

    const dailyReports = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    res.status(200).json({
      message: 'Statistik berhasil didapatkan',
      data: {
        totalReports,
        totalAgencies,
        totalUsers,
        reportsByStatus: reportsByStatus.map((r) => ({
          status: r.status as string,
          count: r._count.id,
        })),
        reportsByAgency: reportsByAgencyWithNames,
        recentReports,
        dailyReports,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
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

    // Notify report author (if commenter is not the author)
    if (report.userId !== user.id) {
      const commenter = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, nama: true },
      });
      const commenterName = (commenter as any)?.nama || commenter?.name || 'Seseorang';
      await createNotification(
        report.userId,
        'comment',
        `${commenterName} berkomentar di laporanmu: "${content.substring(0, 50)}"`,
        String(id),
      );
    }

    res.status(201).json({
      message: 'Komentar berhasil ditambahkan',
      data: comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = req as AuthenticatedRequest;

    if (!user?.id) return res.status(401).json({ message: 'Token tidak valid' });

    const report = await prisma.report.findUnique({
      where: { id: String(id) },
    });

    if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    const existingLike = await prisma.reportLike.findUnique({
      where: {
        userId_reportId: {
          userId: user.id,
          reportId: String(id)
        }
      }
    });

    if (existingLike) {
      await prisma.reportLike.delete({
        where: { id: existingLike.id }
      });
      res.status(200).json({ message: 'Laporan batal didukung', liked: false });
    } else {
      await prisma.reportLike.create({
        data: {
          userId: user.id,
          reportId: String(id)
        }
      });

      // Notify report author (if liker is not the author)
      if (report.userId !== user.id) {
        const liker = await prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true, nama: true },
        });
        const likerName = (liker as any)?.nama || liker?.name || 'Seseorang';
        await createNotification(
          report.userId,
          'like',
          `${likerName} mendukung laporanmu`,
          String(id),
        );
      }

      res.status(200).json({ message: 'Laporan didukung', liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
