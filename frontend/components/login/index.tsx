'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Form, Input, message, Col } from 'antd';
import Image from 'next/image';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authAPI } from '@/apis/auth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await authAPI.cookie();
        const userData = response.data;

        if (userData) {
          switch (userData.role) {
            case 'admin':
              router.push('/admin');
              break;
            case 'tourist':
              router.push('/');
              break;
            case 'business':
              router.push('/business');
              break;
            default:
              router.push('/');
              break;
          }
        }
      } catch (error) {
        console.error('Lỗi kiểm tra đăng nhập:', error);
      }
    };

    checkLoggedIn();
  }, [router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);
      const userData = response.data;
      
      if (userData) {
        message.success('Đăng nhập thành công!');
        switch (userData.role) {
          case 'admin':
            router.push('/admin');
            window.location.reload();
            break;
          case 'tourist':
            router.push('/');
            window.location.reload();
            break;
          case 'business':
            router.push('/business');
            window.location.reload();
            break;
          default:
            router.push('/');
            break;
        }
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.');
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/regis');
  };

  const handleForgot = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center max-w-full w-full space-y-8">
        <Image
          src='/images/login-bg.jpg'
          alt='background'
          layout='fill'
          objectFit='cover'
        />
        <Col className='w-auto bg-black bg-opacity-75 rounded-xl'>
          <h1 className="text-center text-4xl text-white font-bold px-10 pt-20 pb-5">Đăng nhập</h1>
          <Form
            name="normal_login"
            className="space-y-4 px-10 pb-10"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="user_name"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className='text-white'>Nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Button type="link" onClick={handleForgot}>Quên mật khẩu</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full bg-blue-400" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <div className="flex justify-start px-10">
            <Button type="link" className='items-start' onClick={handleRegister}>Đăng ký ngay</Button>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default LoginPage;
