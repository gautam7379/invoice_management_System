import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    client_id: Yup.string().required('Client is required'),
    due_date: Yup.string().required('Due date is required'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().required('Description required'),
          qty: Yup.number().required('Quantity required').positive('Qty must be positive'),
          unit_price: Yup.number().required('Unit price required').positive('Price must be positive')
        })
      )
      .min(1, 'At least one item is required')
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { items: [{ description: '', qty: 1, unit_price: 0 }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
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

  const fetchClients = async () => {
    try {
      const res = await API.get('/clients');
      setClients(res.data.clients);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      data.status = 'Sent'; // default status
      await API.post('/invoices', data);
      alert('Invoice created!');
      reset();
      fetchInvoices();
    } catch (error) {
      console.error(error);
      alert('Failed to create invoice!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await API.delete(`/invoices/${id}`);
        alert('Invoice deleted!');
        fetchInvoices();
      } catch (error) {
        console.error(error);
        alert('Failed to delete invoice!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Invoices Management</h1>

      {/* Create Invoice Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl mb-4">Create New Invoice</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <label>Client</label>
            <select {...register('client_id')} className="w-full px-3 py-2 border rounded">
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            <p className="text-red-500 text-sm">{errors.client_id?.message}</p>
          </div>

          <div className="mb-4">
            <label>Due Date</label>
            <input
              type="date"
              {...register('due_date')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.due_date?.message}</p>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Invoice Items</h3>

          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

              <div>
                <input
                  type="text"
                  placeholder="Description"
                  {...register(`items.${index}.description`)}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-red-500 text-sm">{errors.items?.[index]?.description?.message}</p>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Quantity"
                  {...register(`items.${index}.qty`)}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-red-500 text-sm">{errors.items?.[index]?.qty?.message}</p>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Unit Price"
                  {...register(`items.${index}.unit_price`)}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-red-500 text-sm">{errors.items?.[index]?.unit_price?.message}</p>
              </div>

              <div className="col-span-3 text-right">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ description: '', qty: 1, unit_price: 0 })}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            + Add Item
          </button>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Create Invoice
            </button>
          </div>

        </form>
      </div>

      {/* Invoices Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Invoices List</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="text-center border-b">
                <td className="px-4 py-2">{invoice.invoice_no}</td>
                <td className="px-4 py-2">{invoice.client_name}</td>
                <td className="px-4 py-2">₹ {invoice.total}</td>
                <td className="px-4 py-2">{invoice.status}</td>
                <td className="px-4 py-2">{invoice.due_date}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoicesPage;
