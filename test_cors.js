async function testCORS() {
  const res = await fetch('https://krishimitra-backend-wrc0.onrender.com/predict', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST'
    }
  });
  console.log('OPTIONS Status:', res.status);
  for (let [k,v] of res.headers) {
    console.log(k, v);
  }
}
testCORS();
