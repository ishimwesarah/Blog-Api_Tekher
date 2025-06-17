import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/common.types";
import { UserRole } from "../modals/user";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (req.user.role === "super_admin") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Your role ('${req.user.role}') is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};
