import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaSignOutAlt, FaBars } from 'react-icons/fa';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css'; // We will create this

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setCollapsed(!collapsed);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-vh-100 bg-light">
            {/* Sidebar */}
            <div className={`sidebar bg-white border-end ${collapsed ? 'collapsed' : ''} d-flex flex-column transition-all`}>
                <div className="sidebar-header p-3 d-flex align-items-center justify-content-between border-bottom">
                    {!collapsed && <h4 className="m-0 fw-bold text-primary">VentasApp</h4>}
                    <button className="btn btn-link text-secondary p-0" onClick={toggleSidebar}>
                        <FaBars size={20} />
                    </button>
                </div>

                <div className="sidebar-menu flex-grow-1 py-3">
                    <Link to="/dashboard" className={`nav-link text-secondary px-3 py-2 d-flex align-items-center ${isActive('/dashboard') ? 'active-link' : ''}`}>
                        <FaHome className="me-3" size={20} />
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                    <Link to="/productos" className={`nav-link text-secondary px-3 py-2 d-flex align-items-center ${isActive('/productos') ? 'active-link' : ''}`}>
                        <FaBox className="me-3" size={20} />
                        {!collapsed && <span>Productos</span>}
                    </Link>
                    <Link to="/clientes" className={`nav-link text-secondary px-3 py-2 d-flex align-items-center ${isActive('/clientes') ? 'active-link' : ''}`}>
                        <FaUsers className="me-3" size={20} />
                        {!collapsed && <span>Clientes</span>}
                    </Link>
                    <Link to="/ventas" className={`nav-link text-secondary px-3 py-2 d-flex align-items-center ${isActive('/ventas') ? 'active-link' : ''}`}>
                        <FaShoppingCart className="me-3" size={20} />
                        {!collapsed && <span>Ventas</span>}
                    </Link>
                </div>

                <div className="sidebar-footer p-3 border-top">
                    <Link to="/" className="nav-link text-danger px-0 d-flex align-items-center">
                        <FaSignOutAlt className="me-3" size={20} />
                        {!collapsed && <span>Cerrar Sesión</span>}
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="d-flex flex-column transition-all" style={{ marginLeft: collapsed ? '60px' : '250px', minHeight: '100vh' }}>
                <main className="container-fluid p-4 flex-grow-1">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
