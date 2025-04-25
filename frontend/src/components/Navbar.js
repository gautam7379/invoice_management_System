import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // icons

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="text-2xl font-bold">Invoice Manager</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className={`${isActive('/dashboard') ? 'underline' : ''}`}>Dashboard</Link>
          <Link to="/clients" className={`${isActive('/clients') ? 'underline' : ''}`}>Clients</Link>
          <Link to="/invoices" className={`${isActive('/invoices') ? 'underline' : ''}`}>Invoices</Link>
          <Link to="/payments" className={`${isActive('/payments') ? 'underline' : ''}`}>Payments</Link>
          <Link to="/" className="hover:underline">Logout</Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 flex flex-col space-y-2 px-6 pb-4">
          <Link to="/dashboard" onClick={toggleMenu} className={`${isActive('/dashboard') ? 'underline' : ''}`}>Dashboard</Link>
          <Link to="/clients" onClick={toggleMenu} className={`${isActive('/clients') ? 'underline' : ''}`}>Clients</Link>
          <Link to="/invoices" onClick={toggleMenu} className={`${isActive('/invoices') ? 'underline' : ''}`}>Invoices</Link>
          <Link to="/payments" onClick={toggleMenu} className={`${isActive('/payments') ? 'underline' : ''}`}>Payments</Link>
          <Link to="/" onClick={toggleMenu}>Logout</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
