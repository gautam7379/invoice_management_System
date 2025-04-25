import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function PaymentsPage() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    invoice_id: Yup.string().required('Invoice is required'),
    amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
    mode: Yup.string().required('Payment mode is required'),
    date: Yup.string().required('Payment date is required')
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await API.get('/invoices');
      setInvoices(res.data.invoices);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert('Session expired! Please login again.');
        navigate('/');
      }
    }
  };

  const fetchPayments = async (invoiceId) => {
    try {
      const res = await API.get(`/payments/${invoiceId}`);
      setPayments(res.data.payments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvoiceChange = (e) => {
    const invoiceId = e.target.value;
    setSelectedInvoice(invoiceId);
    if (invoiceId) {
      fetchPayments(invoiceId);
    } else {
      setPayments([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      await API.post('/payments', data);
      alert('Payment added successfully!');
      reset();
      fetchPayments(data.invoice_id);
    } catch (error) {
      console.error(error);
      alert('Failed to add payment!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Payments Management</h1>

      {/* Add Payment Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl mb-4">Add Payment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label>Invoice</label>
            <select {...register('invoice_id')} className="w-full px-3 py-2 border rounded" onChange={handleInvoiceChange}>
              <option value="">Select Invoice</option>
              {invoices.map(invoice => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoice_no} - {invoice.client_name}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm">{errors.invoice_id?.message}</p>
          </div>

          <div>
            <label>Amount</label>
            <input
              type="number"
              {...register('amount')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.amount?.message}</p>
          </div>

          <div>
            <label>Payment Mode</label>
            <input
              type="text"
              placeholder="Cash, UPI, Bank Transfer"
              {...register('mode')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.mode?.message}</p>
          </div>

          <div>
            <label>Payment Date</label>
            <input
              type="date"
              {...register('date')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.date?.message}</p>
          </div>

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>

      {/* Payments Table */}
      {payments.length > 0 && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl mb-4">Payments List</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Mode</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="text-center border-b">
                  <td className="px-4 py-2">₹ {payment.amount}</td>
                  <td className="px-4 py-2">{payment.mode}</td>
                  <td className="px-4 py-2">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default PaymentsPage;
