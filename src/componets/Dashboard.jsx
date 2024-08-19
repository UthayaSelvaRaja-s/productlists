import React, { useState, useEffect } from 'react';
import { Layout, FloatButton, Card, message, Button, Modal, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Import the external CSS file

const {  Content } = Layout;
const { confirm } = Modal;
const { Option } = Select;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ name: '', category: '', priceOrder: '' });
  const [tempFilters, setTempFilters] = useState({ name: '', category: '', priceOrder: '' });

  // Function to fetch products from the server
  const refreshProducts = () => {
    axios.get('http://localhost:3002/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setCategories([...new Set(response.data.map(item => item.category))]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);// Error message for not able to fetch the data
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshProducts(); // Fetch products when component mounts
  }, []);
// this contains the alert message when we can try to delete the product
  const deleteProduct = (id) => {
    confirm({
      title: 'Are you sure you want to delete this product?', content: 'This action cannot be undone.', okText: 'Yes',okType: 'danger',
       cancelText: 'No',
      onOk() {
        axios.delete(`http://localhost:3002/product/${id}`)// Feting the id for deleting Product
          .then(() => {
            message.success('Product deleted successfully!');
            refreshProducts(); // Refresh the product list after deletion
          })
          .catch(err => {
            console.error('Error deleting product:', err);// this wil catch the error like not able to delete
            message.error('Error deleting product.');
          });
      },
      onCancel() {
        console.log('Delete canceled');// Cancel The Delete
      },
    });
  };
// To Apply every Filter
  const applyFilters = () => {
    let filtered = [...products];

    // Filter by name
    if (tempFilters.name) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(tempFilters.name.toLowerCase()));
    }

    // Filter by category
    if (tempFilters.category) {
      filtered = filtered.filter(product => product.category === tempFilters.category);
    }

    // Sort by price
    if (tempFilters.priceOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (tempFilters.priceOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(filtered);
    setFilters(tempFilters);
  };
// To Reset Every Filter
  const resetFilters = () => {
    setTempFilters({ name: '', category: '', priceOrder: '' });
    setFilters({ name: '', category: '', priceOrder: '' });
    setFilteredProducts(products);
  };

  return (
    <div>
      <Layout>
        <Content>
          <div className='product-list'>
            <h1>Product List</h1>

            <div style={{ marginBottom: 20 }}>
                {/*Product filered by name of the product */}
              <Select
                style={{ width: 200, marginRight: 10 }}
                placeholder="Filter by Name"
                value={tempFilters.name}
                onChange={(value) => setTempFilters(prev => ({ ...prev, name: value }))}
                showSearch>
                {products.map(product => (
                  <Option key={product._id} value={product.name}>{product.name}</Option> ))} </Select>
       {/*Product filtered  Category */}
              <Select
                style={{ width: 200, marginRight: 10 }}
                placeholder="Filter by Category"
                value={tempFilters.category}
                onChange={(value) => setTempFilters(prev => ({ ...prev, category: value }))} >
                {categories.map(category => (
                  <Option key={category} value={category}> {category}</Option>
                ))} </Select>
           {/*Product Soretd by Price*/}
              <Select
                placeholder="Sort by Price"
                style={{ width: 200, marginRight: 10 }}
                value={tempFilters.priceOrder}
                onChange={(value) => setTempFilters(prev => ({ ...prev, priceOrder: value }))}>
                <Option value="lowToHigh">Price: Low to High</Option>
                <Option value="highToLow">Price: High to Low</Option>
              </Select>
           {/*Apply Butto for applying the filters */}
              <Button type="primary" onClick={applyFilters} style={{ marginRight: 10 }}>Apply</Button>
              <Button onClick={resetFilters}>Reset</Button>
            </div>

            <div className="product-grid">
              {filteredProducts.map(item => (
                <Card key={item._id} className="product-card" title={item.name.toUpperCase()}>
                  <p>Category: {item.category}</p>
                  <p>Price: ${item.price}</p>
                  {/*Edit button  */}
                  <div className="btns">
                  <div className="edit-btn">
                  <Link to={`/edit-product/${item._id}`}><EditOutlined /> Edit</Link>
                  </div>
                  {/*Delete Button */}
                  <div className="delete-btn">
                  <Button type="text" icon={<DeleteOutlined />} onClick={() => deleteProduct(item._id)} danger>
                    Delete
                  </Button>
                  </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        {/*Add Product page  navigation icon */}
          <Link to="/addproduct">
            <FloatButton tooltip={<div>Add Product</div>} icon={<PlusOutlined />} type="primary" style={{ insetInlineEnd: 94 }} />
          </Link>
        </Content>
      </Layout>
    </div>
  );
}

export default Dashboard;
