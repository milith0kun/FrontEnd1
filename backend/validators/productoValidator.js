// Validaciones para el modelo de producto
const validateProducto = (data) => {
  const errors = [];

  // Validar nombre
  if (!data.nombre || typeof data.nombre !== 'string') {
    errors.push('El nombre es requerido y debe ser texto');
  } else if (data.nombre.trim().length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  } else if (data.nombre.trim().length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres');
  }

  // Validar precio
  if (data.precio === undefined || data.precio === null) {
    errors.push('El precio es requerido');
  } else {
    const precio = parseFloat(data.precio);
    if (isNaN(precio)) {
      errors.push('El precio debe ser un número válido');
    } else if (precio < 0) {
      errors.push('El precio no puede ser negativo');
    } else if (precio > 999999.99) {
      errors.push('El precio no puede exceder 999,999.99');
    }
  }

  // Validar stock
  if (data.stock === undefined || data.stock === null) {
    errors.push('El stock es requerido');
  } else {
    const stock = parseInt(data.stock);
    if (isNaN(stock)) {
      errors.push('El stock debe ser un número entero');
    } else if (stock < 0) {
      errors.push('El stock no puede ser negativo');
    } else if (stock > 999999) {
      errors.push('El stock no puede exceder 999,999');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitizar datos de producto
const sanitizeProducto = (data) => {
  return {
    nombre: data.nombre?.trim(),
    precio: parseFloat(data.precio),
    stock: parseInt(data.stock)
  };
};

module.exports = {
  validateProducto,
  sanitizeProducto
};
