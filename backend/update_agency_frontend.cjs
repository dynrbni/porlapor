const fs = require('fs');

// 1. Update agencyService.ts
let serviceFile = '../frontend/src/services/agencyService.ts';
let serviceCode = fs.readFileSync(serviceFile, 'utf8');

if (!serviceCode.includes('password?: string;')) {
    serviceCode = serviceCode.replace(
        "email?: string;",
        "email?: string;\n  password?: string;"
    );
    fs.writeFileSync(serviceFile, serviceCode);
}

// 2. Update AdminDashboard.tsx
let dashboardFile = '../frontend/src/pages/AdminDashboard.tsx';
let dashboardCode = fs.readFileSync(dashboardFile, 'utf8');

if (!dashboardCode.includes('password: \'\',')) {
    // Add password to agencyForm state
    dashboardCode = dashboardCode.replace(
        "const [agencyForm, setAgencyForm] = useState({\n    name: '',\n    description: '',\n    email: '',\n    phone: '',\n    address: '',\n    photoUrl: '',\n  });",
        "const [agencyForm, setAgencyForm] = useState({\n    name: '',\n    description: '',\n    email: '',\n    password: '',\n    phone: '',\n    address: '',\n    photoUrl: '',\n  });"
    );

    // Add password to resetAgencyForm
    dashboardCode = dashboardCode.replace(
        "const resetAgencyForm = () => {\n    setAgencyForm({\n      name: '',\n      description: '',\n      email: '',\n      phone: '',\n      address: '',\n      photoUrl: '',\n    });\n  };",
        "const resetAgencyForm = () => {\n    setAgencyForm({\n      name: '',\n      description: '',\n      email: '',\n      password: '',\n      phone: '',\n      address: '',\n      photoUrl: '',\n    });\n  };"
    );

    // Add password to handleCreateAgency
    dashboardCode = dashboardCode.replace(
        "if (agencyForm.email.trim()) payload.email = agencyForm.email.trim();",
        "if (agencyForm.email.trim()) payload.email = agencyForm.email.trim();\n      if (agencyForm.password.trim()) payload.password = agencyForm.password.trim();"
    );

    // Add password input UI
    const emailInputHtml = `<div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={agencyForm.email}
                    onChange={(event) => setAgencyForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    placeholder="instansi@email.go.id"
                  />
                </div>`;
                
    const replacementHtml = emailInputHtml + `
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password (Untuk Login Admin)</label>
                  <input
                    type="text"
                    value={agencyForm.password}
                    onChange={(event) => setAgencyForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    placeholder="Password minimal 6 karakter"
                  />
                </div>`;
                
    dashboardCode = dashboardCode.replace(emailInputHtml, replacementHtml);
    
    fs.writeFileSync(dashboardFile, dashboardCode);
}
