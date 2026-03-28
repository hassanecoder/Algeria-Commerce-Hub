import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import productsRouter from "./products";
import ordersRouter from "./orders";
import customersRouter from "./customers";
import analyticsRouter from "./analytics";
import inventoryRouter from "./inventory";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/dashboard", dashboardRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/customers", customersRouter);
router.use("/analytics", analyticsRouter);
router.use("/inventory", inventoryRouter);
router.use("/notifications", notificationsRouter);

export default router;
