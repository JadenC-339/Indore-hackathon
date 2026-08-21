const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: 'postgresql://postgres:Rohita@2006@localhost:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE soil_ml_db;');
    console.log("Database soil_ml_db created successfully.");
  } catch (e) {
    if (e.code === '42P04') {
      console.log('Database already exists.');
    } else {
      console.error(e.message);
    }
  } finally {
    await client.end();
  }
}
run();
