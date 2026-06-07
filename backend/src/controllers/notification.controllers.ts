import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

type NotificationType = 'new_report' | 'comment' | 'like' | 'official_note' | 'status_change';

export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string,
  reportId?: string,
) {
  try {
    await prisma.notification.create({
      data: { userId, type, message, reportId },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.status(200).json({ data: notifications });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil notifikasi' });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const count = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });
    return res.status(200).json({ data: { count } });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil jumlah notifikasi' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { user } = req as AuthenticatedRequest;
    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true },
    });
    return res.status(200).json({ message: 'Notifikasi ditandai sudah dibaca' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menandai notifikasi' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
    return res.status(200).json({ message: 'Semua notifikasi ditandai sudah dibaca' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menandai semua notifikasi' });
  }
};
