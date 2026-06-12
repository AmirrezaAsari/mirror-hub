const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SEED_DATA = [
  {
    type: 'pypi',
    name: 'PyPI Mirrors',
    mirrors: [
      {
        name: 'آروان کلود',
        baseUrl: 'https://mirror.arvancloud.ir/pypi',
      },
      {
        name: 'دانشگاه تهران',
        baseUrl: 'https://repo.ut.ac.ir/pypi',
      },
      {
        name: 'میرور دانشگاه اصفهان',
        baseUrl: 'https://mirror.isfahan.ir/pypi',
      },
    ],
  },
  {
    type: 'npm',
    name: 'npm Registry Mirrors',
    mirrors: [
      {
        name: 'آروان کلود npm',
        baseUrl: 'https://mirror.arvancloud.ir/npm',
      },
      {
        name: 'npmmirror',
        baseUrl: 'https://registry.npmmirror.com',
      },
      {
        name: 'npmjs (official)',
        baseUrl: 'https://registry.npmjs.org',
      },
    ],
  },
  {
    type: 'apt',
    name: 'APT Mirrors',
    mirrors: [
      {
        name: 'آروان کلود Debian',
        baseUrl: 'https://mirror.arvancloud.ir/debian',
      },
      {
        name: 'دانشگاه تهران Debian',
        baseUrl: 'https://repo.ut.ac.ir/debian',
      },
      {
        name: 'میرور اوبونتو ایران',
        baseUrl: 'https://mirror.iranserver.com/ubuntu',
      },
    ],
  },
];

async function seedManager({ type, name, mirrors }) {
  let manager = await prisma.mirrorManager.findFirst({
    where: { type, deletedAt: null },
  });

  if (!manager) {
    manager = await prisma.mirrorManager.create({
      data: { type, name },
    });
    console.log(`Created mirror manager: ${name} (${type})`);
  } else {
    console.log(`Mirror manager already exists: ${name} (${type})`);
  }

  for (const mirror of mirrors) {
    const existing = await prisma.mirror.findFirst({
      where: { baseUrl: mirror.baseUrl, deletedAt: null },
    });

    if (existing) {
      console.log(`Mirror already exists: ${mirror.name}`);
      continue;
    }

    await prisma.mirror.create({
      data: {
        name: mirror.name,
        baseUrl: mirror.baseUrl,
        isActive: true,
        mirrorManagerId: manager.id,
      },
    });
    console.log(`Created mirror: ${mirror.name}`);
  }
}

async function main() {
  console.log('Seeding mirror managers and mirrors...');

  for (const group of SEED_DATA) {
    await seedManager(group);
  }

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
