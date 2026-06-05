const fs = require('fs');
const file = '../backend/prisma/schema.prisma';
let code = fs.readFileSync(file, 'utf8');

// Add agency relation to User
if (!code.includes('agencyId    String?')) {
    code = code.replace('role     Role    @default(USER)', `role     Role    @default(USER)

  // Relasi ke Agency (Jika ini adalah ADMIN dari sebuah instansi)
  agencyId    String?
  agency      Agency?  @relation(fields: [agencyId], references: [id])
`);
}

// Add user relation to Agency
if (!code.includes('users      User[]')) {
    code = code.replace('categories Category[]', `categories Category[]
  
  // Pegawai / Admin yang mengelola instansi ini
  users      User[]
`);
}

fs.writeFileSync(file, code);
