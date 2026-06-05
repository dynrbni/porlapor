const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace condition checks
  if (content.includes("user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'")) {
    content = content.replace(/user\?.role === 'ADMIN' \|\| user\?.role === 'SUPERADMIN'/g, "user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY'");
    changed = true;
  }
  
  if (content.includes("user.role === 'ADMIN' || user.role === 'SUPERADMIN'")) {
    content = content.replace(/user\.role === 'ADMIN' \|\| user\.role === 'SUPERADMIN'/g, "user.role === 'ADMIN' || user.role === 'SUPERADMIN' || user.role === 'AGENCY'");
    changed = true;
  }

  if (content.includes("u.role !== 'ADMIN' && u.role !== 'SUPERADMIN'")) {
    content = content.replace(/u\.role !== 'ADMIN' && u\.role !== 'SUPERADMIN'/g, "u.role !== 'ADMIN' && u.role !== 'SUPERADMIN' && u.role !== 'AGENCY'");
    changed = true;
  }

  // Update promote label in AgencyDashboard / AdminDashboard
  if (content.includes("u.role === 'ADMIN' ? 'bg-blue-100")) {
    content = content.replace(/u\.role === 'ADMIN' \? 'bg-blue-100 text-blue-800 border border-blue-200' :/g, "u.role === 'ADMIN' || u.role === 'AGENCY' ? 'bg-blue-100 text-blue-800 border border-blue-200' :");
    changed = true;
  }

  // AdminReportDetailPanel
  if (content.includes("note.author?.role || 'ADMIN'")) {
    content = content.replace(/note\.author\?\.role \|\| 'ADMIN'/g, "note.author?.role || 'AGENCY'");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
