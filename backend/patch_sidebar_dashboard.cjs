const fs = require('fs');

// Patch AdminSidebar.tsx
let file = '../frontend/src/components/AdminSidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "{navItems.map((item) => {",
  `{navItems.map((item) => {
            if (userRole === 'ADMIN' && (item.id === 'agencies' || item.id === 'users' || item.id === 'categories')) return null;`
);

fs.writeFileSync(file, code);

// Patch AdminDashboard.tsx
let file2 = '../frontend/src/pages/AdminDashboard.tsx';
let code2 = fs.readFileSync(file2, 'utf8');

code2 = code2.replace(
  "const showOverview = activeSection === 'overview';",
  "const isSubAdmin = user?.role === 'ADMIN';\n  const showOverview = activeSection === 'overview';"
);

code2 = code2.replace(
  "const showAgencies = activeSection === 'agencies';",
  "const showAgencies = !isSubAdmin && activeSection === 'agencies';"
);

code2 = code2.replace(
  "const showUsers = activeSection === 'users';",
  "const showUsers = !isSubAdmin && activeSection === 'users';"
);

code2 = code2.replace(
  "const showCategories = activeSection === 'categories';",
  "const showCategories = !isSubAdmin && activeSection === 'categories';"
);

fs.writeFileSync(file2, code2);
