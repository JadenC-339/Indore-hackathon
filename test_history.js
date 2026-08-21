fetch('https://krishimitra-backend-wrc0.onrender.com/history')
  .then(res => res.json())
  .then(data => {
    console.log(`Fetched ${data.length} records from Render DB.`);
    if (data.length > 0) {
      console.log('Most recent record:', data[0]);
    }
  })
  .catch(console.error);
