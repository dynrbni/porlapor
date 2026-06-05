const fs = require('fs');
const file = 'src/controllers/agency.controllers.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "export const createAgency = async (req: Request, res: Response) => {",
  `import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const createAgency = async (req: Request, res: Response) => {`
);

code = code.replace(
  "const { name, description, email, phone, address, photoUrl, photoSource } = req.body;",
  "const { name, description, email, password, phone, address, photoUrl, photoSource } = req.body;"
);

code = code.replace(
  `const newAgency = await prisma.agency.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        photoUrl,
        photoSource,
      },
    });`,
  `const newAgency = await prisma.$transaction(async (tx) => {
      const agency = await tx.agency.create({
        data: {
          name,
          description,
          email,
          phone,
          address,
          photoUrl,
          photoSource,
        },
      });

      if (email && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create an Admin user for this agency
        await tx.user.create({
           data: {
              name: \`Admin \${name}\`,
              email,
              password: hashedPassword,
              phone: phone || \`AGENCY_\${crypto.randomUUID().substring(0,8)}\`,
              nik: \`AGENCY_\${crypto.randomUUID().substring(0,8)}\`,
              address: address || '-',
              gender: 'LAKI_LAKI',
              role: 'ADMIN',
              agencyId: agency.id
           }
        });
      }

      return agency;
    });`
);

fs.writeFileSync(file, code);
