const fs = require('fs');
const file = 'e:/AgriSmart-AI/client/src/pages/SoilPassport.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `      setResult({ phStatus, phColor, overallScore, suggestions, bestCrops });
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch('http://localhost:5000/api/data/soil', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${token}\`
            },
            body: JSON.stringify({
              ph_level: parseFloat(form.ph),
              nitrogen: form.nitrogen,
              phosphorus: form.phosphorus,
              potassium: form.potassium,
              suggestion: suggestions.length > 0 ? suggestions[0].text : 'Normal Levels'
            })
          });
        } catch(err) { console.error(err); }
      }
      setLoading(false);`;

content = content.replace(/      setResult\(\{ phStatus, phColor, overallScore, suggestions, bestCrops \}\)\s*setLoading\(false\)/, replacement);

fs.writeFileSync(file, content);
console.log('SoilPassport.jsx updated successfully!');
