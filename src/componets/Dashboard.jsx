import React, { useState, useEffect } from 'react';
import { Layout, FloatButton, Card, message, Button, Select, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ name: '', category: '', priceOrder: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Filters before API call:', filters); // Log filters
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:3002/products?${params}`);
      console.log('API Response:', response.data);  // Log API response
      setProducts(response.data); // Update products state with filtered data
      setCategories([...new Set(response.data.map(item => item.category))]); // Update categories based on response
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts or filters change
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({ name: '', category: '', priceOrder: '' });
    fetchProducts(); // Refresh products without filters
  };

  const deleteProduct = (id) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.delete(`http://localhost:3002/product/${id}`)
          .then(() => {
            message.success('Product deleted successfully!');
            fetchProducts(); // Refresh the product list after deletion
          })
          .catch(err => {
            console.error('Error deleting product:', err);
            message.error('Error deleting product.');
          });
      },
      onCancel() {
        console.log('Delete canceled');
      },
    });
  };

  return (
    <Layout>
      <Content>
        <div className='product-list'>
          <h1>Product List</h1>

          <div style={{ marginBottom: 20 }}>
            <Select
              style={{ width: 200, marginRight: 10 }}
              placeholder="Filter by Name"
              value={filters.name}
              onChange={(value) => handleFilterChange('name', value)}
              showSearch
            >
              {products.map(product => (
                <Option key={product._id} value={product.name}>{product.name}</Option>
              ))}
            </Select>

            <Select
              style={{ width: 200, marginRight: 10 }}
              placeholder="Filter by Category"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>

            <Select
              placeholder="Sort by Price"
              style={{ width: 200, marginRight: 10 }}
              value={filters.priceOrder}
              onChange={(value) => handleFilterChange('priceOrder', value)}
            >
              <Option value="lowToHigh">Price: Low to High</Option>
              <Option value="highToLow">Price: High to Low</Option>
            </Select>

            {/* <Button type="primary" onClick={fetchProducts} style={{ marginRight: 10 }}>Apply</Button> */}
            <Button onClick={resetFilters}>Reset</Button>
          </div>

          <div className="product-grid">
            {products.length ? (
              products.map(product => (
                <Card key={product._id} className="product-card" title={product.name.toUpperCase()}>
                  <p>Category: {product.category}</p>
                  <p>Price: ${product.price}</p>
                  <div className="btns">
                    <div className="edit-btn">
                      <Link to={`/edit-product/${product._id}`}>
                        <EditOutlined /> Edit
                      </Link>
                    </div>
                    <div className="delete-btn">
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => deleteProduct(product._id)} danger>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>

        <Link to="/addproduct">
          <FloatButton tooltip={<div>Add Product</div>} icon={<PlusOutlined />} type="primary" style={{ insetInlineEnd: 94 }} />
        </Link>
      </Content>
    </Layout>
  );
}

export default Dashboard;
