const { pool } = require('./db');

(async () => {
  try {
    await pool.query('ALTER TABLE predictions ADD COLUMN prediction_confidence FLOAT');
    console.log("Added prediction_confidence");
  } catch(e) { console.log("Already exists or error", e.message); }
  
  try {
    await pool.query('ALTER TABLE predictions ADD COLUMN crop_confidences JSONB');
    console.log("Added crop_confidences");
  } catch(e) { console.log("Already exists or error", e.message); }

  try {
    await pool.query('ALTER TABLE predictions ADD COLUMN model_accuracy FLOAT');
    console.log("Added model_accuracy");
  } catch(e) { console.log("Already exists or error", e.message); }

  console.log("Database altered!");
  process.exit();
})();
