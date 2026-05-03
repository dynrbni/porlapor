import { Request, Response } from 'express';
import prisma from '../config/database';

function normalizeText(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  return null;
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const name = normalizeText(req.body?.name);
    const description = normalizeText(req.body?.description);

    if (!name) {
      return res.status(400).json({
        message: 'Nama kategori wajib diisi',
      });
    }

    const data: { name: string; description?: string | null } = { name };
    if (req.body?.description !== undefined) {
      data.description = description;
    }

    const category = await prisma.category.create({ data });

    res.status(201).json({
      message: 'Kategori berhasil dibuat',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      message: 'Berhasil mendapatkan semua data kategori',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryNotFound = !(await prisma.category.findUnique({
      where: { id: String(id) },
    }));
    if (categoryNotFound) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan',
      });
    }
    const category = await prisma.category.findFirst({
      where: {
        id: String(id),
        isActive: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan',
      });
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan data kategori',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const name = normalizeText(req.body?.name);
    const description = normalizeText(req.body?.description);
    const isActive = parseBoolean(req.body?.isActive);
    const categoryNotFound = !(await prisma.category.findUnique({
      where: { id: String(id) },
    }));
    if (categoryNotFound) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan',
      });
    }

    const data: { name?: string; description?: string | null; isActive?: boolean } = {};

    if (name) {
      data.name = name;
    }
    if (req.body?.description !== undefined) {
      data.description = description;
    }
    if (isActive !== null) {
      data.isActive = isActive;
    }

    const category = await prisma.category.update({
      where: { id: String(id) },
      data,
    });

    res.status(200).json({
      message: 'Kategori berhasil diperbarui',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryNotFound = !(await prisma.category.findUnique({
      where: { id: String(id) },
    }));
    if (categoryNotFound) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan',
      });
    }

    await prisma.category.delete({
      where: { id: String(id) },
    });

    res.status(200).json({
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
