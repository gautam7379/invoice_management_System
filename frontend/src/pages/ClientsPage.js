import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    company: Yup.string().required('Company name is required'),
    contact: Yup.string().required('Contact is required'),
    gst_no: Yup.string()
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
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get('/clients');
      setClients(res.data.clients);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert('Session expired! Please login again.');
        navigate('/');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingClient) {
        await API.put(`/clients/${editingClient.id}`, data);
        alert('Client updated!');
      } else {
        await API.post('/clients', data);
        alert('Client created!');
      }
      reset();
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error(error);
      alert('Operation failed!');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    reset(client);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await API.delete(`/clients/${id}`);
        alert('Client deleted!');
        fetchClients();
      } catch (error) {
        console.error(error);
        alert('Delete failed!');
      }
    }
  };

  const cancelEdit = () => {
    setEditingClient(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Clients Management</h1>

      {/* Client Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl mb-4">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label>Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div>
            <label>Company</label>
            <input
              type="text"
              {...register('company')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.company?.message}</p>
          </div>

          <div>
            <label>Contact</label>
            <input
              type="text"
              {...register('contact')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.contact?.message}</p>
          </div>

          <div>
            <label>GST No (Optional)</label>
            <input
              type="text"
              {...register('gst_no')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="col-span-2 flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {editingClient ? 'Update' : 'Create'}
            </button>
            {editingClient && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Clients Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Clients List</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">GST No</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="text-center border-b">
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.company}</td>
                <td className="px-4 py-2">{client.contact}</td>
                <td className="px-4 py-2">{client.gst_no || '-'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">No clients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientsPage;
