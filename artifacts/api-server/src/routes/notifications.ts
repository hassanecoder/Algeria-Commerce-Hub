import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const notifications = await db
      .select()
      .from(notificationsTable)
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);
    res.json(notifications);
  } catch (err) {
    req.log.error({ err }, "Error fetching notifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
