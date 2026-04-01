const fs = require('fs');
const file = 'e:/AgriSmart-AI/client/src/pages/FarmingSimulator.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `      setResult({ totalCost, totalProfit, netProfit, roi, budgetSufficient, data, isProfit: netProfit > 0 });
      try {
        const token = localStorage.getItem('token');
        if (token) {
          fetch('http://localhost:5000/api/data/simulation', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${token}\`
            },
            body: JSON.stringify({
              crop_name: crop,
              budget,
              season,
              acres,
              estimated_profit: netProfit,
              risk_percent: data.risk
            })
          }).catch(e => console.error(e));
        }
      } catch (err) {}
      setLoading(false);`;

content = content.replace(/      setResult\(\{ totalCost, totalProfit, netProfit, roi, budgetSufficient, data, isProfit: netProfit > 0 \}\)\n      setLoading\(false\)/, replacement);

fs.writeFileSync(file, content);
console.log('FarmingSimulator updated successfully!');
