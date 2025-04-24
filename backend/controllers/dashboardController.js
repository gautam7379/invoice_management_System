const db = require('../config/db');

// Dashboard Stats Controller
exports.getDashboardStats = async (req, res) => {
  try {
    // Total number of invoices
    const totalInvoicesResult = await db.query('SELECT COUNT(*) FROM invoices');
    const totalInvoices = parseInt(totalInvoicesResult.rows[0].count);

    // Total received payments
    const totalReceivedResult = await db.query('SELECT SUM(amount) FROM payments');
    const totalReceived = parseFloat(totalReceivedResult.rows[0].sum) || 0;

    // Total outstanding (sum of unpaid invoices)
    const outstandingResult = await db.query(
      `SELECT SUM(total) 
       FROM invoices 
       WHERE status = 'Draft' OR status = 'Sent' OR status = 'Partially Paid'`
    );
    const outstanding = parseFloat(outstandingResult.rows[0].sum) || 0;

    // Upcoming Due Invoices (in next 7 days)
    const upcomingDueResult = await db.query(
      `SELECT COUNT(*) 
       FROM invoices 
       WHERE due_date >= CURRENT_DATE AND due_date <= CURRENT_DATE + INTERVAL '7 days'
         AND (status = 'Draft' OR status = 'Sent' OR status = 'Partially Paid')`
    );
    const upcomingDue = parseInt(upcomingDueResult.rows[0].count);

    res.status(200).json({
      totalInvoices,
      totalReceived,
      outstanding,
      upcomingDue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
