const db = require('../config/db');

// Helper function to generate Invoice Number
const generateInvoiceNumber = () => {
  return 'INV-' + Date.now();
};

// Create Invoice
exports.createInvoice = async (req, res) => {
  const { client_id, items, status, due_date } = req.body;
  const created_by = req.user.userId;

  try {
    const invoice_no = generateInvoiceNumber();

    // Insert invoice with total = 0 initially
    const invoiceResult = await db.query(
      `INSERT INTO invoices (invoice_no, client_id, total, status, due_date, created_by)
       VALUES ($1, $2, 0, $3, $4, $5) RETURNING *`,
      [invoice_no, client_id, status, due_date, created_by]
    );

    const invoiceId = invoiceResult.rows[0].id;
    let totalAmount = 0;

    // Insert invoice items
    for (const item of items) {
      const itemTotal = item.qty * item.unit_price;
      totalAmount += itemTotal;

      await db.query(
        `INSERT INTO invoice_items (invoice_id, description, qty, unit_price, total)
         VALUES ($1, $2, $3, $4, $5)`,
        [invoiceId, item.description, item.qty, item.unit_price, itemTotal]
      );
    }

    // Update total in invoice
    await db.query(
      `UPDATE invoices SET total = $1 WHERE id = $2`,
      [totalAmount, invoiceId]
    );

    res.status(201).json({ message: 'Invoice created successfully', invoice_id: invoiceId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all Invoices
exports.getInvoices = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT invoices.*, clients.name as client_name
       FROM invoices
       JOIN clients ON invoices.client_id = clients.id
       ORDER BY invoices.created_at DESC`
    );
    res.status(200).json({ invoices: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Invoice Status
exports.updateInvoiceStatus = async (req, res) => {
  const invoiceId = req.params.id;
  const { status } = req.body;

  try {
    const result = await db.query(
      `UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *`,
      [status, invoiceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ invoice: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
  const invoiceId = req.params.id;

  try {
    // Delete invoice items first (because of foreign key constraint)
    await db.query(`DELETE FROM invoice_items WHERE invoice_id = $1`, [invoiceId]);
    const result = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING *`, [invoiceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
