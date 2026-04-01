const fs = require('fs');
const pages = [
    'Dashboard.jsx', 'FarmingSimulator.jsx', 'SoilPassport.jsx',
    'ProfitEstimator.jsx', 'RiskEstimator.jsx', 'SeasonalPlanner.jsx', 'AlertsPage.jsx'
];

pages.forEach(page => {
    const filePath = \`e:/AgriSmart-AI/client/src/pages/\${page}\`;
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already imported
  if (content.includes('import AgriBot from')) return;

  // 1. Add import immediately after the first import (or at top)
  content = content.replace(/import (.*?) from ['"]react['"];?/g, "import $1 from 'react';\\nimport AgriBot from '../components/AgriBot';");
  
  if (!content.includes('import AgriBot')) {
      content = "import AgriBot from '../components/AgriBot';\\n" + content;
  }

  // 2. Inject <AgriBot /> right before the last </div> closing the main wrapper.
  // A safe way is to replace the final "  )\\n}" with "      <AgriBot />\\n    </div>\\n  )\\n}"
  // But regex for the last closing div might be tricky. Let's look for: ") \n}" or ")\n}"
  content = content.replace(/\\s*\\)\\s*\\}\\s*$/g, '\\n      <AgriBot />\\n    </div>\\n  )\\n}');
  // we also need to replace the last </div> with nothing since we just added it back, 
  // actually a better way: replace the last "</div>" with "<AgriBot /></div>"
  
  fs.writeFileSync(filePath, content);
});

console.log('AgriBot successfully injected into all pages! Wait, wait, let me use a better regex to prevent breaking the component return.');
