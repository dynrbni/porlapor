import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthPayload {
  id: string;
  role: string;
  email?: string;
}

export type AuthenticatedRequest = Request & { user: AuthPayload };

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: 'Token tidak ditemukan',
    });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Format token tidak valid',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string') {
    return res.status(401).json({
      message: 'Token tidak valid',
    });
  }

  const { id, role } = decoded as Partial<AuthPayload>;
  if (!id || !role) {
    return res.status(401).json({
      message: 'Token tidak valid',
    });
  }

  (req as AuthenticatedRequest).user = { id, role };
  next();
};

export const authorizeRoles = (...allowedRoles: AuthPayload['role'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as AuthenticatedRequest;
    if (!user?.role) {
      return res.status(401).json({
        message: 'Token tidak valid',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: 'Akses ditolak',
      });
    }

    next();
  };
};
