import { useState } from 'react';
import './ProductForm.css';

function ProductForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || { nombre: '', precio: '', stock: '' }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validación en tiempo real
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        if (value.trim().length > 100) {
          return 'El nombre no puede exceder 100 caracteres';
        }
        return '';
      
      case 'precio':
        if (!value) return 'El precio es requerido';
        const precio = parseFloat(value);
        if (isNaN(precio)) return 'Debe ser un número válido';
        if (precio < 0) return 'No puede ser negativo';
        if (precio > 999999.99) return 'No puede exceder 999,999.99';
        return '';
      
      case 'stock':
        if (!value && value !== 0) return 'El stock es requerido';
        const stock = parseInt(value);
        if (isNaN(stock)) return 'Debe ser un número entero';
        if (stock < 0) return 'No puede ser negativo';
        if (stock > 999999) return 'No puede exceder 999,999';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validar el campo si ya fue tocado
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {
      nombre: validateField('nombre', formData.nombre),
      precio: validateField('precio', formData.precio),
      stock: validateField('stock', formData.stock)
    };
    
    setErrors(newErrors);
    setTouched({ nombre: true, precio: true, stock: true });
    
    // Si hay errores, no enviar
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    
    setLoading(true);
    try {
      const producto = {
        nombre: formData.nombre.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      };
      await onSubmit(producto);
      if (!initialData) {
        setFormData({ nombre: '', precio: '', stock: '' });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      
      <div className="form-group">
        <label htmlFor="nombre">
          Nombre <span className="required">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.nombre && touched.nombre ? 'error' : ''}
          disabled={loading}
          placeholder="Ej: Laptop Dell"
        />
        {errors.nombre && touched.nombre && (
          <span className="error-message">{errors.nombre}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="precio">
          Precio <span className="required">*</span>
        </label>
        <input
          type="number"
          id="precio"
          name="precio"
          step="0.01"
          value={formData.precio}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.precio && touched.precio ? 'error' : ''}
          disabled={loading}
          placeholder="Ej: 599.99"
        />
        {errors.precio && touched.precio && (
          <span className="error-message">{errors.precio}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="stock">
          Stock <span className="required">*</span>
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.stock && touched.stock ? 'error' : ''}
          disabled={loading}
          placeholder="Ej: 10"
        />
        {errors.stock && touched.stock && (
          <span className="error-message">{errors.stock}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <span className="loading-spinner"></span>
          ) : initialData ? (
            '✓ Actualizar'
          ) : (
            '+ Crear Producto'
          )}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading} className="cancel-btn">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
