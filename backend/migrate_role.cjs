const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      role: 'ADMIN',
      agencyId: { not: null }
    },
    data: {
      role: 'AGENCY'
    }
  });
  console.log(`Updated ${result.count} users from ADMIN to AGENCY`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
