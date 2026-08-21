fetch('https://krishimitra-backend-wrc0.onrender.com/api/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: "9999999999" })
}).then(async res => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text.substring(0, 500));
}).catch(console.error);
