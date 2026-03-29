import { db } from "@workspace/db";
import {
  productsTable,
  customersTable,
  ordersTable,
  orderItemsTable,
  notificationsTable,
} from "@workspace/db/schema";

const wilayas = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Batna", "Tlemcen",
  "Béjaïa", "Tizi Ouzou", "Ghardaïa", "Ouargla", "Biskra", "Skikda", "Mostaganem",
  "Médéa", "Tiaret", "Bordj Bou Arréridj", "Sidi Bel Abbès", "Chlef",
];

const communes: Record<string, string[]> = {
  "Alger": ["Hydra", "El Biar", "Bab El Oued", "Hussein Dey", "Bir Mourad Raïs"],
  "Oran": ["Es Sénia", "Bir El Djir", "Arzew", "Ain El Turck"],
  "Constantine": ["El Khroub", "Ain Smara", "Hamma Bouziane"],
  "Annaba": ["El Bouni", "El Hadjar", "Sidi Amar"],
  "Blida": ["Boufarik", "Larbaa", "Meftah"],
  "Sétif": ["Ain Oulmane", "Bougaa", "El Eulma"],
  "Batna": ["Ain Touta", "Barika", "Merouana"],
};

const categories = [
  "Électronique", "Vêtements", "Alimentation", "Maison & Jardin",
  "Beauté", "Sport", "Jouets", "Auto & Moto", "Informatique", "Téléphonie",
];

const productData = [
  { name: "Samsung Galaxy A54", nameAr: "سامسونج جالاكسي A54", category: "Téléphonie", price: 89000, stock: 45, sku: "TEL-001", rating: 4.5, totalSold: 234 },
  { name: "iPhone 13 Reconditionné", nameAr: "آيفون 13 مجدد", category: "Téléphonie", price: 145000, stock: 12, sku: "TEL-002", rating: 4.8, totalSold: 156 },
  { name: "Laptop Lenovo IdeaPad 3", nameAr: "لابتوب لينوفو آيديا باد 3", category: "Informatique", price: 115000, stock: 8, sku: "INFO-001", rating: 4.2, totalSold: 89 },
  { name: "Robe Kabyle Traditionnelle", nameAr: "فستان قبائلي تقليدي", category: "Vêtements", price: 8500, stock: 67, sku: "VET-001", rating: 4.7, totalSold: 312 },
  { name: "Burnous Homme", nameAr: "برنوس رجالي", category: "Vêtements", price: 12000, stock: 34, sku: "VET-002", rating: 4.6, totalSold: 198 },
  { name: "Huile d'Argan Bio", nameAr: "زيت أركان بيولوجي", category: "Beauté", price: 3500, stock: 120, sku: "BEAU-001", rating: 4.9, totalSold: 567 },
  { name: "Miel Sidr Algérien", nameAr: "عسل السدر الجزائري", category: "Alimentation", price: 4200, stock: 85, sku: "ALI-001", rating: 4.8, totalSold: 445 },
  { name: "Couscous Rena 5kg", nameAr: "كسكسي رينا 5 كيلو", category: "Alimentation", price: 850, stock: 230, sku: "ALI-002", rating: 4.3, totalSold: 892 },
  { name: "TV Samsung 55\" 4K", nameAr: "تلفزيون سامسونج 55 بوصة 4K", category: "Électronique", price: 185000, stock: 6, sku: "ELEC-001", rating: 4.6, totalSold: 43 },
  { name: "Climatiseur Condor 12000 BTU", nameAr: "مكيف كوندور 12000 وحدة", category: "Électronique", price: 68000, stock: 23, sku: "ELEC-002", rating: 4.4, totalSold: 134 },
  { name: "Tapis Berbère Authentique", nameAr: "سجادة أمازيغية أصيلة", category: "Maison & Jardin", price: 25000, stock: 18, sku: "MAI-001", rating: 4.9, totalSold: 67 },
  { name: "Service Vaisselle Céramique", nameAr: "طقم أواني سيراميك", category: "Maison & Jardin", price: 7500, stock: 42, sku: "MAI-002", rating: 4.5, totalSold: 187 },
  { name: "Vélo VTT Adulte 26\"", nameAr: "دراجة جبلية للبالغين", category: "Sport", price: 35000, stock: 15, sku: "SPORT-001", rating: 4.3, totalSold: 76 },
  { name: "Kit de Musculation", nameAr: "طقم تمرين رياضي", category: "Sport", price: 22000, stock: 28, sku: "SPORT-002", rating: 4.4, totalSold: 112 },
  { name: "Jouet Éducatif Bois 3ans+", nameAr: "لعبة تعليمية خشبية للأطفال", category: "Jouets", price: 2800, stock: 95, sku: "JOU-001", rating: 4.7, totalSold: 334 },
  { name: "Autoradio Android GPS", nameAr: "راديو سيارة أندرويد GPS", category: "Auto & Moto", price: 18500, stock: 31, sku: "AUTO-001", rating: 4.2, totalSold: 89 },
  { name: "Tablette iPad Mini 6", nameAr: "تابلت آيباد ميني 6", category: "Informatique", price: 95000, stock: 4, sku: "INFO-002", rating: 4.7, totalSold: 56 },
  { name: "Parfum Oud Royal 100ml", nameAr: "عطر عود رويال 100 مل", category: "Beauté", price: 5500, stock: 78, sku: "BEAU-002", rating: 4.8, totalSold: 423 },
  { name: "Cafetière Expresso DeLonghi", nameAr: "آلة قهوة إسبريسو ديلونجي", category: "Électronique", price: 42000, stock: 19, sku: "ELEC-003", rating: 4.6, totalSold: 98 },
  { name: "Chaussures Sportives Nike", nameAr: "حذاء رياضي نايكي", category: "Vêtements", price: 11500, stock: 3, sku: "VET-003", rating: 4.5, totalSold: 267 },
];

