// middlewares/roleOrOwner.ts
import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/blog.service';

export const roleOrOwner =
  (roles: ('admin' | 'user')[] = [], getResourceOwner: (req: Request) => Promise<number>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = await getResourceOwner(req);
      if (req.user!.id === ownerId || roles.includes(req.user!.role as any)) {
        return next();
      }
      res.status(403).json({ message: 'Forbidden' });
    } catch (e) {
      next(e);
    }
  };

// Usage in routes
// import { roleOrOwner } from '../middleware/role;
// router.delete('/:id',
//   roleOrOwner(['admin'], async (req) => {
//     const post = await new PostService().findOne
