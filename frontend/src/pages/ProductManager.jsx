import { useState, useEffect } from 'react';
import api from '../api/axios';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addRandomProduct = async () => {
    const randomNames = [
      'Smart Watch',
      'Bluetooth Speaker',
      'Tablet',
      'Gaming Mouse',
      'USB Drive',
      'Power Bank',
      'Wireless Charger',
      'Desk Mat',
      'Monitor Stand',
      'Cable Kit'
    ];

    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)] + ' ' + Math.floor(Math.random() * 1000);
    const randomPrice = (Math.random() * 200 + 10).toFixed(2);
    const randomStock = Math.floor(Math.random() * 100) + 1;

    try {
      await api.post('/products', {
        name: randomName,
        price: parseFloat(randomPrice),
        stock: randomStock
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const editProductName = async (id, currentName) => {
    const newName = window.prompt('Enter new product name:', currentName);
    if (newName && newName !== currentName) {
      try {
        await api.put(`/products/${id}`, { name: newName });
        fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Product Manager</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <button
        onClick={addRandomProduct}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Random Product
      </button>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Price</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Stock</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${product.price.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.stock}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => editProductName(product.id, product.name)}
                    style={{
                      padding: '5px 10px',
                      marginRight: '5px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Name
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductManager;
