import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Input, Select, Button, Space, Popconfirm } from 'antd';
import { serviceAPI } from '@/apis/service';

const { Option } = Select;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const fetchServices = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (type) params.type = type;
      if (sortBy) params.sort_by = sortBy;

      const response = await serviceAPI.getAllServices(params);
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, type, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTypeChange = (value: string | undefined) => {
    setType(value);
  };

  const handleSortChange = (value: string | undefined) => {
    setSortBy(value);
  };

  const handleReset = () => {
    setSearch('');
    setType(undefined);
    setSortBy(undefined);
    fetchServices();
  };

  const handleDelete = async (serviceId: number) => {
    try {
      await serviceAPI.deleteService(serviceId);
      fetchServices();
    } catch (err) {
      setError('Failed to delete service');
      console.error('Error deleting service:', err);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <h1>Services</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by name"
          value={search}
          onChange={handleSearchChange}
          onSearch={() => fetchServices()}
          enterButton
        />
        <Select
          placeholder="Select type"
          value={type}
          onChange={handleTypeChange}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="airline">Airline</Option>
          <Option value="hotel">Hotel</Option>
          <Option value="grab">Grab</Option>
          <Option value="restaurant">Restaurant</Option>
        </Select>
        <Select
          placeholder="Sort by"
          value={sortBy}
          onChange={handleSortChange}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="rating_asc">Rating Ascending</Option>
          <Option value="rating_desc">Rating Descending</Option>
          <Option value="created_at_asc">Created At Ascending</Option>
          <Option value="created_at_desc">Created At Descending</Option>
        </Select>
        <Button onClick={handleReset}>Reset</Button>
      </Space>
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
