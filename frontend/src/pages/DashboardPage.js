import React, { useEffect, useState } from 'react';
import API from '../services/api'; // our axios instance
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          alert('Session expired! Please login again.');
          navigate('/');
        }
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Invoices</h2>
          <p className="text-2xl mt-2">{stats.totalInvoices ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Received</h2>
          <p className="text-2xl mt-2 text-green-600">₹ {stats.totalReceived ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Outstanding</h2>
          <p className="text-2xl mt-2 text-red-600">₹ {stats.outstanding ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Upcoming Dues</h2>
          <p className="text-2xl mt-2">{stats.upcomingDue ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
