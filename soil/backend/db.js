const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS soil_data (
        id SERIAL PRIMARY KEY,
        n FLOAT NOT NULL,
        p FLOAT NOT NULL,
        k FLOAT NOT NULL,
        ph FLOAT NOT NULL,
        moisture FLOAT NOT NULL,
        temperature FLOAT NOT NULL,
        humidity FLOAT NOT NULL,
        rainfall FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        soil_id INTEGER REFERENCES soil_data(id),
        soil_quality VARCHAR(50) NOT NULL,
        recommended_crops JSONB NOT NULL,
        improvement_tips JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // model_metrics is kept here if we want to store it, but right now
    // ML service stores it locally and we fetch it through /api/metrics.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS model_metrics (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL,
        accuracy FLOAT NOT NULL,
        training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(15) UNIQUE NOT NULL,
        name VARCHAR(100),
        village VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS otp_store (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing database tables:", error);
  }
};

module.exports = {
  pool,
  initDB
};
