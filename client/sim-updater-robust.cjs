const fs = require('fs');
const file = 'e:/AgriSmart-AI/client/src/pages/FarmingSimulator.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = 'setResult({ totalCost, totalProfit, netProfit, roi, budgetSufficient, data, isProfit: netProfit > 0 })';

const replacement = `setResult({ totalCost, totalProfit, netProfit, roi, budgetSufficient, data, isProfit: netProfit > 0 })

      const token = localStorage.getItem('token')
      if (token) {
        try {
          fetch('${import.meta.env.VITE_API_URL}/api/data/simulation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
            body: JSON.stringify({ crop_name: crop, budget, season, acres, estimated_profit: netProfit, risk_percent: data.risk })
          }).catch(e => console.error('Sim save failed:', e))
        } catch(err) {}
      }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('FarmingSimulator successfully patched!');
} else {
    console.log('Target string NOT found. Check file manually.');
}
