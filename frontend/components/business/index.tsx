'use client'
import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ShopOutlined, CommentOutlined, AppstoreOutlined, LineChartOutlined } from '@ant-design/icons';
import Dashboard from './dashboard';
import { useRouter } from 'next/navigation';
import CreateService from './service/create_service';
import ViewComments from './comment';
import ViewServices from './service';
import Statistics from './statics';
import RatingDistribution from './rating';

const { Header, Sider, Content } = Layout;

type MenuItemKey = 'dashboard' | 'createService' | 'viewComments' | 'viewServices' | 'statistics' | 'ratingDistribution';

const Business = () => {
  const router = useRouter();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemKey>('dashboard');

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'createService', icon: <AppstoreOutlined />, label: 'Create Service' },
    { key: 'viewComments', icon: <CommentOutlined />, label: 'View Comments' },
    { key: 'viewServices', icon: <ShopOutlined />, label: 'View Services' },
    { key: 'statistics', icon: <LineChartOutlined />, label: 'Statistics' },
    { key: 'ratingDistribution', icon: <LineChartOutlined />, label: 'Rating Distribution' },
  ];

  useEffect(() => {
    
  }, [])

  const content: Record<MenuItemKey, JSX.Element> = {
    dashboard: <Dashboard />,
    createService: <CreateService />,
    viewComments: <ViewComments />,
    viewServices: <ViewServices />,
    statistics: <Statistics />,
    ratingDistribution: <RatingDistribution />,
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

export default Business;
