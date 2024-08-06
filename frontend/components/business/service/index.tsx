'use client'
import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Popconfirm, message } from 'antd';
import { useRouter } from 'next/navigation';
import { serviceAPI } from '@/apis/service';
import { authAPI } from '@/apis/auth';

const Services = () => {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUserId = async () => {
    try {
      const response = await authAPI.cookie();
      const fetchedUserId = response.data.user_id;
      setUserId(fetchedUserId);
    } catch (error) {
      setError('Failed to fetch user ID from cookie.');
      router.push('/login');
      console.error(error);
    }
  };

  const fetchServices = async (userId: number) => {
    setLoading(true);
    try {
      const response = await serviceAPI.getMyServices(userId);
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUserId();
    };

    initialize();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchServices(userId);
    }
  }, [userId]);

  const handleDelete = async (id: number) => {
    try {
      await serviceAPI.deleteService(id);
      if (userId !== null) {
        fetchServices(userId);
      }
    } catch (err) {
      setError('Failed to delete service.');
      console.error(err);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <Table
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Type', dataIndex: 'type', key: 'type' },
          { title: 'Address', dataIndex: 'address', key: 'address' },
          { title: 'Phone', dataIndex: 'phone', key: 'phone' },
          { title: 'Website', dataIndex: 'website', key: 'website' },
          {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: { id: number }) => (
              <Popconfirm
                title="Are you sure you want to delete this service?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link">Delete</Button>
              </Popconfirm>
            ),
          },
        ]}
        dataSource={services}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Services;
