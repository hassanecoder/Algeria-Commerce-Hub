import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { sql, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.query.filter as string | undefined;

    let query = db.select().from(productsTable);

    let products;
    if (filter === "out_of_stock") {
      products = await db.select().from(productsTable).where(sql`${productsTable.stock} = 0`);
    } else if (filter === "low_stock") {
      products = await db.select().from(productsTable).where(sql`${productsTable.stock} > 0 AND ${productsTable.stock} < 10`);
    } else {
      products = await db.select().from(productsTable);
    }

    res.json(products.map((p) => {
      let status: string;
      if (p.stock === 0) status = "out_of_stock";
      else if (p.stock < 5) status = "critical";
      else if (p.stock < 10) status = "low";
      else status = "ok";

      return {
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        category: p.category,
        currentStock: p.stock,
        minStock: 5,
        maxStock: 200,
        status,
        lastRestocked: p.updatedAt,
      };
    }));
  } catch (err) {
    req.log.error({ err }, "Error fetching inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:productId/update", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const { currentStock, minStock, maxStock } = req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (currentStock !== undefined) updates.stock = currentStock;

    const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, productId)).returning();
    if (!product) return res.status(404).json({ error: "Product not found" });

    let status: string;
    if (product.stock === 0) status = "out_of_stock";
    else if (product.stock < 5) status = "critical";
    else if (product.stock < 10) status = "low";
    else status = "ok";

    res.json({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.stock,
      minStock: minStock ?? 5,
      maxStock: maxStock ?? 200,
      status,
      lastRestocked: product.updatedAt,
    });
  } catch (err) {
    req.log.error({ err }, "Error updating inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