const firstNames = ["Karim", "Amira", "Mohamed", "Yasmine", "Ali", "Fatima", "Omar", "Khadija", "Youcef", "Nadia", "Abdelkader", "Samira", "Rachid", "Leila", "Hamid", "Meriem", "Sofiane", "Houria", "Amine", "Djamila"];
const lastNames = ["Benali", "Hadji", "Meziane", "Boudiaf", "Cherif", "Mammeri", "Amrani", "Tlemcani", "Bensalem", "Kaci", "Aït Ahmed", "Boukhari", "Saadi", "Belkacem", "Ferhat", "Mansouri", "Azzedine", "Bouchakour", "Hamida", "Yousfi"];

const paymentMethods: Array<"cash_on_delivery" | "ccp" | "baridimob" | "cib" | "virement"> = ["cash_on_delivery", "cash_on_delivery", "cash_on_delivery", "baridimob", "ccp", "cib", "virement"];
const orderStatuses: Array<"pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"> = ["pending", "confirmed", "processing", "shipped", "delivered", "delivered", "delivered", "cancelled"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d;
}

async function seed() {
  const seedMode = process.env.SEED_MODE === "bootstrap" ? "bootstrap" : "reset";
  console.log(`🌱 Seeding Algerian e-commerce data in ${seedMode} mode...`);

  if (seedMode === "bootstrap") {
    const existing = await db.select().from(productsTable).limit(1);
    if (existing.length > 0) {
      console.log("Bootstrap seed skipped; products already present");
      process.exit(0);
    }
  }

  if (seedMode === "reset") {
    await db.delete(notificationsTable);
    await db.delete(orderItemsTable);
    await db.delete(ordersTable);
    await db.delete(customersTable);
    await db.delete(productsTable);
  }

  // Insert products
  console.log("📦 Inserting products...");
  const products = await db.insert(productsTable).values(
    productData.map((p) => ({
      ...p,
      price: p.price.toString(),
      rating: p.rating.toString(),
      status: p.stock === 0 ? "out_of_stock" as const : "active" as const,
    }))
  ).returning();

  // Insert customers (50 customers)
  console.log("👥 Inserting customers...");
  const customerRecords = [];
  for (let i = 0; i < 50; i++) {
    const wilaya = randomItem(wilayas);
    const communeList = communes[wilaya] || ["Centre ville"];
    customerRecords.push({
      name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      phone: `0${Math.floor(Math.random() * 9) + 5}${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: i % 3 === 0 ? `customer${i}@example.dz` : undefined,
      wilaya,
      commune: randomItem(communeList),
      totalOrders: 0,
      totalSpent: "0",
    });
  }
  const customers = await db.insert(customersTable).values(customerRecords).returning();

  // Insert orders (200 orders over the last 90 days)
  console.log("🛒 Inserting orders...");
  for (let i = 0; i < 200; i++) {
    const customer = randomItem(customers);
    const orderDate = randomDate(90);
    const status = randomItem(orderStatuses);
    const paymentMethod = randomItem(paymentMethods);
    const numItems = Math.floor(Math.random() * 3) + 1;
    
    const orderProducts = [];
    let total = 0;
    for (let j = 0; j < numItems; j++) {
      const product = randomItem(products);
      const qty = Math.floor(Math.random() * 3) + 1;
      const price = parseFloat(product.price.toString());
      orderProducts.push({ product, qty, price });
      total += price * qty;
    }

    const [order] = await db.insert(ordersTable).values({
      orderNumber: `ALG-${String(i + 1).padStart(5, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      wilaya: customer.wilaya,
      commune: customer.commune,
      address: `Rue ${Math.floor(Math.random() * 100) + 1}, ${customer.commune || customer.wilaya}`,
      totalAmount: total.toString(),
      status,
      paymentMethod,
      paymentStatus: status === "delivered" ? "paid" : status === "cancelled" ? "refunded" : "pending",
      createdAt: orderDate,
      updatedAt: orderDate,
    }).returning();

    await db.insert(orderItemsTable).values(
      orderProducts.map(({ product, qty, price }) => ({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: qty,
        unitPrice: price.toString(),
        totalPrice: (price * qty).toString(),
      }))
    );

    // Update customer stats
    if (status === "delivered") {
      await db.execute(
        `UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ${total}, last_order_at = '${orderDate.toISOString()}' WHERE id = ${customer.id}`
      );
    }
  }

  // Insert notifications
  console.log("🔔 Inserting notifications...");
  await db.insert(notificationsTable).values([
    { type: "new_order", title: "Nouvelle commande", message: "Commande ALG-00198 reçue de Karim Benali - 89,000 DZD", isRead: false, relatedId: 1 },
    { type: "low_stock", title: "Stock faible", message: "iPad Mini 6 - Seulement 4 unités restantes", isRead: false, relatedId: 17 },
    { type: "payment_received", title: "Paiement reçu", message: "Paiement CIB confirmé pour la commande ALG-00195", isRead: false, relatedId: 195 },
    { type: "new_order", title: "Nouvelle commande", message: "Commande ALG-00199 reçue de Amira Hadji - 25,000 DZD", isRead: false },
    { type: "low_stock", title: "Stock critique", message: "Chaussures Sportives Nike - Seulement 3 unités restantes", isRead: true, relatedId: 20 },
    { type: "new_order", title: "Nouvelle commande", message: "Commande ALG-00200 reçue de Mohamed Meziane - 145,000 DZD", isRead: true },
    { type: "order_cancelled", title: "Commande annulée", message: "La commande ALG-00187 a été annulée par le client", isRead: true, relatedId: 187 },
    { type: "review", title: "Nouvel avis", message: "Nouvel avis 5 étoiles pour Huile d'Argan Bio", isRead: true },
    { type: "low_stock", title: "Stock faible", message: "TV Samsung 55\" 4K - Seulement 6 unités restantes", isRead: true, relatedId: 9 },
    { type: "payment_received", title: "Paiement reçu", message: "Virement bancaire confirmé - 115,000 DZD", isRead: true },
  ]);

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
