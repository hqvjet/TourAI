'use client'
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, AppstoreOutlined, CommentOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Dashboard from './dashboard';
import Users from './users';
import Services from './services';
import Comments from './comments';


const { Header, Sider, Content } = Layout;

type MenuItemKey = 'dashboard' | 'users' | 'services' | 'comments';

const Admin = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemKey>('dashboard');

  const menuItems = [
    { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: 'users', icon: <UserOutlined />, label: 'Users' },
    { key: 'services', icon: <AppstoreOutlined />, label: 'Services' },
    { key: 'comments', icon: <CommentOutlined />, label: 'Comments' },
  ];

  const content: Record<MenuItemKey, JSX.Element> = {
    dashboard: <Dashboard />,
    users: <Users />,
    services: <Services />,
    comments: <Comments />,
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={({ key }) => setSelectedMenuItem(key as MenuItemKey)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>{content[selectedMenuItem]}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
