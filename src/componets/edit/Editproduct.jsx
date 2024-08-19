import React, { useEffect} from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Form, Input, message } from 'antd';
import { UserOutlined, DollarOutlined, AppstoreAddOutlined } from '@ant-design/icons';

function EditProduct() {
  const [form] = Form.useForm();
  const { id } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch the product details when the component mounts
    axios.get(`http://localhost:3002/product/${id}`)
      .then(response => {
        form.setFieldsValue(response.data); // Set form values with fetched data
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        message.error('Error fetching product details.');//Error Message for Fetch the data
      });
  }, [id, form]);

  const onFinish = (values) => {
    axios.put(`http://localhost:3002/update-product/${id}`, values)// get the specific product by id 
      .then(response => {
        message.success('Product updated successfully!');// sucessfully updated message
        navigate("/");// navigate to dashboard
      })
      .catch(err => {
        console.error('Error updating product:', err);// Error message for not able to update the Prodct 
        message.error('Error updating product.');
      });
  };

  return (
    <div className='Main-container'>
      <Card className="card-container">
        <div className="Heading">
          <h1>EDIT PRODUCT</h1>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish}>

          {/* Product Name input field */}
          <Form.Item  name="name"
            rules={[
              {
                required: true,
                message: 'Please input the name!',// No Empty Warning message 
              },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Name must contain only letters and spaces!',// only Letters and spaces message
              },
              {
                min: 5,
                message: 'Name must be at least 5 characters long!',// minimum length of the Product name 
              },]}>
            <Input prefix={<UserOutlined style={{ fontSize: '20px' }} />}placeholder="PRODUCT NAME"className="form-input"/>
          </Form.Item>

          {/* Product Category field */}
          <Form.Item name="category"
            rules={[
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Category must contain only letters and spaces!',// rule for only letters and spaces 
              },
              {
                required: true,
                message: 'Please input the category',// not empty rule
              },]}>
            <Input prefix={<AppstoreAddOutlined style={{ fontSize: '20px' }} />} placeholder="Category"className="form-input"/>
          </Form.Item>

          {/* Product Price field */}
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: 'Please input the price!',// no empty proce rule
              },
              {
                pattern: /^[1-9]\d*$/,
                message: 'Price must be a positive number greater than zero!',// Positive number and not zero rule
              }, ]}>
            <Input prefix={<DollarOutlined style={{ fontSize: '20px' }} />} placeholder="Price" className="form-input" />
          </Form.Item>
           {/* Product Updated Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="primary-button">
              UPDATE
            </Button>
          </Form.Item>
          {/* Back to dashboard button */}
          <Form.Item>
          <Link to="/"> <Button type="primary"className="primary-button">GO BACK</Button></Link>
           </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default EditProduct;
