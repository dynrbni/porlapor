const fs = require('fs');

// Update backend/src/controllers/auth.controllers.ts to include agencyId
let authFile = 'src/controllers/auth.controllers.ts';
let code = fs.readFileSync(authFile, 'utf8');

code = code.replace(
  "role: true,",
  "role: true,\n                agencyId: true,"
);
code = code.replace(
  "role: user.role,",
  "role: user.role,\n                    agencyId: user.agencyId,"
);
code = code.replace(
  "role: updatedUser.role,",
  "role: updatedUser.role,\n                    agencyId: updatedUser.agencyId,"
);

fs.writeFileSync(authFile, code);

// Update frontend authService.ts to include agencyId
let frontendAuthFile = '../frontend/src/services/authService.ts';
let frontendCode = fs.readFileSync(frontendAuthFile, 'utf8');

if (!frontendCode.includes('agencyId?: string;')) {
    frontendCode = frontendCode.replace(
      "role?: string;",
      "role?: string;\n  agencyId?: string;"
    );
    fs.writeFileSync(frontendAuthFile, frontendCode);
}

