import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable, customersTable, orderItemsTable } from "@workspace/db/schema";
import { sql, desc, gte, lte, and, count, sum } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [productsCount] = await db.select({ count: count() }).from(productsTable);
    const [customersCount] = await db.select({ count: count() }).from(customersTable);

    const [currentPeriodOrders] = await db
      .select({ count: count(), revenue: sum(ordersTable.totalAmount) })
      .from(ordersTable)
      .where(gte(ordersTable.createdAt, thirtyDaysAgo));

    const [prevPeriodOrders] = await db
      .select({ count: count(), revenue: sum(ordersTable.totalAmount) })
      .from(ordersTable)
      .where(and(gte(ordersTable.createdAt, sixtyDaysAgo), lte(ordersTable.createdAt, thirtyDaysAgo)));

    const [currentCustomers] = await db
      .select({ count: count() })
      .from(customersTable)
      .where(gte(customersTable.createdAt, thirtyDaysAgo));

    const [prevCustomers] = await db
      .select({ count: count() })
      .from(customersTable)
      .where(and(gte(customersTable.createdAt, sixtyDaysAgo), lte(customersTable.createdAt, thirtyDaysAgo)));

    const [pendingOrders] = await db
      .select({ count: count() })
      .from(ordersTable)
      .where(sql`${ordersTable.status} = 'pending'`);

    const [lowStock] = await db
      .select({ count: count() })
      .from(productsTable)
      .where(sql`${productsTable.stock} > 0 AND ${productsTable.stock} < 10`);

    const currentRevenue = parseFloat(currentPeriodOrders.revenue?.toString() ?? "0");
    const prevRevenue = parseFloat(prevPeriodOrders.revenue?.toString() ?? "0");
    const currentOrderCount = currentPeriodOrders.count;
    const prevOrderCount = prevPeriodOrders.count;
    const currentCustCount = currentCustomers.count;
    const prevCustCount = prevCustomers.count;

    const [totalRevenueRow] = await db.select({ revenue: sum(ordersTable.totalAmount) }).from(ordersTable);
    const [totalOrdersRow] = await db.select({ count: count() }).from(ordersTable);

    res.json({
      totalRevenue: parseFloat(totalRevenueRow.revenue?.toString() ?? "0"),
      totalOrders: totalOrdersRow.count,
      totalProducts: productsCount.count,
      totalCustomers: customersCount.count,
      revenueGrowth: prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 100,
      ordersGrowth: prevOrderCount > 0 ? ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100 : 100,
      customersGrowth: prevCustCount > 0 ? ((currentCustCount - prevCustCount) / prevCustCount) * 100 : 100,
      pendingOrders: pendingOrders.count,
      lowStockProducts: lowStock.count,
      averageOrderValue: currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/revenue-chart", async (req, res) => {
  try {
    const period = (req.query.period as string) || "30d";
    const periodMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
    const days = periodMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const rows = await db
      .select({
        date: sql<string>`DATE(${ordersTable.createdAt})::text`,
        revenue: sum(ordersTable.totalAmount),
        orders: count(),
      })
      .from(ordersTable)
      .where(gte(ordersTable.createdAt, startDate))
      .groupBy(sql`DATE(${ordersTable.createdAt})`)
      .orderBy(sql`DATE(${ordersTable.createdAt})`);

    res.json(rows.map((r) => ({
      date: r.date,
      revenue: parseFloat(r.revenue?.toString() ?? "0"),
      orders: r.orders,
    })));
  } catch (err) {
    req.log.error({ err }, "Error fetching revenue chart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(10);

    const [itemCounts] = await Promise.all([
      db.select({
        orderId: orderItemsTable.orderId,
        count: count(),
      }).from(orderItemsTable).groupBy(orderItemsTable.orderId),
    ]);

    const itemCountMap = new Map(itemCounts.map((ic) => [ic.orderId, ic.count]));

    res.json(orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      wilaya: o.wilaya,
      commune: o.commune,
      totalAmount: parseFloat(o.totalAmount.toString()),
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      itemCount: itemCountMap.get(o.id) ?? 0,
      createdAt: o.createdAt,
    })));
  } catch (err) {
    req.log.error({ err }, "Error fetching recent orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/top-products", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .orderBy(desc(productsTable.totalSold))
      .limit(5);

    res.json(products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      totalSold: p.totalSold,
      revenue: parseFloat(p.price.toString()) * p.totalSold,
      imageUrl: p.imageUrl,
    })));
  } catch (err) {
    req.log.error({ err }, "Error fetching top products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wilaya-sales", async (req, res) => {
  try {
    const rows = await db
      .select({
        wilaya: ordersTable.wilaya,
        orders: count(),
        revenue: sum(ordersTable.totalAmount),
      })
      .from(ordersTable)
      .groupBy(ordersTable.wilaya)
      .orderBy(desc(sum(ordersTable.totalAmount)));

    const totalRevenue = rows.reduce((acc, r) => acc + parseFloat(r.revenue?.toString() ?? "0"), 0);

    const wilayaCodes: Record<string, string> = {
      "Alger": "16", "Oran": "31", "Constantine": "25", "Annaba": "23",
      "Blida": "09", "Sétif": "19", "Batna": "05", "Tlemcen": "13",
      "Béjaïa": "06", "Tizi Ouzou": "15", "Ghardaïa": "47", "Ouargla": "30",
      "Biskra": "07", "Skikda": "21", "Mostaganem": "27", "Médéa": "26",
      "Tiaret": "14", "Bordj Bou Arréridj": "34", "Sidi Bel Abbès": "22", "Chlef": "02",
    };

    res.json(rows.map((r) => {
      const revenue = parseFloat(r.revenue?.toString() ?? "0");
      return {
        wilaya: r.wilaya,
        wilayaCode: wilayaCodes[r.wilaya] ?? "00",
        orders: r.orders,
        revenue,
        percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
      };
    }));
  } catch (err) {
    req.log.error({ err }, "Error fetching wilaya sales");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
