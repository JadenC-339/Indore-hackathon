const phone = '9998887776';
const otp = '123456';

async function test() {
  console.log("Sending OTP...");
  await fetch('https://krishimitra-backend-wrc0.onrender.com/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });

  console.log("Verifying OTP...");
  const res = await fetch('https://krishimitra-backend-wrc0.onrender.com/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, name: 'RenderTest', village: 'TestVillage' })
  });
  
  const data = await res.json();
  console.log('Verify Response:', data);
}

test();
