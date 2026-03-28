import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { customersTable, ordersTable, orderItemsTable } from "@workspace/db/schema";
import { sql, desc, ilike, eq, and, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const wilaya = req.query.wilaya as string | undefined;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) conditions.push(ilike(customersTable.name, `%${search}%`));
    if (wilaya) conditions.push(eq(customersTable.wilaya, wilaya));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [customers, totalRow] = await Promise.all([
      db.select().from(customersTable).where(where).orderBy(desc(customersTable.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(customersTable).where(where),
    ]);

    res.json({
      customers: customers.map((c) => ({
        ...c,
        totalSpent: parseFloat(c.totalSpent.toString()),
      })),
      total: Number(totalRow[0].count),
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const orders = await db.select().from(ordersTable).where(eq(ordersTable.customerId, id)).orderBy(desc(ordersTable.createdAt));
    const itemCounts = await db.select({ orderId: orderItemsTable.orderId, cnt: count() }).from(orderItemsTable).groupBy(orderItemsTable.orderId);
    const itemCountMap = new Map(itemCounts.map((ic) => [ic.orderId, ic.cnt]));

    res.json({
      ...customer,
      totalSpent: parseFloat(customer.totalSpent.toString()),
      orders: orders.map((o) => ({
        ...o,
        totalAmount: parseFloat(o.totalAmount.toString()),
        itemCount: itemCountMap.get(o.id) ?? 0,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
