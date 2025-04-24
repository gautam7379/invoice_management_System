const db = require('../config/db');

class User {
  static async create(name, email, hashedPassword, role) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, email, hashedPassword, role];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await db.query(query, [email]);
    return result.rows[0];
  }
}

module.exports = User;
