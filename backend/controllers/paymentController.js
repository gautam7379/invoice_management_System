const db = require('../config/db');

// Add Payment
exports.addPayment = async (req, res) => {
  const { invoice_id, amount, mode, date } = req.body;

  try {
    // Insert payment
    await db.query(
      `INSERT INTO payments (invoice_id, amount, mode, date)
       VALUES ($1, $2, $3, $4)`,
      [invoice_id, amount, mode, date]
    );

    // Fetch total invoice amount
    const invoiceResult = await db.query(`SELECT total FROM invoices WHERE id = $1`, [invoice_id]);
    const invoiceTotal = invoiceResult.rows[0].total;

    // Fetch total payments done
    const paymentResult = await db.query(
      `SELECT SUM(amount) AS total_paid FROM payments WHERE invoice_id = $1`,
      [invoice_id]
    );
    const totalPaid = parseFloat(paymentResult.rows[0].total_paid);

    // Update invoice status
    let newStatus = '';
    if (totalPaid >= invoiceTotal) {
      newStatus = 'Paid';
    } else {
      newStatus = 'Partially Paid';
    }

    await db.query(
      `UPDATE invoices SET status = $1 WHERE id = $2`,
      [newStatus, invoice_id]
    );

    res.status(201).json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments for an invoice
exports.getPaymentsByInvoice = async (req, res) => {
  const invoiceId = req.params.invoiceId;

  try {
    const result = await db.query(
      `SELECT * FROM payments WHERE invoice_id = $1 ORDER BY date DESC`,
      [invoiceId]
    );

    res.status(200).json({ payments: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
