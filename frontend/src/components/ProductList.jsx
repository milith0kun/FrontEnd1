import { useState, useEffect } from 'react';
import './ProductList.css';

function ProductList({ productos, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (productos.length === 0) {
    return <div className="empty">No hay productos registrados</div>;
  }

  // Formateadores para precio y stock
  const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'MXN' });

  return (
    <div className="product-list">
      <h3>Lista de Productos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th className="numeric">Precio</th>
            <th className="numeric">Stock</th>
            <th className="numeric">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td className="numeric">{producto.precio !== undefined && producto.precio !== null ? currencyFormatter.format(parseFloat(producto.precio)) : '—'}</td>
              <td className="numeric">{(() => {
                const s = Number(producto.stock);
                if (Number.isFinite(s)) return s;
                return '—';
              })()}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(producto)}
                >
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(producto.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
