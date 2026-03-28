import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { sql, desc, ilike, eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
    if (category) conditions.push(eq(productsTable.category, category));
    if (status) conditions.push(sql`${productsTable.status} = ${status}`);

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [products, totalRow] = await Promise.all([
      db.select().from(productsTable).where(where).orderBy(desc(productsTable.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(productsTable).where(where),
    ]);

    res.json({
      products: products.map((p) => ({
        ...p,
        price: parseFloat(p.price.toString()),
        rating: p.rating ? parseFloat(p.rating.toString()) : null,
      })),
      total: Number(totalRow[0].count),
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, nameAr, description, category, price, stock, sku, imageUrl } = req.body;
    const [product] = await db.insert(productsTable).values({
      name, nameAr, description, category,
      price: price.toString(),
      stock: stock || 0,
      sku,
      imageUrl,
      status: "active",
    }).returning();
    res.status(201).json({ ...product, price: parseFloat(product.price.toString()) });
  } catch (err) {
    req.log.error({ err }, "Error creating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ ...product, price: parseFloat(product.price.toString()), rating: product.rating ? parseFloat(product.rating.toString()) : null });
  } catch (err) {
    req.log.error({ err }, "Error fetching product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nameAr, description, category, price, stock, status, imageUrl } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (nameAr !== undefined) updates.nameAr = nameAr;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = price.toString();
    if (stock !== undefined) updates.stock = stock;
    if (status !== undefined) updates.status = status;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ ...product, price: parseFloat(product.price.toString()) });
  } catch (err) {
    req.log.error({ err }, "Error updating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
