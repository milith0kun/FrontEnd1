import React from 'react';

function Footer() {
    return (
        <footer className="bg-white text-muted text-center py-3 mt-auto border-top">
            <small>&copy; {new Date().getFullYear()} VentasApp. Todos los derechos reservados.</small>
        </footer>
    );
}

export default Footer;
