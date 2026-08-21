fetch('https://krishimitra-backend-wrc0.onrender.com/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ n: "50", p: "25", k: "40", ph: "6.5", moisture: "50", temperature: "25", humidity: "60", rainfall: "100" })
}).then(async res => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text.substring(0, 500));
}).catch(console.error);
