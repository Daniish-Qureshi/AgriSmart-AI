const fs = require('fs');
const path = require('path');

const pagesDir = 'e:/AgriSmart-AI/client/src/pages';
const filesToUpdate = ['Dashboard.jsx', 'FarmingSimulator.jsx', 'RiskEstimator.jsx', 'SoilPassport.jsx', 'ProfitEstimator.jsx', 'SeasonalPlanner.jsx', 'AlertsPage.jsx'];

filesToUpdate.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Make sure we have the user state defined
        if (!content.includes("const user = JSON.parse(localStorage.getItem('user'))")) {
            content = content.replace(/(const \[activeNav.*$)/m, "$1\n  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' };");
        }

        // Replace the sidebar D
        content = content.replace(
            />D<\/div>/g,
            ">{user.name.charAt(0).toUpperCase()}</div>"
        );

        // Replace Danish
        content = content.replace(
            />Danish<\/div>/g,
            ">{user.name}</div>"
        );

        // Replace Namaste, Danish 👋
        content = content.replace(
            />Namaste, Danish 👋<\/h1>/g,
            ">Namaste, {user.name} 👋</h1>"
        );

        // Replace location
        content = content.replace(
            />Dadri, G\.B\. Nagar<\/div>/g,
            ">{user.location}</div>"
        );

        // Replace logout logic
        content = content.replace(
            /onClick=\{\(\) \=\> navigate\('\/'\)\}/g,
            "onClick={() => { localStorage.removeItem('user'); navigate('/'); }}"
        );

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
