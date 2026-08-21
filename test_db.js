const { Pool } = require('pg');
require('dotenv').config({ path: 'backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // assuming it's set, wait, I don't have .env! I'll just rely on the backend.
});

// Since I don't know the exact DATABASE_URL on Render, I can just ping the Render backend again right now!
