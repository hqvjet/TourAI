'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select, Checkbox } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authAPI } from '@/apis/auth';
import Image from 'next/image';

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

  return (
    <div className='relative h-screen text-white flex items-center justify-center overflow-hidden'>
      <Image
        src='/images/login-bg.jpg'
        alt='background'
        layout='fill'
        objectFit='cover'
        style={{ zIndex: -1 }}
      />
      <div className="bg-slate-700  bg-opacity-75 rounded-xl p-8 shadow-lg w-full max-w-md z-10">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Register</h1>
        <Form
          name="register"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-white">Role</span>}
            name="role"
            initialValue="business"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select>
              <Option value="business">Business</Option>
              <Option value="tourist">Tourist</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Full Name</span>}
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Age</span>}
            name="age"
            rules={[{ required: true, message: 'Please input your age!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Username</span>}
            name="user_name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Confirm Pass</span>}
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
            wrapperCol={{ offset: 6, span: 18 }}
            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please agree to terms and conditions!') }]}
          >
            <Checkbox className='text-white'>I agree to the terms and conditions</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" className='bg-blue-600' htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>

          <div className="text-center text-white mt-5">
            Already have an account? <Button type="link" onClick={() => router.push('/login')}>Login</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
