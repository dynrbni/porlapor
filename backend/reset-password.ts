import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.update({
    where: { email: 'superadmin@porlapor.com' },
    data: { password: hash },
  });
  console.log('Updated password for:', user.email);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
