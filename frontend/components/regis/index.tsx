'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select, Checkbox } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authAPI } from '@/apis/auth';

const { Option } = Select;

interface RegisterFormValues {
  role: string;
  full_name: string;
  age: number;
  user_name: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>('business');

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await authAPI.registerUser(values);
      message.success('Registered successfully!');
      console.log('User registered successfully:', response.data);
      router.push('/login');
    } catch (error) {
      console.error('Error registering:', error);
      message.error('Registration failed. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className='h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <h1 className="text-4xl text-center text-white font-bold mb-4">Register</h1>
      <Form
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ role: 'business', remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select your role!' }]}
        >
          <Select onChange={(value) => setRole(value)} defaultValue="business">
            <Option value="business">Business</Option>
            <Option value="tourist">Tourist</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please input your age!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="user_name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
          rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please agree to terms and conditions!') }]}
        >
          <Checkbox>I agree to the terms and conditions</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Button type="link" onClick={handleLogin}>Login</Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
