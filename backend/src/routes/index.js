import { Router } from "express";

import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import contractorRoutes from "./contractor.routes.js";
import bidRoutes from "./bid.routes.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/contractors", contractorRoutes);
router.use("/bids", bidRoutes);
router.use("/reviews", reviewRoutes);

export default router;