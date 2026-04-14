import { PrismaClient, RoleName, ProductStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Create OWNER user
  const adminEmail = 'admin@thesis.local';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    // Find or create OWNER role first
    const ownerRole = await prisma.role.upsert({
      where: { name: RoleName.OWNER },
      update: {},
      create: { name: RoleName.OWNER },
    });

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        fullName: 'Admin Thesis',
        roleId: ownerRole.id,
      },
    });
    console.log('Created Admin User: admin@thesis.local / admin123');
  }

  // 2. Create Brand
  const brandName = 'Nike';
  const brandSlug = slugify(brandName, { lower: true });
  let brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: brandName,
        slug: brandSlug,
        description: 'Just do it.',
      },
    });
    console.log('Created Brand:', brandName);
  }

  // 3. Create Category
  const catName = 'Giày Thể Thao';
  const catSlug = slugify(catName, { lower: true });
  let category = await prisma.category.findUnique({ where: { slug: catSlug } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: catName,
        slug: catSlug,
        description: 'Giày nam/nữ',
      },
    });

    const subCatName = 'Giày Chạy Bộ';
    await prisma.category.create({
      data: {
        name: subCatName,
        slug: slugify(subCatName, { lower: true }),
        parentId: category.id,
      },
    });
    console.log('Created Categories:', catName, subCatName);
  }

  // 4. Create Product with Colors and Variants
  const prodName = 'Nike Air Force 1';
  const prodSlug = slugify(prodName, { lower: true });
  const existingProd = await prisma.product.findUnique({ where: { slug: prodSlug } });
  if (!existingProd) {
    const product = await prisma.product.create({
      data: {
        name: prodName,
        slug: prodSlug,
        brandId: brand.id,
        categoryId: category.id,
        description: 'Huyền thoại đường phố.',
        basePrice: 2500000,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
      },
    });

    await prisma.productColor.create({
      data: {
        productId: product.id,
        name: 'Trắng',
        colorCode: '#FFFFFF',
        variants: {
          create: [
            {
              productId: product.id,
              size: '40',
              sku: 'NK-AF1-WHT-40',
              price: 2500000,
              stock: 10,
            },
            {
              productId: product.id,
              size: '41',
              sku: 'NK-AF1-WHT-41',
              price: 2500000,
              stock: 5,
            },
          ]
        }
      }
    });
    console.log('Created Product:', prodName);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
