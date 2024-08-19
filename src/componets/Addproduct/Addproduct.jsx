import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button, Card, Form, Input, message } from 'antd';
import { UserOutlined, DollarOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import './Addproduct.css';

function Addproduct() {
  const [form] = Form.useForm();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  const onFinish = () => {
    console.log('Name:', name);
    console.log('Category:', category);
    console.log('Price:', price);

    axios.post('http://localhost:3002/add-product', { name, category, price: parseFloat(price) })// post data details 
      .then(result => {
        console.log(result);
        message.success('Saved Successfully');// Data Saved sucessfully message
        navigate("/");
      })
      .catch(err => {
        console.error('Axios error:', err.response ? err.response.data : err.message);// Axios Error message
        message.error('Error saving product. Please try again.');
      });
  };

  return (
    <div className='Main-container'>
      <Card className="card-container">
        <div className="Heading">
          <h1>ADD DATA</h1>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/*Product Name input field */}
          <Form.Item name="name"
            rules={[
              {
                required: true,
                message: 'Please input your Product name!',// rule for not empty fileds
              },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Name must contain only letters and spaces!',// rule for only letters and Spaces
              },
              {
                min: 5,
                message: 'Name must be at least 5 characters long!',//rule for minimum charater
              }, ]}>
            <Input prefix={<UserOutlined style={{ fontSize: '20px' }} />}placeholder="PRODUCT NAME" className="form-input"
              onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          {/*Product Category field */}
          <Form.Item
            name="category"
            rules={[
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Category must contain only letters and spaces!',// rule for only letters and spaces
              },
              {
                required: true,
                message: 'Please input your category',// rule for not empty 
              },
            ]}
          >
            <Input
              prefix={<AppstoreAddOutlined style={{ fontSize: '20px' }} />}
              placeholder="Category"
              className="form-input"
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Item>

          {/*Product Price field */}
          <Form.Item name="price"
            rules={[
              {
                required: true,
                message: 'Please input the price!',//rule for empty price input 
              },
              {
                pattern: /^[1-9]\d*$/,
                message: 'Price must be a positive number greater than zero!',//rule for positive number and not zero
              },]} >
        
            <Input prefix={<DollarOutlined style={{ fontSize: '20px' }} />} placeholder="Price"className="form-input"
              onChange={(e) => setPrice(e.target.value)}/>
          </Form.Item>
         {/*to Add the Product */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="primary-button"> SAVE </Button>
          </Form.Item>
          {/*to goback Dashboard */}
          <Form.Item>
          <Link to="/"> <Button type="primary"className="primary-button">GO BACK</Button></Link>
           </Form.Item> 
        </Form>
      </Card>
    </div>
  );
}

export default Addproduct;
