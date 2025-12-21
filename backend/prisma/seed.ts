import 'dotenv/config';
import { PrismaClient, UserRole, AuditAction } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
  });

  const product = await prisma.product.upsert({
    where: { sku: 'SKU-001' },
    update: {},
    create: {
      name: 'Test Product',
      sku: 'SKU-001',
      price: 199.99,
    },
  });

  await prisma.inventoryItem.upsert({
    where: { productId: product.id },
    update: { quantity: 50 },
    create: {
      productId: product.id,
      quantity: 50,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: AuditAction.CREATE,
      entity: 'Product',
      entityId: product.id,
      userId: admin.id,
    },
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
