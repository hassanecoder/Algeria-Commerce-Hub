import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db/schema";
import { sql, desc, ilike, eq, and, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const wilaya = req.query.wilaya as string | undefined;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status) conditions.push(sql`${ordersTable.status} = ${status}`);
    if (wilaya) conditions.push(eq(ordersTable.wilaya, wilaya));
    if (search) conditions.push(ilike(ordersTable.customerName, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [orders, totalRow, itemCounts] = await Promise.all([
      db.select().from(ordersTable).where(where).orderBy(desc(ordersTable.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(ordersTable).where(where),
      db.select({ orderId: orderItemsTable.orderId, count: count() }).from(orderItemsTable).groupBy(orderItemsTable.orderId),
    ]);

    const itemCountMap = new Map(itemCounts.map((ic) => [ic.orderId, ic.count]));

    res.json({
      orders: orders.map((o) => ({
        ...o,
        totalAmount: parseFloat(o.totalAmount.toString()),
        itemCount: itemCountMap.get(o.id) ?? 0,
      })),
      total: Number(totalRow[0].count),
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));

    res.json({
      ...order,
      totalAmount: parseFloat(order.totalAmount.toString()),
      items: items.map((i) => ({
        ...i,
        unitPrice: parseFloat(i.unitPrice.toString()),
        totalPrice: parseFloat(i.totalPrice.toString()),
      })),
      itemCount: items.length,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;
    const [order] = await db
      .update(ordersTable)
      .set({ status, notes, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    res.json({ ...order, totalAmount: parseFloat(order.totalAmount.toString()), itemCount: items.length });
  } catch (err) {
    req.log.error({ err }, "Error updating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
