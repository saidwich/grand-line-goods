import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categoryData = [
    { name: "Figures", slug: "figures" },
    { name: "Apparel", slug: "apparel" },
    { name: "Posters", slug: "posters" },
    { name: "Accessories", slug: "accessories" },
  ];

  const cat: Record<string, string> = {};
  for (const c of categoryData) {
    const created = await prisma.category.create({ data: c });
    cat[c.slug] = created.id;
  }

  const img = "/placeholder.svg";

  await prisma.product.createMany({
    data: [
      { name: "Captain of the Sea Figure", slug: "captain-of-the-sea-figure", description: "A 20cm collectible figure of a rubber-limbed pirate captain in a heroic pose.", priceCents: 4999, image: img, stock: 15, crew: "Sunny Crew", categoryId: cat.figures },
      { name: "Three-Blade Swordsman Figure", slug: "three-blade-swordsman-figure", description: "Hand-painted figure of a green-haired swordsman with three blades.", priceCents: 5499, image: img, stock: 10, crew: "Sunny Crew", categoryId: cat.figures },
      { name: "Straw Hat Replica", slug: "straw-hat-replica", description: "Woven straw hat with a red band. Wear it like a true pirate.", priceCents: 2499, image: img, stock: 30, crew: "Sunny Crew", categoryId: cat.accessories },
      { name: "Grand Line Logo Tee", slug: "grand-line-logo-tee", description: "Soft cotton tee with the Grand Line Goods compass logo.", priceCents: 2299, image: img, stock: 40, crew: null, categoryId: cat.apparel },
      { name: "Jolly Roger Hoodie", slug: "jolly-roger-hoodie", description: "Heavyweight black hoodie with an embroidered skull-and-hat emblem.", priceCents: 4599, image: img, stock: 20, crew: "Sunny Crew", categoryId: cat.apparel },
      { name: "Wanted Poster Print", slug: "wanted-poster-print", description: "Aged-paper style bounty poster, A3 size. Add your own name!", priceCents: 1299, image: img, stock: 50, crew: null, categoryId: cat.posters },
      { name: "Grand Line Map Poster", slug: "grand-line-map-poster", description: "Illustrated sea chart of a fictional Grand Line, A2 size.", priceCents: 1599, image: img, stock: 25, crew: null, categoryId: cat.posters },
      { name: "Log Pose Compass Necklace", slug: "log-pose-compass-necklace", description: "Brass compass pendant on an adjustable cord.", priceCents: 1899, image: img, stock: 35, crew: null, categoryId: cat.accessories },
    ],
  });

  await prisma.user.upsert({
    where: { email: "admin@grandlinegoods.dev" },
    update: {},
    create: {
      email: "admin@grandlinegoods.dev",
      name: "Admin",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  console.log("Seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());