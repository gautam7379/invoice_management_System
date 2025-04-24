const db = require('../config/db');

// Create a new client
exports.createClient = async (req, res) => {
  const { name, company, contact, gst_no } = req.body;
  try {
    const query = `
      INSERT INTO clients (name, company, contact, gst_no)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, company, contact, gst_no];
    const result = await db.query(query, values);

    res.status(201).json({ client: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clients');
    res.status(200).json({ clients: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  const clientId = req.params.id;
  const { name, company, contact, gst_no } = req.body;
  try {
    const query = `
      UPDATE clients
      SET name = $1, company = $2, contact = $3, gst_no = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [name, company, contact, gst_no, clientId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ client: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const clientId = req.params.id;
  try {
    const query = 'DELETE FROM clients WHERE id = $1 RETURNING *';
    const result = await db.query(query, [clientId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
