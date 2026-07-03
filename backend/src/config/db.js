const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../database.sqlite');
const schemaPath = path.resolve(__dirname, '../db/schema.sql');

// Establish physical SQLite connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('💥 SQLite connection error:', err.message);
  } else {
    console.log(`🔌 SQLite database connected successfully at: ${dbPath}`);
  }
});

// Promisified helper query methods to match controller expectations
const dbQuery = {
  get: (query, params = []) => new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  }),
  all: (query, params = []) => new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  }),
  run: (query, params = []) => new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  })
};

// Initialize schema and trigger seeding if necessary
const connectPromise = (async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Enable Foreign Keys
      db.run("PRAGMA foreign_keys = ON;", (err) => {
        if (err) {
          console.error("❌ Failed to enable foreign keys:", err);
          return reject(err);
        }
      });

      // 2. Read and execute database schema
      try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, async (err) => {
          if (err) {
            console.error("❌ Database schema execution failed:", err);
            return reject(err);
          }
          console.log("✅ SQLite Relational schema verified/created successfully.");
          
          // 3. Perform seed check and execution
          try {
            const { seedDatabase } = require('../db/seed');
            await seedDatabase();
            resolve();
          } catch (seedErr) {
            console.error("❌ Seeding check/execution failed:", seedErr);
            reject(seedErr);
          }
        });
      } catch (fsErr) {
        console.error("❌ Failed to read schema.sql:", fsErr.message);
        reject(fsErr);
      }
    });
  });
})();

module.exports = {
  db,
  dbQuery,
  connectPromise
};
