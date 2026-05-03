import { Request, Response } from 'express';
import { Prisma, ReportStatus } from '@prisma/client';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

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
    role: true,
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

    const { title, description, latitude, longitude, address, imageUrl, categoryId } = req.body;
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

    const report = await prisma.report.create({
      data: {
        title,
        description,
        latitude: lat,
        longitude: lng,
        address,
        imageUrl,
        categoryId,
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
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: reporterSelect() },
        category: { select: categorySelect() },
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
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, address, imageUrl, status, categoryId } = req.body;

    const data: Prisma.ReportUpdateInput = {};

    if (title) data.title = title;
    if (description) data.description = description;
    if (address !== undefined) data.address = address;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
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
