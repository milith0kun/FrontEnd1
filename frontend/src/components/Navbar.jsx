import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand" to="/dashboard">Mi Sistema de Ventas</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/productos">Productos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/clientes">Clientes</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ventas">Ventas</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Salir</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
