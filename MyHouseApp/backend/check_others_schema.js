import { pool } from './config/database.js';

async function checkOtherTables() {
  try {
    const tables = ['machinarydet', 'vehiclesdet', 'vehtenant', 'mactenant', 'buitenant'];
    for (const table of tables) {
      const [cols] = await pool.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'cdmrental' AND TABLE_NAME = ?`,
        [table]
      );
      console.log(`Columns in ${table}:`, cols.map(r => r.COLUMN_NAME).join(', '));
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    process.exit();
  }
}

checkOtherTables();
