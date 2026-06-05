const fs = require('fs');
let file = '../frontend/src/pages/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Filter reports
code = code.replace(
  "setReports(reportsResponse.data || []);",
  "const allReports = reportsResponse.data || [];\n        setReports(currentUser?.role === 'ADMIN' ? allReports.filter((r: any) => r.agencyId === currentUser?.agencyId) : allReports);"
);

fs.writeFileSync(file, code);
