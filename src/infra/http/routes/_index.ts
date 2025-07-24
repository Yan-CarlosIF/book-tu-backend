import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
